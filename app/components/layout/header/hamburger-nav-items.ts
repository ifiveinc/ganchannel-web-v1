export type HamburgerNavItem = {
  label: string;
  to: string;
};

// 全てのページを網羅するハンバーガーメニュー用の項目（アイコンなし）
export const HAMBURGER_NAV_ITEMS: HamburgerNavItem[] = [
  { label: "ホーム", to: "/" },
  { label: "サークル情報", to: "/circle-info" },
  { label: "AIチャット", to: "/chat" },
  { label: "ニュース", to: "/news" },
  { label: "Q&A", to: "/faq" },
  { label: "お問い合わせ", to: "/ad-inquiry" },
];