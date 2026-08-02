# 学内QAチャットボット 実装仕様書

- ステータス: ドラフト
- 対象日: 2026-08-06（β版公開）
- 決定事項の正本: `docs/chatbot-decisions.md`（ローカル専用、gitignore対象）。本書は決定事項を実装可能な単位に分解したものであり、本書と決定事項が矛盾する場合は決定事項を優先する
- 本書の型定義・DDLは「実装者が迷わないための契約定義」として記載する。関数の中身（実装ロジック）は含めない

---

## 0. 前提とスコープ

- 本仕様書が対象とするのは `docs/chatbot-decisions.md` に記載された学内QAチャットボット機能のみ
- 既存の `app/routes/`（`_index.tsx` / `news.tsx` / `faq.tsx` / `ad-inquiry.tsx` / `kakunin.tsx`）とその配下のコンポーネント・データは変更しない。フッターへのナビ追加のみ既存ファイルを変更する（§4参照）
- ディレクトリ構成・命名規則は `docs/architecture.md` および `docs/development-guidelines.md` §10.2 に従う（ファイル: kebab-case / コンポーネント・型: PascalCase / 変数・関数: camelCase / 定数: UPPER_SNAKE_CASE）

---

## 1. 新規作成ファイル一覧

### 1-1. ルート（`app/routes/`）

`@react-router/fs-routes` の flatRoutes 規約では `.`（ドット）がURLのセグメント区切りを表す。本リポジトリにこの記法の先例は無いため、本書で新規に導入する。

| ファイル | URL | 種別 |
|---|---|---|
| `app/routes/chat.tsx` | `/chat` | 通常ルート（`default export` あり） |
| `app/routes/api.chat.ts` | `/api/chat` | リソースルート（`action` のみ、`default export` なし） |
| `app/routes/api.chat.feedback.ts` | `/api/chat/feedback` | リソースルート（`action` のみ） |
| `app/routes/api.health.ts` | `/api/health` | リソースルート（`loader` のみ） |

### 1-2. サーバ専用サービス（`app/services/`、`*.server.ts`）

| ファイル | 役割 |
|---|---|
| `app/services/supabase-client.server.ts` | Supabaseクライアント生成（`service_role`キー使用） |
| `app/services/snapshot-service.server.ts` | `data/snapshot.json` の読み込み、DB接続失敗時のフォールバック判定 |
| `app/services/circle-service.server.ts` | サークル3状態判定、名前・かな・別名の強一致検索 |
| `app/services/risk-filter.server.ts` | C層キーワード照合によるブロック判定 |
| `app/services/faq-service.server.ts` | 事前生成FAQとの一致判定 |
| `app/services/qa-cache-service.server.ts` | `qa_cache` の完全一致・意味的一致の検索と書き込み |
| `app/services/embedding-service.server.ts` | クエリ埋め込みの生成、メタデータ（`embeddingModel`/`dimensions`/`normalized`/`builtAt`）照合 |
| `app/services/search-service.server.ts` | 検索カスケード（§7の1〜5段）の統括、RRF融合 |
| `app/services/recommend-service.server.ts` | 曖昧クエリからの条件構造化抽出、カード生成 |
| `app/services/qa-log-service.server.ts` | `qa_logs` への書き込み（失敗しても本処理を止めない） |
| `app/services/rate-limit-service.server.ts` | IP単位のレート制限判定 |
| `app/services/llm/llm-provider.server.ts` | `LLMProvider` インターフェース定義 |
| `app/services/llm/gemini-provider.server.ts` | Google AI Studio（Gemini）アダプタ |
| `app/services/llm/cerebras-provider.server.ts` | Cerebrasアダプタ |
| `app/services/llm/degraded-provider.server.ts` | 縮退モード（検索結果カードのみ返す） |
| `app/services/llm/provider-registry.server.ts` | `LLM_PROVIDERS` 環境変数から使用プロバイダ列を解決し、429/5xxで次順位へフォールバック |

### 1-2b. サークル取り込み共有ロジック（`app/services/circles/`、`.server.ts`ではない）

CSV正規化・列マッピングは秘密情報を扱わず、`scripts/sync-circles.ts`（Node実行のスクリプト。アプリのリクエスト/レスポンス経路に含まれない）から呼ばれる。クライアントバンドルへ混入する経路が無いため`*.server.ts`サフィックスは付けない。詳細は§9参照。

| ファイル | 役割 |
|---|---|
| `app/services/circles/column-map.ts` | CSVヘッダ文字列 → `Circle`フィールドの対応表。フィールドごとに候補ヘッダの複数パターンを持つ |
| `app/services/circles/name-overrides.ts` | 団体名の表記ゆれ手動対応表（`circle_registry`との突合で自動一致しない場合に参照） |

### 1-3. 型定義（`app/types/`）

