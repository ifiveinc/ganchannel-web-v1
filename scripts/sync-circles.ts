// サークル紹介フォームの回答CSVを取得・正規化し、app/data/circle-info/circles.ts へマージするスクリプト
// （docs/chat/spec.md §9）。`npm run sync:circles` で開発者が手動実行する。
// 8/6当日の応答経路（/api/chat）には含めない。
//
// 【要確認事項（着手前にチームで確認すること。docs/chat/spec.md §8）】
// - item22: Circle.id（スラッグ）の生成方法が未定のため、本スクリプトでは
//   name-overrides.ts での手動指定が無い場合、団体名のハッシュ値（circle-xxxxxxxx）を
//   暫定的な生成方法として採用している
// - item24: 「入会費・年会費など」は1列だが Circle.fee は admission/annual が別フィールド、
//   「実績」は自由記述1つだが Circle.achievements は{year, content}[]のため、
//   本スクリプトでは前者を fee.annual に、後者を year:"" の1件配列に暫定的に格納している
// - item13: images / contact.links の統合順序・件数上限・重複排除は未定のため、
//   本スクリプトでは単純に「アップロード分→SNS引用リンク分」の順で結合している
// - item14: 「ふりがな」「略称・別名」列がスプレッドシートに反映されているか未確認。
//   反映されていない場合、本スクリプトは両フィールドとも書き込まない（kana:null, aliases:[]）

import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import Papa from "papaparse";
import {
  CIRCLE_COLUMN_PATTERNS,
  OPTIONAL_CIRCLE_COLUMN_PATTERNS,
  ORGANIZATION_TYPE_VALUE_ALIASES,
  TIMESTAMP_COLUMN_PATTERNS,
  type CircleColumnKey,
  type OptionalCircleColumnKey,
} from "../app/services/circle-info/column-map";
import { NAME_OVERRIDES } from "../app/services/circle-info/name-overrides";
import { findRegistryEntryByName } from "../app/services/chatbot/circle-registry-service";
import { circles as existingCircles } from "../app/data/circle-info/circles";
import { ORGANIZATION_TYPES } from "../app/constants";
import type { Circle, CircleLink, OrganizationType } from "../app/types/circle-info/circle";

const REPO_ROOT = fileURLToPath(new URL("..", import.meta.url));
const CIRCLES_PATH = fileURLToPath(new URL("../app/data/circle-info/circles.ts", import.meta.url));

// circle-infoチームが手動で管理するフィールド。sync-circles.tsは書き換えない（§9-2a）。
const CIRCLE_INFO_OWNED_DEFAULTS = {
  genres: [] as Circle["genres"],
  recruitmentStatus: "募集中" as Circle["recruitmentStatus"],
  isRecommended: false,
  summary: "",
  recommendedFor: [] as string[],
  restriction: null as string | null,
  newcomerEvent: null as string | null,
  isOfficial: null as boolean | null,
};

function assertNoUncommittedChanges(): void {
  const output = execSync("git status --porcelain -- app/data/circle-info/circles.ts", {
    cwd: REPO_ROOT,
    encoding: "utf-8",
  });
  if (output.trim().length > 0) {
    throw new Error(
      "app/data/circle-info/circles.ts に未コミットの変更があります。circle-infoチームが作業中の可能性があるため、書き込みを中止しました（§9-2a）。先にコミットしてから再実行してください。"
    );
  }
}

async function fetchCsv(
  url: string
): Promise<{ headers: string[]; rows: Record<string, string>[] }> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`CSVの取得に失敗しました（status: ${response.status}）。`);
  }
  const text = await response.text();
  const result = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  });
  if (result.errors.length > 0) {
    throw new Error(`CSVの解析に失敗しました: ${result.errors[0].message}`);
  }
  return { headers: result.meta.fields ?? [], rows: result.data };
}

function resolveHeader(headers: string[], patterns: string[]): string | null {
  return headers.find((header) => patterns.includes(header.trim())) ?? null;
}

interface HeaderMap {
  columns: Record<CircleColumnKey, string>;
  optionalColumns: Partial<Record<OptionalCircleColumnKey, string>>;
  timestampHeader: string;
}

