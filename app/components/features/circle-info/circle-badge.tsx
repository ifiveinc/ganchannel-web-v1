import styles from "./circle-badge.module.css";

type CircleBadgeProps = {
  children: React.ReactNode;
  /** tag: 分類・属性、strong: 状態の強調（デザイン規約 §17.1） */
  variant?: "tag" | "strong";
};

// 分類・状態を示すバッジ。色で分類を表現せず、文字で示す（規約 §17.2）。
export default function CircleBadge({
  children,
  variant = "tag",
}: CircleBadgeProps) {
  return (
    <span
      className={`${styles.badge} ${variant === "strong" ? styles.strong : styles.tag}`}
    >
      {children}
    </span>
  );
}
