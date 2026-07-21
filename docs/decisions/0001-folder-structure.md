# 0001. app/ ディレクトリ構成の再編

- 日付: 2026-07-21
- ステータス: 採用

## 背景

開発態勢を整える初期段階として、React Router のテンプレート由来の初期構成を整理する必要があった。当初は以下の課題があった。

- ファイル命名が不統一（kebab-case / snake_case / camelCase が混在）
- データ・型・画像がコンポーネントやルート配下に散在
- テンプレートの残骸（`app/welcome/`）が残存
- hooks / types / services / constants などの層が未整備

## 決定

`app/` を役割ごとの層に再編した。詳細は [../architecture.md](../architecture.md) を参照。

- `routes/` はルーティング専用に絞る
- `components/` を `ui` / `layout` / `features` に分ける
- データ取得は `services/`、静的データは `data/`、型は `types/`、定数は `constants/` に集約
- 共有画像は `assets/` に一元化
- ファイル名は kebab-case に統一、コンポーネント関数は PascalCase に修正

あわせてルート `ad_inq` を `/ad-inquiry` に改名した。

## 影響

- 広告問い合わせページのURLが `/ad_inq` → `/ad-inquiry` に変更。内部リンクは追随済み。
- `app/welcome/`（テンプレート）を削除し、ホーム（`_index`）はプレースホルダに置き換えた。
- 型チェック・本番ビルドの成功を確認済み。
