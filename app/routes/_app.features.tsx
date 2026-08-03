import FeatureCard from "~/components/features/feature-list/feature-card";
import { APP_FEATURES } from "~/components/features/feature-list/feature-items";

export function meta() {
  return [
    { title: "機能一覧 | がんちゃんねる" },
    {
      name: "description",
      content: "がんちゃんねるで使える機能の一覧です。",
    },
  ];
}

export default function Features() {
  return (
    // 下部固定要素（ナビ65px＋余白15px＋広告バナー約105px）に隠れないよう下余白を確保する（規約 §5.3）
    <main className="mx-auto w-full max-w-lg px-4 pt-4 pb-48">
      <h1 className="text-2xl font-bold leading-snug">機能一覧</h1>

      <ul className="mt-6 grid grid-cols-2 gap-3">
        {APP_FEATURES.map((feature) => (
          <li key={feature.to} className="flex">
            <FeatureCard feature={feature} />
          </li>
        ))}
      </ul>
    </main>
  );
}
