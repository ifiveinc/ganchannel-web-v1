// 団体画像の手動差し替え表。
//
// フォーム回答の「ロゴ画像」「活動写真」はGoogle Driveの共有リンクとして入ってくるが、
// これらは非公開ファイルのため <img> では描画できない（サインイン画面のHTMLが返る）。
// また images / logo は scripts/sync-circles.ts の所有フィールドで、
// app/data/circle-info/circles.ts を直接書き換えても次回の `npm run sync:circles` で上書きされる
// （docs/chatbot/spec.md §9-2a）。
//
// そのため、Driveからダウンロードした画像は public/circles/<circleId>/ に置き、
// パスをこの表で指定する。circle-service.ts が読み出し時に差し替える。
// name-overrides.ts と同じく、同期スクリプトが触らない場所で手動管理する。

export interface CircleImageOverride {
  /** 対象の Circle.id */
  circleId: string;
  /** 円形ロゴ画像。public/ からの絶対パス（例: "/circles/xxx/logo.png"） */
  logo?: string;
  /** 活動写真。images[0] がヒーロー画像・カードのサムネイルになる */
  images?: string[];
}

export const CIRCLE_IMAGE_OVERRIDES: CircleImageOverride[] = [
  // 岩手大学ボラセン構想チーム
  // TODO: public/circles/circle-d178a0af/ に画像を配置したらコメントを外す
  // {
  //   circleId: "circle-d178a0af",
  //   logo: "/circles/circle-d178a0af/logo.png",
  //   images: [
  //     "/circles/circle-d178a0af/activity-01.jpg",
  //     "/circles/circle-d178a0af/activity-02.jpg",
  //     "/circles/circle-d178a0af/activity-03.jpg",
  //     "/circles/circle-d178a0af/activity-04.jpg",
  //     "/circles/circle-d178a0af/activity-05.jpg",
  //   ],
  // },
];

export function findImageOverride(
  circleId: string
): CircleImageOverride | undefined {
  return CIRCLE_IMAGE_OVERRIDES.find(
    (override) => override.circleId === circleId
  );
}

// Google Drive / Googleドキュメントの共有リンクは、公開設定にしていても
// <img> から直接参照できないため描画対象から除外する。
// 除外した結果 images が空になった場合はプレースホルダ画像が表示される。
const UNRENDERABLE_HOSTS = ["drive.google.com", "docs.google.com"];

export function isRenderableImage(url: string): boolean {
  if (url.startsWith("/")) return true;

  try {
    return !UNRENDERABLE_HOSTS.includes(new URL(url).hostname);
  } catch {
    // URLとして解釈できない値（フォームの自由記述など）は表示しない
    return false;
  }
}
