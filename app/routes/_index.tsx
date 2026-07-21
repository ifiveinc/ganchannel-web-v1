import type { Route } from "./+types/_index";

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
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">がんちゃんねる</h1>
      {/* TODO: ホーム画面の実装（デザイン確定後に着手） */}
    </div>
  );
}
