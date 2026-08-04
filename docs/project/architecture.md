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

MVP公開後、カンパニー全体の方針に従いNext.jsへ移行する予定がある。
移行時に影響する箇所は [decisions/0002-framework-react-router.md](../decisions/0002-framework-react-router.md) を参照。

## ディレクトリ構成

```
app/
├── root.tsx                    # 全ページ共通のレイアウト（βバナー・広告バナー・共通ナビ）
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
│   ├── ui/                     # 複数画面で使う共通UI（empty-state, loading-spinner 等）
│   ├── layout/                 # アプリ全体の chrome（bottom-nav, ad-banner, header）
│   └── features/<機能>/        # 画面固有のコンポーネント（circle-info, chat, news 等）
├── services/                   # データ取得・ドメインロジック（UIから分離）
│   ├── circle-info/            #   circle-service, column-map, image/name-overrides
│   ├── chatbot/                #   search, qa-cache, rate-limit, llm/ など
│   └── news/                   #   news-service
├── data/                       # 静的データ
│   ├── circle-info/            #   circles
│   ├── chatbot/                #   chatbot-faq, circle-registry, snapshot.json など
│   ├── news/                   #   demo-news
│   └── faq/                    #   faq-list
├── types/                      # 型定義
│   ├── circle-info/            #   circle
│   ├── chatbot/                #   chatbot, chunk, llm, qa, search, circle-registry
│   └── news/                   #   news
├── lib/                        # 純粋関数のユーティリティ
│   ├── circle-info/            #   filter-circles, favorites-storage
│   └── chatbot/                #   text-similarity, embedding-common-words
├── constants/                  # 定数（APIのURL・カテゴリ一覧 等）
├── hooks/                      # カスタムフック（use-xxx.ts）
├── styles/                     # グローバルCSS（app.css）
└── assets/                     # 共有画像などのアセット
```

### 層の中の分け方

機能が増えて `services` / `data` / `types` / `lib` に複数機能のファイルが混在したため、
**各層の中を機能名のディレクトリで分ける**方針をとる（2026-08-05）。
`components/features/<機能>/` と粒度が揃い、機能ごとに触る範囲が分かれる。

- 新しいファイルは、担当機能のディレクトリに置く
- 複数機能で共有するものだけ、層の直下に置いてよい
  （例: `types/circle-info/circle.ts` は chatbot からも参照する。
  所有は circle-info 側にあるため circle-info 配下に置いている）
- `routes/` は flatRoutes がファイル名からURLを決めるため、フラットのまま変えない

### データファイルを移動するときの注意

`scripts/` の生成スクリプトは、出力先のパスと**生成するファイルの中身に書く import 文**を
文字列として持っている。移動時は両方の追随が必要（片方だけだと次回実行で壊れる）。

| スクリプト | 出力先 |
| --- | --- |
| `sync-circles.ts` | `app/data/circle-info/circles.ts` |
| `sync-registry.ts` | `app/data/chatbot/circle-registry.ts` |
| `generate-circle-embeddings.ts` | `app/data/chatbot/circle-embeddings.json` |
| `generate-snapshot.ts` | `app/data/chatbot/snapshot.json` |

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
