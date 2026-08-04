import type { LLMCompletionChunk, LLMCompletionParams, LLMProvider } from "~/types/llm";
import {
  assertNotPreviewModel,
  buildUserMessage,
  LLMProviderError,
  parseOpenAiCompatibleSseStream,
} from "~/services/llm/llm-provider.server";

const API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Groqアダプタ。OpenAI互換のChat Completions APIをSSEストリーミングで呼ぶ
// （docs/chatbot-decisions.md §5：主系が溢れた分を受ける第2系。Cerebrasから差し替え）。
export class GroqProvider implements LLMProvider {
  readonly name = "groq";

  async *complete(params: LLMCompletionParams): AsyncIterable<LLMCompletionChunk> {
    const apiKey = process.env.GROQ_API_KEY;
    const model = process.env.GROQ_MODEL;
    if (!apiKey || !model) {
      throw new LLMProviderError(
        this.name,
        null,
        "GROQ_API_KEY / GROQ_MODEL が設定されていません。"
      );
    }
    assertNotPreviewModel(model, this.name);

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        stream: true,
        messages: [
          { role: "system", content: params.systemPrompt },
          { role: "user", content: buildUserMessage(params) },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      throw new LLMProviderError(
        this.name,
        response.status,
        `Groq APIエラー（status: ${response.status}）`
      );
    }

    yield* parseOpenAiCompatibleSseStream(response.body);
  }
}
