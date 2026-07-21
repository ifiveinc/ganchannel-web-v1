// 外部APIやアプリ全体で共有する定数を集約する

// 岩手大学のニュースをスクレイピングした結果を返すエンドポイント
export const NEWS_API_URL =
  "https://ifive.sakura.ne.jp/scrape/iwate_u_data.json";

// ニュース一覧の絞り込みカテゴリー（"All" は全件表示用の擬似カテゴリー）
export const NEWS_CATEGORIES = [
  "All",
  "ニュース",
  "イベント",
  "最新研究",
  "入試情報",
  "お知らせ",
] as const;
