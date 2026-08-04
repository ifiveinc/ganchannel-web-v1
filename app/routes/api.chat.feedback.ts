import type { Route } from "./+types/api.chat.feedback";
import { updateQaLogFeedback } from "~/services/qa-log-service.server";

interface FeedbackRequestBody {
  logId: number;
  feedback: "up" | "down";
}

function isValidBody(body: unknown): body is FeedbackRequestBody {
  if (typeof body !== "object" || body === null) return false;
  const { logId, feedback } = body as Record<string, unknown>;
  return typeof logId === "number" && (feedback === "up" || feedback === "down");
}

// リソースルート（action のみ、default export なし）。👍👎フィードバックを受け取る。
export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response("Invalid JSON body", { status: 400 });
  }

  if (!isValidBody(body)) {
    return Response.json(
      { error: "logId (number) と feedback ('up' | 'down') が必要です。" },
      { status: 400 }
    );
  }

  const success = await updateQaLogFeedback(body.logId, body.feedback);
  return Response.json({ success }, { status: success ? 200 : 500 });
}