| ファイル | 主な型 |
|---|---|
| `app/types/chatbot.ts` | `ChatRequestBody` / `ChatStreamChunk` |
| `app/types/circle.ts` | `CircleStatus` / `CircleRegistryEntry` / `Circle` / `CircleResolution` / `RecommendCard` |
| `app/types/chunk.ts` | `RiskLevel` / `Chunk` |
| `app/types/qa.ts` | `QaCacheEntry` / `QaLogEntry` |
| `app/types/llm.ts` | `LLMProvider` / `LLMCompletionChunk` |
| `app/types/search.ts` | `CascadeStage` / `CascadeResult` |

### 1-4. 定数・静的データ

| ファイル | 内容 |
|---|---|
| `app/constants/chatbot.ts` | チャットボット関連の定数（環境変数名の参照、既定値） |
| `app/data/chatbot-faq.ts` | 事前生成FAQ 20件（`FaqItem`型を再利用、または同型の新規型） |
| `app/data/risk-c-keywords.ts` | C層キーワード・意図リスト |

### 1-5. コンポーネント（`app/components/`）

| ファイル | 役割 |
|---|---|
| `app/components/features/chat/chat-window.tsx` | チャット画面全体（メッセージ一覧＋入力欄） |
| `app/components/features/chat/chat-message.tsx` | 1メッセージ（ユーザー/ボット）の表示 |
| `app/components/features/chat/suggested-questions.tsx` | カテゴリタブ付きサジェスト質問 |
| `app/components/features/chat/circle-recommend-card.tsx` | サークルレコメンドカード |
| `app/components/features/chat/feedback-buttons.tsx` | 👍👎フィードバックボタン |
| `app/components/layout/beta-banner/beta-banner.tsx` | βバナー・非公式表記（`root.tsx`に常時マウント） |
| `app/components/ui/loading-spinner.tsx` | 共通ローディング表示（`components/ui/`への最初の追加） |
| `app/components/ui/empty-state.tsx` | 共通空状態表示 |

### 1-6. データベース関連

| ファイル | 内容 |
|---|---|
| `supabase/migrations/0001_chatbot_schema.sql` | §3のDDL一式（配置は要確認、§8参照） |
| `scripts/generate-snapshot.ts` | Supabaseの内容を`app/data/snapshot.json`へ書き出すスクリプト |
| `app/data/snapshot.json` | スナップショットフォールバック用データ（`scripts/generate-snapshot.ts`の生成物、コミット対象） |
| `scripts/sync-circles.ts` | フォーム回答CSVを取得・正規化し`circles`へupsertする手動実行スクリプト（§9参照）。8/6の応答経路には含めない |
| `scripts/sync-photos.ts` | 活動写真の取得・リサイズ（`sync-circles.ts`から分離）。実行方法は未定（§8参照） |

### 1-7. 環境変数

`.env.example`（新規作成、既存無し）に以下を追記する。

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
LLM_PROVIDERS=gemini,cerebras
GEMINI_API_KEY=
GEMINI_MODEL=gemini-3.1-flash-lite
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
CEREBRAS_API_KEY=
CEREBRAS_MODEL=
CIRCLE_DETAIL_URL_TEMPLATE=
CIRCLE_INFO_FORM_URL=
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW_SECONDS=
SEARCH_SCORE_THRESHOLD=
CIRCLE_STRONG_MATCH_THRESHOLD=
CIRCLE_FORM_CSV_URL=
```

`CIRCLE_FORM_CSV_URL`は`scripts/sync-circles.ts`が取得するフォーム回答スプレッドシートのCSV公開URL（§9参照）。アプリのリクエスト経路では使わないため`.env.example`上は他の変数と区別しない。

`CIRCLE_INFO_FORM_URL` / `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS` / `SEARCH_SCORE_THRESHOLD` / `CIRCLE_STRONG_MATCH_THRESHOLD` の具体値は**要確認**（§8参照）。値は空欄のまま各実装フェーズのPRで確定させる。

### 1-8. 変更する既存ファイル（新規作成ではない）

| ファイル | 変更内容 |
|---|---|
| `app/root.tsx` | `BetaBanner` を `Ad` / `Footer` と同様に常時マウント |
| `app/components/layout/footer/footer.tsx` | チャットへのナビ項目を1件追加（既存の`NavLink`パターンを踏襲） |
| `package.json` | `generate:snapshot`／`sync:circles` スクリプトを追加。`sync:circles`は`scripts/sync-circles.ts`を実行し`--dry-run`オプションを受け付ける。`sync-photos.ts`のnpm scriptは実行方法未定のため保留（§8参照） |

---

## 2. 型・インターフェース定義

命名は既存の `app/types/news.ts`（`NewsData`）と同様、型はPascalCase・プロパティはcamelCaseとする。DBのsnake_caseカラムとの変換はサービス層（`*.server.ts`）内で行い、型定義自体はcamelCaseで統一する。

```ts
// app/types/circle.ts
export type CircleStatus = "detailed" | "registered" | "unknown";

export interface CircleRegistryEntry {
  id: string;
  name: string;
  kana: string;
  category: string;
}

