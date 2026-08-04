import type { IconType } from "react-icons";
import styles from "./circle-detail-section.module.css";

export type DetailRow = {
  label: string;
  value: string | null;
};

type CircleDetailSectionProps = {
  title: string;
  icon: IconType;
  rows: DetailRow[];
};

// 詳細画面の情報カード。
// 未入力の行は表示せず、全ての行が空ならセクションごと描画しない
// （docs/circle-info/spec.md §3.3）。「未登録」という文字を並べない方針。
export default function CircleDetailSection({
  title,
  icon: Icon,
  rows,
}: CircleDetailSectionProps) {
  const filled = rows.filter((row) => row.value !== null && row.value !== "");
  if (filled.length === 0) return null;

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>
        <span className={styles.titleIcon}>
          <Icon size={16} aria-hidden />
        </span>
        {title}
      </h3>

      <dl className={styles.rows}>
        {filled.map((row) => (
          <div key={row.label} className={styles.row}>
            <dt className={styles.label}>{row.label}</dt>
            <dd className={styles.value}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
