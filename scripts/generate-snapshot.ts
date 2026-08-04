// Supabaseの chunks / qa_cache テーブルの内容を app/data/snapshot.json へ書き出す。
// 開発者が `npm run generate:snapshot` で手動実行する（Renderのビルド時には実行しない、
// docs/chatbot/spec.md §8 item7）。生成物は差分を確認してコミットする。

import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { getSupabaseClient } from "../app/services/chatbot/supabase-client.server";
import { EMBEDDING_DIMENSIONS, EMBEDDING_NORMALIZED } from "../app/services/chatbot/embedding-service.server";
import type { Chunk } from "../app/types/chatbot/chunk";
import type { QaCacheEntry } from "../app/types/chatbot/qa";
import type { Snapshot } from "../app/services/chatbot/snapshot-service.server";

const SNAPSHOT_PATH = fileURLToPath(
  new URL("../app/data/chatbot/snapshot.json", import.meta.url)
);

// SupabaseはPostgresのvector型を "[0.1,0.2,...]" 形式の文字列として返す
// （配列に自動変換されない）ため、明示的にパースする。
function parseVector(value: unknown): number[] | null {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  return null;
}

async function fetchChunks(): Promise<Chunk[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("chunks")
    .select(
      "id, url, title, section, content, embedding, risk_level, fetched_at, page_updated_at"
    );

  if (error) {
    throw new Error(`chunksの取得に失敗しました: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    url: row.url,
    title: row.title,
    section: row.section,
    content: row.content,
    riskLevel: row.risk_level,
    fetchedAt: row.fetched_at,
    pageUpdatedAt: row.page_updated_at,
    embedding: parseVector(row.embedding),
  }));
}

async function fetchQaCache(): Promise<QaCacheEntry[]> {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from("qa_cache")
    .select(
      "id, question_hash, question, answer, index_version, hit_count, created_at, source_urls, recommend_cards"
    );

  if (error) {
    throw new Error(`qa_cacheの取得に失敗しました: ${error.message}`);
  }

  return data.map((row) => ({
    id: row.id,
    questionHash: row.question_hash,
    question: row.question,
    answer: row.answer,
    indexVersion: row.index_version,
    hitCount: row.hit_count,
    createdAt: row.created_at,
    sourceUrls: row.source_urls ?? [],
    recommendCards: row.recommend_cards ?? null,
  }));
}

async function main() {
  const [chunks, qaCache] = await Promise.all([fetchChunks(), fetchQaCache()]);
  const generatedAt = new Date().toISOString();

  // 現時点ではコーパスのバッチ埋め込みパイプライン自体が未実装のため、
  // builtAtはこのスナップショット生成時刻を代用する（実装され次第、実際のビルド時刻に差し替える）
  const snapshot: Snapshot = {
    chunks,
    qaCache,
    embeddingMetadata: {
      embeddingModel: process.env.GEMINI_EMBEDDING_MODEL ?? "",
      dimensions: EMBEDDING_DIMENSIONS,
      normalized: EMBEDDING_NORMALIZED,
      builtAt: generatedAt,
    },
    generatedAt,
  };

  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);

  console.log(
    `snapshot.jsonを更新しました（chunks: ${chunks.length}件, qa_cache: ${qaCache.length}件）`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
