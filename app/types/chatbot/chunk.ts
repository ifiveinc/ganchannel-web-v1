export type RiskLevel = "A" | "B" | "C";

export interface Chunk {
  id: string;
  url: string;
  title: string;
  section: string | null;
  content: string;
  riskLevel: RiskLevel;
  fetchedAt: string;
  pageUpdatedAt: string | null;
  // ベクトル検索（Phase 12）用。スナップショットフォールバック時はnull
  // （question_vecと同様、DB利用時のみの機能として段階的に縮退させる）。
  embedding: number[] | null;
}
