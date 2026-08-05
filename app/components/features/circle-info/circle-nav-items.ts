import { MdHome, MdSearch, MdFavoriteBorder, MdApps } from "react-icons/md";
import type { BottomNavItem } from "~/components/layout/nav-items/bottom-nav";

// 機能内ナビの項目。デザイン規約 §19.0 に従い、上部ナビ（md:以上）と
// 下部固定ナビ（md:未満）で同じ項目・同じ並び順を使う。
export const CIRCLE_NAV_ITEMS: BottomNavItem[] = [
  { label: "ホーム", to: "/circle-info", end: true, icon: MdHome },
  { label: "探す", to: "/circle-info/search", end: false, icon: MdSearch },
  {
    label: "気になる",
    to: "/circle-info/favorites",
    end: false,
    icon: MdFavoriteBorder,
  },
  // 「その他」タブは中身が未定（docs/circle-info/spec.md §10-1）。
  // 導線確認のため、当面はがんちゃんねる本体のTOPへ戻る枠として使う。
  { label: "TOP", to: "/", end: true, icon: MdApps },
];
