import { MdExpandMore, MdOpenInNew } from "react-icons/md";
import type { FaqItem as FaqItemData } from "~/data/faq/faq-list";
import styles from "./faq-item.module.css";

type FaqItemProps = {
  item: FaqItemData;
};

// 1件の質問と回答。開閉はブラウザ標準の details/summary に任せ、
// キーボード操作とスクリーンリーダーの読み上げを自前で組まない。
export default function FaqItem({ item }: FaqItemProps) {
  return (
    <details className={styles.item}>
      <summary className={styles.question}>
        <span className={styles.questionText}>{item.question}</span>
        <MdExpandMore size={20} aria-hidden className={styles.icon} />
      </summary>

      <div className={styles.answer}>
        {item.answerText.map((text) => (
          <p key={text} className={styles.paragraph}>
            {text}
          </p>
        ))}

        {item.linkUrl && (
          // 外部リンクであることをアイコンでも示す（デザイン規約 §19.6）
          <a
            href={item.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            <MdOpenInNew size={16} aria-hidden className={styles.linkIcon} />
            <span className={styles.linkText}>{item.linkUrl}</span>
          </a>
        )}
      </div>
    </details>
  );
}
