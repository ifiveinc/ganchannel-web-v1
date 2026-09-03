import styles from "./news-category-filter.module.css";

type NewsCategoryFilterProps = {
  categories: readonly string[];
  selected: string;
  onSelect: (category: string) => void;
};

// "All" は全件表示用の擬似カテゴリー。画面上は日本語で示す（デザイン規約 §23.1）
function toLabel(category: string): string {
  return category === "All" ? "すべて" : category;
}

// カテゴリーの絞り込み。項目が5つを超えるためタブ（規約 §19.4・4つまで）にはせず、
// 横スクロールもしない、幅を等分した1列のボタン列にする。
// スクロールしても操作できるよう、ヘッダー直下に固定する。
export default function NewsCategoryFilter({
  categories,
  selected,
  onSelect,
}: NewsCategoryFilterProps) {
  return (
    <nav aria-label="カテゴリーの絞り込み" className={styles.nav}>
      <ul className={styles.list}>
        {categories.map((category) => {
          const isSelected = category === selected;

          return (
            <li key={category} className={styles.item}>
              <button
                type="button"
                onClick={() => onSelect(category)}
                // 選択状態は色だけでなく、支援技術にも伝わる形で示す（規約 §24.1）
                aria-pressed={isSelected}
                className={`${styles.button} ${isSelected ? styles.selected : ""}`}
              >
                <span className={styles.label}>{toLabel(category)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
