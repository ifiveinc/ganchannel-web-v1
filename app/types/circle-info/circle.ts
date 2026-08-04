// サークル情報（circle-info）の型定義
// 項目の詳細と設計上の判断は docs/circle-info/spec.md §5 を参照。

import type {
  CIRCLE_GENRES,
  ORGANIZATION_TYPES,
  RECRUITMENT_STATUSES,
} from "~/constants";

export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];
export type Genre = (typeof CIRCLE_GENRES)[number];
export type RecruitmentStatus = (typeof RECRUITMENT_STATUSES)[number];

export type CircleLink = {
  type: "instagram" | "x" | "website" | "other";
  label: string;
  url: string;
};

/** 活動情報。詳細画面の「活動情報」カードに対応する */
export type CircleActivity = {
  place: string | null;
  /** 例: "毎週火曜 18:00〜20:00 / 週1回" */
  schedule: string | null;
  /** 例: "通年募集" */
  recruitmentPeriod: string | null;
};

/** 費用。詳細画面の「費用」カードに対応する */
export type CircleFee = {
  admission: string | null;
  annual: string | null;
  other: string | null;
};

/** メンバー構成。詳細画面の「メンバー構成」カードに対応する */
export type CircleMembers = {
  /** 例: "28名" */
  total: string | null;
  /** 例: "6:4" */
  genderRatio: string | null;
  /** 例: "初心者多め" */
  beginnerRatio: string | null;
};

/** 連絡先。詳細画面の「SNS・連絡先」カードに対応する */
export type CircleContact = {
  representative: string | null;
  email: string | null;
  links: CircleLink[];
};

export type CircleAchievement = {
  /** 例: "2023年" */
  year: string;
  content: string;
};

// 必須項目は name のみ。未入力は null（配列の場合は空配列）で表す。
// "none" のような文字列で未入力を表すと値と区別できないため使わない。
export type Circle = {
  id: string;
  name: string;
  organizationType: OrganizationType;
  genres: Genre[];
  tags: string[];
  recruitmentStatus: RecruitmentStatus;
  /** ホーム・探すの「おすすめの団体」に出すか */
  isRecommended: boolean;

  /** 一覧カード用の短い紹介文（1〜2行） */
  summary: string;
  /** 詳細ページ用の本文 */
  description: string;
  /** 「こんな人におすすめ」の箇条書き */
  recommendedFor: string[];

  /** 円形ロゴ画像のパス */
  logo: string | null;
  /** 活動写真。images[0] をヒーロー画像・カードのサムネイルに使う */
  images: string[];

  activity: CircleActivity;
  fee: CircleFee;
  members: CircleMembers;
  achievements: CircleAchievement[];
  contact: CircleContact;

  /** 対象学部・学年の制限 */
  restriction: string | null;
  /** 新歓イベントの日程 */
  newcomerEvent: string | null;
  /** 公認 / 非公認 */
  isOfficial: boolean | null;

  /** "YYYY-MM-DD" */
  updatedAt: string;

  /** チャットボットのサークル名検索用。circle-infoの画面表示では使わない */
  kana?: string | null;
  /** チャットボットのサークル名検索用。circle-infoの画面表示では使わない */
  aliases?: string[];
};