export interface Circle {
  id: string;
  circleRegistryId: string;
  name: string;
  kana: string;
  aliases: string[];
  category: string;
  description: string;
  activityLocation: string | null;
  activityDays: string | null;
  recruitingPeriod: string | null;
  fee: string | null;
  otherFees: string | null;
  memberCount: number | null;
  beginnerRatio: string | null;
  achievements: string | null;
  snsLinks: Record<string, string>;
  photoUrls: string[];
  moodTags: string[] | null;
}

export interface CircleResolution {
  status: CircleStatus;
  registryEntry: CircleRegistryEntry | null;
  circle: Circle | null;
}

export interface RecommendCard {
  circleId: string;
  name: string;
  reason: string;
  status: CircleStatus;
}
```

```ts
// app/types/chunk.ts
export type RiskLevel = "A" | "B" | "C";

export interface Chunk {
  id: string;
  url: string;
  title: string;
  section: string | null;
  content: string;
  riskLevel: RiskLevel;
  fetchedAt: string;
  pageUpdatedAt: string | null;
}
```

```ts
// app/types/qa.ts
export interface QaCacheEntry {
  id: number;
  questionHash: string;
  question: string;
  answer: string;
  indexVersion: string;
  hitCount: number;
  createdAt: string;
}

export interface QaLogEntry {
  id: number;
  question: string;
  answer: string;
  providerUsed: string | null;
  searchScore: number | null;
  feedback: "up" | "down" | null;
  noAnswer: boolean;
  createdAt: string;
}
```

```ts
// app/types/llm.ts
export interface LLMCompletionChunk {
  type: "text" | "done" | "error";
  text?: string;
}

export interface LLMCompletionParams {
  systemPrompt: string;
  context: string;
  question: string;
}

export interface LLMProvider {
  readonly name: string;
  complete(params: LLMCompletionParams): AsyncIterable<LLMCompletionChunk>;
}
```

```ts
// app/types/search.ts
export type CascadeStage =
  | "c_layer_block"
  | "faq_match"
  | "qa_cache_exact"
  | "circle_strong_match"
  | "qa_cache_semantic"
  | "hybrid_generation"
  | "degraded";

export interface CascadeResult {
  stage: CascadeStage;
  answer: string;
  sourceUrls: string[];
  providerUsed: string | null;
  searchScore: number | null;
  recommendCards: RecommendCard[] | null;
}
```

```ts
// app/types/chatbot.ts
export interface ChatRequestBody {
  question: string;
}

export interface ChatStreamChunk {
  type: "text" | "sources" | "recommend" | "log_id" | "done" | "error";
  text?: string;
  sourceUrls?: string[];
  recommendCards?: RecommendCard[];
  logId?: number;
}
```

`CircleResolution.status` はDBに保存しない。`circle_registry`に名前が一致し、かつ対応する`circles`行が存在すれば`detailed`、`circle_registry`のみ一致すれば`registered`、どちらにも一致しなければ`unknown`と、`circle-service.server.ts`が問い合わせのたびに導出する（データの二重管理を避けるため）。

---

## 3. Supabase テーブル定義（DDL）

`qa_cache`は`docs/chatbot-decisions.md` §4に定義済みのため、そのまま転記する（変更しない）。

```sql
create extension if not exists vector;

create table circle_registry (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kana        text not null,
  category    text not null,
  created_at  timestamptz not null default now()
);

create index circle_registry_kana_idx on circle_registry (kana);

