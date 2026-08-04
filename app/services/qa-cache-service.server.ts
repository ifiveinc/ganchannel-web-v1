import { createHash } from "node:crypto";
import { getSupabaseClient } from "~/services/supabase-client.server";
import { getSnapshotQaCache } from "~/services/snapshot-service.server";
import { getCurrentIndexVersion } from "~/services/embedding-service.server";
import type { QaCacheEntry } from "~/types/qa";
import type { RecommendCard } from "~/types/circle-registry";

// コサイン類似度の閾値（正規化済みベクトル同士の内積 > 0.95、docs/chatbot-decisions.md §4）
const SEMANTIC_MATCH_THRESHOLD = 0.95;

interface QaCacheRow {
  id: number;
  question_hash: string;
  question: string;
  answer: string;
  index_version: string;
  hit_count: number;
  created_at: string;
  source_urls: unknown;
  recommend_cards: unknown;
}

const QA_CACHE_COLUMNS =
  "id, question_hash, question, answer, index_version, hit_count, created_at, source_urls, recommend_cards";

function normalizeQuestion(question: string): string {
  return question.normalize("NFKC").trim().replace(/\s+/g, "");
}

// 正規化した質問のハッシュ（docs/chatbot-decisions.md §4 qa_cache.question_hash）
export function computeQuestionHash(question: string): string {
  return createHash("sha256").update(normalizeQuestion(question)).digest("hex");
}

// jsonb列はSupabaseクライアント経由だと既にパース済みのオブジェクトで返ることが多いが、
// 文字列で返る場合にも備えて両対応する（question_vecの文字列返却と同様の注意、下記参照）。
function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function rowToEntry(row: QaCacheRow): QaCacheEntry {
  return {
    id: row.id,
    questionHash: row.question_hash,
    question: row.question,
    answer: row.answer,
    indexVersion: row.index_version,
    hitCount: row.hit_count,
    createdAt: row.created_at,
    sourceUrls: parseJsonColumn<string[]>(row.source_urls, []),
    recommendCards: parseJsonColumn<RecommendCard[] | null>(row.recommend_cards, null),
  };
}

async function incrementHitCount(id: number, currentHitCount: number): Promise<void> {
  try {
    const client = getSupabaseClient();
    await client.from("qa_cache").update({ hit_count: currentHitCount + 1 }).eq("id", id);
  } catch (error) {
    // ヒットカウント更新の失敗は本処理（回答自体は既に得られている）を止めない
    console.warn("[警告] qa_cacheのhit_count更新に失敗しました:", error);
  }
}

// 完全一致（検索カスケード第3段）。DBを優先し、失敗時はスナップショットへフォールバックする
// （docs/chatbot-decisions.md §4）。index_versionが現在と異なるキャッシュは無効として扱う。
export async function findExactMatch(question: string): Promise<QaCacheEntry | null> {
  const hash = computeQuestionHash(question);
  const currentIndexVersion = getCurrentIndexVersion();

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("qa_cache")
      .select(QA_CACHE_COLUMNS)
      .eq("question_hash", hash)
      .eq("index_version", currentIndexVersion)
      .maybeSingle<QaCacheRow>();

    if (error) throw error;
    if (!data) return null;

    await incrementHitCount(data.id, data.hit_count);
    return rowToEntry(data);
  } catch {
    const entry = getSnapshotQaCache().find(
      (item) => item.questionHash === hash && item.indexVersion === currentIndexVersion
    );
    return entry ?? null;
  }
}

function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) return -1;
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

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

// 意味的一致（検索カスケード第5a段）。クエリ埋め込みとqa_cache.question_vecの内積
// （双方正規化済み前提のためコサイン類似度に等しい）を比較する。
// スナップショットにはquestion_vecが含まれないため、DB利用時のみ対応する
// （docs/chatbot-decisions.md §4「メモリ上のキャッシュは採用しない」の精神に合わせ、
// 意味的一致はDB接続時のみの機能として段階的に縮退させる）。
export async function findSemanticMatch(queryEmbedding: number[]): Promise<QaCacheEntry | null> {
  const currentIndexVersion = getCurrentIndexVersion();

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("qa_cache")
      .select(`${QA_CACHE_COLUMNS}, question_vec`)
      .eq("index_version", currentIndexVersion);

    if (error) throw error;

    let best: { row: QaCacheRow; score: number } | null = null;
    for (const row of (data ?? []) as (QaCacheRow & { question_vec: unknown })[]) {
      const vector = parseVector(row.question_vec);
      if (!vector) continue;
      const score = dotProduct(queryEmbedding, vector);
      if (score > SEMANTIC_MATCH_THRESHOLD && (!best || score > best.score)) {
        best = { row, score };
      }
    }

    if (!best) return null;

    await incrementHitCount(best.row.id, best.row.hit_count);
    return rowToEntry(best.row);
  } catch {
    return null;
  }
}

// 生成した回答をqa_cacheへ書き込む（失敗しても本処理を止めない、docs/chatbot-decisions.md §13）。
// 既存の質問（question_hash重複）があれば上書きする（index_version更新後の再キャッシュに対応）。
// sourceUrls/recommendCardsも保存し、キャッシュヒット時にリンク・カードを復元できるようにする
// （Phase 10後の追加対応。当初はanswerのテキストのみをキャッシュしていた）。
export async function writeCacheEntry(
  question: string,
  answer: string,
  questionEmbedding: number[] | null,
  sourceUrls: string[] = [],
  recommendCards: RecommendCard[] | null = null
): Promise<void> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.from("qa_cache").upsert(
      {
        question_hash: computeQuestionHash(question),
        question,
        question_vec: questionEmbedding,
        answer,
        index_version: getCurrentIndexVersion(),
        source_urls: sourceUrls,
        recommend_cards: recommendCards,
      },
      { onConflict: "question_hash" }
    );
    if (error) throw error;
  } catch (error) {
    console.warn("[警告] qa_cacheへの書き込みに失敗しました:", error);
  }
}
