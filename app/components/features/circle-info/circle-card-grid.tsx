import type { Circle } from "~/types/circle-info/circle";
import CircleCard from "./circle-card";
import styles from "./circle-card-grid.module.css";

type CircleCardGridProps = {
  circles: Circle[];
};

// 一覧の2列グリッド（デザイン規約 §6.3）。
export default function CircleCardGrid({ circles }: CircleCardGridProps) {
  return (
    <ul className={styles.grid}>
      {circles.map((circle) => (
        <li key={circle.id} className={styles.item}>
          <CircleCard circle={circle} />
        </li>
      ))}
    </ul>
  );
}
