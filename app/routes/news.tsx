import { useState } from "react";
import { useLoaderData } from "react-router";
import { NEWS_CATEGORIES } from "~/constants";
import { fetchNews } from "~/services/news-service";
import type { NewsData } from "~/types/news";
import NewsCard from "~/components/features/news/news-card";


export async function loader() {
  const data = await fetchNews();
  return { data }; // オブジェクト形式で返すと扱いやすいです
}


export default function News() {
  // newsデータの取得に使う部分。一旦コメントアウト(サーバー直るまで)
  const { data } = useLoaderData();
  console.log(data)
  

  // ダミーデータを使う場合は demoNews（~/data/demo-news）に差し替える
  const newsDeta: NewsData[] = data; // サーバのデータを使用する場合

  //絞り込み機能に必要なstateを定義
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  //絞り込むカテゴリーは constants に集約（スタイルの都合上"キャリア・地域協創教育"は一旦除外）
  const categories = NEWS_CATEGORIES;

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
