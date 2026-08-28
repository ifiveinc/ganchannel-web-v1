import { getSnapshotEmbeddingMetadata } from "~/services/chatbot/snapshot-service.server";

// 埋め込みの固定設定（docs/decisions/0004-chatbot-architecture.md §3）。次元数・正規化はアーキテクチャ上の
// 決定事項でありモデルIDとは異なるため、環境変数化はせずコードの定数として持つ。
export const EMBEDDING_DIMENSIONS = 768;
export const EMBEDDING_NORMALIZED = true;

function getEmbeddingModel(): string {
  const model = process.env.GEMINI_EMBEDDING_MODEL;
  if (!model) {
    throw new Error("GEMINI_EMBEDDING_MODEL が設定されていません。");
  }
  return model;
}

function normalizeVector(values: number[]): number[] {
  const norm = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0));
  if (norm === 0) return values;
  return values.map((value) => value / norm);
}

// クエリの埋め込みを生成する。検索カスケード第5段でのみ呼ぶ（docs/decisions/0004-chatbot-architecture.md §3）。
// 失敗した場合は呼び出し元でキャッチし、キーワード検索のみで応答する（同 §7）。
export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = getEmbeddingModel();
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY が設定されていません。");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: { parts: [{ text }] },
      outputDimensionality: EMBEDDING_DIMENSIONS,
    }),
  });

  if (!response.ok) {
    throw new Error(`埋め込みAPIエラー（status: ${response.status}）`);
  }

  const json = await response.json();
  const values = json.embedding?.values;
  if (!Array.isArray(values)) {
    throw new Error("埋め込みAPIのレスポンス形式が不正です。");
  }

  return EMBEDDING_NORMALIZED ? normalizeVector(values) : values;
}

// qa_cacheのindex_versionとして使う値。コーパスの埋め込みが再生成されたタイミング
// （snapshotのembeddingMetadata.builtAt）が変わるたびに、古いキャッシュを自動的に無効化する
// （docs/decisions/0004-chatbot-architecture.md §1「index_versionが変わったキャッシュは無効化する」）。
export function getCurrentIndexVersion(): string {
  return getSnapshotEmbeddingMetadata().builtAt;
}

// コーパス側（snapshotに記録された値）と実行時の埋め込み設定を照合する。
// 不一致でもエラーにはせず警告のみ（docs/decisions/0004-chatbot-architecture.md §3「不一致なら警告」）。
export function checkEmbeddingMetadata(): boolean {
  const stored = getSnapshotEmbeddingMetadata();
  const model = process.env.GEMINI_EMBEDDING_MODEL;

  const matches =
    stored.embeddingModel === model &&
    stored.dimensions === EMBEDDING_DIMENSIONS &&
    stored.normalized === EMBEDDING_NORMALIZED;

  if (!matches) {
    console.warn(
      `[警告] 埋め込み設定がコーパスと一致しません。corpus: ${JSON.stringify(stored)} / 実行時: model=${model}, dimensions=${EMBEDDING_DIMENSIONS}, normalized=${EMBEDDING_NORMALIZED}`
    );
  }

  return matches;
}
