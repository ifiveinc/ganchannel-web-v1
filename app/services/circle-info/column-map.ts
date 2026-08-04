// CSVヘッダ文字列 → Circleフィールドの対応表（docs/chatbot/spec.md §9-5a）。
// フォームの質問文がそのままヘッダになるため、フィールドごとに候補ヘッダを複数持たせて表記ゆれを吸収する。
//
// 「種別」（#4）・「活動動画」（#9）・「代表者名」（#19）は対応するCircleフィールドが無い、
// または個人情報のため取り込まない（§9-5a、§8 item25）ため、ここには含めない。

import type { OrganizationType } from "~/types/circle-info/circle";

export type CircleColumnKey =
  | "organizationType"
  | "name"
  | "description"
  | "logo"
  | "imagesUpload"
  | "imagesSnsLink"
  | "recruitmentPeriod"
  | "place"
  | "schedule"
  | "fee"
  | "feeOther"
  | "membersTotal"
  | "membersGenderRatio"
  | "membersBeginnerRatio"
  | "achievements"
  | "contactPrimary"
  | "contactLinksOther"
  | "tags";

// §8 item14は2026-08-04に解消（列は反映済み、ヘッダ文言は「団体名ふりがな」「団体名略称」）。
// 念のため列が欠けていてもエラーにはしない。
export type OptionalCircleColumnKey = "kana" | "aliases";

export const TIMESTAMP_COLUMN_PATTERNS = ["タイムスタンプ"];

export const CIRCLE_COLUMN_PATTERNS: Record<CircleColumnKey, string[]> = {
  organizationType: ["団体の形態"],
  name: ["団体名"],
  description: ["紹介文"],
  logo: ["ロゴ画像"],
  imagesUpload: [
    "活動写真（ファイルをアップロードする場合はこちら．5枚まで可能です．）",
    "活動写真（アップロード、5枚まで）",
    "活動写真(アップロード、5枚まで)",
  ],
  imagesSnsLink: [
    "活動写真（SNSなどから引用する場合はこちら．写真のリンクをまとめて添付してください．5枚まで可能です．）",
    "活動写真（SNS引用リンク、5枚まで）",
    "活動写真(SNS引用リンク、5枚まで)",
  ],
  recruitmentPeriod: ["募集期間"],
  place: ["活動場所"],
  schedule: ["活動曜日・時間・頻度"],
  fee: ["入会費・年会費など"],
  feeOther: [
    "その他費用（用途・金額をまとめる）",
    "その他費用（用途・金額）",
    "その他費用(用途・金額)",
  ],
  membersTotal: ["総人数"],
  membersGenderRatio: ["大まかな男女比"],
  membersBeginnerRatio: [
    "大まかな初心者：経験者割合",
    "大まかな初心者:経験者割合",
  ],
  achievements: [
    "実績（テキストまたはURL添付．）",
    "実績（テキストまたはURL）",
    "実績(テキストまたはURL)",
  ],
  contactPrimary: [
    "団体との連絡手段（SNSリンクやメールアドレスなど，ユーザーとやり取りできるものを記載してください．個人電話番号などは記載しないでください．）",
    "団体との連絡手段（SNS・メール等）",
    "団体との連絡手段(SNS・メール等)",
  ],
  contactLinksOther: ["その他SNSリンク"],
  tags: [
    "雰囲気・特徴（当てはまるものすべてにチェック）",
    "雰囲気・特徴（チェックボックス）",
    "雰囲気・特徴(チェックボックス)",
  ],
};

export const OPTIONAL_CIRCLE_COLUMN_PATTERNS: Record<
  OptionalCircleColumnKey,
  string[]
> = {
  kana: ["団体名ふりがな（ひらがな）", "ふりがな"],
  aliases: [
    "団体名略称（ 複数ある場合は、全角読点「、」で区切って入力してください。 ）",
    "略称・別名",
    "略称・別名（あれば）",
    "略称・別名(あれば)",
  ],
};

// 「団体の形態」列の回答値の表記ゆれ対応（§8 item23）。
// ORGANIZATION_TYPES（app/constants/index.ts）の正式表記に正規化する。
export const ORGANIZATION_TYPE_VALUE_ALIASES: Record<string, OrganizationType> = {
  "NEXTSTEP工房": "NEXT STEP工房",
  "NEXT STEP工房": "NEXT STEP工房",
};
