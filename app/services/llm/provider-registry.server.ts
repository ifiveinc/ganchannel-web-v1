import type { LLMCompletionChunk, LLMCompletionParams, LLMProvider } from "~/types/llm";
import { GeminiProvider } from "~/services/llm/gemini-provider.server";
import { GroqProvider } from "~/services/llm/groq-provider.server";
import { DegradedProvider } from "~/services/llm/degraded-provider.server";

// LLM_PROVIDERS環境変数で有効化するプロバイダ名（docs/chatbot-decisions.md §5）。
// 将来プロバイダを追加する場合は、ここに1行追加するだけで有効化できる。
const PROVIDER_FACTORIES: Record<string, () => LLMProvider> = {
  gemini: () => new GeminiProvider(),
  groq: () => new GroqProvider(),
};

function resolveConfiguredProviders(): LLMProvider[] {
  const names = (process.env.LLM_PROVIDERS ?? "")
    .split(",")
    .map((name) => name.trim())
    .filter((name) => name.length > 0);

  const providers: LLMProvider[] = [];
  for (const name of names) {
    const factory = PROVIDER_FACTORIES[name];
    if (!factory) {
      console.warn(`[警告] 未知のLLMプロバイダ「${name}」はLLM_PROVIDERSから無視します。`);
      continue;
    }
    providers.push(factory());
  }
  return providers;
}

// LLM_PROVIDERSの順に呼び出し、失敗したら次のプロバイダへフォールバックする。
// 全滅時は縮退モードへ落ちる（エラー画面を出さない、docs/chatbot-decisions.md §5・§13）。
// 呼び出し元は最終的にどのプロバイダで応答したか（qa_logsのprovider_usedに対応）を
// AsyncGeneratorの戻り値（string | null。null = 縮退モード）として受け取れる。
export async function* completeWithFallback(
  params: LLMCompletionParams
): AsyncGenerator<LLMCompletionChunk, string | null, undefined> {
  const providers = resolveConfiguredProviders();

  for (const provider of providers) {
    let yieldedAny = false;
    try {
      for await (const chunk of provider.complete(params)) {
        yieldedAny = true;
        yield chunk;
        if (chunk.type === "done" || chunk.type === "error") {
          return provider.name;
        }
      }
      return provider.name;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (yieldedAny) {
        // 既に部分的なテキストをクライアントへ送信済みのため、
        // 別プロバイダへ黙って切り替えると不整合な応答になる。ここで打ち切る
        console.error(`[エラー] ${provider.name}がストリーミング中に失敗: ${message}`);
        yield { type: "error", text: "応答の生成中にエラーが発生しました。" };
        return provider.name;
      }
      console.warn(`[警告] ${provider.name}が失敗（${message}）。次のプロバイダへフォールバックします。`);
    }
  }

  // 設定済みプロバイダが全て失敗、またはLLM_PROVIDERSが空 → 縮退モード
  const degraded = new DegradedProvider();
  for await (const chunk of degraded.complete(params)) {
    yield chunk;
  }
  return null;
}
