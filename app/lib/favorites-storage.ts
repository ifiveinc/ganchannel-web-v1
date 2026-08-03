// お気に入り（気になる）の永続化。localStorage へのアクセスはここに閉じ込める。
// 保存するのは団体IDの配列だけ（docs/circle-info/spec.md §4）。

const STORAGE_KEY = "ganchannel:circle-info:favorites";

export function readFavorites(): string[] {
  // サーバ側には localStorage が存在しないため、必ず空配列を返す
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((id): id is string => typeof id === "string");
  } catch {
    // 壊れた値が入っていても機能全体を止めない
    return [];
  }
}

export function writeFavorites(ids: string[]): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // 保存領域が一杯・プライベートモード等。保存できなくても操作は続行させる
  }
}
