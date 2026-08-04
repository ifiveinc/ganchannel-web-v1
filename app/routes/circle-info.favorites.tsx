import { Link, useLoaderData } from "react-router";
import { fetchCircles } from "~/services/circle-info/circle-service";
import { useFavorites } from "~/hooks/use-favorites";
import CircleCardGrid from "~/components/features/circle-info/circle-card-grid";

export function meta() {
  return [
    { title: "気になる | がんちゃんねる" },
    { name: "description", content: "気になるサークルを保存して見返せます。" },
  ];
}

export async function loader() {
  const circles = await fetchCircles();
  return { circles };
}

export default function CircleInfoFavorites() {
  const { circles } = useLoaderData<typeof loader>();
  const { favoriteIds, isLoaded } = useFavorites();

  // 掲載を取り下げた団体のIDが残っていても無視する（docs/circle-info/spec.md §4）
  const favorites = circles.filter((circle) => favoriteIds.includes(circle.id));

  return (
    <div className="flex flex-col gap-3 pt-4">
      <h1 className="text-2xl font-bold leading-snug">気になる</h1>

      {/* localStorage の読み込みは初回描画のあとなので、確定するまで件数を出さない */}
      {!isLoaded ? null : favorites.length > 0 ? (
        <>
          <p className="text-sm text-ink-muted">{favorites.length}件</p>
          <CircleCardGrid circles={favorites} />
        </>
      ) : (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <p className="text-base text-ink">まだ登録されていません。</p>
          <p className="text-sm text-ink-muted">
            気になるサークルのハートを押すと、ここに保存されます。
          </p>
          <Link
            to="/circle-info/search"
            className="inline-flex h-11 items-center rounded-control border border-primary bg-surface px-4 text-base whitespace-nowrap text-primary hover:bg-primary-subtle focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            サークルを探す
          </Link>
        </div>
      )}
    </div>
  );
}
