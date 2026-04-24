import { useState } from "react";
import iFiveicon from "../components/news/iFiveicon.png";

{/*講義、成績関係の配列*/}
{/* 配列サンプル
  { 
    id: "",

    category: ""

    items: [

    {
    question: "",
    answer: (
      <>
      </>
    ),
    keywords: ""
    },

   ]
  }
  */}
const faqList = [
{
  id: "category1",
  category: "講義、成績関係",
  items:[
  {
    question: "講義の詳細はどこで確認できる？",
    answer: (
      <>
        アイアシスタントのシラバスで講義名を検索すれば講義内容やレポート、試験の配点、オンデマンドの実施などの詳細を確認できます。
      </>
    ),
    keywords: "アイアシスタント シラバス 講義内容 レポート 試験の配点 オンデマンド"
  },
  {
    question: "履修申告期間を過ぎた後に訂正、取り消しをしたい",
    answer: (
      <>
        履修申告期間後に履修申告訂正期間、履修申告取り消し期間があるので、それらの期間中に履修の訂正、取り消しをアイアシスタントから申告してください。<br/>
        訂正期間の日程はアイアシスタントのMy時間割にある学年歴から確認することができます。
      </>
    ),
    keywords: "履修申告期間後 履修申告訂正期間 履修申告取り消し期間 履修の訂正、取り消し アイアシスタント 訂正期間 日程 アイアシスタント My時間割 学年歴"
  },
  {
    question: "集中講義の履修登録方法とかどこで確認できる？",
    answer: (
      <>
        講義の詳細が決まり次第、開講時期や履修方法がアイアシスタントのお知らせに表示されます。
      </>
    ),
    keywords: "講義 開講時期 履修方法 アイアシスタント"
  },
  {
    question: "講義室の場所が分からない",
    answer: (
      <>
        以下のリンクから調べることができます。<br/>
        <a href="https://www.iwate-u.ac.jp/upload/kougishitsu.pdf" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/upload/kougishitsu.pdf
        </a>
      </>
    ),
    keywords: "リンク"
  },
  {
    question: "受講する講義の講義室名や場所をすぐに確認できる所はある？",
    answer: (
      <>
        講義室名はアイアシスタントのMy時間割から、講義室の場所は時間割の下にある「講義配置図へ」のリンクから確認することができます。
      </>
    ),
    keywords: "講義室名 アイアシスタント My時間割 講義室 場所 講義配置図"
  },
  {
    question: "オンデマンド講義で使うTeamsの参加方法は？",
    answer: (
      <>
        Teamsでの参加方法は以下のリンクを参照してください。<br/>
        <a href="https://isic.iwate-u.ac.jp/info/remote" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://isic.iwate-u.ac.jp/info/remote
        </a>
      </>
    ),
    keywords: "Teams teams 参加方法"
  },
  {
    question: "講義内容についていけない、難しいときはどうすればいい？",
    answer: (
      <>
        岩手大学には学習支援室があるので、そちらを利用してみてはいかがでしょうか。<br/>
        学習支援室のリンクです↓<br/>
        <a href="https://sites.google.com/iwate-u.ac.jp/lsr/info?authuser=0" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://sites.google.com/iwate-u.ac.jp/lsr/info?authuser=0
        </a>
      </>
    ),
    keywords: "学習支援室"
  },
  {
    question: "地震とかの災害が起きたとき、休講情報はどこで確認できるの？",
    answer: (
      <>
      アイアシスタントを確認してください。
      </>
    ),
    keywords: "アイアシスタント"
  },
  {
    question: "成績はどこで、どうやって確認することができるの？",
    answer: (
      <>
        アイアシスタントからアクセスできるiFolioから確認可能です。<br/>
        なお、接続するには大学内のwi-fiか、VPNを経由する必要があります。<br/>
        VPNの接続方法はこちらから↓<br/>
        <a href="https://isic.iwate-u.ac.jp/tags/2" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://isic.iwate-u.ac.jp/tags/2
        </a>
      </>
    ),
    keywords: "アイアシスタント iFolio  接続 VPN"
  },
  {
    question: "単位数が本当に足りているかよく分からない。どこで確認すればいいの？",
    answer: (
      <>
        iFolioに取得単位数が載っているので、それを見ながら計算してください。<br/>
        もし分からなければ、学生センター3番（人社・教育）、4番（理工・農）、5番（一般教養・地域創生専攻）に行ってください。
      </>
    ),
   keywords: "iFolio 取得単位数 学生センター"
  }
 ]
},
{
  id: "category2",
  category:"学内施設",
  items:[
    {
    question: "学内施設の場所や名称はどうやって確認できますか",
    answer: (
      <>
        大学のキャンパスマップはこちらから確認できます。<br/>
        <a href="https://www.iwate-u.ac.jp/upload/014ed6ba1f94fbc41b895031dae908a1_1.png" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/upload/014ed6ba1f94fbc41b895031dae908a1_1.png
        </a>
      </>
    ),
    keywords: "キャンパスマップ"
  },
  {
    question: "学生が使用可能は施設はどうやって確認できますか？",
    answer: (
      <>
      がんちゃんねるでは、各施設の予約状況が見れる機能を準備中です！
      </>
    ),
    keywords: "各施設 予約状況 準備中"
  }
 ]
},
{
    id: "category3",
    category:"進学、就職",
    items:[
    {
    question: "大学院入試について詳しく知りたい",
    answer: (
      <>
      岩手大学HPの大学院入試要領を確認してください。<br/>
        <a href="https://www.iwate-u.ac.jp/admission/graduate/info.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/admission/graduate/info.html
        </a>
      </>
    ),
    keywords: "HP 大学院入試要領"
  },
  {
    question: "岩手大学の大学院入試を受ける場合、TOEICは何点あるのが望ましいですか？",
    answer: (
      <>
      大学院入試要項をご確認ください。<br/>
        <a href="https://www.iwate-u.ac.jp/admission/graduate/info.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/admission/graduate/info.html
        </a>
      </>
    ),
    keywords: "大学院入試要項"
  },

  {
    question: "インターンシップ、求人情報はどこで確認できるの？",
    answer: (
      <>
      企業公式情報やハローワーク・民間サービスを利用する他、岩大生が利用できる岩手大学キャリアサポートナビには、企業から岩手大学に届いたインターンシップ、求人情報が載っています。<br/>
        <a href="https://www.iwate-u.ac.jp/career/students/index.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/career/students/index.html
        </a><br/>
      ほかにも気になることがあれば、岩手大学キャリアサポートルームに相談することができます。<br/>
      また、各学部棟の掲示板にも就職関連情報が掲載されているので確認してみてください！
      </>
    ),
    keywords: "企業情報 ハローワーク 民間サービス キャリアサポートナビ キャリアサポートルーム インターン 就職 就活"
  },

  {
    question: "面接練習をはじめとした就職対策はどこでできるの？",
    answer: (
      <>
      大学構内にあるキャリア相談室で、キャリアアドバイザーによる個別キャリア相談があり、そこで就職対策をすることができます。<br/>
      キャリア相談は事前予約制なので、キャリアサポートナビから予約する必要があります。<br/>
      キャリア相談の詳細はこちらから↓<br/>
        <a href="https://www.iwate-u.ac.jp/career/students/index.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/career/students/index.html
        </a><br/>
      キャリアサポートナビはこちらからログインできます。<br/>
        <a href="https://idp.cc.iwate-u.ac.jp/idp/profile/SAML2/Redirect/SSO?execution=e2s1" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://idp.cc.iwate-u.ac.jp/idp/profile/SAML2/Redirect/SSO?execution=e2s1
        </a>
      </>
    ),
    keywords: "キャリアサポートナビ 就職 就活 キャリア相談 予約"
  },

  {
    question: "進路について相談したいことがあるんだけど、誰かに相談できる？",
    answer: (
      <>
      キャリア相談で進路相談をはじめとした就職、キャリアに関することについて相談することができます。
      キャリア相談の詳細はこちらから確認できます。<br/>
        <a href="https://www.iwate-u.ac.jp/career/students/index.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/career/students/index.html
        </a><br/>
      </>
    ),
    keywords: "キャリアサポートナビ 就職 就活"
  },
  
  ]
},

  { 
    id: "catogory",

    category: "サークル",

    items: [

    {
    question: "サークルに入るためにはどうしたらいいですか？",
    answer: (
      <>
      毎年4月にサークルオリエンテーションが開催されるので参加してみてください。<br/>
      それ以外の時期でも、入りたいサークルに連絡してみると歓迎してくれるかもしれません。
      </>
    ),
    keywords: "サークル オリエンテーション 参加"
    },

    {
    question: "大学のサークル情報はどこから確認できる？",
    answer: (
      <>
      こちらから確認することができます。<br/>
        <a href="https://www.iwate-u.ac.jp/campus/activity/club.html" className="text-blue-600 hover:text-blue-800 hover:underline break-all" target="_blank" rel="noopener noreferrer">
          https://www.iwate-u.ac.jp/campus/activity/club.html
        </a><br/>
      サークルによってはSNSを利用しているので、そちらを調べると、日々の活動の様子などの詳しい情報を知ることができます。
      </>
    ),
    keywords: ""
    },
   ]
  }
]


