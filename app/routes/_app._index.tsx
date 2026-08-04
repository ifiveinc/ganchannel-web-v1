import type { Route } from "./+types/_app._index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "がんちゃんねる" },
    {
      name: "description",
      content: "岩手大学の情報を統合するアプリ「がんちゃんねる」",
    },
  ];
}

export default function Index() {
  return (
    // 下部固定要素（ナビ65px＋余白15px＋広告バナー約105px）に隠れないよう下余白を確保する（規約 §5.3）
    <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-36">
      <h1 className="text-2xl font-bold leading-snug">がんちゃんねる</h1>
      {/* TODO: ホーム画面の実装（デザイン確定後に着手） */}
    </main>
  );
}
