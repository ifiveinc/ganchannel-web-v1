import { NavLink } from "react-router";
import adIFiveIcon from "~/assets/ifive-banner-icon.png";

//useEffectでスクロールの副作用を管理する
import{ useState, useEffect } from "react";

export default function Ad()
{
    //バナー表示するかのuseState
    const [ display, setdisplay ] = useState(true);
    //スクロール位置を記憶するuseState
    const [ positionY, setpositionY ] = useState(0);

    useEffect (() => {
        const Scroll = () =>{
         const currentScroll = window.scrollY;
         
         currentScroll > positionY ?
         (setdisplay(false)):(setdisplay(true))

         setpositionY(currentScroll);
        };
         window.addEventListener("scroll", Scroll);

        // コンポーネントが消えるときに監視を解除
         return () => {
            window.removeEventListener("scroll", Scroll);
         };
  }, [positionY]);



    return(
        //zで上に表示させる。
        //NavLinkはimport必須、aタグよりリロード時間が短縮
       <div className={`fixed bottom-22 h-22 z-20 bg-white w-full ring-1 ring-gray-300 text-black ${display ? "" : "invisible"}`}> 
       <NavLink to="/ad-inquiry" className="flex gap-3 bottom-24 h-22 w-full">
        <img className="bg-white w-18 h-22 ring-1 ring-gray-300" src={adIFiveIcon} />
        <div className="flex-col text-sm md:text-base">
            <p className="font-bold">
                【広告募集中】
            </p>
            <p>
                がんチャンネルでは、企業様のPRから、サークル・イベントの告知など様々な広告を募集しています！
            </p>
            <p className="font-bold">
                🔘 問い合わせはこちらから
            </p>

        </div>
       </NavLink>
       </div>
    );
}