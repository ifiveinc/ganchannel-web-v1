import type { LLMCompletionChunk, LLMCompletionParams, LLMProvider } from "~/types/llm";
import {
  assertNotPreviewModel,
  buildUserMessage,
  LLMProviderError,
} from "~/services/llm/llm-provider.server";

const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Google AI Studio（Gemini）アダプタ。REST API（streamGenerateContent, SSE）を直接呼ぶ
// （docs/chatbot-decisions.md §5：主系、日本語品質が最も安定）。
export class GeminiProvider implements LLMProvider {
  readonly name = "gemini";

  async *complete(params: LLMCompletionParams): AsyncIterable<LLMCompletionChunk> {
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL;
    if (!apiKey || !model) {
      throw new LLMProviderError(
        this.name,
        null,
        "GEMINI_API_KEY / GEMINI_MODEL が設定されていません。"
      );
    }
    assertNotPreviewModel(model, this.name);

    const url = `${API_BASE}/${model}:streamGenerateContent?alt=sse&key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: params.systemPrompt }] },
        contents: [
          { role: "user", parts: [{ text: buildUserMessage(params) }] },
        ],
      }),
    });

    if (!response.ok || !response.body) {
      throw new LLMProviderError(
        this.name,
        response.status,
        `Gemini APIエラー（status: ${response.status}）`
      );
    }

    yield* parseGeminiSseStream(response.body);
  }
}

async function* parseGeminiSseStream(
  body: ReadableStream<Uint8Array>
): AsyncIterable<LLMCompletionChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const payload = line.slice("data: ".length).trim();
      if (!payload) continue;

      const json = JSON.parse(payload);
      const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
      if (typeof text === "string" && text.length > 0) {
        yield { type: "text", text };
      }
    }
  }

  yield { type: "done" };
}
