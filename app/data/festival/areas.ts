// FES-0: 学祭（不来方祭）の仮データセット（構内マップ・エリア情報）。
// 第76回不来方祭パンフレットの全体マップ（P.11）・グループ別マップ（P.18〜）の
// 実際のグループ構成を参照している。マップ画像自体は未取得のため mapImageUrl は
// すべて null（FES-1で実行委員会から構内マップ素材を受領後に差し替える）。

import type {
  FestivalIndoorAreaInfo,
  FestivalOutdoorGroupInfo,
} from "~/types/festival/festival";

export const festivalOutdoorGroups: FestivalOutdoorGroupInfo[] = [
  {
    group: "A",
    label: "Aグループ",
    mapImageUrl: null,
    programIds: ["A1", "A2", "A3", "A4", "A11", "A17", "A18"],
  },
  { group: "B", label: "Bグループ", mapImageUrl: null, programIds: [] },
  { group: "C", label: "Cグループ", mapImageUrl: null, programIds: [] },
  { group: "D", label: "Dグループ", mapImageUrl: null, programIds: [] },
  { group: "E", label: "Eグループ", mapImageUrl: null, programIds: [] },
  { group: "F", label: "Fグループ", mapImageUrl: null, programIds: [] },
];

export const festivalIndoorAreas: FestivalIndoorAreaInfo[] = [
  {
    id: "student-center-b-2f",
    building: "学生センターB棟",
    floor: "2F",
    mapImageUrl: null,
    programIds: ["GB21", "GB-2A"],
  },
];
