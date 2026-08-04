import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { MdClose, MdForum, MdSend } from "react-icons/md";
import ChatMessage, { type ChatMessageData } from "~/components/features/chat/chat-message";
import SuggestedQuestions from "~/components/features/chat/suggested-questions";
import BackToTopLink from "~/components/ui/back-to-top-link";
import EmptyState from "~/components/ui/empty-state";
import type { ChatRequestBody, ChatStreamChunk } from "~/types/chatbot";

function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const ERROR_MESSAGE = "エラーが発生しました。しばらくしてから再度お試しください。";

// /api/chat のNDJSONレスポンス（1行1 ChatStreamChunk）を逐次読み取る。
async function streamChat(
  question: string,
  signal: AbortSignal,
  onChunk: (chunk: ChatStreamChunk) => void
): Promise<void> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question } satisfies ChatRequestBody),
    signal,
  });

  if (!response.ok || !response.body) {
    throw new Error(`サーバーエラー（status: ${response.status}）`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.trim()) continue;
      onChunk(JSON.parse(line) as ChatStreamChunk);
    }
  }
}

// チャット画面全体（メッセージ一覧＋入力欄）。状態はメモリ上のみで保持する
// （localStorage/sessionStorageは使わない、docs/chatbot-decisions.md §14）。
export default function ChatWindow() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  // localStorage/sessionStorageは使わない方針のため、閉じた状態はstateのみで保持する
  // （再読み込み・新規訪問時は必ずまた表示される）。
  const [isNoticeVisible, setIsNoticeVisible] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendQuestion = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isStreaming) return;

    const userMessage: ChatMessageData = {
      id: createId(),
      role: "user",
      text: trimmed,
      status: "done",
      timestamp: formatTimestamp(new Date()),
    };
    const botMessageId = createId();
    const botMessage: ChatMessageData = {
      id: botMessageId,
      role: "bot",
      text: "",
      status: "streaming",
      timestamp: formatTimestamp(new Date()),
    };

    setMessages((prev) => [...prev, userMessage, botMessage]);
    setInput("");
    setIsStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const updateBotMessage = (updater: (message: ChatMessageData) => ChatMessageData) => {
      setMessages((prev) =>
        prev.map((message) => (message.id === botMessageId ? updater(message) : message))
      );
    };

    try {
      await streamChat(trimmed, controller.signal, (chunk) => {
        if (chunk.type === "text" && chunk.text) {
          updateBotMessage((message) => ({ ...message, text: message.text + chunk.text }));
        } else if (chunk.type === "sources" && chunk.sourceUrls) {
          updateBotMessage((message) => ({ ...message, sourceUrls: chunk.sourceUrls }));
        } else if (chunk.type === "recommend" && chunk.recommendCards) {
          updateBotMessage((message) => ({ ...message, recommendCards: chunk.recommendCards }));
        } else if (chunk.type === "log_id" && chunk.logId !== undefined) {
          updateBotMessage((message) => ({ ...message, logId: chunk.logId }));
        } else if (chunk.type === "error") {
          updateBotMessage((message) => ({
            ...message,
            text: message.text || chunk.text || ERROR_MESSAGE,
            status: "error",
          }));
        } else if (chunk.type === "done") {
          updateBotMessage((message) => ({
            ...message,
            status: message.status === "error" ? "error" : "done",
          }));
        }
      });
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") return;
      updateBotMessage((message) => ({
        ...message,
        text: message.text || ERROR_MESSAGE,
        status: "error",
      }));
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendQuestion(input);
  };

  return (
    <>
      <div className="flex-1 px-4 py-4">
        <div className="mb-4">
          <BackToTopLink />
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col gap-6">
            <EmptyState
              icon={MdForum}
              title="学内QAチャットボットへようこそ"
              description="サークル・キャンパス生活・お金のことなど、気になることを聞いてみてください。"
            />
            <SuggestedQuestions onSelect={(question) => void sendQuestion(question)} />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 z-10 border-t border-border bg-surface px-4 pt-2 pb-4">
        {isNoticeVisible && (
          <div className="flex items-start gap-2 pb-2">
            <p className="flex-1 text-xs text-ink-muted">
              入力内容は生成AIの提供元に送信されます。個人情報は入力しないでください。
            </p>
            <button
              type="button"
              aria-label="この注意書きを閉じる"
              onClick={() => setIsNoticeVisible(false)}
              className="inline-flex size-5 shrink-0 items-center justify-center rounded-full text-ink-muted hover:bg-surface-card"
            >
              <MdClose size={14} aria-hidden />
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <label htmlFor="chat-input" className="sr-only">
            メッセージを入力
          </label>
          <input
            id="chat-input"
            type="text"
            // Chromeは通常のテキスト欄でautoComplete="off"を無視して過去の入力履歴を
            // サジェストし続けることがある。"new-password"はパスワードマネージャー避けの
            // 値だが、Chromeが確実に履歴サジェストを止める数少ない指定のため代用する。
            autoComplete="new-password"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="メッセージを入力してください..."
            disabled={isStreaming}
            className="h-12 min-w-0 flex-1 rounded-control border border-border-strong bg-surface px-4 text-base focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label="送信"
            disabled={isStreaming || input.trim().length === 0}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary-hover active:bg-primary-active disabled:cursor-not-allowed disabled:opacity-50"
          >
            <MdSend size={20} aria-hidden />
          </button>
        </form>
      </div>
    </>
  );
}
