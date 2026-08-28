import { CHATBOT_FAQ_ITEMS, type ChatbotFaqItem } from "~/data/chatbot/chatbot-faq";

// 事前生成FAQとの一致判定（docs/decisions/0004-chatbot-architecture.md §4 検索カスケード第2段）。
// LLM・埋め込みAPIを呼ばず、コード側のキーワード一致のみで判定する。
// matchKeywordsの全トークンが質問文に含まれた場合に一致とみなす（AND条件）。
export function matchFaq(question: string): ChatbotFaqItem | null {
  const normalized = question.normalize("NFKC");
  return (
    CHATBOT_FAQ_ITEMS.find((item) =>
      item.matchKeywords.every((keyword) => normalized.includes(keyword))
    ) ?? null
  );
}
