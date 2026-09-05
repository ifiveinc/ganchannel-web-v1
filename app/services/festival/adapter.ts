// FES-0: 実データ（FES-1確定後）→ 学祭データ型への変換を1箇所に集約するアダプター。
//
// 目的（docs/project/festival-issues.md FES-0参照）:
// 実行委員会からのデータ構造が、この時点で仮定している項目・形式と異なっていた場合でも、
// 直すのはこのファイルだけで済むようにし、FES-2・FES-3・FES-4・FES-6のUI側には波及させない。
//
// 現時点では実データの提供形式（スプレッドシート等）・列名が未確定（FES-1未完了）のため、
// Raw*Row 型は「企画名・場所・時間・説明文・画像」等、これまでの提案・打ち合わせで
// 想定している項目（festival-issues.md, festival-meeting-0908.md）に基づく仮の形。
// 実データ到着後、まずこの Raw*Row 型と各 adapt 関数の中身を実際の列名に合わせて更新する。

import type {
  FestivalDay,
  FestivalOutdoorGroup,
  FestivalProgram,
  FestivalProgramLocation,
  FestivalStageProgram,
  FestivalTimeRange,
} from "~/types/festival/festival";

// --- 企画（模擬店・屋内出店） -------------------------------------------

export type RawFestivalProgramRow = {
  id: string;
  name: string;
  organizer: string;
  description: string;
  imageUrl?: string | null;
  /** "outdoor" | "indoor" */
  locationKind: string;
  /** 屋外の場合のグループ記号（例: "A"） */
  outdoorGroup?: string | null;
  /** 屋外の場合の企画コード（例: "A1") */
  outdoorCode?: string | null;
  /** 屋内の場合の建物名 */
  indoorBuilding?: string | null;
  /** 屋内の場合の階 */
  indoorFloor?: string | null;
  /** 屋内の場合の室コード */
  indoorRoomCode?: string | null;
  /** "HH:mm"。時間指定が無い模擬店は空文字 or 未設定 */
  timeStart?: string | null;
  timeEnd?: string | null;
  tags?: string[];
};

function toProgramLocation(row: RawFestivalProgramRow): FestivalProgramLocation {
  if (row.locationKind === "indoor") {
    return {
      kind: "indoor",
      building: row.indoorBuilding ?? "",
      floor: row.indoorFloor ?? "",
      roomCode: row.indoorRoomCode ?? row.id,
    };
  }

  // 既定は屋外扱い。想定外の値が来た場合もここでエラーにせず屋外扱いに倒し、
  // 個別行の不整合でインポート全体が止まらないようにする。
  return {
    kind: "outdoor",
    group: (row.outdoorGroup ?? "A") as FestivalOutdoorGroup,
    code: row.outdoorCode ?? row.id,
  };
}

function toTimeRange(row: RawFestivalProgramRow): FestivalTimeRange | null {
  if (!row.timeStart || !row.timeEnd) return null;
  return { start: row.timeStart, end: row.timeEnd };
}

export function adaptRawFestivalPrograms(
  rows: RawFestivalProgramRow[]
): FestivalProgram[] {
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    organizer: row.organizer,
    description: row.description,
    imageUrl: row.imageUrl ?? null,
    location: toProgramLocation(row),
    time: toTimeRange(row),
    tags: row.tags ?? [],
  }));
}

// --- ステージ企画（タイムテーブル） ---------------------------------------

export type RawFestivalStageProgramRow = {
  id: string;
  /** 1 | 2（Day1: 10/18、Day2: 10/19） */
  day: number;
  name: string;
  performer?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  timeStart: string;
  timeEnd: string;
  isGuest?: boolean;
  tags?: string[];
};

export function adaptRawFestivalStagePrograms(
  rows: RawFestivalStageProgramRow[]
): FestivalStageProgram[] {
  return rows.map((row) => ({
    id: row.id,
    day: (row.day === 2 ? 2 : 1) as FestivalDay,
    name: row.name,
    performer: row.performer ?? null,
    description: row.description ?? null,
    imageUrl: row.imageUrl ?? null,
    time: { start: row.timeStart, end: row.timeEnd },
    isGuest: row.isGuest ?? false,
    tags: row.tags ?? [],
  }));
}
