import type { Circle } from "../circle-info/circle";

export type CircleStatus = "detailed" | "registered" | "unknown";

// circle_registry（クラブ紹介ページ・手動書き起こし由来の名簿。docs/chat/spec.md §10）のエントリ。
// circle-infoのCircle型より情報が少ない「名前と分類だけ分かっている団体」を表す。
// descriptionはクラブ紹介ページのスクレイピング（§10-2）では取得できないためnullになるが、
// 学内カンパニー・NEXT STEP工房の手動書き起こし（§10-3）では入力される想定。
export interface CircleRegistryEntry {
  name: string;
  kana: string | null;
  category: string;
  description: string | null;
}

export interface CircleResolution {
  status: CircleStatus;
  registryEntry: CircleRegistryEntry | null;
  circle: Circle | null;
}

export interface RecommendCard {
  circleId: string;
  name: string;
  reason: string;
  status: CircleStatus;
}
