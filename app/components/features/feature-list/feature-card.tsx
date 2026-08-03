import { Link } from "react-router";
import type { AppFeature } from "./feature-items";

type FeatureCardProps = {
  feature: AppFeature;
};

// 機能一覧の1枚。2列グリッドに並べる前提（デザイン規約 §6.3）。
export default function FeatureCard({ feature }: FeatureCardProps) {
  const { name, description, to, icon: Icon } = feature;

  return (
    <Link
      to={to}
      className="flex h-full flex-col gap-2 rounded-card border border-border bg-surface p-3 shadow-card hover:bg-surface-card"
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <Icon size={20} aria-hidden />
      </span>
      <span className="line-clamp-2 text-base font-bold leading-snug">
        {name}
      </span>
      <span className="line-clamp-3 text-sm leading-normal text-ink-muted">
        {description}
      </span>
    </Link>
  );
}
