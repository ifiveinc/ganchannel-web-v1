import { useMemo, useState } from "react";
import { MdSearchOff } from "react-icons/md";
import { faqList } from "~/data/faq/faq-list";
import { buildFaqSections, countFaqItems } from "~/lib/faq/group-faq";
import FaqHeader from "~/components/features/faq/faq-header";
import FaqSearchForm from "~/components/features/faq/faq-search-form";
import FaqCategoryNav from "~/components/features/faq/faq-category-nav";
import FaqSection from "~/components/features/faq/faq-section";
import EmptyState from "~/components/ui/empty-state";
import BackToTopLink from "~/components/ui/back-to-top-link";

export function meta() {
  return [
    { title: "Q&A | がんちゃんねる" },
    {
      name: "description",
      content: "岩手大学の学生生活について、よくある質問と答えを探せます。",
    },
  ];
}

export default function Faq() {
  const [keyword, setKeyword] = useState("");

  // 掲載件数が少ないため、絞り込みはクライアント側で行う
  const sections = useMemo(() => buildFaqSections(faqList, keyword), [keyword]);
  const total = countFaqItems(sections);
  const isSearching = keyword.trim() !== "";

  return (
    <>
      <FaqHeader />

      {/* 下部固定要素（ナビ・広告バナー）に隠れないよう下余白を確保する（規約 §5.3） */}
      <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-36">
        {/* 見出しはヘッダーのタイトルが兼ねるため、視覚的には出さない */}
        <h1 className="sr-only">Q&amp;A</h1>

        <div className="flex flex-col gap-6">
          {/* 機能内で迷子にならないための脱出口（circle-info と同じ導線） */}
          <div>
            <BackToTopLink />
          </div>

          <FaqSearchForm keyword={keyword} onChange={setKeyword} />

          {/* 件数は常に置く。要素ごと出し入れすると読み上げに変化が伝わらないため、
              中身だけを差し替える（規約 §22.2・§24.1） */}
          <p aria-live="polite" className="text-sm text-ink-muted">
            {isSearching ? `${total}件` : `全${total}件`}
          </p>

          {sections.length > 0 ? (
            <>
              <FaqCategoryNav sections={sections} />

              {sections.map((section) => (
                <FaqSection key={section.id} section={section} />
              ))}
            </>
          ) : (
            // 0件でも入力したキーワードは画面に残す（規約 §22.2）
            <div className="flex flex-col items-center gap-4">
              <EmptyState
                icon={MdSearchOff}
                title="条件に一致する質問は見つかりませんでした。"
                description="別のキーワードにすると、見つかる場合があります。"
              />
              <button
                type="button"
                onClick={() => setKeyword("")}
                className="inline-flex h-11 items-center rounded-full border border-primary bg-surface px-6 text-base whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                検索条件をリセットする
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
