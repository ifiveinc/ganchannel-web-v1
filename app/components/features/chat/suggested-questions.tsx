import { useState } from "react";
import { CHATBOT_FAQ_ITEMS, type ChatbotFaqCategory } from "~/data/chatbot/chatbot-faq";

const CATEGORIES: ChatbotFaqCategory[] = [
  "サークル",
  "キャンパス",
  "お金のこと",
  "盛岡での暮らし",
  "学部えらび",
];

type SuggestedQuestionsProps = {
  onSelect: (question: string) => void;
};

// カテゴリタブ付きサジェスト質問（docs/chatbot-decisions.md §14）。
// Phase 4で作成した事前生成FAQ（app/data/chatbot-faq.ts）をそのまま流用する。
export default function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  const [activeCategory, setActiveCategory] = useState<ChatbotFaqCategory>(CATEGORIES[0]);

  const items = CHATBOT_FAQ_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col gap-3">
      <div
        role="tablist"
        aria-label="質問のカテゴリー"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {CATEGORIES.map((category) => (
          <button
            key={category}
            type="button"
            role="tab"
            aria-selected={activeCategory === category}
            onClick={() => setActiveCategory(category)}
            className={`h-9 shrink-0 whitespace-nowrap rounded-control px-3 text-sm transition-colors ${
              activeCategory === category
                ? "bg-primary font-bold text-white"
                : "bg-surface-card text-ink-muted"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.question)}
            className="rounded-card border border-border bg-surface px-3 py-2 text-left text-sm text-ink hover:bg-surface-card"
          >
            {item.question}
          </button>
        ))}
      </div>
    </div>
  );
}
