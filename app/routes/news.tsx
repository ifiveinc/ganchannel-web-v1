import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { MdSearchOff } from "react-icons/md";
import { NEWS_CATEGORIES } from "~/constants";
import { fetchNews } from "~/services/news/news-service";
import NewsHeader from "~/components/features/news/news-header";
import NewsCategoryFilter from "~/components/features/news/news-category-filter";
import NewsList from "~/components/features/news/news-list";
import EmptyState from "~/components/ui/empty-state";
import BackToTopLink from "~/components/ui/back-to-top-link";

export function meta() {
  return [
    { title: "ニュース | がんちゃんねる" },
    {
      name: "description",
      content:
        "岩手大学のニュース・イベント・入試情報をカテゴリー別にまとめて読めます。",
    },
  ];
}

export async function loader() {
  // 取得に失敗した場合は fetchNews が例外を投げ、root.tsx の ErrorBoundary に委ねる
  const news = await fetchNews();
  return { news };
}

export default function News() {
  const { news } = useLoaderData<typeof loader>();

  // "All" は全件表示用の擬似カテゴリー（~/constants）
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredNews = useMemo(
    () =>
      selectedCategory === "All"
        ? news
        : news.filter((item) => item.category === selectedCategory),
    [news, selectedCategory]
  );

  return (
    <>
      <NewsHeader />

      {/* 下部固定要素（ナビ・広告バナー）に隠れないよう下余白を確保する（規約 §5.3） */}
      <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-36 md:pb-24">
        {/* 見出しはヘッダーのタイトルが兼ねるため、視覚的には出さない */}
        <h1 className="sr-only">ニュース</h1>

        <div className="flex flex-col gap-6">
          {/* 機能内で迷子にならないための脱出口（circle-info・Q&A と同じ導線） */}
          <div>
            <BackToTopLink />
          </div>

          <NewsCategoryFilter
            categories={NEWS_CATEGORIES}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />

          {/* 件数は常に置く。要素ごと出し入れすると読み上げに変化が伝わらない（規約 §22.2・§24.1） */}
          <p aria-live="polite" className="text-sm text-ink-muted">
            {selectedCategory === "All"
              ? `全${filteredNews.length}件`
              : `${filteredNews.length}件`}
          </p>

          {filteredNews.length > 0 ? (
            <NewsList newsList={filteredNews} />
          ) : (
            // 0件でも適用中の絞り込みは画面に残す（規約 §22.2）
            <div className="flex flex-col items-center gap-4">
              <EmptyState
                icon={MdSearchOff}
                title="条件に一致するニュースは見つかりませんでした。"
                description="別のカテゴリーにすると、見つかる場合があります。"
              />
              <button
                type="button"
                onClick={() => setSelectedCategory("All")}
                className="inline-flex h-11 items-center rounded-full border-2 border-primary bg-surface px-6 text-base whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                絞り込みを解除する
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
