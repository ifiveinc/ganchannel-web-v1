import type { FaqSection } from "~/lib/faq/group-faq";
import styles from "./faq-category-nav.module.css";

type FaqCategoryNavProps = {
  sections: FaqSection[];
};

// カテゴリーへのページ内ジャンプ。階層は作らず、1段の並びに保つ（デザイン規約 §19.6）。
export default function FaqCategoryNav({ sections }: FaqCategoryNavProps) {
  return (
    <nav aria-label="カテゴリー">
      <ul className={styles.list}>
        {sections.map((section) => (
          <li key={section.id}>
            <a href={`#${section.id}`} className={styles.link}>
              {section.name}
              <span className={styles.count}>{section.items.length}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
