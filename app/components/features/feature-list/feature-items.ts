import { MdArticle, MdHelpOutline, MdGroups, MdChatBubbleOutline } from "react-icons/md";
import type { IconType } from "react-icons";

export type AppFeature = {
  /** 機能名 */
  name: string;
  /** カードに出す1行説明 */
  description: string;
  to: string;
  icon: IconType;
};

// がんちゃんねるの機能一覧。機能を追加したらここに1行足す。
export const APP_FEATURES: AppFeature[] = [
  {
    name: "ニュース",
    description: "岩手大学の最新ニュースをまとめて読めます。",
    to: "/news",
    icon: MdArticle,
  },
  {
    name: "Q&A",
    description: "大学生活のよくある疑問と答えを探せます。",
    to: "/faq",
    icon: MdHelpOutline,
  },
  {
    name: "サークル情報",
    description: "学内のサークル・部活・学内カンパニーを探せます。",
    to: "/circle-info",
    icon: MdGroups,
  },
  {
    name: "学内QAチャットボット",
    description: "学内のよくある質問にAIチャットボットが答えます。",
    to: "/chat",
    icon: MdChatBubbleOutline,
  },
];
