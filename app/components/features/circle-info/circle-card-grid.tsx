import type { Circle } from "~/types/circle";
import CircleCard from "./circle-card";

type CircleCardGridProps = {
  circles: Circle[];
};

// 一覧の2列グリッド（デザイン規約 §6.3）。
export default function CircleCardGrid({ circles }: CircleCardGridProps) {
  return (
    <ul className="grid grid-cols-2 gap-3">
      {circles.map((circle) => (
        <li key={circle.id} className="flex">
          <CircleCard circle={circle} />
        </li>
      ))}
    </ul>
  );
}
