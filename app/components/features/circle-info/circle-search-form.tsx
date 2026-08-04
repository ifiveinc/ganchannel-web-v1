import { MdSearch, MdExpandMore, MdCheck, MdClose } from "react-icons/md";
import { CIRCLE_GENRES } from "~/constants";
import type { Genre } from "~/types/circle";
import type { CircleFilter } from "~/lib/filter-circles";

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
    <div className="flex flex-col gap-3">
      <SearchPanel htmlFor="circle-keyword" label="キーワードで探す">
        <div className="relative">
          <input
            id="circle-keyword"
            type="search"
            value={filter.keyword}
            onChange={(event) =>
              onChange({ ...filter, keyword: event.target.value })
            }
            placeholder="例：軽音楽"
            className="h-12 w-full rounded-full border border-border-strong bg-surface pr-12 pl-4 text-base focus-visible:ring-2 focus-visible:ring-primary"
          />
          <MdSearch
            size={20}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-primary"
          />
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
        <p className="text-sm text-ink-muted">
          複数選ぶとタグをすべて持つ団体に絞り込まれます。
          （横にスクロールできます）
        </p>

        {/* タグが増えても縦に伸びないよう、折り返さず横1列にして溢れた分をスクロールさせる。
            はみ出しはこの中だけで起き、ページ全体は横スクロールしない */}
        <ul className="-mx-3 mt-2 flex gap-2 overflow-x-auto px-3 pb-1">
          {tagOptions.map((tag) => {
            const isSelected = filter.tags.includes(tag);
            return (
              <li key={tag} className="shrink-0">
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleTag(tag)}
                  className={`inline-flex min-h-11 items-center gap-1 rounded-full border px-3 text-sm whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    isSelected
                      ? "border-primary bg-primary font-bold text-white"
                      : "border-border-strong bg-surface text-ink hover:border-primary"
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
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-ink-muted">
              選択中（{filter.tags.length}件）
            </span>

            {filter.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                aria-label={`「${tag}」の選択を解除`}
                className="inline-flex items-center gap-0.5 rounded-full border border-primary bg-primary-subtle py-1 pr-1.5 pl-2 text-xs text-primary hover:bg-surface focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {tag}
                <MdClose size={14} aria-hidden />
              </button>
            ))}

            <button
              type="button"
              onClick={() => onChange({ ...filter, tags: [] })}
              className="ml-1 text-xs text-primary underline"
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
      <span aria-hidden className="h-4 w-1 shrink-0 rounded-full bg-primary" />
      {label}
    </>
  );
  const headingClassName =
    "flex items-center gap-2 text-base font-bold text-ink";

  // タグのように選択肢が複数ある場合は、label ではなくグループとして読み上げさせる
  if (htmlFor === undefined) {
    return (
      <div
        role="group"
        aria-labelledby={labelId}
        className="rounded-card bg-surface-card p-3"
      >
        <p id={labelId} className={headingClassName}>
          {heading}
        </p>
        <div className="mt-2">{children}</div>
      </div>
    );
  }

  return (
    <div className="rounded-card bg-surface-card p-3">
      <label htmlFor={htmlFor} className={headingClassName}>
        {heading}
      </label>
      <div className="mt-2">{children}</div>
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
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full appearance-none rounded-full border border-border-strong bg-surface pr-12 pl-4 text-base focus-visible:ring-2 focus-visible:ring-primary"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <MdExpandMore
        size={20}
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-4 -translate-y-1/2 text-primary"
      />
    </div>
  );
}
