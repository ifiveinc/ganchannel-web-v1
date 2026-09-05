// 岩手大学のニュースAPIは日付を 20250903 のような8桁の数値で返す。
// 表示用のラベルと <time dateTime> 用の値に整える処理をUIから分離する。

export type FormattedNewsDate = {
  /** 画面に出す文字列（例: 2025.09.03） */
  label: string;
  /** <time dateTime> に渡す値（例: 2025-09-03） */
  iso: string;
};

// 想定外の値が来ても画面を壊さないよう、8桁でなければ null を返して
// 呼び出し側で日付の表示ごと省けるようにする（デザイン規約 原則3）。
export function formatNewsDate(date: number): FormattedNewsDate | null {
  const raw = String(date);

  if (!/^\d{8}$/.test(raw)) return null;

  const year = raw.slice(0, 4);
  const month = raw.slice(4, 6);
  const day = raw.slice(6, 8);

  return {
    label: `${year}.${month}.${day}`,
    iso: `${year}-${month}-${day}`,
  };
}
