import { useState } from "react";
import {
  MdThumbDown,
  MdThumbDownOffAlt,
  MdThumbUp,
  MdThumbUpOffAlt,
} from "react-icons/md";
import type { IconType } from "react-icons";

type FeedbackValue = "up" | "down";

type FeedbackButtonsProps = {
  onFeedback?: (value: FeedbackValue) => void;
};

// 👍👎フィードバックボタン。送信先API（app/routes/api.chat.feedback.ts）はPhase 9で実装するため、
// 現時点ではローカルの選択状態のみを保持する（onFeedbackは呼び出し元が任意で受け取れる）。
export default function FeedbackButtons({ onFeedback }: FeedbackButtonsProps) {
  const [selected, setSelected] = useState<FeedbackValue | null>(null);

  const handleClick = (value: FeedbackValue) => {
    if (selected) return; // 一度送ったら変更不可（二重送信防止）
    setSelected(value);
    onFeedback?.(value);
  };

  return (
    <div className="flex items-center gap-1">
      <FeedbackButton
        value="up"
        label="役に立った"
        icon={MdThumbUpOffAlt}
        activeIcon={MdThumbUp}
        selected={selected}
        onClick={handleClick}
      />
      <FeedbackButton
        value="down"
        label="役に立たなかった"
        icon={MdThumbDownOffAlt}
        activeIcon={MdThumbDown}
        selected={selected}
        onClick={handleClick}
      />
    </div>
  );
}

type FeedbackButtonProps = {
  value: FeedbackValue;
  label: string;
  icon: IconType;
  activeIcon: IconType;
  selected: FeedbackValue | null;
  onClick: (value: FeedbackValue) => void;
};

function FeedbackButton({
  value,
  label,
  icon: Icon,
  activeIcon: ActiveIcon,
  selected,
  onClick,
}: FeedbackButtonProps) {
  const isActive = selected === value;
  const isDisabled = selected !== null;

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={isActive}
      disabled={isDisabled}
      onClick={() => onClick(value)}
      className={`inline-flex size-9 items-center justify-center rounded-full transition-colors disabled:cursor-not-allowed ${
        isActive ? "text-primary" : "text-ink-muted hover:bg-surface-card"
      } ${isDisabled && !isActive ? "opacity-50" : ""}`}
    >
      {isActive ? <ActiveIcon size={20} aria-hidden /> : <Icon size={20} aria-hidden />}
    </button>
  );
}
