// FES-0: 学祭（不来方祭）の仮データセット（実行委員スタッフの役職一覧）。
// 第76回不来方祭パンフレットの編集後記「実行委員スタッフ代表」に掲載されていた役職名を
// そのまま流用している。個人名は掲載しない方針にしているため、nameは常にnull
//（app/services/circle-info/column-map.tsの「代表者名は個人情報のため取り込まない」と同じ方針。
// festival-data-fes0.md §4参照）。

import type { FestivalStaffMember } from "~/types/festival/festival";

export const festivalStaffMembers: FestivalStaffMember[] = [
  { role: "委員長", name: null },
  { role: "副委員長", name: null },
  { role: "会計", name: null },
  { role: "ステージ部長", name: null },
  { role: "構想部長", name: null },
  { role: "企画部長", name: null },
  { role: "物品交渉部長", name: null },
  { role: "模擬部長", name: null },
  { role: "外部交渉部長", name: null },
  { role: "広報部長", name: null },
];
