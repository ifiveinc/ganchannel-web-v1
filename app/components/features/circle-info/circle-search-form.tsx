import { MdSearch, MdExpandMore } from "react-icons/md";
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

      <SearchPanel htmlFor="circle-tag" label="タグで探す">
        <SelectField
          id="circle-tag"
          value={filter.tag}
          onChange={(value) => onChange({ ...filter, tag: value })}
          placeholder="タグを選択してください"
          options={tagOptions}
        />
      </SearchPanel>
    </div>
  );
}

type SearchPanelProps = {
  htmlFor: string;
  label: string;
  children: React.ReactNode;
};

function SearchPanel({ htmlFor, label, children }: SearchPanelProps) {
  return (
    <div className="rounded-card bg-surface-card p-3">
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-base font-bold text-ink"
      >
        <span aria-hidden className="h-4 w-1 shrink-0 rounded-full bg-primary" />
        {label}
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
