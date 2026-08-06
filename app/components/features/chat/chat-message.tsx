import ganChanIcon from "~/assets/gan-chan.png";
import FeedbackButtons from "~/components/features/chat/feedback-buttons";
import CircleRecommendCard from "~/components/features/chat/circle-recommend-card";
import type { RecommendCard } from "~/types/chatbot/circle-registry";

export interface ChatMessageData {
  id: string;
  role: "user" | "bot";
  text: string;
  sourceUrls?: string[];
  recommendCards?: RecommendCard[];
  status: "streaming" | "done" | "error";
  /** "HH:MM" 形式 */
  timestamp: string;
  /** qa_logs.id。フィードバック送信に使う（書き込み失敗時はundefinedのまま） */
  logId?: number;
}

// 👍👎フィードバックをqa_logsへ送信する（失敗しても画面は止めない）。
async function sendFeedback(logId: number, feedback: "up" | "down"): Promise<void> {
  try {
    await fetch("/api/chat/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ logId, feedback }),
    });
  } catch (error) {
    console.warn("フィードバックの送信に失敗しました:", error);
  }
}

type ChatMessageProps = {
  message: ChatMessageData;
};

// 1メッセージ（ユーザー/ボット）の表示。
export default function ChatMessage({ message }: ChatMessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="max-w-[85%] rounded-card bg-primary px-3 py-2">
          <p className="whitespace-pre-wrap text-sm text-white">{message.text}</p>
        </div>
        <span className="px-1 text-xs text-ink-muted">{message.timestamp}</span>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2">
      <img
        src={ganChanIcon}
        alt=""
        className="size-9 shrink-0 rounded-full border border-border bg-surface object-cover"
      />
      <div className="flex max-w-[85%] min-w-0 flex-col items-start gap-1">
        <div
          className={`rounded-card px-3 py-2 ${
            message.status === "error" ? "bg-danger-subtle text-danger" : "bg-surface-card text-ink"
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">
            {message.text}
            {message.status === "streaming" && (
              <span aria-hidden className="ml-0.5 inline-block animate-pulse">
                ▍
              </span>
            )}
          </p>
        </div>

        {message.sourceUrls && message.sourceUrls.length > 0 && (
          <ul className="flex flex-col gap-0.5 px-1">
            {message.sourceUrls.map((url) => (
              <li key={url}>
                <a
                  href={url}
                  target={url.startsWith("/") ? undefined : "_blank"}
                  rel={url.startsWith("/") ? undefined : "noopener noreferrer"}
                  className="text-xs break-all text-primary underline"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        )}

        {message.recommendCards && message.recommendCards.length > 0 && (
          <div className="flex w-full flex-col gap-2 pt-1">
            {message.recommendCards.map((card) => (
              <CircleRecommendCard key={card.circleId} card={card} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-ink-muted">{message.timestamp}</span>
          {message.status === "done" && (
            <FeedbackButtons
              onFeedback={
                message.logId !== undefined
                  ? (value) => sendFeedback(message.logId!, value)
                  : undefined
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
