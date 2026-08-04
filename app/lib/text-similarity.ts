// 日本語は分かち書きが無いため、形態素解析なしで扱える文字bigramの重なり率を
// 簡易的な類似度として使う（app/services/search-service.server.ts のキーワード検索で使用）。

export function toBigrams(text: string): Set<string> {
  const normalized = text.normalize("NFKC");
  const bigrams = new Set<string>();
  for (let i = 0; i < normalized.length - 1; i++) {
    bigrams.add(normalized.slice(i, i + 2));
  }
  return bigrams;
}

// queryのbigramのうち、targetに含まれる割合（0〜1）
export function bigramOverlapScore(query: string, target: string): number {
  const queryGrams = toBigrams(query);
  if (queryGrams.size === 0) return 0;

  const targetGrams = toBigrams(target);
  let matched = 0;
  for (const gram of queryGrams) {
    if (targetGrams.has(gram)) matched++;
  }
  return matched / queryGrams.size;
}
