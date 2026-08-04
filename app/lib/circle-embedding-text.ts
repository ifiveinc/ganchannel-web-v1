// サークルのベクトル検索で、多くの団体の埋め込みに共通して含まれがちな語
// （大学名・団体形態の呼称等）を除去するためのリスト。
//
// これらの語が団体側・質問側の両方の埋め込みに共通して含まれることで、話題が
// 全く無関係な質問（例:「岩大付近のおいしいラーメン屋教えて」）でも埋め込みの
// 類似度が0.6前後まで底上げされ、無関係な団体がレコメンドされてしまう問題が
// 実際に発生したための対処（2026-08-05、実測値で効果を確認済み）。
//
// 団体側は scripts/generate-circle-embeddings.ts で埋め込み生成前に適用し、
// 質問側は search-service.server.ts でサークル検索専用の埋め込みを生成する際に
// 同じ関数を適用する（qa_cache・chunksの埋め込みには影響させないよう、
// サークル検索専用に埋め込みAPIをもう1回呼ぶ設計にしている）。
//
// 【要確認】リストは今回の誤検知パターンから作った暫定的なもの。団体数が増えたり
// 別の共通語が問題になったりした場合は随時追加すること。
export const CIRCLE_EMBEDDING_COMMON_WORDS = [
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

export function stripCircleEmbeddingCommonWords(text: string): string {
  return CIRCLE_EMBEDDING_COMMON_WORDS.reduce(
    (result, word) => result.split(word).join(""),
    text
  );
}
