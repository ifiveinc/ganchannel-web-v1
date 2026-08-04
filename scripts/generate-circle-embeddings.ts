// app/data/circles.ts の各団体の紹介文をあらかじめ埋め込みベクトル化し、
// app/data/circle-embeddings.json へ書き出す。
//
// サークルデータはSupabaseテーブルを持たない静的ファイル方式のため
// （docs/chatbot-spec.md §9）、埋め込みも同様に静的ファイルとして持つ。
// 実行時はクエリ側だけをその場で埋め込み、ここで作った値と比較する
// （docs/chatbot-decisions.md §6「実行時に埋め込むのはクエリ1件のみ」の精神に合わせる）。
//
// `npm run sync:circles` で app/data/circles.ts を更新した後、
// このスクリプト（`npm run generate:circle-embeddings`）も忘れずに再実行すること。

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { circles } from "../app/data/circles";
import {
  EMBEDDING_DIMENSIONS,
  EMBEDDING_NORMALIZED,
  generateQueryEmbedding,
} from "../app/services/embedding-service.server";
import type { Circle } from "../app/types/circle";

const OUTPUT_PATH = fileURLToPath(
  new URL("../app/data/circle-embeddings.json", import.meta.url)
);

// 検索対象のテキスト。名前・ジャンル・タグ・紹介文をまとめて埋め込む
function buildSearchableText(circle: Circle): string {
  return [circle.name, ...circle.genres, ...circle.tags, circle.summary, circle.description]
    .filter(Boolean)
    .join(" ");
}

async function main() {
  const entries: { circleId: string; embedding: number[] }[] = [];

  for (const circle of circles) {
    const text = buildSearchableText(circle);
    const embedding = await generateQueryEmbedding(text);
    entries.push({ circleId: circle.id, embedding });
    console.log(`埋め込み生成: ${circle.name}`);
  }

  const output = {
    embeddingModel: process.env.GEMINI_EMBEDDING_MODEL ?? "",
    dimensions: EMBEDDING_DIMENSIONS,
    normalized: EMBEDDING_NORMALIZED,
    builtAt: new Date().toISOString(),
    entries,
  };

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`circle-embeddings.jsonを更新しました（${entries.length}件）`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
