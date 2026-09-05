// 事前生成FAQ 20件（docs/chat/spec.md §1-4、docs/decisions/0004-chatbot-architecture.md §4 カスケード第2段）。
// カテゴリーは docs/decisions/0004-chatbot-architecture.md §12 のサジェスト質問カテゴリー
// （サークル / キャンパス / お金のこと / 盛岡での暮らし / 学部えらび）と揃え、
// Phase 7（サジェスト質問UI）でもこのデータを再利用できるようにしている。
//
// app/data/faq-list.ts（既存のFAQページ用データ）とは対象読者・用途が異なるため、
// サークル関連の内容も含め新規に書き起こしている（faq-list.ts自体は変更しない）。
//
// matchKeywords はコード側のみで一致判定するためのキーワード（docs/decisions/0004-chatbot-architecture.md §5
// 「判断はコード側で行う」）。埋め込みAPIは使わない。1項目あたりのトークン数を絞り込み用に
// 少なくしているため、運用しながら実際の質問ログを見て調整する前提のデータである。

export type ChatbotFaqCategory =
  | "サークル"
  | "キャンパス"
  | "お金のこと"
  | "盛岡での暮らし"
  | "学部えらび";

export interface ChatbotFaqItem {
  id: string;
  category: ChatbotFaqCategory;
  question: string;
  answer: string;
  linkUrl?: string;
  /** マッチング用キーワード。すべてが質問文に含まれた場合に一致とみなす（AND条件） */
  matchKeywords: string[];
}

