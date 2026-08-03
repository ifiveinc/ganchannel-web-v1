import type { IconType } from "react-icons";

export type DetailRow = {
  label: string;
  value: string | null;
};

type CircleDetailSectionProps = {
  title: string;
  icon: IconType;
  rows: DetailRow[];
};

// 詳細画面の情報カード。
// 未入力の行は表示せず、全ての行が空ならセクションごと描画しない
// （docs/circle-info/spec.md §3.3）。「未登録」という文字を並べない方針。
export default function CircleDetailSection({
  title,
  icon: Icon,
  rows,
}: CircleDetailSectionProps) {
  const filled = rows.filter((row) => row.value !== null && row.value !== "");
  if (filled.length === 0) return null;

  return (
    <section className="rounded-card border border-border bg-surface-card p-3">
      <h3 className="flex items-center gap-2 text-base font-bold leading-snug">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Icon size={16} aria-hidden />
        </span>
        {title}
      </h3>

      <dl className="mt-3 flex flex-col gap-2">
        {filled.map((row) => (
          <div
            key={row.label}
            className="flex flex-col gap-0.5 border-t border-border pt-2 first:border-t-0 first:pt-0"
          >
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="text-base leading-normal">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
