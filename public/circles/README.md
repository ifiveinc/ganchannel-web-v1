# 団体画像の置き場

団体ごとに `public/circles/<circleId>/` を作り、そこへ画像を置く。
`circleId` は `app/data/circles.ts` の `id`（例: `circle-d178a0af`）。

## 手順

1. フォーム回答のGoogle Driveリンクから画像をダウンロードする
   （Driveのファイルは非公開のため、`<img>` から直接参照できない）
2. `public/circles/<circleId>/` に置く。推奨するファイル名は以下

   | 用途 | ファイル名 |
   | --- | --- |
   | 円形ロゴ | `logo.png` / `logo.jpg` |
   | 活動写真 | `activity-01.jpg` 〜 `activity-05.jpg` |

   `activity-01` がヒーロー画像と一覧カードのサムネイルになる。

3. `app/services/circles/image-overrides.ts` にパスを登録する

```ts
{
  circleId: "circle-d178a0af",
  logo: "/circles/circle-d178a0af/logo.png",
  images: ["/circles/circle-d178a0af/activity-01.jpg"],
}
```

## なぜデータファイルを直接書き換えないのか

`app/data/circles.ts` の `images` / `logo` は `scripts/sync-circles.ts` の所有フィールドで、
`npm run sync:circles` を実行すると**フォームの値で上書きされる**（docs/chatbot/spec.md §9-2a）。
そのため画像パスは同期スクリプトが触らない `image-overrides.ts` 側で管理する。

登録がない団体は、描画できないURL（Driveリンク）が自動的に除外され、
プレースホルダ画像が表示される。
