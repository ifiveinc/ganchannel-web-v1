import { Link } from "react-router";
import iFiveIcon from "~/assets/ifive-icon.png";
import ChatWindow from "~/components/features/chat/chat-window";
import ChatbotInfoDialog from "~/components/features/chat/chatbot-info-dialog";

export function meta() {
  return [
    { title: "学内QAチャットボット | がんちゃんねる" },
    {
      name: "description",
      content: "岩手大学の学内QAチャットボット。サークルやキャンパス生活の疑問に答えます。",
    },
  ];
}

// /chat 専用レイアウト。共通ヘッダー・共通ボトムナビは出さない
// （circle-info.tsxと同じパターン、docs/chatbot-spec.md §1-1）。
export default function Chat() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-2 px-4">
          <Link
            to="/"
            aria-label="がんちゃんねるのTOPへ戻る"
            className="flex shrink-0 items-center rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <img src={iFiveIcon} alt="" className="h-8 w-auto" />
          </Link>

          <h1 className="min-w-0 flex-1 truncate text-center text-base font-bold text-primary">
            学内QAチャットボット
          </h1>

          <ChatbotInfoDialog />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col">
        <ChatWindow />
      </div>
    </div>
  );
}
