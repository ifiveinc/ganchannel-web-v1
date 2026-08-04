import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useFavorites } from "~/hooks/use-favorites";
import styles from "./favorite-button.module.css";

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
      className={`${styles.button} ${className}`}
    >
      {active ? (
        <MdFavorite size={20} aria-hidden className={styles.activeIcon} />
      ) : (
        <MdFavoriteBorder size={20} aria-hidden />
      )}
    </button>
  );
}