// 候補ヘッダのいずれにも一致しない必須列があれば即座にエラーで停止する（§9-5、無言でnullを入れない）
function buildHeaderMap(headers: string[]): HeaderMap {
  const columns = {} as Record<CircleColumnKey, string>;
  const missing: string[] = [];

  for (const key of Object.keys(CIRCLE_COLUMN_PATTERNS) as CircleColumnKey[]) {
    const header = resolveHeader(headers, CIRCLE_COLUMN_PATTERNS[key]);
    if (!header) {
      missing.push(CIRCLE_COLUMN_PATTERNS[key][0]);
      continue;
    }
    columns[key] = header;
  }

  const timestampHeader = resolveHeader(headers, TIMESTAMP_COLUMN_PATTERNS);
  if (!timestampHeader) {
    missing.push(TIMESTAMP_COLUMN_PATTERNS[0]);
  }

  if (missing.length > 0 || !timestampHeader) {
    throw new Error(
      `CSVのヘッダに想定した列が見つかりません（フォームの質問文が変更された可能性があります）: ${missing.join(", ")}`
    );
  }

  // kana/aliases はスプレッドシートへの反映が未確認のため、無くてもエラーにしない（§8 item14）
  const optionalColumns: Partial<Record<OptionalCircleColumnKey, string>> = {};
  for (const key of Object.keys(
    OPTIONAL_CIRCLE_COLUMN_PATTERNS
  ) as OptionalCircleColumnKey[]) {
    const header = resolveHeader(headers, OPTIONAL_CIRCLE_COLUMN_PATTERNS[key]);
    if (header) {
      optionalColumns[key] = header;
    }
  }

  return { columns, optionalColumns, timestampHeader };
}

function parseTimestamp(raw: string | undefined): number {
  if (!raw) return 0;
  const time = new Date(raw).getTime();
  return Number.isNaN(time) ? 0 : time;
}

// 同一団体の複数回答（送信後の編集による重複）は、タイムスタンプ最新の1件を採用する（§9-3）
function dedupeByLatestTimestamp(
  rows: Record<string, string>[],
  nameHeader: string,
  timestampHeader: string
): Record<string, string>[] {
  const groups = new Map<string, Record<string, string>[]>();

  for (const row of rows) {
    const name = row[nameHeader]?.trim();
    if (!name) continue;
    const group = groups.get(name) ?? [];
    group.push(row);
    groups.set(name, group);
  }

  const deduped: Record<string, string>[] = [];
  for (const [name, group] of groups) {
    if (group.length === 1) {
      deduped.push(group[0]);
      continue;
    }
    const sorted = [...group].sort(
      (a, b) => parseTimestamp(b[timestampHeader]) - parseTimestamp(a[timestampHeader])
    );
    deduped.push(sorted[0]);
    console.warn(
      `[警告] 「${name}」の回答が${group.length}件あります。最新の1件を採用し、${group.length - 1}件を破棄しました。`
    );
  }
  return deduped;
}

function splitMultiValue(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\n,、，]/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

