import { MdAutorenew } from "react-icons/md";

type LoadingSpinnerProps = {
  label?: string;
};

// 共通のローディング表示（components/ui/への最初の追加）。
export default function LoadingSpinner({ label = "読み込み中" }: LoadingSpinnerProps) {
  return (
    <div role="status" className="flex items-center justify-center gap-2 py-6 text-ink-muted">
      <MdAutorenew size={20} aria-hidden className="animate-spin text-primary" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
