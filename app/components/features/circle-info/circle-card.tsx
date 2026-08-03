import { Link } from "react-router";
import iFiveIcon from "~/assets/ifive-icon.png";
import type { Circle } from "~/types/circle";
import CircleBadge from "./circle-badge";
import FavoriteButton from "./favorite-button";

type CircleCardProps = {
  circle: Circle;
};

// 一覧カード。2列グリッドに並べる前提（デザイン規約 §6.3・§16）。
//
// 規約 §16.1 は「カードのルート要素を <Link> にする」としているが、
// 画面イメージのとおりカード内にお気に入りボタンを置くため、リンクの入れ子
// （HTML上不正）を避けて、ルートは <div>、リンクは疑似要素でカード全体に広げる。
export default function CircleCard({ circle }: CircleCardProps) {
  const hasImage = circle.images.length > 0;
  const genre = circle.genres[0];

  return (
    <div className="relative flex h-full flex-col gap-2 rounded-card border border-border bg-surface-card p-3 transition-colors hover:border-primary">
      <div className="aspect-video w-full overflow-hidden rounded-control bg-surface">
        <img
          src={hasImage ? circle.images[0] : iFiveIcon}
          alt=""
          loading="lazy"
          className={`h-full w-full ${hasImage ? "object-cover" : "object-contain p-2"}`}
        />
      </div>

      <Link
        to={`/circle-info/${circle.id}`}
        className="line-clamp-2 text-base font-bold leading-snug text-ink after:absolute after:inset-0 after:rounded-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        {circle.name}
      </Link>

      <p className="line-clamp-2 text-sm leading-normal text-ink-muted">
        {circle.summary}
      </p>

      {/* 要素の有無にかかわらず下端を揃える（規約 §16.2） */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-1">
        <span className="min-w-0">
          {genre && <CircleBadge>{genre}</CircleBadge>}
        </span>
        <FavoriteButton
          circleId={circle.id}
          circleName={circle.name}
          className="relative z-10"
        />
      </div>
    </div>
  );
}
