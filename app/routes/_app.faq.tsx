import { useState } from "react";
import iFiveIcon from "~/assets/ifive-icon.png";

import { faqList } from "~/data/faq/faq-list";


export default function Faq() {
  //検索フォームに入力された文字をUseStateで保持
  const[Search, setSearch] = useState("");

  // 【追加】faqList.tsのフラットなデータを、元の2階層構造（カテゴリーごとの配列）に変換
  const groupedFaqList = Object.values(
    faqList.reduce((acc, item) => {
      if (!acc[item.categoryId]) {
        acc[item.categoryId] = {
          id: item.categoryId,
          category: item.categoryName,
          items: [],
        };
      }
      acc[item.categoryId].items.push({
        question: item.question,
        answer: item.answerText, // 配列として保持
        keywords: item.keywords,
        linkUrl: item.linkUrl,   // 新しくリンクも保持
      });
      return acc;
    }, {} as Record<string, { id: string; category: string; items: any[] }>)
  );

  //データをキーワードで絞り込む作業
  //mapの第1引数(section)は配列の中身{}を順に取り出している
  const filteredFaqList = groupedFaqList.map(section => {
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
        <img className="rounded-full bg-white w-12 h-12" src={iFiveIcon} alt="" />
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
          <div className="mb-2 mx-2 text-sm md:text-lg text-center font-mono bg-green-200 p-1 w-35 rounded-md ring-2 ring-gray-500">
            <a href={`#${section.id}`}>
              {section.category}
            </a>
          </div>
        ))}
        </div>

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
                    {/* 【変更】answerTextは配列なので、mapを使って改行（pタグ）として表示 */}
                    {item.answer.map((text: string, i: number) => (
                      <p key={i} className="mb-1">{text}</p>
                    ))}
                    {/* 【追加】linkUrlが存在する場合のみリンクを表示する */}
                    {item.linkUrl && (
                      <a href={item.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all mt-2 inline-block">
                        {item.linkUrl}
                      </a>
                    )}
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
