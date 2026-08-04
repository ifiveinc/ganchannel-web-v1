import { NavLink } from "react-router";
import { MdChevronRight } from "react-icons/md";
import adIFiveIcon from "~/assets/ifive-banner-icon.png";

// 全ページ共通の広告枠。下部固定ナビ（h-16 + border-t = 65px）の上に載せる。
//
// スマートフォンの表示領域を圧迫しないよう、高さは1行分（約56px）に抑える。
// 本文は truncate で1行に収め、詳細は遷移先（/ad-inquiry）で読ませる。
// 幅はコンテンツと同じ max-w-lg に合わせる（デザイン規約 §29-12）。
export default function Ad() {
  return (
    <div className="fixed inset-x-0 bottom-20 z-20 mx-auto w-full max-w-lg px-4">
      {/* NavLinkはaタグより再読み込みが軽い */}
      <NavLink
        to="/ad-inquiry"
        className="flex items-center gap-2 overflow-hidden rounded-card border border-border bg-surface shadow-card"
      >
        <img
          className="size-11 shrink-0 self-stretch object-contain"
          src={adIFiveIcon}
          alt=""
        />
        <div className="min-w-0 flex-1 py-1.5">
          <p className="text-xs font-bold leading-tight text-primary">
            【広告募集中】
          </p>
          <p className="truncate text-xs leading-tight text-ink-muted">
            企業PR・サークル・イベントの告知を募集しています
          </p>
        </div>
        <MdChevronRight
          size={20}
          aria-hidden
          className="mr-1 shrink-0 text-ink-muted"
        />
      </NavLink>
    </div>
  );
}
