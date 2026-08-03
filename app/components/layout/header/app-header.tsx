import { Link } from "react-router";
import { MdMenu } from "react-icons/md";
import iFiveIcon from "~/assets/ifive-icon.png";

// アプリ全体の上部固定ヘッダー（デザイン規約 §19.1）。
// 機能ページ（circle-info 等）は機能内のヘッダーを持つため、そちらを使う。
export default function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-2 px-4">
        <Link to="/" className="flex min-w-0 items-center gap-2">
          <img src={iFiveIcon} alt="" className="h-8 w-auto shrink-0" />
          <span className="truncate text-base font-bold text-primary">
            がんちゃんねる
          </span>
        </Link>

        {/* TODO: ハンバーガーメニューは未実装（デザイン規約 §29-11）。
            中身が決まるまで無効状態で置く */}
        <button
          type="button"
          disabled
          aria-label="メニュー（準備中）"
          className="ml-auto inline-flex size-11 shrink-0 items-center justify-center rounded-full text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          <MdMenu size={24} aria-hidden />
        </button>
      </div>
    </header>
  );
}
