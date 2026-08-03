import { MdEmojiEvents } from "react-icons/md";
import type { CircleAchievement } from "~/types/circle";

type CircleAchievementsProps = {
  achievements: CircleAchievement[];
};

// 実績・活動内容。年ごとの年表形式で表示する。
export default function CircleAchievements({
  achievements,
}: CircleAchievementsProps) {
  if (achievements.length === 0) return null;

  return (
    <section className="rounded-card border border-border bg-surface-card p-3">
      <h3 className="flex items-center gap-2 text-base font-bold leading-snug">
        <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <MdEmojiEvents size={16} aria-hidden />
        </span>
        実績・活動内容
      </h3>

      <ul className="mt-3 flex flex-col gap-2">
        {achievements.map((achievement) => (
          <li
            key={`${achievement.year}-${achievement.content}`}
            className="flex gap-2"
          >
            <span
              aria-hidden
              className="mt-2 size-2 shrink-0 rounded-full border border-primary"
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm text-ink-muted">{achievement.year}</span>
              <span className="text-base leading-normal">
                {achievement.content}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
