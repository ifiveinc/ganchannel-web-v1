import { Link } from "react-router";
import { MdGroups } from "react-icons/md";
import type { RecommendCard } from "~/types/chatbot/circle-registry";

type CircleRecommendCardProps = {
  card: RecommendCard;
};

// サークルレコメンドカード。recommendCardsはapp/services/search-service.server.ts の
// サークルのベクトル検索（複数団体が拮抗した場合）から生成される（Phase 10）。
export default function CircleRecommendCard({ card }: CircleRecommendCardProps) {
  const isDetailed = card.status === "detailed";

  const body = (
    <div className="flex flex-col gap-1 rounded-card border border-border bg-surface p-3">
      <div className="flex items-center gap-2">
        <MdGroups size={16} aria-hidden className="shrink-0 text-primary" />
        <p className="min-w-0 flex-1 truncate text-sm font-bold text-ink">{card.name}</p>
      </div>
      <p className="text-sm text-ink-muted">{card.reason}</p>
      {!isDetailed && (
        <p className="text-xs text-ink-muted">詳細情報はまだ登録されていません</p>
      )}
    </div>
  );

  if (!isDetailed) {
    return body;
  }

  return (
    // 新しいタブで開く。同じタブでcircle-infoへ遷移するとチャット画面（/chat）が
    // アンマウントされ会話が消えてしまうため（chatの状態はメモリ上のみで保持、
    // localStorage/sessionStorageは使わない設計）。複数のレコメンドを見比べたい
    // 場合にも、それぞれ別タブで開けるようにする（2026-08-05）。
    <Link
      to={`/circle-info/${card.circleId}`}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-card focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
    >
      {body}
    </Link>
  );
}
