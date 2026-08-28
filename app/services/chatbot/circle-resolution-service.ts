import { fetchCircles } from "~/services/circle-info/circle-service";
import {
  fetchCircleRegistry,
  findRegistryEntryByKana,
  findRegistryEntryByName,
  normalizeCircleName,
} from "~/services/chatbot/circle-registry-service";
import type { Circle } from "~/types/circle-info/circle";
import type { CircleResolution } from "~/types/chatbot/circle-registry";

// 【要確認】§8 item5「サークル名強一致の閾値」は数値未確定。
// ここではマッチした名前・かな・別名の最小文字数として解釈する。
// 実際のcircle-registry.ts（148件）を調べたところ最短でも3文字（弓道部・剣道部等）だったため、
// 実在する団体を取りこぼさずに短い部分一致の誤爆を防げる3文字を暫定値とする。
const DEFAULT_CIRCLE_STRONG_MATCH_MIN_LENGTH = 3;

function getStrongMatchMinLength(): number {
  const raw = process.env.CIRCLE_STRONG_MATCH_THRESHOLD;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_CIRCLE_STRONG_MATCH_MIN_LENGTH;
}

// 「Xについて教えて」「Xとは」等の定型的な語尾を取り除き、質問の中核部分を取り出す。
// 「Have a break！〜しどろもどろシンドローム」のような長い正式名称の一部（通称）だけを
// 聞かれるケースに対応するための簡易処理（完全な形態素解析は行わない）。
const QUESTION_SUFFIX_PATTERN =
  /(について教えて|について|とは何ですか|とはなんですか|とは|って何ですか|って何|ってなに|は何ですか|を教えて|教えて)[？?。.！!]*$/;

function stripQuestionSuffix(question: string): string {
  return question.replace(QUESTION_SUFFIX_PATTERN, "").trim();
}

// 名前・かな・別名でCircleを検索する。circleRegistryIdのような永続的な紐付けは持たず、
// 問い合わせのたびにその場で突合する（docs/chatbot/spec.md §2）。
async function findCircleByNameKanaOrAlias(query: string): Promise<Circle | null> {
  const circles = await fetchCircles();
  const normalizedQuery = normalizeCircleName(query);

  const byName = circles.find(
    (circle) =>
      circle.name === query || normalizeCircleName(circle.name) === normalizedQuery
  );
  if (byName) {
    return byName;
  }

  const byKana = circles.find(
    (circle) => circle.kana && normalizeCircleName(circle.kana) === normalizedQuery
  );
  if (byKana) {
    return byKana;
  }

  const byAlias = circles.find((circle) =>
    circle.aliases?.some(
      (alias) => alias === query || normalizeCircleName(alias) === normalizedQuery
    )
  );

  return byAlias ?? null;
}

// 3状態（detailed/registered/unknown）判定（§2・§10-6）。
// circles（app/data/circle-info/circles.ts）とcircle_registry（app/data/circle-registry.ts）の
// どちらも静的ファイルのため、DBのFK制約に相当する紐付けは持たず、その場で導出する。
export async function resolveCircle(query: string): Promise<CircleResolution> {
  const circle = await findCircleByNameKanaOrAlias(query);
  if (circle) {
    return { status: "detailed", registryEntry: null, circle };
  }

  const registryEntry =
    (await findRegistryEntryByName(query)) ?? (await findRegistryEntryByKana(query));
  if (registryEntry) {
    return { status: "registered", registryEntry, circle: null };
  }

  return { status: "unknown", registryEntry: null, circle: null };
}

// 質問文（自由記述の1文）の中に、既知のサークル名・かな・別名が含まれるかを走査する
// （検索カスケード第4段「サークル名・かな・別名に強一致」、docs/decisions/0004-chatbot-architecture.md §4）。
// 「第4段の閾値は高く設定する」方針のため、最小文字数に満たない短い名前は対象外にし、
// 一致した名前が複数ある場合は最も長いものを採用する（短い部分一致による誤爆を避ける）。
export async function findStrongCircleMatch(question: string): Promise<CircleResolution | null> {
  const normalizedQuestion = normalizeCircleName(question);
  const minLength = getStrongMatchMinLength();

  // 質問の語尾を除いた中核部分。逆方向一致（正式名称の一部だけを聞かれるケース）の判定に使う
  const coreQuestion = stripQuestionSuffix(question);
  const normalizedCore = normalizeCircleName(coreQuestion);
  const canReverseMatch = coreQuestion.length >= minLength;

  function isMatch(name: string): boolean {
    if (question.includes(name) || normalizedQuestion.includes(normalizeCircleName(name))) {
      return true;
    }
    if (!canReverseMatch) return false;
    return name.includes(coreQuestion) || normalizeCircleName(name).includes(normalizedCore);
  }

  const circles = await fetchCircles();
  const circleNames = circles.flatMap((circle) => {
    const names = [circle.name, ...(circle.aliases ?? [])];
    if (circle.kana) names.push(circle.kana);
    return names
      .filter((name) => name.length >= minLength)
      .map((name) => ({ name, circle }));
  });

  const circleMatch = circleNames
    .filter(({ name }) => isMatch(name))
    .sort((a, b) => b.name.length - a.name.length)[0];

  if (circleMatch) {
    return { status: "detailed", registryEntry: null, circle: circleMatch.circle };
  }

  const registry = await fetchCircleRegistry();
  const registryNames = registry.flatMap((entry) => {
    const names = [entry.name];
    if (entry.kana) names.push(entry.kana);
    return names
      .filter((name) => name.length >= minLength)
      .map((name) => ({ name, entry }));
  });

  const registryMatch = registryNames
    .filter(({ name }) => isMatch(name))
    .sort((a, b) => b.name.length - a.name.length)[0];

  if (registryMatch) {
    return { status: "registered", registryEntry: registryMatch.entry, circle: null };
  }

  return null;
}
