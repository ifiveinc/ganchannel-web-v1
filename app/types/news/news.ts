export type NewsData = {
  date: number;
  category:
    | "ニュース"
    | "イベント"
    | "最新研究"
    | "入試情報"
    | "キャリア・地域協創教育"
    | "お知らせ"
    | "重要なお知らせ";
  title: string;
  link: string;
  image: string | "none";
  faculty: "理工学" | "農学" | "人文社会" | "教育学" | "none";
};
