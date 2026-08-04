import { Link } from "react-router";
import iFiveIcon from "~/assets/ifive-icon.png";
import type { Circle } from "~/types/circle";
import CircleBadge from "./circle-badge";
import FavoriteButton from "./favorite-button";
import styles from "./circle-card.module.css";

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
    <div className={styles.card}>
      <div className={styles.thumbnail}>
        <img
          src={hasImage ? circle.images[0] : iFiveIcon}
          alt=""
          loading="lazy"
          className={`${styles.image} ${hasImage ? styles.imageCover : styles.imagePlaceholder}`}
        />
      </div>

      <Link to={`/circle-info/${circle.id}`} className={styles.name}>
        {circle.name}
      </Link>

      <p className={styles.summary}>{circle.summary}</p>

      {/* 要素の有無にかかわらず下端を揃える（規約 §16.2） */}
      <div className={styles.footer}>
        <span className={styles.badgeArea}>
          {genre && <CircleBadge>{genre}</CircleBadge>}
        </span>
        <FavoriteButton
          circleId={circle.id}
          circleName={circle.name}
          className={styles.favorite}
        />
      </div>
    </div>
  );
}
