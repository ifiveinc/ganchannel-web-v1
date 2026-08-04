// 学内カンパニー・NEXT STEP工房の名簿。名簿ソースが画像ファイルでしか存在しないため、
// 担当者が手動で文字起こしする（docs/chatbot-spec.md §10-3）。これは実装タスクではなく運用タスク。
//
// category は "学内カンパニー" か "NEXT STEP工房"。
// 画像にふりがなの記載が無ければ kana は null のままでよい（無理に推測しない）。
// description（内容）が無い場合も null でよい。
import type { CircleRegistryEntry } from "~/types/circle-registry";

export const MANUAL_REGISTRY_ENTRIES: CircleRegistryEntry[] = [
  // --- 学内カンパニー -----------------------------------------------------
  {
    name: "+DESIGN",
    kana: "ぷらすでざいん",
    category: "学内カンパニー",
    description:
      "デザインをビジネスとするカンパニーである。これまでに学内外の依頼を受け、製品パッケージデザイン、ロゴマークデザイン、名刺のデザインなどを手掛けてきた。若手スタッフがファイルアプリのデザインをはじめ、地元企業のポスター・チラシ、リカレント教育特設ページなど多様なデザインに携わり、他カンパニーとの協働も行う。",
  },
  {
    name: "Anonas Lighting",
    kana: "あのなすらいてぃんぐ",
    category: "学内カンパニー",
    description:
      "農業で学んだ力を電子回路・プログラミングなどの電子技術を用い、学生がものづくりを行う。ソフトウェアや回路設計、ユニバーサルデザインを活用したシステムづくりを目指す。市内イベントの照明演出や映像表示、電気設備の製作・改良、ワークショップ開催などを通じて地域への貢献を図る。",
  },
  {
    name: "Iwate機能開発",
    kana: "いわてきのうかいはつ",
    category: "学内カンパニー",
    description:
      "主に高齢者向けのエピソードの多様化により、金属および樹脂材料を用いた部品の機械加工を行う。大学の研究成果を活用し、ものづくりに携わることで技術の研鑽に努める。引き続き学内の仕事や企業の依頼にも対応し、新たな部品や治具の開発・試作を行い、知識と技術の向上につなげる。",
  },
  {
    name: "iFive",
    kana: "あいふぁいぶ",
    category: "学内カンパニー",
    description:
      "学内に分散している学生向けの有益な情報を一元化することで、学生がより早く・確実に情報を得られるスマホ向けアプリ「がんちゃんねる」のWeb版を今春運用開始。現在はアプリ版の運用・保守や機能追加を進め、大学内外との連携や情報発信の強化を図る。",
  },
  {
    name: "岩手大学硝匠工業",
    kana: "いわてだいがくがらすこうぎょう",
    category: "学内カンパニー",
    description:
      "スピードスケート競技における初心者の参入に対する障害の削減を目的として、継続的負担の少ないスピードスケート用簡易練習具「R-keeper」の開発・販売を行う。昨年度は販売を開始し、R-keeperの特徴を整理して認知度向上を図った。今年度は改良とPR活動を進め、製品価値の向上を目指す。",
  },
  {
    name: "DearU",
    kana: "でぃあゆー",
    category: "学内カンパニー",
    description:
      "設立当初から活動し、設計・製造を行いデータを基に企画・提案やアドバイスを行うプロセスを重視して活動を行う。企業課題への対応や学生の関心向上、地域課題解決につながる研究・開発を推進し、ものづくり満足度の向上を目指す。",
  },
  {
    name: "Occasions",
    kana: "おけーじょんず",
    category: "学内カンパニー",
    description:
      "岩手県のふるさと納税で使用される木製品の製作など、地域資源を活用したものづくりを行う。木材利用技術の向上を図り、地域活性化や林業振興に貢献する。木製品の製作・販売を通して地域への貢献を続ける。",
  },
  {
    name: "Ginga Genomics",
    kana: "ぎんがげのみくす",
    category: "学内カンパニー",
    description:
      "次世代シーケンサー（NGS）のデータ解析を中心に、研究支援や受託解析を行う。昨年度はRNA-seq解析サービスを提供し、学会・研究活動を支援した。今年度は解析技術をさらに発展させ、学術活動の活性化に貢献する。",
  },
  {
    name: "岩手大学クラフトビール部",
    kana: "いわてだいがくくらふとびーるぶ",
    category: "学内カンパニー",
    description:
      "地元資源を活用した商品の価値向上を目指し、地域への経済効果や社会的価値を定量評価する。クラフトビール開発を通して農業・観光・地域振興を結び付け、消費者へ価値を伝える仕組みづくりやブランド化を推進する。",
  },
  {
    name: "IWATE Studio",
    kana: "いわてすたじお",
    category: "学内カンパニー",
    description:
      "写真・画像・映像をビジネスとするカンパニー。学生団体や大学広報などに対し、写真・映像素材の提供を通して学生に寄り添った情報発信を目指す。",
  },

  // --- NEXT STEP工房 --------------------------------------------------
  // ふりがなの提供は無いため全件 null
  {
    name: "岩手大学卓球部",
    kana: null,
    category: "NEXT STEP工房",
    description: "卓球バレー指導者資格の取得，卓球バレーの普及イベント",
  },
  {
    name: "岩手町農業探検隊",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "岩手町を実際に歩き観察・テーマ調査を行い，岩手町の農業に関するニーズを収集する，WSを開催する",
  },
  {
    name: "MSC（Morioka Sound Connection）",
    kana: null,
    category: "NEXT STEP工房",
    description: "盛岡市大通りでの演奏・パレード，盛岡を活気づける活動を実施",
  },
  {
    name: "岩手大学ボラセン構想チーム",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "ボランティアセンターを仮立ち上げることが目標，災害ボランティアの募集や学内団体のボランティア依頼を学生に提供する",
  },
  {
    name: "三陸委員会ここより",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "研修旅行で三陸の魅力を発見，南青山での夏祭りや震災追悼イベントを運営，三陸地域の魅力発信イベントを行う",
  },
  {
    name: "岩手大学クラフトビール部",
    kana: null,
    category: "NEXT STEP工房",
    description: "ビール産地の形成に向けた支援活動，プロジェクトの広報PR，商品企画，アプリ開発",
  },
  {
    name: "工学GIRLS",
    kana: null,
    category: "NEXT STEP工房",
    description: "サイエンスショー，サイエンス教室（子ども対象）",
  },
  {
    name: "はろっぷ",
    kana: null,
    category: "NEXT STEP工房",
    description: "社会人向けのサークル活動を支援・促進するアプリの開発",
  },
  {
    name: "岩手大学オリエンテーリング部",
    kana: null,
    category: "NEXT STEP工房",
    description: "市内でのロゲイニング大会企画",
  },
  {
    name: "自然史探検団",
    kana: null,
    category: "NEXT STEP工房",
    description: "標本作成，博物館でのワークショップ",
  },
  {
    name: "いわてi-sakeプロジェクト",
    kana: null,
    category: "NEXT STEP工房",
    description: "オリジナル日本酒「Rondo Iwate」作り，酒米作り，ラベルコンペ",
  },
  {
    name: "岩手大学経済研究室まちづくり部",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "きたかみ朝市での企画準備・実施，カフェマップvol.1の配布方法検討，vol.2作成に向けた調査",
  },
  {
    name: "動物介在学研究室",
    kana: null,
    category: "NEXT STEP工房",
    description: "チャグチャグ馬コに関わり，将来につなげる",
  },
  {
    name: "岩手大学ローカル線振興委員会",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "山田線沿線地域の住民が山田線に愛着を持てるよう活動，山田線を活かしたイベント企画，魅力の発信",
  },
  {
    name: "陸前高田市訪問サークルNEO",
    kana: null,
    category: "NEXT STEP工房",
    description: "陸前高田市への訪問，イベント実施，観光マップの作成",
  },
  {
    name: "たんぽぽ",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "子どもたちへ無料で「あそび・まなび・はなせる場所」を提供する，学習支援事業の実施",
  },
  {
    name: "岩手大学フレスコボール同好会 AMENIMOMAKE'S",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "フレスコボールの普及活動，陸前高田市で行われる大会の補助，全国から高田へ訪れたフレスコボーラーへの防災発表",
  },
  {
    name: "国際協力ボランティアサークル",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "フィリピン貧困地域への寄付活動，難民映画の上映会，中央食堂や構内でフェアトレード商品の普及活動（予定）",
  },
  {
    name: "同じ釜の旬を食う2025",
    kana: null,
    category: "NEXT STEP工房",
    description: "「釜石はまゆりサクラマス」を用いたメニュー2種の開発",
  },
  {
    name: "まちづくりサークルNPCN",
    kana: null,
    category: "NEXT STEP工房",
    description: "「学生の力で盛岡をさらに盛り上げる！」をテーマに様々な活動を行う",
  },
  {
    name: "むちょぐすと",
    kana: null,
    category: "NEXT STEP工房",
    description:
      "食，異文化交流，教育などをテーマとしたオリジナルイベントの企画・運営及び商品開発，メキシコ料理の販売やスペイン語講座の実施",
  },
  {
    name: "結農いわて",
    kana: null,
    category: "NEXT STEP工房",
    description: "援農を通して農家さんのリアルを学び，農業分野の課題解決に繋げる",
  },
];
