// 団体名の表記ゆれ手動対応表。
// circle_registry との名寄せ（docs/chat/spec.md §9-4）で自動一致しない場合に参照する。
// 加えて、Circle.id（スラッグ）を手動指定したい団体があればここで上書きできる（§8 item22）。

export interface NameOverride {
  /** app/data/circle-info/circles.ts（フォーム回答）側の団体名 */
  formName: string;
  /** circle_registry 側の正式名称と表記が異なる場合に指定する */
  registryName?: string;
  /** Circle.id を自動生成に任せず固定したい場合に指定する */
  circleId?: string;
}

export const NAME_OVERRIDES: NameOverride[] = [
  // 例: { formName: "写真部（サークル棟）", registryName: "写真部", circleId: "photo-club" },

  // 大学のクラブ紹介ページ側は「サッカ－部」（長音符ではなく全角ハイフン U+FF0D）で
  // 掲載されているため、NFKC正規化後も「岩手大学サッカー部」と一致しない。
  { formName: "岩手大学サッカー部", registryName: "サッカ－部" },
];
