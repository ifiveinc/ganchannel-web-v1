# アーキテクチャ・ディレクトリ構成

## 技術構成

| 項目 | 内容 |
| --- | --- |
| フレームワーク | React Router v7（フレームワークモード, SSR有効） |
| ルーティング | ファイルベース（`@react-router/fs-routes` の `flatRoutes`） |
| 言語 | TypeScript / React 19 |
| スタイリング | Tailwind CSS v4 |
| ビルド | Vite |
| パスエイリアス | `~/*` → `app/*` |

## ディレクトリ構成

```
app/
├── root.tsx                    # 全ページ共通のレイアウト（Footer・広告バナーを含む）
├── routes.ts                   # flatRoutes 設定
├── routes/                     # ルーティング専用。薄く保つ（ファイル名 = URL slug）
│   ├── _app.tsx                #   機能ページ以外の共通レイアウト（共通ヘッダー）
│   ├── _app._index.tsx         #   / （ホーム）
│   ├── _app.features.tsx       #   /features（機能一覧）
│   ├── _app.faq.tsx            #   /faq
│   ├── _app.settings.tsx       #   /settings（ユーザー設定）
│   ├── news.tsx                #   /news
│   ├── ad-inquiry.tsx          #   /ad-inquiry（広告問い合わせ）
│   ├── circle-info.tsx         #   circle-info 機能の共通レイアウト
│   ├── circle-info._index.tsx  #   /circle-info（機能ホーム）
│   ├── circle-info.search.tsx  #   /circle-info/search（探す）
│   ├── circle-info.favorites.tsx # /circle-info/favorites（気になる）
│   ├── circle-info.$circleId.tsx # /circle-info/:circleId（サークル詳細）
│   └── kakunin.tsx             #   /kakunin（開発用の確認ページ）
├── components/
│   ├── ui/                     # 複数画面で使う共通UI（Button, Input, Modal 等）
│   ├── layout/                 # アプリ全体の chrome（bottom-nav, ad-banner）
│   └── features/               # 画面固有のコンポーネント（news, circle-info 等）
├── data/                       # 静的データ（faq-list, demo-news）
├── services/                   # データ取得・ドメインロジック（UIから分離）
├── types/                      # 横断的な型定義
├── constants/                  # 定数（APIのURL・カテゴリ一覧 等）
├── hooks/                      # カスタムフック（use-xxx.ts）
├── lib/                        # 純粋関数のユーティリティ
├── styles/                     # グローバルCSS（app.css）
└── assets/                     # 共有画像などのアセット
```

## 命名規約

開発規約 §10.2 に準拠する。

| 対象 | 規則 | 例 |
| --- | --- | --- |
| ファイル | kebab-case | `news-card.tsx`, `use-news.ts` |
| Reactコンポーネント / 型 | PascalCase | `NewsCard`, `NewsData` |
| 変数 / 関数 | camelCase | `fetchNews` |
| 定数 | UPPER_SNAKE_CASE | `NEWS_API_URL` |

## 設計方針

- **routes は薄く保つ** — データ取得は `services/`、UIは `components/` に切り出す（開発規約 §10.3「UI表示とデータ取得処理の分離」）。
- **同じ役割のファイルは同じディレクトリに** 置く（開発規約 §12.1）。
- **1回しか使わないものを過度に共通化しない**。共通UIは複数画面で使う段階で `components/ui/` に昇格させる（§12.3）。
- **大規模な構成変更はチームに相談してから行う**（§12.1）。判断の記録は `decisions/` に残す。
