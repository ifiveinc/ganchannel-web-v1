import type { IconType } from "react-icons";

type EmptyStateProps = {
  icon: IconType;
  title: string;
  description?: string;
};

// 共通の空状態表示（components/ui/への最初の追加）。
export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-2 px-4 py-10 text-center">
      <Icon size={24} aria-hidden className="text-ink-muted" />
      <p className="text-base font-bold text-ink">{title}</p>
      {description && <p className="text-sm text-ink-muted">{description}</p>}
    </div>
  );
}
