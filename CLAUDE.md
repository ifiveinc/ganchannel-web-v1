# CLAUDE.md

このリポジトリで作業する Claude Code 向けのガイドです。

## プロジェクト概要

Web版 がんちゃんねる。岩手大学の分散した情報（ニュース・FAQ・サークル等）を統合するWebアプリ。開発は学生団体 iFive。MVP公開: 2026-08-06 / 完成版: 2027-04-01。

## 技術スタック

- React Router v7（framework mode, SSR有効）＋ Vite
- **Next.js ではない。** 過去の規約文書にNext.jsの記載が残っていた場合は誤りなので無視すること
- React 19 / TypeScript / Tailwind CSS v4（`@tailwindcss/vite`、`tailwind.config.*` は無く `app/styles/app.css` の `@theme` でトークン管理）
- アイコン: `react-icons`
- デプロイ: Render（常駐Nodeプロセス、`react-router-serve`）。Dockerfile あり
- コマンド: `npm run dev` / `npm run build` / `npm run start` / `npm run typecheck`。`lint`/`test` スクリプトは未整備

## ディレクトリ構成

パスエイリアス `~/*` → `app/*`。

```
app/
├── root.tsx        # 全ページ共通レイアウト（Footer・広告バナーを常時マウント）
├── routes/         # ルーティング専用、薄く保つ（flatRoutes、ファイル名=URLスラッグ）
├── components/
│   ├── ui/          # 複数画面で使う共通UI
│   ├── layout/       # アプリ全体のchrome（footer, ad-banner）
│   └── features/      # 画面固有コンポーネント
├── data/            # 静的データ
├── services/         # データ取得・ドメインロジック（UIから分離）
├── types/            # 横断的な型定義
├── constants/         # 定数
├── hooks/, lib/        # カスタムフック・純粋関数ユーティリティ
├── styles/           # グローバルCSS
└── assets/           # 画像等
```

詳細は [docs/project/architecture.md](docs/project/architecture.md) を参照。

## 規約

- 開発規約: [docs/project/development-guidelines.md](docs/project/development-guidelines.md)
- デザイン規約: [docs/project/design-guidelines.md](docs/project/design-guidelines.md)（**新規に作成するコンポーネントにのみ適用**。既存画面への遡及適用は不要）
- 重要な意思決定（ADR）: [docs/decisions/](docs/decisions/)

## 注意

- 回答は日本語で書くこと
- `.env` / `.env.local` は読まない、変更しない
- 環境変数に `VITE_` プレフィックスを付けない（クライアントバンドルに露出する）
- サーバ専用コードは `*.server.ts` サフィックスで隔離する
- 1フェーズずつ実装し、終わったら動作確認方法を提示して止まる
- ブランチ名は `作業種別/Issue番号-作業内容`（開発規約§6.3）
- このプロジェクトは Next.js ではない。React Router v7（framework mode）を使う