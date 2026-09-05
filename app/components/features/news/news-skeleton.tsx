import styles from "./news-skeleton.module.css";

type NewsSkeletonProps = {
  /** 並べる枠の数。画面の高さがひととおり埋まる程度に留める */
  count?: number;
};

// ニュースを取得できていない間の代替表示（デザイン規約 §20.3）。
// news-card と同じ寸法・同じ段組みの枠を並べ、取得の前後でレイアウトが動かないようにする。
// アニメーションは付けない（§20.1）。状態は呼び出し側の文言で伝えるため、ここは読み上げから隠す。
export default function NewsSkeleton({ count = 4 }: NewsSkeletonProps) {
  return (
    <ul aria-hidden className={styles.list}>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className={styles.card}>
          <div className={styles.thumbnail} />

          <div className={styles.titleArea}>
            <span className={styles.line} />
            <span className={`${styles.line} ${styles.lineShort}`} />
          </div>

          <div className={styles.meta}>
            <span className={styles.date} />
            <span className={styles.category} />
          </div>
        </li>
      ))}
    </ul>
  );
}
