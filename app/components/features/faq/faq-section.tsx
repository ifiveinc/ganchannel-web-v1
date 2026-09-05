import type { FaqSection as FaqSectionData } from "~/lib/faq/group-faq";
import FaqItem from "./faq-item";
import styles from "./faq-section.module.css";

type FaqSectionProps = {
  section: FaqSectionData;
};

// カテゴリー1つぶんの質問の並び。
export default function FaqSection({ section }: FaqSectionProps) {
  return (
    // ページ内ジャンプの着地点。sticky ヘッダーに見出しが隠れないよう余白を取る
    <section id={section.id} className={styles.section}>
      <h2 className={styles.heading}>
        <span aria-hidden className={styles.headingBar} />
        <span className={styles.headingText}>{section.name}</span>
      </h2>

      <ul className={styles.list}>
        {section.items.map((item) => (
          <li key={item.question}>
            <FaqItem item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}
