import type { RecommendCard } from "./circle-registry";

export interface ChatRequestBody {
  question: string;
}

export interface ChatStreamChunk {
  type: "text" | "sources" | "recommend" | "log_id" | "done" | "error";
  text?: string;
  sourceUrls?: string[];
  recommendCards?: RecommendCard[];
  logId?: number;
}
