import { useEffect } from "react";
import { NavLink } from "react-router";
import { MdClose } from "react-icons/md";
import { HAMBURGER_NAV_ITEMS } from "./hamburger-nav-items";

type MenuDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  /** md:以上で隠すか（上部ナビが同じ項目を担当するヘッダーで true） */
  hideOnDesktop?: boolean;
};

// 全機能への入口となるドロワー（デザイン規約 §19.3）。
// ヘッダーごとにボタンの置き方は違うため、パネル部分だけを共通化する。
export default function MenuDrawer({
  isOpen,
  onClose,
  hideOnDesktop = false,
}: MenuDrawerProps) {
  // 閉じる手段を2つ以上用意する（規約 §19.3）。ここでは背景タップとEscを担当する
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 z-50 flex justify-end bg-ink/40 backdrop-blur-sm ${
        hideOnDesktop ? "md:hidden" : ""
      }`}
    >
      <div
        id="menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="メニュー"
        // 背景タップだけを閉じる操作にし、パネル内のタップでは閉じない
        onClick={(event) => event.stopPropagation()}
        className="animate-in slide-in-from-right-full flex h-full w-64 flex-col overflow-y-auto bg-surface p-4 shadow-overlay duration-200"
      >
        <div className="mb-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            aria-label="メニューを閉じる"
            className="inline-flex size-11 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-surface-card hover:text-ink"
          >
            <MdClose size={28} aria-hidden />
          </button>
        </div>

        <nav aria-label="全機能" className="flex flex-col gap-1">
          {HAMBURGER_NAV_ITEMS.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              onClick={onClose}
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
  );
}
