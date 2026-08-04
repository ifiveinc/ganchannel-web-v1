// サークル・chunksのベクトル検索/BM25検索で、多くのドキュメントに共通して含まれがちな語
// （大学名・団体形態の呼称等）を除去するためのリスト。
//
// これらの語が検索対象（団体紹介文・chunks本文）と質問の両方に共通して含まれることで、
// 話題が全く無関係な質問（例:「岩大付近のおいしいラーメン屋教えて」）でも類似度・BM25
// スコアが底上げされ、無関係な団体やchunkがヒットしてしまう問題が実際に発生したための
// 対処（2026-08-05、実測値で効果を確認済み）。
//
// 検索対象側（scripts/generate-circle-embeddings.ts・chunksのBM25トークン化時）と
// 質問側（search-service.server.ts）の両方で同じ関数を適用する。qa_cacheの埋め込みには
// 影響させないよう、サークル・chunksのベクトル検索専用に埋め込みAPIをもう1回呼ぶ設計にしている。
//
// 【要確認】リストは今回の誤検知パターンから作った暫定的なもの。団体・chunksが増えたり
// 別の共通語が問題になったりした場合は随時追加すること。
export const SEARCH_COMMON_WORDS = [
  "岩手大学",
  "岩大",
  "学内カンパニー",
  "NEXT STEP工房",
  "NEXTSTEP工房",
  "同好会",
  "サークル",
  "部活",
  "学生団体",
];

export function stripSearchCommonWords(text: string): string {
  return SEARCH_COMMON_WORDS.reduce((result, word) => result.split(word).join(""), text);
}
