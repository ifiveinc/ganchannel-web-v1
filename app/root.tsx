import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";

import type { Route } from "./+types/root";
import "./styles/app.css";
import BottomNav from "~/components/layout/bottom-nav/bottom-nav";
import { APP_NAV_ITEMS } from "~/components/layout/bottom-nav/app-nav-items";
import Ad from "~/components/layout/ad-banner/ad-banner";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    // デザイン規約 §4.1：日本語グリフを持つ Noto Sans JP を 400/700 の2ウェイトのみ読み込む
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap",
  },
];


export default function Root() {
  // circle-info は機能内に専用のボトムナビを持つため、共通ナビと下部で衝突する。
  // 配下では共通ナビを描画せず、機能内ナビに任せる（docs/circle-info/spec.md §7.2）。
  const { pathname } = useLocation();
  const hasOwnBottomNav = pathname.startsWith("/circle-info");

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {/* ここに各ページコンポーネントが表示される */}
        <Outlet />

        <ScrollRestoration />
        <Scripts />
        {/* 広告バナーは全ページ共通。下部固定ナビ（64px）の上に載せる */}
        <Ad />
        {!hasOwnBottomNav && (
          // TODO: 共通ヘッダーの上部ナビ（規約 §29-10）が未実装のため、md:以上でも
          //       このナビを表示している。ヘッダー実装時に hideOnDesktop を付ける
          <BottomNav items={APP_NAV_ITEMS} ariaLabel="メインメニュー" />
        )}
      </body>
    </html>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
