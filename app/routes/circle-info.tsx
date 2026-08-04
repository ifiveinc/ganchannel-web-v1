import { Outlet, useLocation } from "react-router";
import CircleHeader from "~/components/features/circle-info/circle-header";
import BottomNav from "~/components/layout/bottom-nav/bottom-nav";
import { CIRCLE_NAV_ITEMS } from "~/components/features/circle-info/circle-nav-items";

// パスごとのヘッダータイトル（docs/circle-info/spec.md §2.1）
function resolveTitle(pathname: string): string {
  if (pathname.startsWith("/circle-info/search")) return "サークルを探す";
  if (pathname.startsWith("/circle-info/favorites")) return "気になる";
  return "サークル情報";
}

// circle-info 機能の共通レイアウト。
// ヘッダーと機能内ナビを持ち、配下の各画面を <Outlet /> に描画する。
export default function CircleInfoLayout() {
  const { pathname } = useLocation();

  return (
    <>
      <CircleHeader title={resolveTitle(pathname)} />

      {/* 下部固定要素（ナビ65px＋余白15px＋広告バナー約46px）に隠れないよう下余白を確保する（規約 §5.3） */}
      <main className="mx-auto w-full max-w-lg px-4 pb-36">
        <Outlet />
      </main>

      {/* 機能内ナビ。ヘッダーの対となる下部固定フッターとして、画面幅によらず常に表示する */}
      <BottomNav items={CIRCLE_NAV_ITEMS} ariaLabel="サークル情報メニュー" />
    </>
  );
}
