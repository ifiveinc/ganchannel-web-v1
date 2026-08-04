import { getSupabaseClient } from "~/services/supabase-client.server";

interface WriteQaLogParams {
  question: string;
  answer: string;
  providerUsed: string | null;
  searchScore: number | null;
  noAnswer: boolean;
}

// qa_logsへの書き込み。IPアドレス・ユーザー識別子は保存しない
// （docs/chatbot-decisions.md §13「個人特定情報は保存しない」）。
// 失敗しても本処理を止めない（同§13）。書き込めた場合はidを返し、フィードバックAPIから参照する。
export async function writeQaLog(params: WriteQaLogParams): Promise<number | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("qa_logs")
      .insert({
        question: params.question,
        answer: params.answer,
        provider_used: params.providerUsed,
        search_score: params.searchScore,
        no_answer: params.noAnswer,
      })
      .select("id")
      .single();

    if (error) throw error;
    return data.id;
  } catch (error) {
    console.warn("[警告] qa_logsへの書き込みに失敗しました:", error);
    return null;
  }
}

// 👍👎フィードバックをqa_logs.feedbackへ反映する（app/routes/api.chat.feedback.ts から呼ぶ）。
export async function updateQaLogFeedback(
  logId: number,
  feedback: "up" | "down"
): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client.from("qa_logs").update({ feedback }).eq("id", logId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.warn("[警告] qa_logsのfeedback更新に失敗しました:", error);
    return false;
  }
}
