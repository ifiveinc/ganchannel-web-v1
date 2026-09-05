// 学祭データの取得処理。UI（route/component）から分離して集約する（development-guidelines.md準拠）。
//
// MVP（FES-0時点）ではリポジトリ内の仮データを返す。FES-1で実行委員会から実データが届いた後は、
// この関数の中身を「実データ取得 → adapter.ts で変換」に差し替える想定で、
// fetchFestivalPrograms 等の戻り値の型（FestivalProgram[] 等）は変えない。

import { festivalIndoorAreas, festivalOutdoorGroups } from "~/data/festival/areas";
import { festivalPrograms } from "~/data/festival/programs";
import { festivalStagePrograms } from "~/data/festival/stage-programs";
import type {
  FestivalIndoorAreaInfo,
  FestivalOutdoorGroupInfo,
  FestivalProgram,
  FestivalStageProgram,
} from "~/types/festival/festival";

export async function fetchFestivalPrograms(): Promise<FestivalProgram[]> {
  return festivalPrograms;
}

export async function fetchFestivalProgramById(
  id: string
): Promise<FestivalProgram | undefined> {
  const all = await fetchFestivalPrograms();
  return all.find((program) => program.id === id);
}

export async function fetchFestivalStagePrograms(): Promise<
  FestivalStageProgram[]
> {
  return festivalStagePrograms;
}

export async function fetchFestivalOutdoorGroups(): Promise<
  FestivalOutdoorGroupInfo[]
> {
  return festivalOutdoorGroups;
}

export async function fetchFestivalIndoorAreas(): Promise<
  FestivalIndoorAreaInfo[]
> {
  return festivalIndoorAreas;
}
