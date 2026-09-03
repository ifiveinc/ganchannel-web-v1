import { useMemo, useState } from "react";
import {
  useLoaderData,
  useRevalidator,
  type ClientLoaderFunctionArgs,
} from "react-router";
import { MdSearchOff } from "react-icons/md";
import { NEWS_CATEGORIES } from "~/constants";
import { fetchNews } from "~/services/news/news-service";
import type { NewsData } from "~/types/news/news";
import NewsHeader from "~/components/features/news/news-header";
import NewsCategoryFilter from "~/components/features/news/news-category-filter";
import NewsList from "~/components/features/news/news-list";
import NewsSkeleton from "~/components/features/news/news-skeleton";
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

// news が null のときは「取得できていない」ことを表す（0件の [] とは区別する）
type NewsLoaderData = { news: NewsData[] | null };

export async function loader(): Promise<NewsLoaderData> {
  try {
    return { news: await fetchNews() };
  } catch {
    // 取得に失敗しても ErrorBoundary には委ねず、画面自体は表示してスケルトンで受ける
    return { news: null };
  }
}

// オフライン等でサーバ自体に到達できない場合の受け皿。
// これが無いと、画面遷移時に loader の取得が失敗した時点でニュース画面ごと表示されなくなる。
export async function clientLoader({
  serverLoader,
}: ClientLoaderFunctionArgs): Promise<NewsLoaderData> {
  try {
    return await serverLoader<typeof loader>();
  } catch {
    return { news: null };
  }
}

export default function News() {
  const { news } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();

  // "All" は全件表示用の擬似カテゴリー（~/constants）
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredNews = useMemo(() => {
    if (news === null) return [];

    return selectedCategory === "All"
      ? news
      : news.filter((item) => item.category === selectedCategory);
  }, [news, selectedCategory]);

  const isLoading = revalidator.state === "loading";

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

          {news === null ? (
            // 取得できていない状態。絞り込む対象が無いためカテゴリーも件数も出さず、
            // 何が起きて次に何をすればよいかを文章で示したうえでスケルトンを置く（規約 §20.3・§21.1）
            <>
              <div
                role="status"
                aria-live="polite"
                className="flex flex-col items-center gap-4 text-center"
              >
                <p className="text-base text-ink-muted">
                  {isLoading
                    ? "読み込み中です。"
                    : "ニュースを取得できませんでした。通信状態を確認して、もう一度お試しください。"}
                </p>
                <button
                  type="button"
                  onClick={() => revalidator.revalidate()}
                  disabled={isLoading}
                  className="inline-flex h-11 items-center rounded-full border-2 border-primary bg-surface px-6 text-base whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50"
                >
                  再読み込み
                </button>
              </div>

              <NewsSkeleton />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </main>
    </>
  );
}
