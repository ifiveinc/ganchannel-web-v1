type SectionHeadingProps = {
  children: React.ReactNode;
  /** 見出しの右側に置く導線（「もっと見る」など） */
  action?: React.ReactNode;
};

// 画面イメージの、左端に縦バーが付くセクション見出し。
export default function SectionHeading({
  children,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h2 className="flex min-w-0 items-center gap-2 text-xl font-bold leading-snug">
        <span aria-hidden className="h-5 w-1 shrink-0 rounded-full bg-primary" />
        <span className="truncate">{children}</span>
      </h2>
      {action}
    </div>
  );
}
