import { RISK_C_KEYWORDS } from "~/data/risk-c-keywords";

export interface RiskFilterResult {
  blocked: boolean;
  matchedKeyword: string | null;
}

// C層トピックをキーワード照合でブロックする（docs/chatbot-decisions.md §7・§8）。
// LLMを呼ばず、判定はコード側で完結させる（検索カスケード第1段、CascadeStage: "c_layer_block"）。
export function checkRiskFilter(question: string): RiskFilterResult {
  const normalized = question.normalize("NFKC");
  const matched = RISK_C_KEYWORDS.find((keyword) => normalized.includes(keyword));
  return { blocked: matched !== undefined, matchedKeyword: matched ?? null };
}

// C層に該当した場合に返す定型文（docs/chatbot-decisions.md §7「LLMを呼ばず定型文」）。
// 【要確認】文面・案内先（学生支援課／教務課／入試課など具体的な窓口）はチームで確定させること
export const C_LAYER_RESPONSE_MESSAGE =
  "この質問には、生成AIでの回答を控えさせていただいています。入試の合否・配点、成績（GPA）、個別の手続き期限、教員個人に関するご質問は、大学の担当窓口（教務課・入試課など）に直接お問い合わせください。";
