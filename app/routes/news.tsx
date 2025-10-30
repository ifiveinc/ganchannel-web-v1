import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { demoNewsData } from "~/components/news/demo-news-data";
import type { NewsData } from "../components/news/news-data";
import NewsCard from "../components/news/news-card";


export async function loader() {
  const API_URL = "https://ifive.sakura.ne.jp/scrape/iwate_u_data.json";

  const response = await fetch(API_URL);

  // エラーチェック（もし取得に失敗したらエラー画面を表示させる）
  if (!response.ok) {
    throw new Error("データの取得に失敗しました。");
  }

  // 取得したデータをJSON形式に変換して返す
  const data = await response.json();
  return { data }; // オブジェクト形式で返すと扱いやすいです
}


export default function News() {
  // newsデータの取得に使う部分。一旦コメントアウト(サーバー直るまで)
  const { data } = useLoaderData();
  console.log(data)
  

  //const newsDeta = demoNewsData; //ダミーデータを使用する場合のニュースデータ
  const newsDeta:NewsData[]=data            //サーバのデータを使用する場合

  //絞り込み機能に必要なstateを定義
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  //絞り込むカテゴリーを定義.スタイルの都合上、一旦"キャリア・地域共創教育"を削除
  const categories = [
    "All",
    "ニュース",
    "イベント",
    "最新研究",
    "入試情報",
    "お知らせ",
  ];

  const filteredNews =
    selectedCategory === "All"
      ? newsDeta // "All"が選択されている場合は、すべてのニュースを表示
      : newsDeta.filter((news) => news.category === selectedCategory);

  return (
    <div>
      {/* カテゴリ絞り込みボタン */}
      <div className="sticky top-0 z-10 flex justify-center h-8 shadow-md divide-x divide-white">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`h-full w-full py-2 text-xs font-mono ${
              selectedCategory === category
                ? "bg-[#004400] text-white" // 選択中のボタンのデザイン
                : "bg-[#bccec2] text-gray-800" // それ以外のボタンのデザイン
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {/*news表示コンポーネント*/ }
      <div className="flex flex-col gap-3 p-3">
        {filteredNews.map((deta) => (
          <NewsCard key={`${deta.title}-${deta.date}`} newsData={deta} />
        ))}
      </div>
    </div>
  );
}
