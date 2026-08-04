import type { LLMCompletionChunk, LLMCompletionParams } from "~/types/llm";

export type { LLMCompletionChunk, LLMCompletionParams, LLMProvider } from "~/types/llm";

// LLM呼び出し失敗時に投げるエラー。プロバイダ名とHTTPステータス（不明な場合はnull）を保持し、
// provider-registry.server.ts のフォールバック判定・ログ出力に使う。
export class LLMProviderError extends Error {
  constructor(
    public readonly providerName: string,
    public readonly status: number | null,
    message: string
  ) {
    super(message);
    this.name = "LLMProviderError";
  }
}

// 429（レート制限）/ 5xx（サーバエラー）かどうかの判定
// （docs/chatbot-decisions.md §5「429/5xxで次のプロバイダへ自動フォールバック」）
export function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status <= 599);
}

// -preview が付いたモデルIDは使わない方針（docs/chatbot-decisions.md §5）をコード側で強制する
export function assertNotPreviewModel(model: string, providerName: string): void {
  if (model.includes("-preview")) {
    throw new LLMProviderError(
      providerName,
      null,
      `${providerName}のモデルID「${model}」は -preview を含むため使用できません（docs/chatbot-decisions.md §5）。`
    );
  }
}

// 検索結果コンテキストと質問を1つのユーザーメッセージにまとめる。
// 各プロバイダアダプタで同じ組み立て方をすることで、プロバイダ間の応答品質比較を公平にする
export function buildUserMessage(params: LLMCompletionParams): string {
  return `${params.context}\n\n質問: ${params.question}`;
}

// OpenAI互換のChat Completions API（SSEストリーミング）共通パーサー。
// Groq・Cerebras等、同じレスポンス形式のプロバイダで共有する。
export async function* parseOpenAiCompatibleSseStream(
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
      if (!payload || payload === "[DONE]") continue;

      const json = JSON.parse(payload);
      const text = json.choices?.[0]?.delta?.content;
      if (typeof text === "string" && text.length > 0) {
        yield { type: "text", text };
      }
    }
  }

  yield { type: "done" };
}