create table circles (
  id                  uuid primary key default gen_random_uuid(),
  circle_registry_id  uuid not null references circle_registry(id),
  name                text not null,
  kana                text not null,
  aliases             text[] not null default '{}'::text[],
  category            text not null,
  description         text not null,
  activity_location   text,
  activity_days       text,
  recruiting_period   text,
  fee                 text,
  other_fees          text,
  member_count        int,
  beginner_ratio      text,
  achievements        text,
  sns_links           jsonb not null default '{}'::jsonb,
  photo_urls          jsonb not null default '[]'::jsonb,
  mood_tags           text[],
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create unique index circles_circle_registry_id_key on circles (circle_registry_id);

create table chunks (
  id               uuid primary key default gen_random_uuid(),
  url              text not null,
  title            text not null,
  section          text,
  content          text not null,
  embedding        vector(768),
  risk_level       text not null check (risk_level in ('A', 'B', 'C')),
  fetched_at       timestamptz not null,
  page_updated_at  timestamptz,
  created_at       timestamptz not null default now()
);

create index chunks_risk_level_idx on chunks (risk_level);

create table qa_cache (
  id            bigserial primary key,
  question_hash text not null unique,
  question      text not null,
  question_vec  vector(768),
  answer        text not null,
  index_version text not null,
  hit_count     int default 0,
  created_at    timestamptz default now()
);

create table qa_logs (
  id             bigserial primary key,
  question       text not null,
  answer         text not null,
  provider_used  text,
  search_score   float8,
  feedback       text check (feedback in ('up', 'down')),
  no_answer      boolean not null default false,
  created_at     timestamptz not null default now()
);

alter table circle_registry enable row level security;
alter table circles enable row level security;
alter table chunks enable row level security;
alter table qa_cache enable row level security;
alter table qa_logs enable row level security;
-- ポリシーは定義しない。service_roleキーはRLSをバイパスしてアクセスする一方、
-- anon/authenticatedロールからのアクセスはデフォルトで拒否される状態を維持する
-- （docs/chatbot-decisions.md §4「RLSは多層防御」に対応）。
```

`qa_logs`にはIPアドレス・ユーザー識別子を保存する列を設けない（`docs/chatbot-decisions.md` §13「個人特定情報は保存しない」に対応）。IPレート制限（§1-2 `rate-limit-service.server.ts`）はDBを使わない実装とする（具体的な保持方法は§8「要確認」参照）。

---

## 4. 既存資産の再利用 / 新規作成の切り分け

| # | 既存のもの | パス | 扱い |
|---|---|---|---|
| 1 | フッターの`NavLink`＋`react-icons`＋`aria-label`パターン | `app/components/layout/footer/footer.tsx` | **既存ファイルを変更**。5項目目として`/chat`へのリンクを既存4項目と同じ書き方で追加する |
| 2 | 問い合わせ導線（mailtoリンク） | `app/routes/ad-inquiry.tsx` | **参照のみ、新規作成なし**。「わかりません」時の問い合わせ導線として、`chat-message.tsx`内に同じ`mailto:developer.iFive@gmail.com`リンクを直接埋め込む |
| 3 | サークル関連FAQ2件 | `app/data/faq-list.ts` (`categoryId: "category4"`) | **内容を参照し、`app/data/chatbot-faq.ts`へ新規に書き起こす**。`faq-list.ts`自体は変更しない（対象読者が異なるため別データとして管理） |
| 4 | ニュースカードのUIパターン（画像＋タイトル＋タグ、`line-clamp`、角丸） | `app/components/features/news/news-card.tsx` | **参照のみ、新規作成**。`circle-recommend-card.tsx`はレイアウトパターンを参考にするが、色指定は§5のトークンに置き換える（`news-card.tsx`のハードコード色は踏襲しない） |
| 5 | `NewsData`型の設計（`app/types/news.ts`） | `app/types/news.ts` | **参照のみ**。§2の型定義における命名スタイル（PascalCase、Union型でのステータス表現）の踏襲元 |
| 6 | `services/news-service.ts`の「UIから分離したデータ取得」構成 | `app/services/news-service.ts` | **参照のみ**。§1-2のサーバサービス群の設計方針（呼び出し元は`loader`/`action`、取得ロジックは`services/`）の踏襲元。ただし`news-service.ts`自体は`.server.ts`ではない（秘密情報を扱わないため）点との違いに注意 |
| — | サークル紹介ページ（別ブランチ、未push） | — | **実行時には依存しない**。`docs/chatbot-decisions.md` §9の通り、詳細ページURLは環境変数テンプレートから組み立てる。ただし`app/services/circles/column-map.ts`・`name-overrides.ts`の正規化ロジックは紹介ページ担当と共有する方針（§9参照）。紹介ページのブランチが未pushのため、共有方法（パッケージ化かコピーか）は着手時に別途調整する |
| — | `components/ui/`配下の共通UI | `app/components/ui/` | **現状空。今回が最初の追加**（`loading-spinner.tsx` / `empty-state.tsx`） |

---

## 5. Tailwind CSS v4 実装方針

### 5-1. カラートークン

`app/styles/app.css`の`@theme`に以下を追加する（`docs/design-guidelines.md` §5-2のカラーパレットをそのままトークン化）。

```css
@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

  --color-brand-primary: #1B4D33;
  --color-brand-secondary: #E2E8E5;
  --color-brand-accent: #1F2937;
  --color-brand-bg: #FFFFFF;
  --color-brand-card: #F4F6F4;
}
```

Tailwind v4は`--color-*`をテーマトークンとして自動的にユーティリティクラス化する。これにより`bg-brand-primary` / `text-brand-accent` / `border-brand-secondary` / `bg-brand-card`が使用可能になる。このトークン定義は§6「フェーズ0」として、チャット機能の他のコードより先に着手する。

### 5-2. クラス命名・CSS管理方針

- 本機能の新規コンポーネントは**Tailwindユーティリティクラスのみ**を使用する。CSS Modulesおよび個別`.css`ファイルは作成しない
- 色は5-1のトークン（`brand-*`）を使う。`bg-[#004400]`のような任意値記法での直接指定はしない
- **要確認**: `docs/design-guidelines.md` §15-2は「CSSの管理方法：CSS Modules」と記載されており、上記方針と矛盾する。規約側の記載修正が必要（`docs/chatbot-decisions.md` §17-6で未対応のまま残っている項目）

### 5-3. ブレークポイント

カスタムブレークポイントは定義しない（Tailwind v4のデフォルト: `sm`640px / `md`768px / `lg`1024px / `xl`1280px / `2xl`1536px を使用）。

モバイル/PC表示の分岐は既存コード（`app/components/layout/ad-banner/ad-banner.tsx`の`md:text-base`、`app/routes/faq.tsx`の`md:w-50`など）の慣習に合わせ、**`md:`（768px）を分岐点とする**。`docs/design-guidelines.md` §8-3の「PC表示時は`max-w-md`または`max-w-lg`で`mx-auto`」は`chat-window.tsx`のルート要素に`md:max-w-lg md:mx-auto`として適用する。

---

## 6. 実装フェーズ分割

`docs/development-guidelines.md` §5.4（タスク分割の目安）・§8.2（PRの大きさ）に従い、1フェーズ＝1 Issue＝1 PRとする。ブランチ名は同§6.3の形式（`作業種別/Issue番号-作業内容`）に従い、Issue番号は起票時に確定する（以下は例として`##`と表記）。

| # | 優先度 | Issue名（ブランチ名例） | 依存 | 概要 | 対象ファイル（§1参照） |
|---|---|---|---|---|---|
| 0 | 必須・前提 | `feature/##-chatbot-color-tokens`（デザイントークン定義） | なし | `@theme`にブランドカラートークンを追加 | `app/styles/app.css`（変更） |
| 1 | 必須 | `feature/##-chatbot-db-foundation`（DB基盤） | 0 | DDL適用、Supabaseクライアント、スナップショット読込・フォールバック、`.env.example` | 1-2 (`supabase-client.server.ts`, `snapshot-service.server.ts`)、1-6、1-7 |
| 2 | 必須 | `feature/##-chatbot-circle-data`（サークルデータ層） | 1 | 3状態判定ロジック、フォーム回答CSVの取り込みスクリプト（§9参照） | `circle-service.server.ts`、`app/types/circle.ts`、`scripts/sync-circles.ts`、`app/services/circles/column-map.ts`、`app/services/circles/name-overrides.ts` |
| 3 | 必須 | `feature/##-chatbot-risk-c-block`（C層ブロック） | 1 | C層キーワードリスト作成、判定ロジック | `risk-filter.server.ts`、`app/data/risk-c-keywords.ts` |
| 4 | 高 | `feature/##-chatbot-preset-faq`（事前生成FAQ） | 1 | FAQ20件データ作成、一致判定 | `faq-service.server.ts`、`app/data/chatbot-faq.ts` |
| 5 | 必須 | `feature/##-chatbot-llm-failover`（LLMフェイルオーバー） | 1 | `LLMProvider`実装、Gemini/Cerebrasアダプタ、縮退モード | 1-2の`llm/`配下一式、`app/types/llm.ts` |
| 6 | 必須 | `feature/##-chatbot-api-route`（チャットAPI結線） | 1, 2, 3, 4, 5 | `/api/chat`でカスケード1〜4段＋5b（キーワード検索のみ）＋LLM生成をストリーミングで結線 | `app/routes/api.chat.ts`、`search-service.server.ts`、`app/types/search.ts`、`app/types/chatbot.ts` |
| 7 | 必須 | `feature/##-chatbot-ui`（チャットUI・βバナー） | 6 | チャット画面、サジェスト、βバナー、ガードレール文言、フッター導線追加 | `app/routes/chat.tsx`、1-5一式、`beta-banner.tsx`、`footer.tsx`（変更）、`root.tsx`（変更） |
| 8 | 高 | `feature/##-chatbot-qa-cache`（応答キャッシュ・埋め込み） | 6 | `qa_cache`完全一致／意味的一致、埋め込みサービス | `qa-cache-service.server.ts`、`embedding-service.server.ts` |
| 9 | 高 | `feature/##-chatbot-logging-ratelimit`（QAログ・レート制限） | 6 | `qa_logs`書き込み、フィードバックAPI、IPレート制限 | `qa-log-service.server.ts`、`rate-limit-service.server.ts`、`app/routes/api.chat.feedback.ts`、`feedback-buttons.tsx` |
| 10 | 中 | `feature/##-chatbot-recommend`（レコメンド機能） | 2, 7 | 構造化抽出、レコメンドカードUI | `recommend-service.server.ts`、`circle-recommend-card.tsx` |
| 11 | 中 | `feature/##-chatbot-circle-match-tuning`（サークル検索精度向上） | 2, 8 | かな正規化・別名対応の強一致検索、タグフィルタ、雰囲気タグ | `circle-service.server.ts`（拡張） |
| 12 | 低 | `feature/##-chatbot-vector-search`（ベクトル検索） | 8 | pgvectorによる類似検索本実装、RRF融合 | `search-service.server.ts`（拡張） |

`docs/chatbot-decisions.md` §16の「絶対に落とさないもの」（3状態分岐/C層ブロック/縮退モード/βバナーと非公式表記）はフェーズ0〜7に含まれる。「落とす順序」（ベクトル検索→レコメンド→応答キャッシュ）と対応させ、応答キャッシュ（8）→レコメンド（10）→ベクトル検索（12）の順で後方に配置している。

各フェーズはSupabaseへのマイグレーション適用・環境変数設定など**コード変更以外の準備作業を伴う場合がある**。PR本文にその旨と実施済みかどうかを明記する（`docs/development-guidelines.md` §8.3のPRテンプレートに従う）。

---

## 7. 受け入れ基準（手動確認シナリオ）

| # | シナリオ | 確認方法 |
|---|---|---|
| 1 | C層の質問（例:「今年の合格ボーダーは？」）を送信する | LLMを呼ばず、担当窓口への定型文が返る。ネットワークタブでLLM APIへのリクエストが発生していないことを確認する |
| 2 | 事前生成FAQに一致する質問（例:「サークルに入るにはどうしたらいい？」）を送信する | 静的回答が即座に返る。ネットワークタブでLLM API・埋め込みAPIへのリクエストが発生していないことを確認する |
| 3 | `detailed`状態のサークル名（フォーム回答済みの9件のいずれか）を尋ねる | 詳細情報・写真・紹介ページへのリンク（`CIRCLE_DETAIL_URL_TEMPLATE`未設定時は公式パンフレットへのリンク）が返る |
| 4 | `registered`状態のサークル名（名簿にあるがフォーム未回答）を尋ねる | 「詳細情報はまだありません」＋公式パンフレットへのリンク＋`CIRCLE_INFO_FORM_URL`（Googleフォーム）への導線が返る |
| 5 | 名簿にも存在しないサークル名を尋ねる | 「実在しない」と断定せず、確認できない旨と学生支援課の案内が返る |
| 6 | Gemini・Cerebras双方が429/5xxを返す状態を再現する | エラー画面を表示せず、検索結果カードのみを返す縮退モードで応答する |
| 7 | Supabaseへの接続を切断した状態でアプリを起動する | `app/data/snapshot.json`の内容にフォールバックし、正常に応答する |
| 8 | B層の話題（例:奨学金の具体的な金額）を尋ねる | 制度の存在のみを回答し、金額・条件・期限は生成せず公式ページへ誘導する文言になる |
| 9 | スマートフォン幅（375px程度）でチャット画面を表示する | レイアウト崩れがなく、βバナーと非公式表記が常時表示されている |
| 10 | 質問を送信する | 回答テキストが一括表示ではなく逐次（ストリーミング）で表示される |
| 11 | 回答に対して👍または👎を押す | ボタン押下後にUIへフィードバック反映があり、対応する`qa_logs`行の`feedback`列に値が記録される（DB確認は要Supabaseダッシュボードアクセス） |
| 12 | 曖昧なレコメンド質問（例:「文化系でゆるいところ」）を送信する | 3〜5件のサークルカードが推薦理由付きで返る。条件に該当がゼロ件の場合は、条件を緩めた代替提案が返る |
| 13 | 入力欄付近を確認する | 「入力内容は生成AIの提供元に送信されます。個人情報は入力しないでください」の文言が常時表示されている |
| 14 | 同一IPから短時間に連続して質問を送信する | 設定した回数を超えるとレート制限メッセージが返り、それ以上LLM APIが呼ばれない（具体的な回数は§8「要確認」の値に従う） |
| 15 | 埋め込みAPIを意図的に失敗させる | エラーで落ちず、キーワード検索のみの結果で応答する |

---

## 8. 要確認事項一覧

本書内で「要確認」とした箇所を集約する。推測で値を埋めていないため、各フェーズの着手前に確定させること。

| # | 箇所 | 内容 |
|---|---|---|
| 1 | §1-6 | `supabase/migrations/`の配置がこのプロジェクトの運用（Supabase CLI導入有無）と合っているか未確認 |
| 2 | §1-7 | `CIRCLE_INFO_FORM_URL`（既存のサークル情報収集用Googleフォームの実URL）が未確認 |
| 3 | §1-7 / §7-14 | `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS`（IPレート制限の具体的な回数・時間枠）が未確定 |
| 4 | §1-7 | `SEARCH_SCORE_THRESHOLD`（「わかりません」判定の閾値）が未確定 |
| 5 | §1-7 | `CIRCLE_STRONG_MATCH_THRESHOLD`（サークル名強一致の閾値。「高く設定する」という方針のみ決定済みで数値は未確定） |
| 6 | §1-6 | `circles.photo_urls`が指す実体（Supabase Storageか、`app/assets/`相当の自前配信領域か）の保存先が未確定 |
| 7 | §1-6 | `scripts/generate-snapshot.ts`の実行主体・タイミング（開発者が手動実行してコミットするか、CIで実行するか）が未確定。Renderのビルドコンテナにはgit push権限が無いため、「ビルド時に生成しリポジトリに含める」はRenderの`npm run build`内では成立しない |
| 8 | §5-2 | `docs/design-guidelines.md` §15-2「CSSの管理方法：CSS Modules」の記載が本書の方針（Tailwindユーティリティのみ）と矛盾している。規約側の修正が必要 |
| 9 | 全体 | `docs/chatbot-decisions.md` §17に記載の未確定事項（LLMモデルのGA確認、Cerebrasモデル選定、商用利用可否確認など）は本書の対象外。該当フェーズ（5, 8）の着手前に別途解消すること |
| 10 | §9-4 | `circles.circle_registry_id`は`NOT NULL`かつ`circle_registry`への外部キー。`sync-circles.ts`が団体名を`circle_registry`と突合できなかった場合（§9-4の4番目の分岐）、正規化名のスラッグを警告に使うことは決定済みだが、この団体を`circles`へupsertする手段が現行DDLには無い（FK制約に抵触する）。`circle_registry`側に暫定行を自動作成するか、upsert自体をスキップして警告のみ出すか、着手前に確定させること |
| 11 | §1-6 | `scripts/sync-photos.ts`の実行方法（npm scriptにするか、手動実行のみか、実行タイミング）が未定 |
| 12 | §9-5a | `category`は「団体の形態」列を採用と決定したが、「種別」列の選択肢（実際の回答候補値）が未確認のため、大学公式の分類（委員会/体育系/文化系/同好会）に近いのがどちらかの最終比較ができていない。フォームの実回答を見て「団体の形態」の採用でよいか再確認すること |
| 13 | §9-5a | `photoUrls`（#7・#8の統合）と`snsLinks`（#20・#21の統合）について、2列をどう1つのフィールドへ統合するか（順序、件数上限、重複排除、`snsLinks`のキー命名規則）が未定 |
| 14 | §9-5a / §9-7 | 「ふりがな」「略称・別名」の質問はフォームに追加済みとされているが、スプレッドシートの列に反映されていない可能性がある。反映を確認し、`Circle.kana`/`aliases`の実際の取り込み元を確定させること |

---

## 9. サークル情報取り込み（`scripts/sync-circles.ts`）

サークル紹介フォーム（Googleフォーム）の回答を`circles`テーブルへ反映するための取り込みスクリプトの仕様。8/6当日の応答経路（`/api/chat`）には含めない、開発者が手動実行する運用ツールという位置づけ。

### 9-1. 取り込み方式

フォームの回答スプレッドシートをCSV公開し、そのURL（`CIRCLE_FORM_CSV_URL`、§1-7）を`fetch`して取得・正規化し、`circles`テーブルへupsertする。Google Forms API・サービスアカウント認証は使わない（サークル情報は公開前提のデータであり、認証機構を導入するコストに見合わないため）。

### 9-2. 実行タイミング

`scripts/sync-circles.ts`として実装し、`npm run sync:circles`で開発者が手動実行する。cronによる定期実行、およびリクエスト時（`/api/chat`等）の実行は行わない。8/6当日の応答経路には載せない。

`--dry-run`オプションを実装する。指定時はDBへの書き込みを行わず、検出した差分（追加・更新・警告）を標準出力に表示するのみとする。

### 9-3. 重複行の扱い

フォーム側で「送信後に編集」を有効にしているため、修正による重複行は基本的に発生しない想定。それでも同一団体の行が複数存在する場合は、タイムスタンプが最新の行を採用する。採用しなかった団体名と件数を警告として標準出力に出す（無言で破棄しない）。

### 9-4. id の決定（upsertのキー）

団体名は自由記入のまま運用する（団体数が多くプルダウン化は見送り）。表記ゆれを吸収するため、以下の順で`circle_registry`と突合し、一致した`circle_registry.id`を`circles.circle_registry_id`として使う。

1. 完全一致
2. 正規化後の一致。正規化は全角→半角、スペース除去、前後の空白除去のみ。「部」「同好会」「サークル」等の接尾辞は削除しない（別団体を指している可能性があるため）
3. `app/services/circles/name-overrides.ts`の手動対応表
4. いずれも一致しない場合、正規化した名前のスラッグをidとし、「registry未登録」として団体名を警告に出力する（無言でスキップしない）

4番目の分岐と`circles.circle_registry_id`の`NOT NULL`制約との整合性は§8「要確認」item 10を参照。

### 9-5. 列マッピング

`app/services/circles/column-map.ts`の1ファイルに集約する。CSVのヘッダ行はフォームの質問文そのものであるため、フィールドごとに候補となるヘッダ文字列のパターンを複数持たせる。いずれのパターンにも一致しないヘッダがある場合、`Circle`の必須フィールドに対応付けられないことを意味するため、即座にエラーでスクリプトを停止する（無言で`null`を入れない）。

#### 9-5a. CSVヘッダ実物（2026-08-03時点）

フォームのスプレッドシートの列は以下の22列。上から出現順。

| # | ヘッダ | 対応する`Circle`フィールド | 備考 |
|---|---|---|---|
| 1 | タイムスタンプ | なし | §9-3の重複判定にのみ使用。`Circle`型には対応しない |
| 2 | 団体の形態 | `category`（採用） | `circle_registry`の分類（大学公式パンフレット由来）と突合するために採用。「種別」の選択肢一覧との比較は未実施（下記参照）、暫定はこちらを採用 |
| 3 | 団体名 | `name` | |
| 4 | 種別 | **不採用** | `category`には使わない。ただし本書作成時点でこの列の選択肢（回答の候補値）を確認できていない。大学公式の分類（委員会/体育系/文化系/同好会）に近いのがどちらかの最終確認は、フォームの実回答値を見て判断が必要（§8 item 12参照） |
| 5 | 紹介文 | `description` | |
| 6 | ロゴ画像 | **取り込まない（確定）** | `Circle`型に追加しない |
| 7 | 活動写真（アップロード、5枚まで） | `photoUrls`（統合） | 下記#8と合わせて`photoUrls`へ統合する想定。統合順序・件数上限（5+5枚）・重複排除ロジックは未定 |
| 8 | 活動写真（SNS引用リンク、5枚まで） | `photoUrls`（統合） | 同上 |
| 9 | 活動動画（SNS引用リンク） | **取り込まない（確定）** | `Circle`型に追加しない |
| 10 | 募集期間 | `recruitingPeriod`（新規） | |
| 11 | 活動場所 | `activityLocation`（新規） | |
| 12 | 活動曜日・時間・頻度 | `activityDays` | |
| 13 | 入会費・年会費など | `fee` | |
| 14 | その他費用（用途・金額） | `otherFees`（新規） | |
| 15 | 総人数 | `memberCount` | |
| 16 | 大まかな男女比 | **取り込まない（確定）** | `Circle`型に追加しない |
| 17 | 大まかな初心者：経験者割合 | `beginnerRatio`（新規、`string \| null`） | `beginnerFriendly`（`boolean`）は廃止。true/falseへの変換は情報が落ち変換ルールも恣意的になるため、フォームの回答をそのままテキストで保持する。レコメンドの絞り込み条件には使わず、回答文への記載にのみ使う |
| 18 | 実績（テキストまたはURL） | `achievements`（新規） | |
| 19 | 代表者名 | **取り込まない（確定）** | 個人情報のため`Circle`型に追加しない。チャットボットの回答にも出さない |
| 20 | 団体との連絡手段（SNS・メール等） | `snsLinks`（統合） | 下記#21と合わせて`snsLinks`へ統合する想定。統合ロジック（キーの命名規則等）は未定 |
| 21 | その他SNSリンク | `snsLinks`（統合） | 同上 |
| 22 | 雰囲気・特徴（チェックボックス） | `moodTags`（採用） | フォームのチェックボックス回答をそのまま使う。`docs/chatbot-decisions.md` §11にある「活動写真から雰囲気タグをバッチで生成する」という記述は廃止済みの方針であり、本書（仕様書）側では採用しない |

**「ふりがな」「略称・別名」列について**：フォームには質問を追加済みだが、スプレッドシート側に列としてまだ反映されていない可能性がある。確認・対応は別途行うため、`Circle.kana`／`Circle.aliases`は型定義に維持したままとする（§2）。

#### 9-5b. 「略称・別名」列のパース仕様（列反映後に適用）

- 必須回答ではないため空欄の場合がある。空欄・空文字は`aliases: []`（空配列）として扱う
- 回答者への指示は区切り文字を全角読点「、」としているが、実際の回答では「，」（全角カンマ）や「・」（中黒）で区切られる場合があるため、`、`／`，`／`・`のいずれでも分割できるようにする
- 「なし」という回答は略称が無いことを明示するテキストとして扱い、`aliases: []`とする（文字列`"なし"`をそのまま要素として含めない）
- 分割後は各要素の前後の空白を除去し、区切り文字の連続等で生じた空要素は除外する

### 9-6. バリデーション

必須項目（団体名）が欠けた行は警告を出してその行をスキップする。1行の不備でスクリプト全体を落とさない。

### 9-7. フォーム項目の追加（運用タスク）

フォームに「ふりがな」と「略称・別名」の質問を追加した。`Circle`型の`kana`・`aliases`（§2）に対応する。ただしスプレッドシート側の列にまだ反映されていない可能性があり、確認中（§8 item 14）。反映され次第、既存9件の回答にはこれらの値が入っていないため、スプレッドシート上で手入力する。**これは実装タスクではなく運用タスクとして扱う**（`sync-circles.ts`は既存回答の欠損値を推測・補完しない）。

### 9-8. 活動写真の取り込みの分離

活動写真の取得・リサイズは`scripts/sync-photos.ts`として`sync-circles.ts`とは別スクリプトにする。実行方法は未確定（§8 item 11）。

### 9-9. サークル紹介ページとの共有

サークル紹介ページ（別ブランチ、未push）の担当者と同じ正規化ロジック（`column-map.ts`・`name-overrides.ts`）を使う。スプレッドシートを読むコードを2箇所に作らない。共有方法（パッケージ化かコピーか）は紹介ページのブランチがpushされた時点で調整する（§4参照）。