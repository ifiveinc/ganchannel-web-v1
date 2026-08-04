// IP単位のレート制限判定。qa_logsにIPを保存しない方針（docs/chatbot-decisions.md §13）に合わせ、
// DBは使わずメモリ上のみで保持する（docs/chatbot-spec.md §3、§8 item3）。
//
// 【要確認】§8 item3: RATE_LIMIT_MAX_REQUESTS / RATE_LIMIT_WINDOW_SECONDS の具体値は未確定。
// 通常の会話（連続した質問のやり取り）は妨げず、短時間の連投・自動送信を防ぐ値として
// 「60秒間に10回」を暫定値とする。

const DEFAULT_MAX_REQUESTS = 10;
const DEFAULT_WINDOW_SECONDS = 60;

export const RATE_LIMIT_MESSAGE =
  "短時間に多くの質問が送信されたため、しばらく時間をおいてから再度お試しください。";

interface RateLimitState {
  count: number;
  windowStart: number;
}

// Renderの無料プランは15分でスリープし、再起動のたびにリセットされる。
// レート制限の目的（短時間の連投防止）にとってはそれで問題ない
// （qa_cacheと異なり、状態を失っても実害が無いためメモリ実装で十分）。
const requestState = new Map<string, RateLimitState>();

function getMaxRequests(): number {
  const raw = process.env.RATE_LIMIT_MAX_REQUESTS;
  const parsed = raw ? Number(raw) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_MAX_REQUESTS;
}

function getWindowMs(): number {
  const raw = process.env.RATE_LIMIT_WINDOW_SECONDS;
  const parsed = raw ? Number(raw) : NaN;
  const seconds = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_WINDOW_SECONDS;
  return seconds * 1000;
}

// リクエストを1件消費し、許可されるかを返す。ウィンドウが切れていればカウントをリセットする。
export function consumeRateLimit(clientId: string): boolean {
  const now = Date.now();
  const windowMs = getWindowMs();
  const state = requestState.get(clientId);

  if (!state || now - state.windowStart >= windowMs) {
    requestState.set(clientId, { count: 1, windowStart: now });
    pruneExpiredEntries(now, windowMs);
    return true;
  }

  if (state.count >= getMaxRequests()) {
    return false;
  }

  state.count += 1;
  return true;
}

// 呼び出しのついでに期限切れエントリを間引き、Mapが無制限に増え続けないようにする。
function pruneExpiredEntries(now: number, windowMs: number): void {
  for (const [key, state] of requestState) {
    if (now - state.windowStart >= windowMs) {
      requestState.delete(key);
    }
  }
}

// リバースプロキシ（Render等）経由を想定してX-Forwarded-Forを優先する。
// ローカル開発等でヘッダーが無い場合は "unknown" にフォールバックする
// （IPを個人特定情報として保存はしない。メモリ上のレート制限キーとしてのみ使う）。
export function getClientId(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
