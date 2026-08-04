// Phase 12（pgvectorによる類似検索・RRF融合）の動作確認用に、手動で作成した少数のchunksを
// Supabaseへ投入する暫定スクリプト。
//
// 本来のコンテンツ取り込みパイプライン（大学サイトのホワイトリストクロール→要約→chunk化、
// docs/chatbot-decisions.md §5）はまだ実装されていない。ここで投入する内容は暫定の
// 手書きサマリであり、実際のクロール結果ではない。パイプライン実装後は本スクリプトの
// 投入分をchunksテーブルから削除し、本物のchunksに置き換えること。
//
// 再実行時は投入対象のurlに一致する既存行を削除してから入れ直す（冪等）。
// 実行後は `npm run generate:snapshot` も忘れずに再実行し、snapshot.jsonへ反映すること。

import { getSupabaseClient } from "../app/services/chatbot/supabase-client.server";
import { generateQueryEmbedding } from "../app/services/chatbot/embedding-service.server";
import { stripSearchCommonWords } from "../app/lib/chatbot/embedding-common-words";
import type { RiskLevel } from "../app/types/chatbot/chunk";

interface SeedChunk {
  url: string;
  title: string;
  section: string | null;
  content: string;
  riskLevel: RiskLevel;
}

const SEED_CHUNKS: SeedChunk[] = [
  {
    url: "https://www.lib.iwate-u.ac.jp/",
    title: "岩手大学附属図書館の利用案内",
    section: "開館時間",
    content:
      "岩手大学附属図書館は上田キャンパスにある。学期中は平日・土日ともに夜間まで開館しており、長期休業期間は開館時間が短縮される。最新の開館カレンダーは図書館公式サイトで確認できる。学生証があれば館内の閲覧席や学習室、蔵書の貸出を利用できる。",
    riskLevel: "A",
  },
  {
    url: "https://www.iwate-u.ac.jp/campus/life/meal.html",
    title: "学生食堂・生協の食事",
    section: "学食",
    content:
      "上田キャンパスには生協食堂があり、定食・麺類・丼物などを比較的安価に提供している。学生証を提示すると生協の割引価格で利用できるメニューもある。混雑する昼休みの時間帯を避けると席を確保しやすい。",
    riskLevel: "A",
  },
  {
    url: "https://www.iwate-u.ac.jp/campus/access.html",
    title: "上田キャンパスへのアクセス",
    section: "交通手段",
    content:
      "上田キャンパスへは盛岡駅からバス便が出ているほか、最寄りのバス停から徒歩で構内に入ることができる。自転車通学の学生も多く、キャンパス内に駐輪場が複数設置されている。",
    riskLevel: "A",
  },
  {
    url: "https://www.iwate-u.ac.jp/campus/event/kozukata.html",
    title: "不来方祭（大学祭）",
    section: "概要",
    content:
      "不来方祭は岩手大学の学園祭で、例年秋に上田キャンパスで開催される。学生団体・サークルによる模擬店や催し物が並び、学外からも来場者が訪れる岩手大学最大級のイベントの一つ。",
    riskLevel: "A",
  },
  {
    url: "https://www.iwate-u.ac.jp/campus/life/moriokalife.html",
    title: "盛岡での一人暮らし・アパート探し",
    section: "住環境",
    content:
      "盛岡市内には大学周辺にアパート・学生向け物件が多く、不動産会社に相談すると新生活の部屋探しを進めやすい。冬の積雪や寒さに備えた住まい選びのポイントとして、暖房設備や除雪のしやすさを確認する学生が多い。",
    riskLevel: "A",
  },
  {
    url: "https://www.iwate-u.ac.jp/admission/scholarship.html",
    title: "奨学金制度",
    section: "制度概要",
    content:
      "岩手大学では日本学生支援機構の奨学金をはじめ、大学独自の奨学金制度を利用できる場合がある。給付型・貸与型など種類が複数あり、家計状況や成績などの条件によって対象や金額が異なる。申請時期や必要書類は年度により変更されることがある。",
    riskLevel: "B",
  },
  {
    url: "https://www.iwate-u.ac.jp/admission/tuition.html",
    title: "授業料免除・徴収猶予制度",
    section: "制度概要",
    content:
      "経済的な事情がある学生を対象に、授業料の全額・半額免除や徴収猶予を申請できる制度がある。家計基準や学業成績などの審査があり、申請の受付時期は前期・後期でそれぞれ定められている。",
    riskLevel: "B",
  },
];

async function main() {
  const client = getSupabaseClient();
  const fetchedAt = new Date().toISOString();

  const urls = SEED_CHUNKS.map((seed) => seed.url);
  const { error: deleteError } = await client.from("chunks").delete().in("url", urls);
  if (deleteError) {
    throw new Error(`既存chunkの削除に失敗しました: ${deleteError.message}`);
  }

  for (const seed of SEED_CHUNKS) {
    // 大学名等の共通語は埋め込み生成前に除去する（誤検知対策、app/lib/embedding-common-words.ts参照）。
    // title/contentそのもの（LLMへ渡す文脈、B層の定型文タイトル）は元のまま保存する
    const embeddingText = stripSearchCommonWords(`${seed.title}\n${seed.content}`);
    const embedding = await generateQueryEmbedding(embeddingText);
    const { error } = await client.from("chunks").insert({
      url: seed.url,
      title: seed.title,
      section: seed.section,
      content: seed.content,
      embedding,
      risk_level: seed.riskLevel,
      fetched_at: fetchedAt,
      page_updated_at: null,
    });
    if (error) {
      throw new Error(`chunk投入に失敗しました（${seed.title}）: ${error.message}`);
    }
    console.log(`投入: ${seed.title}`);
  }

  console.log(`chunksへの投入が完了しました（${SEED_CHUNKS.length}件）`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
