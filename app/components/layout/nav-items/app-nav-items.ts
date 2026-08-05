import {
  MdHome,
  MdGridView,
  MdChatBubbleOutline,
  MdHelpOutline,
  MdPersonOutline,
} from "react-icons/md";
import type { NavItem } from "./bottom-nav";

// アプリ全体の下部固定ナビの項目。
// アイコンファミリーは Material Design に統一する（デザイン規約 §11.1）。
export const APP_NAV_ITEMS: NavItem[] = [
  { label: "ホーム", to: "/", end: true, icon: MdHome },
  { label: "機能一覧", to: "/features", end: false, icon: MdGridView },
  { label: "チャット", to: "/chat", end: false, icon: MdChatBubbleOutline },
  { label: "Q&A", to: "/faq", end: false, icon: MdHelpOutline },
  { label: "設定", to: "/settings", end: false, icon: MdPersonOutline },
];
