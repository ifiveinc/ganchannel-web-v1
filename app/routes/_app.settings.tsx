export function meta() {
  return [
    { title: "設定 | がんちゃんねる" },
    { name: "description", content: "がんちゃんねるのユーザー設定です。" },
  ];
}

export default function Settings() {
  // TODO: 設定項目は未定。下部固定ナビからの導線を通すためのプレースホルダ。
  //       ログイン機能の導入（年内予定）とあわせて中身を決める
  return (
    <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-48">
      <h1 className="text-2xl font-bold leading-snug">設定</h1>
      <p className="mt-6 text-base leading-relaxed text-ink-muted">
        準備中です。
      </p>
    </main>
  );
}
