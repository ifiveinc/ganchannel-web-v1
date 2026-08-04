import { NavLink } from "react-router";
import adIFiveIcon from "~/assets/ifive-banner-icon.png";

export default function Ad()
{
    return(
        //zで上に表示させる。
        //NavLinkはimport必須、aタグよりリロード時間が短縮
        //下部固定ナビ（h-16 + border-t = 65px）の上に、余白を空けて載せる。
        //高さは固定せず中身に合わせる（固定するとテキストがはみ出してナビに重なる）
        //スクロール中も常に表示する（以前は下スクロールで非表示にしていた）
       <div className="fixed bottom-20 z-20 bg-white w-full ring-1 ring-gray-300 text-black md:hidden">
       <NavLink to="/ad-inquiry" className="flex gap-3 w-full">
        <img className="bg-white w-18 self-stretch object-contain ring-1 ring-gray-300" src={adIFiveIcon} alt="" />
        <div className="flex-col text-sm md:text-base py-1 pr-2">
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