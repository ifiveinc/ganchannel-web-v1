import styles from "./section-heading.module.css";

type SectionHeadingProps = {
  children: React.ReactNode;
  /** 見出しの右側に置く導線（「もっと見る」など） */
  action?: React.ReactNode;
};

// 画面イメージの、左端に縦バーが付くセクション見出し。
export default function SectionHeading({
  children,
  action,
}: SectionHeadingProps) {
  return (
    <div className={styles.root}>
      <h2 className={styles.heading}>
        <span aria-hidden className={styles.bar} />
        <span className={styles.text}>{children}</span>
      </h2>
      {action}
    </div>
  );
}
