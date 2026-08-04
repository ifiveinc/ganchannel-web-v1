import type { LLMCompletionChunk, LLMCompletionParams, LLMProvider } from "~/types/chatbot/llm";

// 縮退モード（docs/chatbot-decisions.md §5・§13：プロバイダ全滅時、エラー画面を出さない）。
// LLMを呼ばずテキストを生成しない。呼び出し元（検索カスケード、Phase 6）は
// providerUsedが"degraded"であることを見て、検索結果カードのみで応答を組み立てる。
export class DegradedProvider implements LLMProvider {
  readonly name = "degraded";

  async *complete(_params: LLMCompletionParams): AsyncIterable<LLMCompletionChunk> {
    yield { type: "done" };
  }
}
