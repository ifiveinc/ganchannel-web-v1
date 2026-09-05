// 学祭（不来方祭）データの型定義。FES-0（docs/project/festival-issues.md）に対応する。
// 第76回不来方祭パンフレット（紙）の実物の構成を参照して定義した仮の型であり、
// 実行委員会からの実データ（FES-1）確定後、構成が変わる可能性がある。
// 実データ→この型への変換は app/services/festival/adapter.ts に集約する。

import type { FESTIVAL_OUTDOOR_GROUPS } from "~/constants";

export type FestivalOutdoorGroup = (typeof FESTIVAL_OUTDOOR_GROUPS)[number];

/** "HH:mm" 形式（例: "10:00"） */
export type FestivalTimeRange = {
  start: string;
  end: string;
};

/** 屋外の模擬店。構内の通路沿いのグループ（A〜F）内で連番コードを持つ */
export type FestivalOutdoorLocation = {
  kind: "outdoor";
  group: FestivalOutdoorGroup;
  /** グループ内の企画コード（例: "A1"）。パンフレット上の表記をそのまま使う */
  code: string;
};

/** 屋内出店。建物・階・室番号（コード）で場所を表す */
export type FestivalIndoorLocation = {
  kind: "indoor";
  building: string;
  floor: string;
  /** 教室コード等（例: "GB21"）。パンフレット上の表記をそのまま使う */
  roomCode: string;
};

export type FestivalProgramLocation =
  | FestivalOutdoorLocation
  | FestivalIndoorLocation;

// 企画一覧（FES-2）・構内マップ（FES-3）で使う、模擬店・屋内出店の共通型。
// 屋外模擬店は基本的に終日出店のため time は null、屋内の一部企画（体験会等）は
// 時間指定があるため time を持つ（例: 教育学部第一号館の卓球体験会）。
export type FestivalProgram = {
  /** 企画コード・室コードをそのまま流用する（例: "A1", "GB21"） */
  id: string;
  name: string;
  organizer: string;
  description: string;
  /** 未提供の場合はプレースホルダーを表示するためnull */
  imageUrl: string | null;
  location: FestivalProgramLocation;
  /** 終日出店等、時間指定が無い場合はnull */
  time: FestivalTimeRange | null;
  /** 「上田商店街」等、地域連携枠であることを示す特記タグ */
  tags: string[];
};

/** 学祭当日の日程（Day1: 10/18、Day2: 10/19 に対応） */
export type FestivalDay = 1 | 2;

// ステージ企画（タイムテーブル・FES-2）。模擬店（FestivalProgram）と異なり、
// 全企画が時間指定を持つ点が構造上の違い。
export type FestivalStageProgram = {
  id: string;
  day: FestivalDay;
  name: string;
  /** 出演団体・出演者名。式典等、出演者名が無い企画はnull */
  performer: string | null;
  description: string | null;
  imageUrl: string | null;
  time: FestivalTimeRange;
  /** 招待ゲスト（芸人等）による企画かどうか */
  isGuest: boolean;
  tags: string[];
};

// 屋外グループ（A〜F）ごとのエリアマップ・所属企画の一覧。
export type FestivalOutdoorGroupInfo = {
  group: FestivalOutdoorGroup;
  /** 例: "Aグループ" */
  label: string;
  mapImageUrl: string | null;
  programIds: string[];
};

// 屋内出店のエリア（建物・階）ごとのフロアマップ・所属企画の一覧。
export type FestivalIndoorAreaInfo = {
  id: string;
  building: string;
  floor: string;
  mapImageUrl: string | null;
  programIds: string[];
};

// --- 企画情報以外の項目 ---------------------------------------------------
// パンフレット序盤・終盤の編集コンテンツ（挨拶・スタッフ紹介・協賛企業・アンケート）。
// 「企画を探す・お気に入り登録する・通知を受け取る」という行動補助が目的のデジタル版には
// 本来含めない想定だが、実行委員会への確認結果次第で追加する可能性があるため、
// 型・仮データだけ先に用意しておく（festival-data-fes0.md §4参照）。

/** 学長挨拶・実行委員長挨拶等、単発の挨拶文 */
export type FestivalGreeting = {
  id: string;
  /** 例: "岩手大学学長挨拶" */
  title: string;
  authorName: string;
  /** 例: "学長" */
  authorRole: string;
  body: string;
  imageUrl: string | null;
};

// 実行委員スタッフの役職一覧（パンフレットの編集後記に掲載）。
// 個人名は掲載しない方針にしている。理由は app/services/circle-info/column-map.ts の
// 「代表者名は個人情報のため取り込まない」という既存方針と同じ（サークルの代表者名を
// Circle型に含めていないのと同様、実行委員個人のフルネームの一覧をコードに含めない）。
export type FestivalStaffMember = {
  /** 例: "委員長" */
  role: string;
  name: string | null;
};

/** 協賛企業。広告費を払って掲載枠を得ている紙面と異なり、デジタル版への掲載可否は要確認 */
export type FestivalSponsor = {
  id: string;
  name: string;
  logoUrl: string | null;
  url: string | null;
};

/** アンケート等、単純なリンク1本の案内 */
export type FestivalSurveyLink = {
  label: string;
  /** パンフレットがQRコードのみでURL文字列を印字していない場合はnull */
  url: string | null;
};
