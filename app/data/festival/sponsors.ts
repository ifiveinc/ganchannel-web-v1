// FES-0: 学祭（不来方祭）の仮データセット（協賛企業）。
// 第76回不来方祭パンフレットの協賛企業紹介ページに実際に掲載されていた企業を一部流用している。
// デジタル版に掲載するかは未定（festival-data-fes0.md §4参照）。

import type { FestivalSponsor } from "~/types/festival/festival";

export const festivalSponsors: FestivalSponsor[] = [
  { id: "iwagin", name: "岩手銀行", logoUrl: null, url: null },
  { id: "hirofoods", name: "ヒロフーズ株式会社", logoUrl: null, url: null },
  { id: "iwate-driving-school", name: "岩手自動車学校", logoUrl: null, url: null },
];
