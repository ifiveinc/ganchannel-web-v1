import { Link, useLoaderData } from "react-router";
import { MdSearch } from "react-icons/md";
import { fetchRecommendedCircles } from "~/services/circle-info/circle-service";
import BackToTopLink from "~/components/ui/back-to-top-link";
import SectionHeading from "~/components/features/circle-info/section-heading";
import CircleCardGrid from "~/components/features/circle-info/circle-card-grid";
import { RECOMMENDED_CIRCLE_LIMIT } from "~/constants";

export function meta() {
  return [
    { title: "サークル情報 | がんちゃんねる" },
    {
      name: "description",
      content: "岩手大学のサークル・部活・学内カンパニーの情報をまとめて探せます。",
    },
  ];
}

export async function loader() {
  const recommended = await fetchRecommendedCircles(RECOMMENDED_CIRCLE_LIMIT);
  return { recommended };
}

export default function CircleInfoIndex() {
  const { recommended } = useLoaderData<typeof loader>();

  return (
    <div className="flex flex-col gap-8 pt-4 pb-20 md:pb-8">
      {/* 画面イメージ上はヘッダーのタイトルが見出しを兼ねるため、視覚的には出さない */}
      <h1 className="sr-only">サークル情報</h1>

      <div>
        <BackToTopLink />
      </div>

      {/* 機能・ページ紹介。画面イメージはカルーセルだが、MVPでは1枚固定
          （docs/circle-info/spec.md §3.1） */}
      <section className="rounded-card bg-primary-subtle p-4">
        <h2 className="text-xl font-bold leading-snug text-primary">
          機能・ページ紹介
        </h2>
        <p className="mt-2 text-base leading-relaxed text-ink">
          サークルを探したり、気になるサークルを保存したり、大学生活をもっと楽しもう！
        </p>
      </section>

      <Link
        to="/circle-info/search"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-primary bg-surface px-6 text-base font-bold whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        サークルを探す
        <MdSearch size={20} aria-hidden />
      </Link>

      <section className="flex flex-col gap-3">
        <SectionHeading>おすすめのサークル</SectionHeading>

        {recommended.length > 0 ? (
          <CircleCardGrid circles={recommended} />
        ) : (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-base text-ink">まだ登録されていません。</p>
            <p className="text-sm text-ink-muted">
              サークルの掲載を準備しています。
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
