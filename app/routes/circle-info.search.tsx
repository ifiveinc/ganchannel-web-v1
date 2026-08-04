import { useMemo, useState } from "react";
import { useLoaderData } from "react-router";
import { fetchCircles } from "~/services/circle-info/circle-service";
import CircleSearchForm from "~/components/features/circle-info/circle-search-form";
import CircleCardGrid from "~/components/features/circle-info/circle-card-grid";
import SectionHeading from "~/components/features/circle-info/section-heading";
import { RECOMMENDED_CIRCLE_LIMIT } from "~/constants";
import {
  EMPTY_CIRCLE_FILTER,
  collectTags,
  filterCircles,
  isFilterEmpty,
} from "~/lib/circle-info/filter-circles";

export function meta() {
  return [
    { title: "サークルを探す | がんちゃんねる" },
    {
      name: "description",
      content: "キーワード・ジャンル・タグから岩手大学のサークルを探せます。",
    },
  ];
}

export async function loader() {
  // 掲載数が少ないため全件を渡し、絞り込みはクライアント側で行う（spec.md §3.2）
  const circles = await fetchCircles();
  return { circles };
}

export default function CircleInfoSearch() {
  const { circles } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState(EMPTY_CIRCLE_FILTER);

  const tagOptions = useMemo(() => collectTags(circles), [circles]);
  const results = useMemo(
    () => filterCircles(circles, filter),
    [circles, filter]
  );

  const noConditions = isFilterEmpty(filter);
  const recommended = useMemo(
    () =>
      circles
        .filter((circle) => circle.isRecommended)
        .slice(0, RECOMMENDED_CIRCLE_LIMIT),
    [circles]
  );

  return (
    <div className="flex flex-col gap-8 pt-4">
      <h1 className="sr-only">サークルを探す</h1>

      <CircleSearchForm
        filter={filter}
        onChange={setFilter}
        tagOptions={tagOptions}
      />

      {noConditions ? (
        // 条件が未指定のうちは、おすすめを出しておく（spec.md §3.2）
        <section className="flex flex-col gap-3">
          <SectionHeading>おすすめのサークル</SectionHeading>
          <CircleCardGrid circles={recommended} />
        </section>
      ) : (
        <section className="flex flex-col gap-3" aria-live="polite">
          <SectionHeading>検索結果</SectionHeading>
          <p className="text-sm text-ink-muted">{results.length}件</p>

          {results.length > 0 ? (
            <CircleCardGrid circles={results} />
          ) : (
            // 0件でも条件は画面に残す（規約 §22.2）
            <div className="flex flex-col items-center gap-4 py-12 text-center">
              <p className="text-base text-ink">
                条件に一致する情報は見つかりませんでした。
              </p>
              <p className="text-sm text-ink-muted">
                条件を変えると、見つかる場合があります。
              </p>
              <button
                type="button"
                onClick={() => setFilter(EMPTY_CIRCLE_FILTER)}
                className="inline-flex h-11 items-center rounded-control border border-primary bg-surface px-4 text-base whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                検索条件をリセットする
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
