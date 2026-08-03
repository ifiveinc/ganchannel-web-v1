import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useFavorites } from "~/hooks/use-favorites";

type FavoriteButtonProps = {
  circleId: string;
  circleName: string;
  /** カードの上に重ねる場合など、位置指定を外から渡す */
  className?: string;
};

// 「気になる」のトグル。localStorage に保存するためログイン不要。
export default function FavoriteButton({
  circleId,
  circleName,
  className = "",
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(circleId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(circleId)}
      aria-pressed={active}
      aria-label={
        active
          ? `${circleName}を気になるから外す`
          : `${circleName}を気になるに追加`
      }
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-ink-muted hover:bg-surface-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${className}`}
    >
      {active ? (
        <MdFavorite size={20} aria-hidden className="text-primary" />
      ) : (
        <MdFavoriteBorder size={20} aria-hidden />
      )}
    </button>
  );
}
