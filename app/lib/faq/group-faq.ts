import type { FaqItem } from "~/data/faq/faq-list";

/** カテゴリー単位にまとめた質問の集まり */
export type FaqSection = {
  /** ページ内ジャンプ用のアンカーid */
  id: string;
  name: string;
  items: FaqItem[];
};

// 掲載件数が少ないため、絞り込みはすべてクライアント側で行う。
// 検索対象は質問文と keywords のみ（回答本文は長く、共通語での誤ヒットが増えるため含めない）。
function matchesKeyword(item: FaqItem, keyword: string) {
  const target = `${item.question} ${item.keywords}`.toLowerCase();
  return target.includes(keyword);
}

/**
 * キーワードで絞り込み、カテゴリー単位にまとめて返す。
 * 該当が0件になったカテゴリーは、見出しごと除く。
 */
export function buildFaqSections(
  items: FaqItem[],
  keyword: string,
): FaqSection[] {
  const normalized = keyword.trim().toLowerCase();
  const sections: FaqSection[] = [];

  for (const item of items) {
    if (normalized !== "" && !matchesKeyword(item, normalized)) continue;

    // データの並び順をそのままカテゴリーの並び順にする
    const section = sections.find((current) => current.id === item.categoryId);
    if (section) {
      section.items.push(item);
      continue;
    }
    sections.push({
      id: item.categoryId,
      name: item.categoryName,
      items: [item],
    });
  }

  return sections;
}

/** 絞り込み後の質問の総数 */
export function countFaqItems(sections: FaqSection[]) {
  return sections.reduce((total, section) => total + section.items.length, 0);
}
