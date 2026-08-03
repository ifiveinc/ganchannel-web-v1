import { Outlet } from "react-router";
import AppHeader from "~/components/layout/header/app-header";

// 機能ページ以外（ホーム・機能一覧・Q&A・設定）の共通レイアウト。
// URLには影響しないパスなしレイアウトルート（ファイル名の先頭 "_"）。
//
// circle-info のような「機能」は独自のヘッダー・ナビを持つため、この配下に置かない。
export default function AppLayout() {
  return (
    <>
      <AppHeader />
      <Outlet />
    </>
  );
}