export default function faq() {
  //検索フォームに入力された文字をUseStateで保持
  const[Search, setSearch] = useState("");

  //データをキーワードで絞り込む作業
  //mapの第1引数(section)は配列の中身{}を順に取り出している
  const filteredFaqList = faqList.map(section => {
    //itemsをfilter
    const filteredItems = section.items.filter(item => {

    //questionとkeywordsを合体、空文字""を加えることで文字が合体するのを阻止
    //item.keywords ||(OR) "" でkeywordsが未設定の場合undifinedとなりエラーが出るのを防ぐ
    //toLowerCaseで小文字に統一する
    const targetText = (item.question + "" + (item.keywords || "")).toLowerCase();

    //includesでSearch内にtargetTextが含まれるならtureを、ないならfalseを返す
    //戻り値ture,falseを文字として配列に返さないのはfilterメゾットの場合、
    //データとして保存せずに真偽判定として使うから（元データの加工ができない）
    return targetText.includes(Search.toLocaleLowerCase())
    });

    //真偽判定後のitemsの配列の戻り値を作成
    return{
      id: section.id,
      category: section.category,
      items: filteredItems
      //検索結果が0のときはカテゴリーごと取り除く
    };}).filter(section => section.items.length > 0);
  
  
  return (
    <div>
      {/*relativeは座標系の親要素absoluteは子要素*/}
      <div className="relative font-serif h-20 bg-green-800 text-6xl items-center flex justify-center">
       <a href="/" className="absolute left-4 ml-4">
        <img className="rounded-full bg-white w-10 h-10" src={iFiveicon} alt="" />
       </a>
      {/*<span>は改行しないインライン要素*/}
       <div>
        Q<span className= "text-5xl ">&</span>A
       </div>

      {/* 検索フォーム */}
      <input
          type="text"
          placeholder="キーワード検索..."
          className="absolute right-4 text-base text-black p-2 bg-green-100 rounded-md h-8 w-32 md:w-50 font-sans focus:outline-none focus:ring-2 focus:ring-gray-700"
          value={Search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>



      {/*pは要素の内側に余白 mは外側に余白 outsideで改行位置を揃える*/}
      <div className="bg-white text-black p-4 min-h-screen">
        {/* mapとidを使って各カテゴリーのリンクを作成 */}
        <div className="flex">
        {filteredFaqList.map((section) =>(
          <div className="mb-2 mx-2 text-center font-mono bg-green-200 p-1 w-35 rounded-md ring-2 ring-gray-500">
            <a href={`#${section.id}`}>
              {section.category}
            </a>
          </div>
        ))}
        </div>

        {/*<div className="mb-6 bg-green-50 p-2 rounded-md ring-1 ring-gray-200">
         <a href="#category1">・ 講義、成績関係</a>
         <a href="#category2">・ 学内施設</a>
         <a href="#category3">・ 進学、就職</a>
        </div>*/}

        {/* 2重構造のmapで配列のデータを表示 */}
        {/* reactでmapを使うにはkeyの定義が必須 */}
        {/* mb-10でカテゴリーごとの間隔をあける */}
        {/* 参考演算子を使う(条件式 ? 条件がtrueの場合の処理 : 条件がfalseの場合の処理) */}
 
        {filteredFaqList.length > 0 ? (
          filteredFaqList.map((section, sectionIndex) => (
          <div id={section.id} key={sectionIndex} className="mb-10 scroll-mt-1"> 
            <div className="h-1 bg-green-600 -mx-4 mb-2"></div>
            {/* カテゴリー名の表示 */}
            <div className="text-[1.6rem] font-bold mb-2 font-mono">
            ・{section.category}
            </div>

            {/* 2層目のmap: そのカテゴリーの中のQ&Aを取り出す */}         
            {section.items.map((item, itemIndex) => (
              <div key={itemIndex} className="mb-6 bg-green-50 p-2 rounded-md ring-1 ring-gray-300">
                <details>
                  <summary className="text-2xl font-bold list-outside ml-5 marker:text-green-800 cursor-pointer">
                    {item.question}
                  </summary>
                  <div className="text-xl ml-5 mt-2 font-arial">
                    {item.answer}
                  </div>
                </details>
              </div>
            ))}
          </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-10 text-xl">
            「{Search}」に一致する質問は見つかりませんでした。
          </div>
        )}
      </div>
    </div>
  );
}
