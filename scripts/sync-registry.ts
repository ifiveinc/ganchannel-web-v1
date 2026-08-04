// 大学公式サイトのクラブ紹介ページのスクレイピングと circle-registry-manual.ts を統合し、
// app/data/circle-registry.ts を生成・上書きする（docs/chatbot-spec.md §10-5）。
// `npm run sync:registry` で開発者が手動実行する。生成物は差分を確認してコミットする。
//
// 実行順序: circles.ts の名寄せ（sync-circles.ts）が最新の名簿を前提とするため、
// このスクリプトを先に実行すること（§10-6）。

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { MANUAL_REGISTRY_ENTRIES } from "../app/data/circle-registry-manual";
import type { CircleRegistryEntry } from "../app/types/circle-registry";

const CLUB_PAGE_URL = "https://www.iwate-u.ac.jp/campus/activity/club.html";

const REGISTRY_PATH = fileURLToPath(
  new URL("../app/data/circle-registry.ts", import.meta.url)
);

// クラブ紹介ページの見出しID → circle_registry の分類（§10-2）。
// club4（紹介パンフレットへのリンク）は団体一覧ではないため対象外。
const SECTIONS: { headingId: string; category: string }[] = [
  { headingId: "club5", category: "学生委員会" },
  { headingId: "club1", category: "体育系" },
  { headingId: "club2", category: "文化系" },
  { headingId: "club3", category: "同好会" },
];

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)))
    .replace(/&(amp|lt|gt|quot|apos|nbsp);/g, (_, name) => HTML_ENTITIES[name]);
}

// 見出しから団体名を抽出する。次の見出しがあればそこまで、無ければ（本ページの構造上、
// 最後の分類は下位見出しを持たない単一のulのため）最初の</ul>までを対象範囲とする。
function extractSectionNames(html: string, headingId: string): string[] {
  const startMatch = html.match(new RegExp(`<h2 id=['"]${headingId}['"]>`));
  if (!startMatch || startMatch.index === undefined) {
    throw new Error(
      `クラブ紹介ページの構造が変わった可能性があります（見出し #${headingId} が見つかりません）。`
    );
  }

  const afterStart = html.slice(startMatch.index + startMatch[0].length);
  const nextHeadingMatch = afterStart.match(/<h2 id=['"]/);
  const closingUlMatch = afterStart.match(/<\/ul>/);

  const end =
    nextHeadingMatch?.index !== undefined
      ? nextHeadingMatch.index
      : closingUlMatch?.index !== undefined
        ? closingUlMatch.index + closingUlMatch[0].length
        : afterStart.length;

  const chunk = afterStart.slice(0, end);

  return [...chunk.matchAll(/<li>\s*<a[^>]*>([^<]*)<\/a>\s*<\/li>/g)]
    .map((match) => decodeHtmlEntities(match[1]).trim())
    .filter((name) => name.length > 0);
}

async function scrapeClubPage(): Promise<CircleRegistryEntry[]> {
  const response = await fetch(CLUB_PAGE_URL);
  if (!response.ok) {
    throw new Error(`クラブ紹介ページの取得に失敗しました（status: ${response.status}）。`);
  }
  const html = await response.text();

  const entries: CircleRegistryEntry[] = [];
  for (const section of SECTIONS) {
    const names = extractSectionNames(html, section.headingId);
    for (const name of names) {
      // ページにふりがなの記載が無いため kana は取得しない（§10-2、§8 item16）
      entries.push({ name, kana: null, category: section.category, description: null });
    }
  }

  return entries;
}

async function main() {
  const scraped = await scrapeClubPage();
  const registry = [...scraped, ...MANUAL_REGISTRY_ENTRIES];

  const fileContent = `// scripts/sync-registry.ts の生成物。手動編集しないこと。
// クラブ紹介ページのスクレイピング結果と circle-registry-manual.ts を統合したもの
// （docs/chatbot-spec.md §10-5）。生成日時: ${new Date().toISOString()}

import type { CircleRegistryEntry } from "~/types/circle-registry";

export const circleRegistry: CircleRegistryEntry[] = ${JSON.stringify(registry, null, 2)};
`;

  writeFileSync(REGISTRY_PATH, fileContent);

  console.log(
    `circle-registry.tsを更新しました（スクレイピング: ${scraped.length}件, 手動登録: ${MANUAL_REGISTRY_ENTRIES.length}件）`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
