import type { RecommendCard } from "./circle-registry";

export type CascadeStage =
  | "c_layer_block"
  | "faq_match"
  | "qa_cache_exact"
  | "circle_strong_match"
  | "qa_cache_semantic"
  | "hybrid_generation"
  | "degraded";

export interface CascadeResult {
  stage: CascadeStage;
  answer: string;
  sourceUrls: string[];
  providerUsed: string | null;
  searchScore: number | null;
  recommendCards: RecommendCard[] | null;
}
