import type { Route } from "./+types/api.chat";
import { runCascade, NO_ANSWER_MESSAGE } from "~/services/chatbot/search-service.server";
import { writeQaLog } from "~/services/chatbot/qa-log-service.server";
import {
  consumeRateLimit,
  getClientId,
  RATE_LIMIT_MESSAGE,
} from "~/services/chatbot/rate-limit-service.server";
import type { ChatRequestBody, ChatStreamChunk } from "~/types/chatbot/chatbot";

// リソースルート（action のみ、default export なし）。
// レスポンスはNDJSON（1行1 ChatStreamChunk）でストリーミングする。
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) {
    return new Response("question is required", { status: 400 });
  }

  const clientId = getClientId(request);
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (chunk: ChatStreamChunk) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(chunk)}\n`));
      };

      // レート制限を超えた場合はカスケードを実行せず、LLM APIも呼ばない
      // （docs/chatbot-decisions.md §7受け入れ基準14）。エラー画面ではなくチャット内の
      // メッセージとして返す（§8「エラー画面を出さない」の精神に合わせる）。
      if (!consumeRateLimit(clientId)) {
        send({ type: "error", text: RATE_LIMIT_MESSAGE });
        send({ type: "done" });
        controller.close();
        return;
      }

      try {
        const generator = runCascade(question);
        let result = await generator.next();
        while (!result.done) {
          send(result.value);
          result = await generator.next();
        }

        const cascadeResult = result.value;
        const logId = await writeQaLog({
          question,
          answer: cascadeResult.answer,
          providerUsed: cascadeResult.providerUsed,
          searchScore: cascadeResult.searchScore,
          noAnswer: cascadeResult.answer === NO_ANSWER_MESSAGE,
        });
        if (logId !== null) {
          send({ type: "log_id", logId });
        }
      } catch (error) {
        console.error("[エラー] /api/chat カスケード実行中に失敗:", error);
        send({
          type: "error",
          text: "サーバーエラーが発生しました。しばらくしてから再度お試しください。",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}
