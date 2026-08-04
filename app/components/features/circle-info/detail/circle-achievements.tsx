import { MdEmojiEvents } from "react-icons/md";
import type { CircleAchievement } from "~/types/circle";
import styles from "./circle-achievements.module.css";

type CircleAchievementsProps = {
  achievements: CircleAchievement[];
};

// 実績・活動内容。年ごとの年表形式で表示する。
export default function CircleAchievements({
  achievements,
}: CircleAchievementsProps) {
  if (achievements.length === 0) return null;

  return (
    <section className={styles.card}>
      <h3 className={styles.title}>
        <span className={styles.titleIcon}>
          <MdEmojiEvents size={16} aria-hidden />
        </span>
        実績・活動内容
      </h3>

      <ul className={styles.list}>
        {achievements.map((achievement) => (
          <li
            key={`${achievement.year}-${achievement.content}`}
            className={styles.item}
          >
            <span aria-hidden className={styles.marker} />
            <div className={styles.itemBody}>
              {/* フォーム由来のデータは年が空のことがある。空欄の行を作らない */}
              {achievement.year !== "" && (
                <span className={styles.year}>{achievement.year}</span>
              )}
              {/* 自由記述で改行を含むため、そのまま反映する（.content が pre-line） */}
              <span className={styles.content}>{achievement.content}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
