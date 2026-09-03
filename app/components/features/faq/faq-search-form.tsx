import { MdSearch, MdClose } from "react-icons/md";
import styles from "./faq-search-form.module.css";

type FaqSearchFormProps = {
  keyword: string;
  onChange: (keyword: string) => void;
};

// 質問の絞り込み。circle-info の検索フォームに合わせ、パネル＋ピル型の入力欄で組む。
// ラベルは placeholder で代用せず必ず付ける（デザイン規約 §15.2）。
export default function FaqSearchForm({
  keyword,
  onChange,
}: FaqSearchFormProps) {
  return (
    <div className={styles.panel}>
      <label htmlFor="faq-keyword" className={styles.label}>
        <span aria-hidden className={styles.labelBar} />
        キーワードで検索
      </label>

      <div className={styles.field}>
        <input
          id="faq-keyword"
          type="search"
          value={keyword}
          onChange={(event) => onChange(event.target.value)}
          placeholder="例：履修"
          className={styles.input}
        />

        {/* 入力があるときは、同じ位置を消去ボタンに入れ替える */}
        {keyword === "" ? (
          <MdSearch size={20} aria-hidden className={styles.searchIcon} />
        ) : (
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="キーワードを消す"
            className={styles.clearButton}
          >
            <MdClose size={20} aria-hidden />
          </button>
        )}
      </div>
    </div>
  );
}
