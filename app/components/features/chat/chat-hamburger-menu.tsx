import { useState } from "react";
import { NavLink } from "react-router";
import { MdClose, MdMenu } from "react-icons/md";
import { HAMBURGER_NAV_ITEMS } from "~/components/layout/header/hamburger-nav-items";

// チャット画面のハンバーガーメニュー。AppHeaderのドロワーメニューと同じ項目・見た目を
// 使う（AppHeader側は共通ヘッダーを持たないchat.tsxには出せないため、同じ内容を
// ここに複製している）。他画面のハンバーガーが機能するようになった一方でこちらは
// 無効状態のまま取り残されていたため対応した（2026-08-05）。
export default function ChatHamburgerMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="メニューを開く"
        className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-card"
      >
        <MdMenu size={24} aria-hidden />
      </button>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm">
          <div className="flex h-full w-64 flex-col overflow-y-auto bg-surface p-4 shadow-overlay">
            <div className="mb-4 flex justify-end">
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
