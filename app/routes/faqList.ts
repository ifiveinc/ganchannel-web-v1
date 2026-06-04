// faqList.ts

// 1. 型定義
export type FaqItem = {
  categoryId: string;     // アンカーリンク（ページ内ジャンプ）用
  categoryName: string;   // カテゴリーの表示名
  question: string;
  answerText: string[];
  linkUrl?: string;
  keywords: string;
};

// 2. データ（すべてのキーを "" で囲んでいます）
export const faqList: FaqItem[] = [
  // ==========================================
  // カテゴリー1：講義関係
  // ==========================================
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "講義の詳細はどこで確認できる？",
    "answerText": [
      "アイアシスタントのシラバスで講義名を検索すれば講義内容やレポート、試験の配点、オンデマンドの実施などの詳細を確認できます。"
    ],
    "keywords": "アイアシスタント シラバス 講義内容 レポート 試験の配点 オンデマンド"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "履修申告期間を過ぎた後に訂正、取り消しをしたい",
    "answerText": [
      "履修申告期間後に履修申告訂正期間、履修申告取り消し期間があるので、それらの期間中に履修の訂正、取り消しをアイアシスタントから申告してください。",
      "訂正期間の日程はアイアシスタントのMy時間割にある学年歴から確認することができます。"
    ],
    "keywords": "履修申告期間後 履修申告訂正期間 履修申告取り消し期間 履修の訂正、取り消し アイアシスタント 訂正期間 日程 アイアシスタント My時間割 学年歴"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "集中講義の履修登録方法とかどこで確認できる？",
    "answerText": [
      "講義の詳細が決まり次第、開講時期や履修方法がアイアシスタントのお知らせに表示されます。"
    ],
    "keywords": "講義 開講時期 履修方法 アイアシスタント"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "講義室の場所が分からない",
    "answerText": [
      "以下のリンクから調べることができます。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/upload/kougishitsu.pdf",
    "keywords": "リンク"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "受講する講義の講義室名や場所をすぐに確認できる所はある？",
    "answerText": [
      "講義室名はアイアシスタントのMy時間割から、講義室の場所は時間割の下にある「講義配置図へ」のリンクから確認することができます。"
    ],
    "keywords": "講義室名 アイアシスタント My時間割 講義室 場所 講義配置図"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "オンデマンド講義で使うTeamsの参加方法は？",
    "answerText": [
      "Teamsでの参加方法は以下のリンクを参照してください。"
    ],
    "linkUrl": "https://isic.iwate-u.ac.jp/info/remote",
    "keywords": "Teams teams 参加方法"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "講義内容についていけない、難しいときはどうすればいい？",
    "answerText": [
      "岩手大学には学習支援室があるので、そちらを利用してみてはいかがでしょうか。",
      "学習支援室のリンクです↓"
    ],
    "linkUrl": "https://sites.google.com/iwate-u.ac.jp/lsr/info?authuser=0",
    "keywords": "学習支援室"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "地震とかの災害が起きたとき、休講情報はどこで確認できるの？",
    "answerText": [
      "アイアシスタントを確認してください。"
    ],
    "keywords": "アイアシスタント"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "成績はどこで、どうやって確認することができるの？",
    "answerText": [
      "アイアシスタントからアクセスできるiFolioから確認可能です。",
      "なお、接続するには大学内のwi-fiか、VPNを経由する必要があります。",
      "VPNの接続方法はこちらから↓"
    ],
    "linkUrl": "https://isic.iwate-u.ac.jp/tags/2",
    "keywords": "アイアシスタント iFolio  接続 VPN"
  },
  {
    "categoryId": "category1",
    "categoryName": "講義関係",
    "question": "単位数が本当に足りているかよく分からない。どこで確認すればいいの？",
    "answerText": [
      "iFolioに取得単位数が載っているので、それを見ながら計算してください。",
      "もし分からなければ、学生センター3番（人社・教育）、4番（理工・農）、5番（一般教養・地域創生専攻）に行ってください。"
    ],
    "keywords": "iFolio 取得単位数 学生センター"
  },

  // ==========================================
  // カテゴリー2：学内施設
  // ==========================================
  {
    "categoryId": "category2",
    "categoryName": "学内施設",
    "question": "学内施設の場所や名称はどうやって確認できますか",
    "answerText": [
      "大学のキャンパスマップはこちらから確認できます。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/upload/014ed6ba1f94fbc41b895031dae908a1_1.png",
    "keywords": "キャンパスマップ"
  },
  {
    "categoryId": "category2",
    "categoryName": "学内施設",
    "question": "学生が使用可能は施設はどうやって確認できますか？",
    "answerText": [
      "がんちゃんねるでは、各施設の予約状況が見れる機能を準備中です！"
    ],
    "keywords": "各施設 予約状況 準備中"
  },

  // ==========================================
  // カテゴリー3：進学、就職
  // ==========================================
  {
    "categoryId": "category3",
    "categoryName": "進学、就職",
    "question": "大学院入試について詳しく知りたい",
    "answerText": [
      "岩手大学HPの大学院入試要領を確認してください。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/admission/graduate/info.html",
    "keywords": "HP 大学院入試要領"
  },
  {
    "categoryId": "category3",
    "categoryName": "進学、就職",
    "question": "岩手大学の大学院入試を受ける場合、TOEICは何点あるのが望ましいですか？",
    "answerText": [
      "大学院入試要項をご確認ください。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/admission/graduate/info.html",
    "keywords": "大学院入試要項"
  },
  {
    "categoryId": "category3",
    "categoryName": "進学、就職",
    "question": "インターンシップ、求人情報はどこで確認できるの？",
    "answerText": [
      "企業公式情報やハローワーク・民間サービスを利用する他、岩大生が利用できる岩手大学キャリアサポートナビには、企業から岩手大学に届いたインターンシップ、求人情報が載っています。",
      "ほかにも気になることがあれば、岩手大学キャリアサポートルームに相談することができます。",
      "また、各学部棟の掲示板にも就職関連情報が掲載されているので確認してみてください！"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/career/students/index.html",
    "keywords": "企業情報 ハローワーク 民間サービス キャリアサポートナビ キャリアサポートルーム インターン 就職 就活"
  },
  {
    "categoryId": "category3",
    "categoryName": "進学、就職",
    "question": "面接練習をはじめとした就職対策はどこでできるの？",
    "answerText": [
      "大学構内にあるキャリア相談室で、キャリアアドバイザーによる個別キャリア相談があり、そこで就職対策をすることができます。",
      "キャリア相談は事前予約制なので、キャリアサポートナビから予約する必要があります。",
      "キャリア相談の詳細や、キャリアサポートナビへのログインはこちらから確認できます。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/career/students/index.html",
    "keywords": "キャリアサポートナビ 就職 就活 キャリア相談 予約"
  },
  {
    "categoryId": "category3",
    "categoryName": "進学、就職",
    "question": "進路について相談したいことがあるんだけど、誰かに相談できる？",
    "answerText": [
      "キャリア相談で進路相談をはじめとした就職、キャリアに関することについて相談することができます。",
      "キャリア相談の詳細はこちらから確認できます。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/career/students/index.html",
    "keywords": "キャリアサポートナビ 就職 就活"
  },

  // ==========================================
  // カテゴリー4：サークル
  // ==========================================
  {
    "categoryId": "category4",
    "categoryName": "サークル",
    "question": "サークルに入るためにはどうしたらいいですか？",
    "answerText": [
      "毎年4月にサークルオリエンテーションが開催されるので参加してみてください。",
      "それ以外の時期でも、入りたいサークルに連絡してみると歓迎してくれるかもしれません。"
    ],
    "keywords": "サークル オリエンテーション 参加"
  },
  {
    "categoryId": "category4",
    "categoryName": "サークル",
    "question": "大学のサークル情報はどこから確認できる？",
    "answerText": [
      "こちらから確認することができます。",
      "サークルによってはSNSを利用しているので、そちらを調べると、日々の活動の様子などの詳しい情報を知ることができます。"
    ],
    "linkUrl": "https://www.iwate-u.ac.jp/campus/activity/club.html",
    "keywords": "SNS 活動 情報"
  }
];