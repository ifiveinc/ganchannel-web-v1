import { Link, NavLink } from "react-router";
import { MdMenu } from "react-icons/md";
import iFiveIcon from "~/assets/ifive-icon.png";
import { CIRCLE_NAV_ITEMS } from "./circle-nav-items";

type CircleHeaderProps = {
  title: string;
};

// 機能内の上部固定ヘッダー（デザイン規約 §19.1）。
// md:以上では上部ナビを表示し、下部固定ナビとは排他にする。
export default function CircleHeader({ title }: CircleHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-2 px-4">
        {/* アイコンはがんちゃんねる本体のTOPへ戻る導線 */}
        <Link
          to="/"
          aria-label="がんちゃんねるのTOPへ戻る"
          className="flex shrink-0 items-center rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <img src={iFiveIcon} alt="" className="h-8 w-auto" />
        </Link>

        {/* ページの見出し（h1）は各画面が持つため、ここは見出しにしない（規約 §24.1） */}
        <p className="min-w-0 flex-1 truncate text-center text-base font-bold text-primary">
          {title}
        </p>

        {/* 上部ナビ：md以上でのみ表示（下部固定ナビと同じ項目・同じ並び順） */}
        <nav
          aria-label="サークル情報メニュー"
          className="hidden md:flex md:items-center md:gap-1"
        >
          {CIRCLE_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex min-h-11 items-center rounded-control px-2 text-sm ${
                  isActive ? "font-bold text-primary" : "text-ink-muted"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* TODO: ハンバーガーメニューは未実装（デザイン規約 §29-11）。
            中身が決まるまで無効状態で置く */}
        <button
          type="button"
          disabled
          aria-label="メニュー（準備中）"
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MdMenu size={24} aria-hidden />
        </button>
      </div>
    </header>
  );
}
