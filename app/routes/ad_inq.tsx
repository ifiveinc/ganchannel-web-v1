import iFiveicon from "../components/news/iFiveicon.png";


export default function ad_inq(){


  return (
    <div>
        <div className="relative font-serif h-20 bg-green-800 text-4xl items-center flex justify-center">
            <a href="/" className="absolute left-4 ml-4">
                 <img className="rounded-full bg-white w-12 h-12" src={iFiveicon} alt="" />
            </a>
            問い合わせ
        </div>
          <div className="bg-white h-200 font-mono text-2xl text-black font-serif text-center pt-4">
            お問い合わせは
            <a href="mailto:developer.iFive@gmail.com" className="text-blue-600">
              こちら
            </a>     
            から、お気軽にご相談ください。<br/>
            （※リンクをクリックするとメールアプリへ移動します）
          </div>
    </div>
  );
};

