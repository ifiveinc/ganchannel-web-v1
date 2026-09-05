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

// --- サークル情報（circle-info）---------------------------------------------
// 分類は「団体種別」と「ジャンル」の2軸。詳細は docs/circle-info/spec.md §5.2

// 団体種別。1団体につき1つ。詳細画面のバッジ表示に使う
export const ORGANIZATION_TYPES = [
  "部活",
  "サークル",
  "同好会",
  "学内カンパニー",
  "学生委員会",
  "NEXT STEP工房",
  "その他学生有志団体",
] as const;

// ジャンル。1団体に複数付けられる。「探す」画面の絞り込みに使う
// TODO: 正式な値は要確認（docs/circle-info/requirements.md §8.2）
export const CIRCLE_GENRES = [
  "運動系",
  "文化系",
  "音楽系",
  "学術系",
  "ボランティア",
  "その他",
] as const;

// 募集ステータス
export const RECRUITMENT_STATUSES = ["募集中", "募集停止"] as const;

// 「おすすめのサークル」枠に出す上限。ホーム（/circle-info）と
// 「探す」の条件未指定時（/circle-info/search）で同じ件数に揃える。
// 掲載数がこれより少ない場合は、あるだけ表示される
export const RECOMMENDED_CIRCLE_LIMIT = 10;

// タグは自由入力のため定数にしない。「探す」画面の選択肢は掲載データから動的に生成する

// --- 学祭（festival）---------------------------------------------
// FES-0: 過去の紙パンフレット（第76回不来方祭パンフレット）の実物を参照した仮定義。
// 屋外模擬店は構内の通路沿いにグループ分けされ、各グループ内で連番のコードが振られる
// （例: Aグループ = A1〜A25）。今年の実データで区分自体が変わる可能性があるため、
// 実データ反映時はまずこの一覧の見直しから行う。
export const FESTIVAL_OUTDOOR_GROUPS = ["A", "B", "C", "D", "E", "F"] as const;