// 略称・別名のパース仕様（§9-5b）。「なし」は略称なしを表すテキストとして扱う
function parseAliases(raw: string | undefined): string[] {
  const trimmed = raw?.trim();
  if (!trimmed || trimmed === "なし") return [];
  return trimmed
    .split(/[、，・]/)
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

// 「団体の形態」は複数選択可能（例:「学内カンパニー, NEXT STEP工房」）。
// Circle.organizationTypeは単一値のため、有効な候補のうち最初に一致したものを採用する
// （2つ目以降の分類はcircle_registry側で別エントリとして持つ想定、docs/chat/spec.md §10-1）。
function normalizeOrganizationType(raw: string): OrganizationType | null {
  const candidates = raw
    .split(",")
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  for (const candidate of candidates) {
    const alias = ORGANIZATION_TYPE_VALUE_ALIASES[candidate];
    if (alias) return alias;
    if ((ORGANIZATION_TYPES as readonly string[]).includes(candidate)) {
      return candidate as OrganizationType;
    }
  }

  return null;
}

function classifyLinkType(url: string): CircleLink["type"] {
  if (/instagram\.com/i.test(url)) return "instagram";
  if (/(twitter\.com|x\.com)/i.test(url)) return "x";
  if (/^https?:\/\//i.test(url)) return "website";
  return "other";
}

// #20「団体との連絡手段」・#21「その他SNSリンク」を統合する（§9-5a）。
// メールアドレス形式は contact.email、それ以外は contact.links に振り分ける
function buildContact(
  primaryRaw: string | undefined,
  otherRaw: string | undefined
): { email: string | null; links: CircleLink[] } {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const values = [...splitMultiValue(primaryRaw), ...splitMultiValue(otherRaw)];

  let email: string | null = null;
  const links: CircleLink[] = [];

  for (const value of values) {
    if (!email && emailPattern.test(value)) {
      email = value;
      continue;
    }
    links.push({ type: classifyLinkType(value), label: value, url: value });
  }

  return { email, links };
}

function generateCircleId(name: string): string {
  const override = NAME_OVERRIDES.find((item) => item.formName === name)?.circleId;
  if (override) return override;
  const hash = createHash("sha256").update(name).digest("hex").slice(0, 8);
  return `circle-${hash}`;
}

interface FormOwnedFields {
  name: string;
  organizationType: OrganizationType;
  kana: string | null;
  aliases: string[];
  description: string;
  activity: Circle["activity"];
  fee: Circle["fee"];
  members: Circle["members"];
  achievements: Circle["achievements"];
  images: string[];
  logo: string | null;
  tags: string[];
  contactEmail: string | null;
  contactLinks: CircleLink[];
}

// 1行をフォーム所有フィールド（§9-2a）のみに変換する。organizationTypeが不正な場合はnullを返す
function parseRow(
  row: Record<string, string>,
  name: string,
  { columns, optionalColumns }: HeaderMap
): FormOwnedFields | null {
  const organizationType = normalizeOrganizationType(row[columns.organizationType] ?? "");
  if (!organizationType) return null;

  const contact = buildContact(row[columns.contactPrimary], row[columns.contactLinksOther]);
  const kanaHeader = optionalColumns.kana;
  const aliasesHeader = optionalColumns.aliases;
  const achievementsRaw = row[columns.achievements]?.trim();

  return {
    name,
    organizationType,
    kana: kanaHeader ? row[kanaHeader]?.trim() || null : null,
    aliases: aliasesHeader ? parseAliases(row[aliasesHeader]) : [],
    description: row[columns.description]?.trim() ?? "",
    activity: {
      place: row[columns.place]?.trim() || null,
      schedule: row[columns.schedule]?.trim() || null,
      recruitmentPeriod: row[columns.recruitmentPeriod]?.trim() || null,
    },
    // §8 item24: 1列のCSV値をfee.annualへ暫定格納（fee.admissionは分割不能のためnull）
    fee: {
      admission: null,
      annual: row[columns.fee]?.trim() || null,
      other: row[columns.feeOther]?.trim() || null,
    },
    members: {
      total: row[columns.membersTotal]?.trim() || null,
      genderRatio: row[columns.membersGenderRatio]?.trim() || null,
      beginnerRatio: row[columns.membersBeginnerRatio]?.trim() || null,
    },
    // §8 item24: 自由記述1つをyear:""の1件配列へ暫定格納
    achievements: achievementsRaw ? [{ year: "", content: achievementsRaw }] : [],
    images: [...splitMultiValue(row[columns.imagesUpload]), ...splitMultiValue(row[columns.imagesSnsLink])],
    logo: row[columns.logo]?.trim() || null,
    tags: splitMultiValue(row[columns.tags]),
    contactEmail: contact.email,
    contactLinks: contact.links,
  };
}

function mergeCircle(existing: Circle | undefined, form: FormOwnedFields): Circle {
  return {
    id: existing?.id ?? generateCircleId(form.name),
    name: form.name,
    organizationType: form.organizationType,
    kana: form.kana,
    aliases: form.aliases,
    description: form.description,
    activity: form.activity,
    fee: form.fee,
    members: form.members,
    achievements: form.achievements,
    images: form.images,
    logo: form.logo,
    tags: form.tags,
    contact: {
      // 代表者名はcircle-infoチームが手動管理し、本スクリプトは書き込まない（§8 item25）
      representative: existing?.contact.representative ?? null,
      email: form.contactEmail,
      links: form.contactLinks,
    },
    genres: existing?.genres ?? CIRCLE_INFO_OWNED_DEFAULTS.genres,
    recruitmentStatus: existing?.recruitmentStatus ?? CIRCLE_INFO_OWNED_DEFAULTS.recruitmentStatus,
    isRecommended: existing?.isRecommended ?? CIRCLE_INFO_OWNED_DEFAULTS.isRecommended,
    summary: existing?.summary ?? CIRCLE_INFO_OWNED_DEFAULTS.summary,
    recommendedFor: existing?.recommendedFor ?? CIRCLE_INFO_OWNED_DEFAULTS.recommendedFor,
    restriction: existing?.restriction ?? CIRCLE_INFO_OWNED_DEFAULTS.restriction,
    newcomerEvent: existing?.newcomerEvent ?? CIRCLE_INFO_OWNED_DEFAULTS.newcomerEvent,
    isOfficial: existing?.isOfficial ?? CIRCLE_INFO_OWNED_DEFAULTS.isOfficial,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  const csvUrl = process.env.CIRCLE_FORM_CSV_URL;
  if (!csvUrl) {
    throw new Error("CIRCLE_FORM_CSV_URL が設定されていません（.env参照）。");
  }

  if (!isDryRun) {
    assertNoUncommittedChanges();
  }

  const { headers, rows } = await fetchCsv(csvUrl);
  const headerMap = buildHeaderMap(headers);
  const deduped = dedupeByLatestTimestamp(rows, headerMap.columns.name, headerMap.timestampHeader);

  const parsedForms: FormOwnedFields[] = [];
  for (const row of deduped) {
    const name = row[headerMap.columns.name]?.trim();
    if (!name) {
      // §9-6: 必須項目（団体名）が欠けた行は警告のうえスキップし、全体は止めない
      console.warn("[警告] 団体名が空の行をスキップしました。");
      continue;
    }

    const parsed = parseRow(row, name, headerMap);
    if (!parsed) {
      console.warn(`[警告] 「${name}」の団体の形態が不正な値のためスキップしました。`);
      continue;
    }
    parsedForms.push(parsed);

    // §9-4: circle_registryとの名寄せはデータ品質チェック（警告のみ）。書き込み先は左右しない
    const registryEntry = await findRegistryEntryByName(parsed.name);
    if (!registryEntry) {
      console.warn(`[警告] 「${parsed.name}」はcircle_registry（公式名簿）に登録されていません。`);
    }
  }

  const existingByName = new Map(existingCircles.map((circle) => [circle.name, circle]));
  const csvNames = new Set(parsedForms.map((form) => form.name));

  const merged: Circle[] = parsedForms.map((form) => mergeCircle(existingByName.get(form.name), form));
  // §9-2a: CSVに無い既存団体（circle-infoチームが独自追加した団体等）は削除しない
  for (const existing of existingCircles) {
    if (!csvNames.has(existing.name)) {
      merged.push(existing);
    }
  }

  if (isDryRun) {
    const added = parsedForms.filter((form) => !existingByName.has(form.name));
    const updated = parsedForms.filter((form) => existingByName.has(form.name));
    console.log(`[dry-run] 追加 ${added.length}件:`);
    added.forEach((form) => console.log(`  + ${form.name}`));
    console.log(`[dry-run] 更新 ${updated.length}件:`);
    updated.forEach((form) => console.log(`  ~ ${form.name}`));
    console.log(`[dry-run] 既存のまま維持: ${merged.length - parsedForms.length}件`);
    return;
  }

  const fileContent = `import type { Circle } from "~/types/circle-info/circle";

// 掲載する団体データ。scripts/sync-circles.ts（自動生成）とcircle-infoチームの手動編集の
// 両方が更新する（docs/chat/spec.md §9-2a）。フィールド単位の所有権は同ファイルを参照。
// UIから直接importせず、必ず services/circle-service.ts を経由すること。
export const circles: Circle[] = ${JSON.stringify(merged, null, 2)};
`;

  writeFileSync(CIRCLES_PATH, fileContent);
  console.log(`circles.tsを更新しました（${merged.length}件）`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
