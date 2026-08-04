import { NavLink } from "react-router";
import type { IconType } from "react-icons";

export type BottomNavItem = {
  label: string;
  to: string;
  /** 前方一致ではなく完全一致でアクティブ判定するか */
  end: boolean;
  icon: IconType;
};

type BottomNavProps = {
  items: BottomNavItem[];
  /** 複数のナビが同一ページに存在しても区別できるようにする */
  ariaLabel: string;
  /** md:以上で隠すか（上部ナビが同じ項目を担当する画面で true） */
  hideOnDesktop?: boolean;
};

// 下部固定ナビ（デザイン規約 §19.2）。
// アプリ全体・機能内のどちらでも使う共通コンポーネントで、項目だけを差し替える。
export default function BottomNav({
  items,
  ariaLabel,
  hideOnDesktop = false,
}: BottomNavProps) {
  return (
    <nav
      aria-label={ariaLabel}
      className={`fixed inset-x-0 bottom-0 z-10 border-t border-border bg-surface md:hidden ${
        hideOnDesktop ? "md:hidden" : ""
      }`}
    >
      <ul className="mx-auto flex h-16 w-full max-w-lg items-stretch">
        {items.map(({ label, to, end, icon: Icon }) => (
          <li key={label} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `relative flex h-full w-full flex-col items-center justify-center gap-1 ${
                  isActive ? "font-bold text-primary" : "text-ink-muted"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* アクティブ表示は色だけに頼らず、上部のバーでも示す（規約 §3.2） */}
                  {isActive && (
                    <span
                      aria-hidden
                      className="absolute inset-x-6 top-0 h-1 rounded-full bg-primary"
                    />
                  )}
                  <Icon size={24} aria-hidden />
                  <span className="text-xs leading-none">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}