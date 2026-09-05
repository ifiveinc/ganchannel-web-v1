// FES-0: 学祭（不来方祭）の仮データセット（ステージ企画・タイムテーブル）。
// 第76回不来方祭パンフレットのステージ企画（Day1: 10/18）の実際の掲載内容を一部流用している。
// 実行委員会からの実データ（FES-1）が届き次第、このファイルを差し替える。

import type { FestivalStageProgram } from "~/types/festival/festival";

export const festivalStagePrograms: FestivalStageProgram[] = [
  {
    id: "stage-day1-01",
    day: 1,
    name: "ビンゴ大会",
    performer: "不来方祭実行委員会",
    description:
      "毎年恒例ビンゴ大会を今年も開催します！今回も豪華賞品が盛りだくさん！ぜひお気軽にご参加ください！！",
    imageUrl: null,
    time: { start: "09:30", end: "10:00" },
    isGuest: false,
    tags: [],
  },
  {
    id: "stage-day1-02",
    day: 1,
    name: "岩手リサイクレーション結果発表",
    performer: "環境マネジメント学生委員会",
    description: null,
    imageUrl: null,
    time: { start: "10:00", end: "10:15" },
    isGuest: false,
    tags: [],
  },
  {
    id: "stage-day1-03",
    day: 1,
    name: "ジャグリングパフォーマンス",
    performer: "IWATE STREET PERFORMANCE CLUB",
    description:
      "ジャグリングパフォーマンスをします！盛り上げられるように頑張ります！是非ご覧ください！",
    imageUrl: null,
    time: { start: "10:15", end: "11:00" },
    isGuest: false,
    tags: [],
  },
  {
    id: "stage-day1-04",
    day: 1,
    name: "れっつアンサンブル！",
    performer: "岩手大学管弦楽団",
    description:
      "初心者も多い中ですが一生懸命練習してきました！楽しいステージをお届けしますので、ぜひ聞きに来てください！",
    imageUrl: null,
    time: { start: "11:00", end: "11:30" },
    isGuest: false,
    tags: [],
  },
  {
    id: "stage-day1-05",
    day: 1,
    name: "合唱団ミニ演奏会",
    performer: "岩手大学合唱団",
    description:
      "こんにちは、岩手大学合唱団です♪本日演奏する「アイノカタチ」は今年の定期演奏会12/21（日）姫神ホールでも演奏します。ぜひお越しください！",
    imageUrl: null,
    time: { start: "11:30", end: "12:00" },
    isGuest: false,
    tags: [],
  },
  {
    id: "stage-day1-06",
    day: 1,
    name: "キッズ ソーラン節",
    performer: "さんこう保育園",
    description:
      "岩手大学農学部南門植物園入口側の桜並木にある、さんこうじ保育園です。年少・年中・年長の子どもたちによる演技を披露します。日頃の練習の成果を発揮します。一生懸命踊る園児に温かい声援よろしくお願いします。",
    imageUrl: null,
    time: { start: "12:00", end: "13:00" },
    isGuest: false,
    tags: ["上田商店街"],
  },
  {
    id: "stage-day1-07",
    day: 1,
    name: "上小太鼓組",
    performer: "盛岡市上田小学校",
    description:
      "本校は、今年9月27日に創立70周年記念式典を行いました。上小太鼓組は30年以上の歴史があり毎年2月に6年生から5年生引継式が行われ主に運動会で披露されております。今回、初出演の上小生の元気な演舞をお楽しみください。",
    imageUrl: null,
    time: { start: "12:00", end: "13:00" },
    isGuest: false,
    tags: ["上田商店街"],
  },
  {
    id: "stage-day1-08",
    day: 1,
    name: "上中太鼓",
    performer: "盛岡市立上田中学校",
    description:
      "上中太鼓は50年以上の歴史があり「上田夏まつり」をはじめ地域の様々な行事に参加しています。応援団幹事による演舞をお楽しみいただきたいと思います。",
    imageUrl: null,
    time: { start: "12:00", end: "13:00" },
    isGuest: false,
    tags: ["上田商店街"],
  },
  {
    id: "stage-day2-01",
    day: 2,
    name: "ゲストライブ「春とヒコーキ」",
    performer: "春とヒコーキ",
    description: "YouTube登録者数100万人を超える大人気芸人。",
    imageUrl: null,
    // パンフレット上は開始時刻（11:30〜）のみの記載。終了時刻は仮に30分と仮定した値
    time: { start: "11:30", end: "12:00" },
    isGuest: true,
    tags: [],
  },
];
