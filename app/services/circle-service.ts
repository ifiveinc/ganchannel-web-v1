import { circles } from "~/data/circles";
import type { Circle } from "~/types/circle";
import {
  findImageOverride,
  isRenderableImage,
} from "~/services/circles/image-overrides";

// フォーム由来の画像URL（Google Driveの共有リンク）を、表示できる値に解決する。
// 手動配置した画像があればそれを使い、無ければ描画できないURLを取り除く。
// データ自体は書き換えないため、`npm run sync:circles` の再実行と競合しない。
function resolveImages(circle: Circle): Circle {
  const override = findImageOverride(circle.id);

  const logo = override?.logo ?? circle.logo;
  const images = override?.images ?? circle.images;

  return {
    ...circle,
    logo: logo !== null && isRenderableImage(logo) ? logo : null,
    images: images.filter(isRenderableImage),
  };
}

// サークル情報の取得処理。UI（route/component）から分離して集約する。
//
// MVPではリポジトリ内の静的データを返す。データソースを外部API等に移行する際は、
// この関数の中だけを差し替える（docs/circle-info/spec.md §6.2）。
export async function fetchCircles(): Promise<Circle[]> {
  return circles.map(resolveImages);
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
