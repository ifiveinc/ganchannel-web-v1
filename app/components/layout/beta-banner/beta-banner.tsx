import { useState } from "react";
import { MdClose, MdInfoOutline } from "react-icons/md";

// βバナー・非公式表記。root.tsxにAdと同様に常時マウントする（docs/chatbot-spec.md §1-8）。
// 閉じた状態はReactのstateのみで保持し、localStorage/sessionStorageには保存しない
// （docs/chatbot-spec.md §14「localStorage/sessionStorageは使わない」）。そのため
// ページを再読み込みすれば毎回また表示される＝新規訪問時は必ず一度は目に入る。
export default function BetaBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="flex items-center gap-2 bg-primary-subtle px-4 py-2 text-sm text-primary">
      <button
        type="button"
        aria-label="このお知らせを閉じる"
        onClick={() => setIsVisible(false)}
        className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-white text-ink-muted shadow-card hover:bg-surface-card"
      >
        <MdClose size={14} aria-hidden />
      </button>
      <MdInfoOutline size={16} aria-hidden className="shrink-0" />
      <p>
        がんちゃんねるは学生団体iFiveが運営する非公式サービスです。学内QAチャットボットはβ版として提供しています。
      </p>
    </div>
  );
}
