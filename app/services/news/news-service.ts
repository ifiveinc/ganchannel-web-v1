import { NEWS_API_URL } from "~/constants";
import type { NewsData } from "~/types/news/news";

// ニュースデータの取得処理。UI（route/component）から分離して集約する。
export async function fetchNews(): Promise<NewsData[]> {
  const response = await fetch(NEWS_API_URL);

  // 取得に失敗した場合はエラーを投げ、route側のErrorBoundaryに委ねる
  if (!response.ok) {
    throw new Error("データの取得に失敗しました。");
  }

  return (await response.json()) as NewsData[];
}
