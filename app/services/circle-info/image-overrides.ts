// 団体画像の手動差し替え表。
//
// フォーム回答の「ロゴ画像」「活動写真」はGoogle Driveの共有リンクとして入ってくるが、
// これらは非公開ファイルのため <img> では描画できない（サインイン画面のHTMLが返る）。
// また images / logo は scripts/sync-circles.ts の所有フィールドで、
// app/data/circle-info/circles.ts を直接書き換えても次回の `npm run sync:circles` で上書きされる
// （docs/chat/spec.md §9-2a）。
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
   {
     circleId: "circle-d178a0af",
     logo: "/circles/circle-d178a0af/logo.jpg",
     images: [
       "/circles/circle-d178a0af/activity-01.jpg",
       "/circles/circle-d178a0af/activity-02.jpg",
       "/circles/circle-d178a0af/activity-03.jpg",
       "/circles/circle-d178a0af/activity-04.jpg",
       "/circles/circle-d178a0af/activity-05.jpg",
     ],
   },

   // 岩手大学アルティメット同好会RASIS
   {
     circleId: "circle-99811a9c",
     logo: "/circles/circle-99811a9c/logo.jpg",
     images: [
       "/circles/circle-99811a9c/activity-01.jpg",
       "/circles/circle-99811a9c/activity-02.jpg",
       "/circles/circle-99811a9c/activity-03.jpg",
       "/circles/circle-99811a9c/activity-04.jpg",
       "/circles/circle-99811a9c/activity-05.jpg",
     ],
   },

   // DearU
   {
     circleId: "circle-1693988b",
     logo: "/circles/circle-1693988b/logo.jpg",
     images: [
       "/circles/circle-1693988b/activity-01.jpg",
       "/circles/circle-1693988b/activity-02.jpg",
       "/circles/circle-1693988b/activity-03.jpg",
       "/circles/circle-1693988b/activity-04.jpg",
       "/circles/circle-1693988b/activity-05.jpg",
     ],
   },

   // IWATE Studio
   {
     circleId: "circle-558573de",
     logo: "/circles/circle-558573de/logo.jpg",
     images: [
       "/circles/circle-558573de/activity-01.jpg",
       "/circles/circle-558573de/activity-02.jpg",
       "/circles/circle-558573de/activity-03.jpg",
       "/circles/circle-558573de/activity-04.jpg",
       "/circles/circle-558573de/activity-05.jpg",
     ],
   },

   // +DESIGN
   {
     circleId: "circle-15559f43",
     logo: "/circles/circle-15559f43/logo.jpg",
     images: [
       "/circles/circle-15559f43/activity-01.jpg",
       "/circles/circle-15559f43/activity-02.jpg",
       "/circles/circle-15559f43/activity-03.jpg",
       "/circles/circle-15559f43/activity-04.jpg",
       "/circles/circle-15559f43/activity-05.jpg",
     ],
   },

   // 岩手大学研磨工業
   {
     circleId: "circle-348baae6",
     logo: "/circles/circle-348baae6/logo.jpg",
     images: [
       "/circles/circle-348baae6/activity-01.jpg",
       "/circles/circle-348baae6/activity-02.jpg",
       "/circles/circle-348baae6/activity-03.jpg",
       "/circles/circle-348baae6/activity-04.jpg",
       "/circles/circle-348baae6/activity-05.jpg",
     ],
   },

   // 岩手大学クラフトビール部
   {
     circleId: "circle-d1e360dd",
     logo: "/circles/circle-d1e360dd/logo.jpg",
     images: [
       "/circles/circle-d1e360dd/activity-01.jpg",
       "/circles/circle-d1e360dd/activity-02.jpg",
       "/circles/circle-d1e360dd/activity-03.jpg",
       "/circles/circle-d1e360dd/activity-04.jpg",
       "/circles/circle-d1e360dd/activity-05.jpg",
     ],
   },

   // Have a break！〜しどろもどろシンドローム
   {
     circleId: "circle-b704e315",
     logo: "/circles/circle-b704e315/logo.jpg",
     images: [
       "/circles/circle-b704e315/activity-01.jpg",
       "/circles/circle-b704e315/activity-02.jpg",
       "/circles/circle-b704e315/activity-03.jpg",
       "/circles/circle-b704e315/activity-04.jpg",
       "/circles/circle-b704e315/activity-05.jpg",
     ],
   },

   // iFive（ロゴのみPNG。フォーム回答の活動写真は1枚）
   {
     circleId: "ifive",
     logo: "/circles/ifive/logo.png",
     images: ["/circles/ifive/activity-01.jpg"],
   },

   // 岩手大学サッカー部
   {
     circleId: "circle-fbc87743",
     logo: "/circles/circle-fbc87743/logo.jpg",
     images: [
       "/circles/circle-fbc87743/activity-01.jpg",
       "/circles/circle-fbc87743/activity-02.jpg",
       "/circles/circle-fbc87743/activity-03.jpg",
       "/circles/circle-fbc87743/activity-04.jpg",
     ],
   },
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