export const CHATBOT_FAQ_ITEMS: ChatbotFaqItem[] = [
  // ==========================================
  // サークル
  // ==========================================
  {
    id: "circle-how-to-join",
    category: "サークル",
    question: "サークルに入るにはどうしたらいいですか？",
    answer:
      "毎年4月に開催されるサークルオリエンテーションに参加するのがおすすめです。それ以外の時期でも、気になるサークルへ直接連絡すれば見学を受け付けてくれることが多いです。",
    matchKeywords: ["サークル", "入"],
  },
  {
    id: "circle-list-where",
    category: "サークル",
    question: "大学のサークル情報はどこで確認できますか？",
    answer:
      "岩手大学公式サイトのクラブ紹介ページで一覧を確認できます。サークルによってはSNSでも日々の活動を発信しています。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/activity/club.html",
    matchKeywords: ["サークル", "情報"],
  },
  {
    id: "circle-multiple",
    category: "サークル",
    question: "サークルは掛け持ちしてもいいですか？",
    answer:
      "サークルの掛け持ちに大学としての制限はありません。ただし活動日が重ならないか、各サークルのルールを事前に確認しておくと安心です。",
    matchKeywords: ["サークル", "掛け持ち"],
  },
  {
    id: "circle-register-request",
    category: "サークル",
    question: "自分のサークルをがんちゃんねるに載せてほしい",
    answer:
      "サークル情報収集用のフォームからご応募ください。フォームへのリンクはサークル情報ページの案内からご確認いただけます。",
    matchKeywords: ["サークル", "載せ"],
  },

  // ==========================================
  // キャンパス
  // ==========================================
  {
    id: "campus-classroom-location",
    category: "キャンパス",
    question: "講義室の場所が分からないときはどうすればいいですか？",
    answer:
      "岩手大学公式サイトの講義室配置図で確認できます。アイアシスタントのMy時間割からも講義室名を確認可能です。",
    linkUrl: "https://www.iwate-u.ac.jp/upload/kougishitsu.pdf",
    matchKeywords: ["講義室", "場所"],
  },
  {
    id: "campus-grades",
    category: "キャンパス",
    question: "成績はどこで確認できますか？",
    answer:
      "アイアシスタントからアクセスできるiFolioで確認できます。学内Wi-FiまたはVPN経由での接続が必要です。",
    linkUrl: "https://isic.iwate-u.ac.jp/tags/2",
    matchKeywords: ["成績", "確認"],
  },
  {
    id: "campus-map",
    category: "キャンパス",
    question: "学内施設の場所はどこで確認できますか？",
    answer: "大学公式サイトのキャンパスマップから確認できます。",
    linkUrl:
      "https://www.iwate-u.ac.jp/upload/014ed6ba1f94fbc41b895031dae908a1_1.png",
    matchKeywords: ["施設", "場所"],
  },
  {
    id: "campus-life-faq",
    category: "キャンパス",
    question: "学生生活で困ったことがあるときはどこに相談すればいいですか？",
    answer:
      "大学公式サイトの「学生生活Q&A」に多くの相談事例と回答がまとまっています。個別の相談は学生センターでも受け付けています。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/guide/faq.html",
    matchKeywords: ["相談", "学生生活"],
  },

  // ==========================================
  // お金のこと
  // ==========================================
  // riskLevel B（docs/decisions/0004-chatbot-architecture.md §7）に準じ、金額・条件・期限は断定せず
  // 制度の存在のみを案内し、公式ページへ誘導する
  {
    id: "money-scholarship",
    category: "お金のこと",
    question: "奨学金にはどんな種類がありますか？",
    answer:
      "日本学生支援機構の奨学金をはじめ、いくつかの経済支援制度があります。制度ごとに条件・金額が異なるため、詳細は大学公式サイトでご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/fee/scholarship.html",
    matchKeywords: ["奨学金"],
  },
  {
    id: "money-tuition-exemption",
    category: "お金のこと",
    question: "授業料の免除制度はありますか？",
    answer:
      "入学料・授業料の免除および徴収猶予制度があります。条件や申請時期は大学公式サイトでご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/fee/exemption.html",
    matchKeywords: ["授業料", "免除"],
  },
  {
    id: "money-circle-fee",
    category: "お金のこと",
    question: "サークルの費用はどれくらいかかりますか？",
    answer:
      "サークルによって年会費や活動費は様々です。各サークルの詳細ページ、または直接サークルへの問い合わせでご確認ください。",
    matchKeywords: ["サークル", "費用"],
  },
  {
    id: "money-parttime-job",
    category: "お金のこと",
    question: "アルバイトはできますか？",
    answer:
      "岩手大学生活協同組合でアルバイトの紹介を行っています（新入生は9月以降の紹介）。詳細は大学公式サイトをご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/guide/part-time-job.html",
    matchKeywords: ["アルバイト"],
  },

  // ==========================================
  // 盛岡での暮らし
  // ==========================================
  {
    id: "living-apartment",
    category: "盛岡での暮らし",
    question: "一人暮らしの部屋はどうやって探せばいいですか？",
    answer:
      "大学生協のアパート紹介サービスを利用できます。詳細は大学公式サイトでご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/guide/apartment.html",
    matchKeywords: ["部屋", "探"],
  },
  {
    id: "living-bicycle",
    category: "盛岡での暮らし",
    question: "大学に通うのに自転車は必要ですか？",
    answer:
      "住む場所によって必要性は変わりますが、大学周辺は自転車通学の学生が多いです。部屋探しの際に大学までの距離もあわせて確認しておくとよいでしょう。",
    matchKeywords: ["自転車"],
  },
  {
    id: "living-recommend-spot",
    category: "盛岡での暮らし",
    question: "盛岡のおすすめスポットはありますか？",
    answer:
      "盛岡は徒歩圏内に城跡公園や中津川沿いの散策路があり、市内中心部までのアクセスも良好です。サークル活動や友人との交流を通じて、自分に合ったお気に入りの場所を見つけてみてください。",
    matchKeywords: ["盛岡", "おすすめ"],
  },
  {
    id: "living-supermarket",
    category: "盛岡での暮らし",
    question: "大学周辺のスーパーはどこにありますか？",
    answer:
      "大学周辺には複数のスーパーがあります。入学後、キャンパス周辺を実際に歩いて確認するのがおすすめです。学生生活ガイドもあわせてご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/campus/guide/faq.html",
    matchKeywords: ["スーパー"],
  },

  // ==========================================
  // 学部えらび
  // ==========================================
  {
    id: "faculty-when-decide",
    category: "学部えらび",
    question: "学部はいつまでに決める必要がありますか？",
    answer:
      "岩手大学では出願時に学部・学科を選択します。学部選びに迷う場合は、大学公式サイトの学部紹介やオープンキャンパスを参考にしてください。",
    linkUrl: "https://www.iwate-u.ac.jp/academics/index.html",
    matchKeywords: ["学部", "決め"],
  },
  {
    id: "faculty-transfer",
    category: "学部えらび",
    question: "入学後に学部を変更することはできますか？",
    answer:
      "転学部の可否や条件は所属学部によって異なります。詳細は所属学部の教務担当窓口にご確認ください。",
    matchKeywords: ["学部", "変更"],
  },
  {
    id: "faculty-feature",
    category: "学部えらび",
    question: "各学部の特色を知りたいです",
    answer:
      "興味のあるキーワードから学部・学科等を探せるページが大学公式サイトにあります。各学部のホームページもあわせてご確認ください。",
    linkUrl:
      "https://www.iwate-u.ac.jp/academics/undergraduate/faculty-suggestion.html",
    matchKeywords: ["学部", "特色"],
  },
  {
    id: "faculty-open-campus",
    category: "学部えらび",
    question: "オープンキャンパスはいつ開催されますか？",
    answer:
      "毎年、大学公式サイトでオープンキャンパスの開催情報が案内されます。最新の日程は公式ページでご確認ください。",
    linkUrl: "https://www.iwate-u.ac.jp/admission/iwateuniv/open-campus.html",
    matchKeywords: ["オープンキャンパス"],
  },
];
