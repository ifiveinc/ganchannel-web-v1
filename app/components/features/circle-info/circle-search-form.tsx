import { MdSearch, MdExpandMore, MdCheck, MdClose } from "react-icons/md";
import { CIRCLE_GENRES } from "~/constants";
import type { Genre } from "~/types/circle-info/circle";
import type { CircleFilter } from "~/lib/circle-info/filter-circles";
import styles from "./circle-search-form.module.css";

type CircleSearchFormProps = {
  filter: CircleFilter;
  onChange: (filter: CircleFilter) => void;
  /** 「タグで探す」の選択肢。掲載データから動的に生成する */
  tagOptions: string[];
};

// 検索条件のパネル。ラベルは placeholder で代用せず必ず付ける（デザイン規約 §15.2）。
export default function CircleSearchForm({
  filter,
  onChange,
  tagOptions,
}: CircleSearchFormProps) {
  function toggleTag(tag: string) {
    const tags = filter.tags.includes(tag)
      ? filter.tags.filter((selected) => selected !== tag)
      : [...filter.tags, tag];
    onChange({ ...filter, tags });
  }

  return (
    <div className={styles.root}>
      <SearchPanel htmlFor="circle-keyword" label="キーワードで探す">
        <div className={styles.field}>
          <input
            id="circle-keyword"
            type="search"
            value={filter.keyword}
            onChange={(event) =>
              onChange({ ...filter, keyword: event.target.value })
            }
            placeholder="例：軽音楽"
            className={styles.input}
          />
          <MdSearch size={20} aria-hidden className={styles.fieldIcon} />
        </div>
      </SearchPanel>

      <SearchPanel htmlFor="circle-genre" label="ジャンルで探す">
        <SelectField
          id="circle-genre"
          value={filter.genre}
          onChange={(value) => onChange({ ...filter, genre: value as Genre | "" })}
          placeholder="ジャンルを選択してください"
          options={[...CIRCLE_GENRES]}
        />
      </SearchPanel>

      {/* タグは複数選択。選んだタグをすべて持つ団体に絞り込まれる */}
      <SearchPanel labelId="circle-tag-label" label="タグで探す">
        <p className={styles.tagHint}>
          複数選ぶとタグをすべて持つ団体に絞り込まれます。
          （横にスクロールできます）
        </p>

        <ul className={styles.tagList}>
          {tagOptions.map((tag) => {
            const isSelected = filter.tags.includes(tag);
            return (
              <li key={tag} className={styles.tagItem}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag)}
                  className={`${styles.tagButton} ${
                    isSelected
                      ? styles.tagButtonSelected
                      : styles.tagButtonDefault
                  }`}
                >
                  {/* 選択状態を色だけで示さない（デザイン規約 §3.2） */}
                  {isSelected && <MdCheck size={16} aria-hidden />}
                  {tag}
                </button>
              </li>
            );
          })}
        </ul>

        {/* 選択中のタグ。上の一覧は横スクロールで隠れることがあるため、
            いま何で絞り込んでいるかをここで一覧できるようにする */}
        {filter.tags.length > 0 && (
          <div className={styles.selected}>
            <span className={styles.selectedCount}>
              選択中（{filter.tags.length}件）
            </span>

            {filter.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-label={`「${tag}」の選択を解除`}
                className={styles.selectedChip}
              >
                {tag}
                <MdClose size={14} aria-hidden />
              </button>
            ))}

            <button
              type="button"
              onClick={() => onChange({ ...filter, tags: [] })}
              className={styles.clearButton}
            >
              すべて解除
            </button>
          </div>
        )}
      </SearchPanel>
    </div>
  );
}

type SearchPanelProps = {
  label: string;
  /** 単一の入力要素に対応する場合に指定する */
  htmlFor?: string;
  /** 入力要素が複数ある場合に、グループの見出しとして紐づけるid */
  labelId?: string;
  children: React.ReactNode;
};

function SearchPanel({
  htmlFor,
  labelId,
  label,
  children,
}: SearchPanelProps) {
  const heading = (
    <>
      <span aria-hidden className={styles.panelBar} />
      {label}
    </>
  );

  // タグのように選択肢が複数ある場合は、label ではなくグループとして読み上げさせる
  if (htmlFor === undefined) {
    return (
      <div role="group" aria-labelledby={labelId} className={styles.panel}>
        <p id={labelId} className={styles.panelLabel}>
          {heading}
        </p>
        <div className={styles.panelBody}>{children}</div>
      </div>
    );
  }

  return (
    <div className={styles.panel}>
      <label htmlFor={htmlFor} className={styles.panelLabel}>
        {heading}
      </label>
      <div className={styles.panelBody}>{children}</div>
    </div>
  );
}

type SelectFieldProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  options: string[];
};

function SelectField({
  id,
  value,
  onChange,
  placeholder,
  options,
}: SelectFieldProps) {
  return (
    <div className={styles.field}>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.select}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <MdExpandMore size={20} aria-hidden className={styles.fieldIcon} />
    </div>
  );
}
