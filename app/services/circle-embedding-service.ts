import circleEmbeddings from "~/data/circle-embeddings.json";
import { fetchCircles } from "~/services/circle-service";
import type { Circle } from "~/types/circle";

interface CircleEmbeddingEntry {
  circleId: string;
  embedding: number[];
}

interface CircleEmbeddingsFile {
  embeddingModel: string;
  dimensions: number;
  normalized: boolean;
  builtAt: string;
  entries: CircleEmbeddingEntry[];
}

const typedEmbeddings = circleEmbeddings as CircleEmbeddingsFile;

function dotProduct(a: number[], b: number[]): number {
  if (a.length !== b.length) return -1;
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

export interface CircleSimilarity {
  circle: Circle;
  score: number;
}

// クエリの埋め込みと、事前生成済みのサークル埋め込み（scripts/generate-circle-embeddings.ts、
// app/data/circle-embeddings.json）の内積（双方正規化済みのためコサイン類似度に等しい）を
// 比較し、類似度の高い順に返す。
// サークルはSupabaseテーブルを持たない静的ファイル方式のため、埋め込みも実行時ではなく
// ビルド時の静的ファイルとして持つ（docs/chatbot-decisions.md §6の設計をサークルにも適用）。
export async function findSimilarCircles(queryEmbedding: number[]): Promise<CircleSimilarity[]> {
  const circles = await fetchCircles();
  const circleById = new Map(circles.map((circle) => [circle.id, circle]));

  return typedEmbeddings.entries
    .map((entry) => {
      const circle = circleById.get(entry.circleId);
      if (!circle) return null;
      return { circle, score: dotProduct(queryEmbedding, entry.embedding) };
    })
    .filter((item): item is CircleSimilarity => item !== null)
    .sort((a, b) => b.score - a.score);
}
