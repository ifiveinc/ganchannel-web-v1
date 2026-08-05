import { useState } from "react";
import { Link, NavLink } from "react-router";
import { MdMenu, MdClose } from "react-icons/md";
import ganchannelIcon from "~/assets/ganchannel-icon.jpg";
import ganchannelLogo from "~/assets/ganchannel-logo.png";

// 先ほど作成したtsファイルを読み込む
import { HAMBURGER_NAV_ITEMS } from "./hamburger-nav-items"; 

export default function AppHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
        {/* 
          PCでリンクを横並びにするため、md:max-w-full で幅の制限を解除し、
          px-2 md:px-4 に変更して全体を左に詰めました。
        */}
        <div className="mx-auto flex h-14 w-full max-w-lg md:max-w-full items-center gap-4 px-2 md:px-4">
          {/* gap-2 → gap-1 に変更してアイコンとロゴの間隔を半分にしました */}
          <Link to="/" className="flex min-w-0 items-center gap-1">
            <img src={ganchannelIcon} alt="" className="h-8 w-auto shrink-0" />
            <img src={ganchannelLogo} alt="" className="h-8 w-auto shrink-0" />
          </Link>

          {/* ======== PC用ナビゲーション ======== */}
          {/* md以上で表示（flex）、モバイルでは非表示（hidden） */}
          <nav className="hidden md:flex ml-auto items-center gap-6">
            {HAMBURGER_NAV_ITEMS.map(({ label, to }) => (
              <NavLink
                key={label}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive
                      ? "text-primary font-bold"
                      : "text-ink-muted hover:text-primary"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ======== モバイル用ハンバーガーボタン ======== */}
          {/* md以上で非表示（md:hidden） */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            aria-label="メニューを開く"
            className="md:hidden ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-hover"
          >
            <MdMenu size={24} aria-hidden />
          </button>
        </div>
      </header>

      {/* ======== モバイル用ドロワーメニュー ======== */}
      {/* PCサイズではボタン自体が消えるので基本開かないが、念のため md:hidden を付与 */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
          <div className="h-full w-64 bg-surface p-4 shadow-overlay flex flex-col overflow-y-auto animate-in slide-in-from-right-full duration-200">
            
            <div className="flex justify-end mb-4">
              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                aria-label="メニューを閉じる"
                className="inline-flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-card hover:text-ink"
              >
                <MdClose size={28} aria-hidden />
              </button>
            </div>
            
            <nav className="flex flex-col gap-1">
              {HAMBURGER_NAV_ITEMS.map(({ label, to }) => (
                <NavLink
                  key={label}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-control px-4 py-3 transition-colors ${
                      isActive
                        ? "bg-primary-subtle font-bold text-primary"
                        : "text-ink hover:bg-surface-card"
                    }`
                  }
                >
                  <span className="text-base">{label}</span>
                </NavLink>
              ))}
            </nav>
            
          </div>
        </div>
      )}
    </>
  );
}