import { circles } from "~/data/circles";
import type { Circle } from "~/types/circle";

// サークル情報の取得処理。UI（route/component）から分離して集約する。
//
// MVPではリポジトリ内の静的データを返す。データソースを外部API等に移行する際は、
// この関数の中だけを差し替える（docs/circle-info/spec.md §6.2）。
export async function fetchCircles(): Promise<Circle[]> {
  return circles;
}

// 詳細ページ用。該当がなければ undefined を返す。
export async function fetchCircleById(id: string): Promise<Circle | undefined> {
  const all = await fetchCircles();
  return all.find((circle) => circle.id === id);
}

// 「おすすめの団体」。isRecommended が立っている団体を返し、
// 件数が足りない場合は募集中の団体で補完する（docs/circle-info/spec.md §3.1）。
export async function fetchRecommendedCircles(limit: number): Promise<Circle[]> {
  const all = await fetchCircles();
  const recommended = all.filter((circle) => circle.isRecommended);

  if (recommended.length >= limit) {
    return recommended.slice(0, limit);
  }

  const fallback = all.filter(
    (circle) => !circle.isRecommended && circle.recruitmentStatus === "募集中"
  );

  return [...recommended, ...fallback].slice(0, limit);
}
