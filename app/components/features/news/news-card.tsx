import { MdOpenInNew } from "react-icons/md";
import type { NewsData } from "~/types/news/news";
import { formatNewsDate } from "~/lib/news/format-news-date";
import styles from "./news-card.module.css";

type NewsCardProps = {
  news: NewsData;
};

// ニュース1件のカード。リンク先は大学の公式サイト（外部）なので、
// カード全体をリンクにしたうえで外部リンクであることをアイコンで示す（デザイン規約 §16.1・§19.6）。
export default function NewsCard({ news }: NewsCardProps) {
  const hasImage = news.image !== "none" && news.image !== "";
  const date = formatNewsDate(news.date);

  return (
    <a
      href={news.link}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.card}
    >
      {/* 画像は枠いっぱいに置き、高さを固定して見切れさせる（object-fit: cover）。
          画像が無い場合も同じ高さの枠を保ち、その旨を文字で示す */}
      <div className={styles.thumbnail}>
        {hasImage ? (
          <img
            src={news.image}
            alt=""
            loading="lazy"
            className={styles.image}
          />
        ) : (
          <p className={styles.noImage}>no image</p>
        )}
      </div>

      <div className={styles.titleArea}>
        <p className={styles.title}>{news.title}</p>
      </div>

      <div className={styles.meta}>
        {/* 日付が欠けていても行の高さが変わらないよう、要素自体は常に置く */}
        <span className={styles.dateArea}>
          {date && (
            <time dateTime={date.iso} className={styles.date}>
              {date.label}
            </time>
          )}
          <MdOpenInNew size={16} aria-hidden className={styles.externalIcon} />
        </span>

        <span className={styles.category}>{news.category}</span>
      </div>
    </a>
  );
}
