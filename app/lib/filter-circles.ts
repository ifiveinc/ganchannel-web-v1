import type { Circle, Genre } from "~/types/circle";

export type CircleFilter = {
  keyword: string;
  /** 空文字は「指定なし」 */
  genre: Genre | "";
  /** 空配列は「指定なし」。複数選んだ場合はすべてを持つ団体に絞り込む */
  tags: string[];
};

export const EMPTY_CIRCLE_FILTER: CircleFilter = {
  keyword: "",
  genre: "",
  tags: [],
};

export function isFilterEmpty(filter: CircleFilter): boolean {
  return (
    filter.keyword.trim() === "" &&
    filter.genre === "" &&
    filter.tags.length === 0
  );
}

// 掲載中の全団体からタグの選択肢を作る。タグは自由入力のため定数化しない
// （docs/circle-info/spec.md §5.2）。
export function collectTags(circles: Circle[]): string[] {
  const tags = new Set<string>();
  for (const circle of circles) {
    for (const tag of circle.tags) tags.add(tag);
  }
  return [...tags];
}

// キーワードは団体名・短い紹介文・詳しい紹介文・タグを対象に部分一致。
// 大文字小文字を区別せず、前後の空白を除去して比較する（spec.md §3.2）。
function matchesKeyword(circle: Circle, keyword: string): boolean {
  const needle = keyword.trim().toLowerCase();
  if (needle === "") return true;

  const haystack = [
    circle.name,
    circle.summary,
    circle.description,
    ...circle.tags,
  ]
    .join("\n")
    .toLowerCase();

  return haystack.includes(needle);
}

// 3つの条件は AND で結合する（spec.md §3.2）。
// タグを複数選んだ場合も AND とし、選んだタグをすべて持つ団体だけを残す。
export function filterCircles(
  circles: Circle[],
  filter: CircleFilter
): Circle[] {
  return circles.filter(
    (circle) =>
      matchesKeyword(circle, filter.keyword) &&
      (filter.genre === "" || circle.genres.includes(filter.genre)) &&
      filter.tags.every((tag) => circle.tags.includes(tag))
  );
}
