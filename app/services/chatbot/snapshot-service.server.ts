import snapshot from "~/data/chatbot/snapshot.json";
import type { Chunk } from "~/types/chatbot/chunk";
import type { QaCacheEntry } from "~/types/chatbot/qa";
import { getSupabaseClient } from "~/services/chatbot/supabase-client.server";

// コーパス（chunks/qa_cache）を埋め込んだ時点の設定。埋め込みAPIのモデル・次元数・正規化の
// 実行時設定とズレていないかの照合に使う（docs/decisions/0004-chatbot-architecture.md §3）。
export interface EmbeddingMetadata {
  embeddingModel: string;
  dimensions: number;
  normalized: boolean;
  builtAt: string;
}

export interface Snapshot {
  chunks: Chunk[];
  qaCache: QaCacheEntry[];
  embeddingMetadata: EmbeddingMetadata;
  generatedAt: string;
}

const typedSnapshot = snapshot as Snapshot;

export function getSnapshotChunks(): Chunk[] {
  return typedSnapshot.chunks;
}

export function getSnapshotQaCache(): QaCacheEntry[] {
  return typedSnapshot.qaCache;
}

export function getSnapshotEmbeddingMetadata(): EmbeddingMetadata {
  return typedSnapshot.embeddingMetadata;
}

// Supabaseへの接続可否を判定する。呼び出し元（検索カスケード等、以降のフェーズ）は
// この結果を見てDB問い合わせかスナップショットへのフォールバックかを選択する。
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client
      .from("chunks")
      .select("id", { head: true, count: "exact" });
    return !error;
  } catch {
    return false;
  }
}

// SupabaseはPostgresのvector型を "[0.1,0.2,...]" 形式の文字列として返す
// （配列に自動変換されない）ため、明示的にパースする（qa-cache-service.server.tsの
// question_vec読み込みと同様の注意）。
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

// chunksを取得する。Supabaseへの接続を優先し、失敗した場合はスナップショットへ
// 自動的に切り替える（docs/decisions/0004-chatbot-architecture.md §1「スナップショットフォールバック」）。
export async function getChunks(): Promise<Chunk[]> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("chunks")
      .select(
        "id, url, title, section, content, embedding, risk_level, fetched_at, page_updated_at"
      );

    if (error) throw error;

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
  } catch {
    return getSnapshotChunks();
  }
}
