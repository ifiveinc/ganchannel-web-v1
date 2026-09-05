import { NavLink } from "react-router";
import { MdChevronRight } from "react-icons/md";
import adIFiveIcon from "~/assets/ifive-banner-icon.png";

export default function Ad()
{
    return(
        // bottom-20 から bottom-16に変更し、フッター（h-16）の真上にぴったりとくっつける
        <div className="fixed bottom-16 z-20 bg-white w-full ring-1 ring-gray-300 text-black md:hidden">
            <NavLink to="/ad-inquiry" className="flex items-center gap-3 w-full">
                <img className="bg-white w-18 self-stretch object-contain ring-1 ring-gray-300 shrink-0" src={adIFiveIcon} alt="" />
                
                <div className="flex-1 flex flex-col text-sm md:text-base py-2 pr-3">
                    <p className="font-bold">
                        【広告募集中】
                    </p>
                    <p className="text-xs text-ink-muted leading-relaxed my-0.5">
                        がんチャンネルでは、企業様のPRから、サークル・イベントの告知など様々な広告を募集しています！
                    </p>
                    
                    {/* 問い合わせの行に MdChevronRight を添えて「押せる感」をアップ */}
                    <div className="flex items-center justify-between font-bold text-primary text-xs mt-1">
                        <span>🔘 問い合わせはこちらから</span>
                        <MdChevronRight size={18} aria-hidden />
                    </div>
                </div>
            </NavLink>
        </div>
    );
}