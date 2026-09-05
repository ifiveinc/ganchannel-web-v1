import type { RecommendCard } from "./circle-registry";

export interface QaCacheEntry {
  id: number;
  questionHash: string;
  question: string;
  answer: string;
  indexVersion: string;
  hitCount: number;
  createdAt: string;
  // Phase 10後に追加。キャッシュヒット時（第3段・5a段）でも出典リンク・レコメンドカードを
  // 復元できるようにするための保存項目（docs/chat/spec.md §2の当初定義には無かった）
  sourceUrls: string[];
  recommendCards: RecommendCard[] | null;
}

export interface QaLogEntry {
  id: number;
  question: string;
  answer: string;
  providerUsed: string | null;
  searchScore: number | null;
  feedback: "up" | "down" | null;
  noAnswer: boolean;
  createdAt: string;
}
