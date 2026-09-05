// FES-0: 学祭（不来方祭）の仮データセット（企画一覧）。
// 第76回不来方祭パンフレット（紙）に実際に掲載されていた内容を一部そのまま流用している
// （docs/project/festival-issues.md FES-0「過去の紙パンフの内容を仮に流用してよい」）。
// 実行委員会からの実データ（FES-1）が届き次第、このファイルを差し替える。
// 変換ロジックは追加せず、この配列をそのまま画面に渡せる形にしておく。

import type { FestivalProgram } from "~/types/festival/festival";

export const festivalPrograms: FestivalProgram[] = [
  {
    id: "A1",
    name: "玉こんにゃく屋",
    organizer: "少林寺拳法部",
    description:
      "少林寺拳法部は玉こんにゃくを出店します！熱々でぷにぷにの玉こんにゃくを作ってお待ちしておりますので、ぜひお立ち寄りください！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A1" },
    time: null,
    tags: [],
  },
  {
    id: "A2",
    name: "味工房チョレイ",
    organizer: "卓球部",
    description:
      "大行列必至の揚げ物屋が登場！バラエティー豊かなメニューを取り揃えて皆様をお出迎えします！一口食べればやみつきになる美味しさをお楽しみください。おいしい揚げ物と楽しいひとときを共に過ごしましょう！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A2" },
    time: null,
    tags: [],
  },
  {
    id: "A3",
    name: "GHKドッグ",
    organizer: "GHK岩手大学放送研究部",
    description:
      "福田パンにソーセージを挟んだホットドッグ！！数量には限りがあるのでお早めにお買い求めください！E36では飲食OKの休憩室もやっています。",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A3" },
    time: null,
    tags: [],
  },
  {
    id: "A4",
    name: "わんこ食堂 じゃがバター＆ココア",
    organizer: "居場所づくりサークルわんこ",
    description:
      "私たちは岩大生を中心としたボランティア団体で、みんなが繋がる食堂を目指して月2回子ども食堂の運営を行なっています。学祭では、温かいじゃがバターとココアをご用意してお待ちしています！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A4" },
    time: null,
    tags: [],
  },
  {
    id: "A11",
    name: "魔法雑貨店",
    organizer: "雑貨店",
    description:
      "魔法雑貨店が登場(>人<;)☆幸運を運ぶ不思議なアイテムや、まるで童話のような手作り雑貨を揃えた。手に取ればきっと、小さな幸せと驚きを感じていただけ！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A11" },
    time: null,
    tags: [],
  },
  {
    id: "A17",
    name: "いさりんご",
    organizer: "ツキノワグマ研究会",
    description:
      "ツキノワグマ研究会が普段活動している猪去地区で取れたりんごを使ったりんご飴を販売します！ぜひ食べに来てください！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A17" },
    time: null,
    tags: [],
  },
  {
    id: "A18",
    name: "学生議会本舗",
    organizer: "学生議会運営委員会",
    description:
      "学生議会本舗、今年も開店！甘くてサクサクのチュロス、香ばしく揚げたポテト、爽やかなドリンクをご用意しました。小腹が空いたら迷わずGO！！学生議会運営委員会が心を込めて笑顔でお届けします！",
    imageUrl: null,
    location: { kind: "outdoor", group: "A", code: "A18" },
    time: null,
    tags: [],
  },
  {
    id: "GB21",
    name: "うたごえ 不来方ライブ",
    organizer: "うたごえサークル",
    description:
      "こんにちは！うたごえサークルです♪ライブではロックやポップス、弾き語りなど色々な音楽を演奏します！盛り上がること間違いなしなのでぜひ来てください👍",
    imageUrl: null,
    location: {
      kind: "indoor",
      building: "学生センターB棟",
      floor: "2F",
      roomCode: "GB21",
    },
    time: null,
    tags: [],
  },
  {
    id: "GB-2A",
    name: "らくのうの夢 チーズケーキ工房",
    organizer: "らくのうの夢",
    description:
      "らくのうの夢は原材料にこだわり岩手のチーズを使ったチーズケーキを売りにしており、何度も試行を重ねて完成したチーズケーキをより多くの人に食べていただけることを目標にしています！是非お越しください！",
    imageUrl: null,
    location: {
      kind: "indoor",
      building: "学生センターB棟",
      floor: "2F",
      roomCode: "GB-2A",
    },
    time: null,
    tags: [],
  },
];
