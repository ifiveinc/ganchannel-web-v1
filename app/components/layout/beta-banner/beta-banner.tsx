import { MdInfoOutline } from "react-icons/md";

// βバナー・非公式表記。root.tsxにAdと同様に常時マウントする（docs/chatbot/spec.md §1-8）。
// 常時表示のため閉じるボタンは付けない（docs/decisions/0004-chatbot-architecture.md §12）。
export default function BetaBanner() {
  return (
    <div className="flex items-center gap-2 bg-primary-subtle px-4 py-2 text-sm text-primary">
      <MdInfoOutline size={16} aria-hidden className="shrink-0" />
      <p>
        がんちゃんねるは学生団体iFiveが運営する非公式サービスです。学内QAチャットボットはβ版として提供しています。
      </p>
    </div>
  );
}
