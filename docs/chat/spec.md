# 学内QAチャットボット 実装仕様書

- ステータス: ドラフト
- 対象日: 2026-08-06（β版公開）
- 決定事項の正本: [decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md)。本書は決定事項を実装可能な単位に分解したものであり、本書と決定事項が矛盾する場合は決定事項を優先する。実装時のより詳細なメモは `docs/chatbot-decisions.md`（ローカル専用、gitignore対象）にもある
- 本書の型定義・DDLは「実装者が迷わないための契約定義」として記載する。関数の中身（実装ロジック）は含めない

---

## 0. 前提とスコープ

- 本仕様書が対象とするのは [decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) に記載された学内QAチャットボット機能のみ
- 既存の `app/routes/`（`_app.tsx` / `_app._index.tsx` / `_app.faq.tsx` / `_app.features.tsx` / `_app.settings.tsx` / `news.tsx` / `ad-inquiry.tsx`）とその配下のコンポーネント・データは変更しない。ナビへの追加のみ既存ファイルを変更する（§4参照）
- ディレクトリ構成・命名規則は `docs/project/architecture.md` および `docs/project/development-guidelines.md` §10.2 に従う（ファイル: kebab-case / コンポーネント・型: PascalCase / 変数・関数: camelCase / 定数: UPPER_SNAKE_CASE）
- **本書で「サークル」と呼ぶ対象は、フォームの「団体の形態」列（§9-5a）で管理される7つの団体形態（部活／サークル／同好会／学内カンパニー／学生委員会／NEXTSTEP工房〈学内カンパニーの派生〉／その他学生有志団体）の総称である**
- **【2026-08-04追記・重要】`develop`に既存の`circle-info`機能（`docs/circle-info/`配下に要件定義・仕様書あり）と、データモデル・データソースを可能な限り一本化する。** `circle-info`は本書と同じ学生団体データ（同じGoogleフォームが情報源、`docs/circle-info/input-sheet.md` Q3-1・Q3-6で確認済み）を扱う独立機能で、`app/types/circle.ts`の`Circle`型・`app/data/circles.ts`（静的データ）・`app/services/circle-service.ts`がすでに実装済み。本書は**新たに`Circle`型やSupabaseテーブルを作らず、`circle-info`の型・データを拡張して再利用する**方針に変更する（詳細は§2・§9・§10）。`circle-info`側の型・コンポーネント・ルートは、拡張以外は変更しない

---

## 1. 新規作成ファイル一覧

### 1-1. ルート（`app/routes/`）

`@react-router/fs-routes` の flatRoutes 規約では `.`（ドット）がURLのセグメント区切りを表す。**この記法は`circle-info`機能（`app/routes/circle-info.tsx`等）ですでに使われている先例がある。**

| ファイル | URL | 種別 |
|---|---|---|
| `app/routes/chat.tsx` | `/chat` | 通常ルート（`default export` あり） |
| `app/routes/api.chat.ts` | `/api/chat` | リソースルート（`action` のみ、`default export` なし） |
| `app/routes/api.chat.feedback.ts` | `/api/chat/feedback` | リソースルート（`action` のみ） |
| `app/routes/api.health.ts` | `/api/health` | リソースルート（`loader` のみ） |

**`/chat`は`_app.tsx`配下に置かない（`_app._index.tsx`のような命名にしない）。** `circle-info.tsx`と同様、`chat.tsx`を独自レイアウトとして扱い、共通ヘッダー（`AppHeader`）や共通ボトムナビ（`BottomNav`）を出さない。理由：チャット画面は入力欄を含む専用UIで、βバナー・非公式表記を常時表示する必要があり（[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §12）、共通ナビと画面下部で競合するため（`circle-info`が共通フッターを隠したのと同じ理由、`root.tsx`参照）。この判断は暫定であり、チーム内で確認すること（§8参照）。

### 1-2. サーバ専用サービス（`app/services/`、`*.server.ts`）

| ファイル | 役割 |
|---|---|
| `app/services/supabase-client.server.ts` | Supabaseクライアント生成（`service_role`キー使用） |
| `app/services/snapshot-service.server.ts` | `data/snapshot.json` の読み込み、DB接続失敗時のフォールバック判定（`chunks`/`qa_cache`/`qa_logs`用。サークルデータは対象外、§9・§10参照） |
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

### 1-2b. サークルデータ関連ロジック（`app/services/`、`.server.ts`ではない）

サークルデータは静的ファイル（`app/data/circles.ts`・`app/data/circle-registry.ts`）で持つため秘密情報を扱わない。クライアントバンドルへ混入しても問題が無いため`*.server.ts`サフィックスは付けない（既存の`circle-service.ts`と同じ扱い）。

| ファイル | 役割 |
|---|---|
| `app/services/circles/column-map.ts` | CSVヘッダ文字列 → `Circle`フィールドの対応表。フィールドごとに候補ヘッダの複数パターンを持つ |
| `app/services/circles/name-overrides.ts` | 団体名の表記ゆれ手動対応表（`circle_registry`との名寄せで自動一致しない場合に参照） |
| `app/services/circle-registry-service.ts` | `app/data/circle-registry.ts`の読み込み、名前・かな・別名によるエントリ検索（§10） |
| `app/services/circle-resolution-service.ts` | 既存の`circle-service.ts`（`app/data/circles.ts`）と`circle-registry-service.ts`を組み合わせた3状態（`detailed`/`registered`/`unknown`）の判定（§2・§10-6） |

### 1-3. 型定義（`app/types/`）

| ファイル | 主な型 |
|---|---|
| `app/types/chatbot.ts` | `ChatRequestBody` / `ChatStreamChunk` |
| `app/types/circle.ts`（既存ファイル、拡張のみ） | 既存の`Circle`型に`kana`/`aliases`を追加（§2） |
| `app/types/circle-registry.ts` | `CircleStatus` / `CircleRegistryEntry` / `CircleResolution` / `RecommendCard`（`circle.ts`とは別ファイルにし、既存ファイルへの変更を最小限にする） |
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
| `app/data/circle-registry-manual.ts` | 学内カンパニー・NEXTSTEP工房の名簿を画像から手動で書き起こしたデータ（§10-3） |
| `app/data/circle-registry.ts` | `scripts/sync-registry.ts`の生成物。クラブ紹介ページのスクレイピング結果と`circle-registry-manual.ts`を統合したもの（§10-5、コミット対象） |

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
| `supabase/migrations/0001_chatbot_schema.sql` | §3のDDL一式（`chunks`/`qa_cache`/`qa_logs`のみ。サークルデータはSupabaseを使わない、§9・§10参照）（配置は要確認、§8参照） |
| `scripts/generate-snapshot.ts` | Supabaseの内容を`app/data/snapshot.json`へ書き出すスクリプト（`chunks`/`qa_cache`/`qa_logs`用） |
| `app/data/snapshot.json` | スナップショットフォールバック用データ（`scripts/generate-snapshot.ts`の生成物、コミット対象） |
| `scripts/sync-registry.ts` | クラブ紹介ページのスクレイピングと`circle-registry-manual.ts`を統合し`app/data/circle-registry.ts`を生成する手動実行スクリプト（§10-5） |
| `scripts/sync-circles.ts` | フォーム回答CSVを取得・正規化し`app/data/circles.ts`を生成する手動実行スクリプト（§9参照）。8/6の応答経路には含めない |
| `scripts/sync-photos.ts` | 活動写真の取得・リサイズ（`sync-circles.ts`から分離）。`public/circles/<id>/`配下への配置は`circle-info`側の既存方針（`docs/circle-info/spec.md` §6.3）に合わせる。実行方法は未定（§8参照） |

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
CIRCLE_INFO_FORM_URL=
RATE_LIMIT_MAX_REQUESTS=
RATE_LIMIT_WINDOW_SECONDS=
SEARCH_SCORE_THRESHOLD=
CIRCLE_STRONG_MATCH_THRESHOLD=
CIRCLE_FORM_CSV_URL=
```

`CIRCLE_FORM_CSV_URL`は`scripts/sync-circles.ts`が取得するフォーム回答スプレッドシートのCSV公開URL（§9参照）。アプリのリクエスト経路では使わないため`.env.example`上は他の変数と区別しない。

**`CIRCLE_DETAIL_URL_TEMPLATE`は廃止した（2026-08-04）。** `detailed`状態の詳細ページは`circle-info`機能の`/circle-info/{id}`にハードコードでリンクする。`circle-info`は同一リポジトリ内の確定した内部ルートであり、環境変数でURLを外部化する理由が無くなったため（[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §6の「紹介ページに依存しない設計」は、紹介ページが未pushだった時点の判断。`circle-info`が同じ`Circle`データを共有するようになったため前提が変わった）。

`CIRCLE_INFO_FORM_URL` / `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS` / `SEARCH_SCORE_THRESHOLD` / `CIRCLE_STRONG_MATCH_THRESHOLD` の具体値は**要確認**（§8参照）。値は空欄のまま各実装フェーズのPRで確定させる。

### 1-8. 変更する既存ファイル（新規作成ではない）

| ファイル | 変更内容 |
|---|---|
| `app/root.tsx` | `/chat`配下でも共通`BottomNav`を隠す条件分岐を追加（`/circle-info`と同じパターン）。`BetaBanner`は`Ad`と同様に常時マウント |
| `app/components/layout/nav-items/app-nav-items.ts` | `APP_NAV_ITEMS`に「チャット」項目を1件追加（既存4項目と同じ書き方） |
| `app/components/features/feature-list/feature-items.ts` | `APP_FEATURES`に「学内QAチャットボット」を1件追加 |
| `package.json` | `generate:snapshot`／`sync:circles`／`sync:registry` スクリプトを追加。`sync:circles`は`scripts/sync-circles.ts`を実行し`--dry-run`オプションを受け付ける。`sync:registry`は`scripts/sync-registry.ts`を実行する（§10-5）。`sync-photos.ts`のnpm scriptは実行方法未定のため保留（§8参照） |

---

## 2. 型・インターフェース定義

命名は既存の `app/types/news.ts`（`NewsData`）と同様、型はPascalCase・プロパティはcamelCaseとする。DBのsnake_caseカラムとの変換はサービス層（`*.server.ts`）内で行い、型定義自体はcamelCaseで統一する。

**【2026-08-04変更】`Circle`型は新規に定義しない。** 既存の`app/types/circle.ts`（`circle-info`機能が定義済み）の`Circle`型をそのまま使い、チャットボットが必要とする2フィールドだけを追加する。既存のサンプルデータ（`app/data/circles.ts`、5件）を壊さないよう、追加フィールドは省略可能（`?`）にする。

```ts
// app/types/circle.ts（既存ファイル。以下の2フィールドを追加するのみ）
export type Circle = {
  // ...既存のフィールド（id, name, organizationType, genres, tags,
  //     recruitmentStatus, isRecommended, summary, description,
  //     recommendedFor, logo, images, activity, fee, members,
  //     achievements, contact, restriction, newcomerEvent,
  //     isOfficial, updatedAt）はそのまま変更しない...

  /** チャットボットのサークル名検索用。circle-infoの画面表示では使わない */
  kana?: string | null;
  /** チャットボットのサークル名検索用。circle-infoの画面表示では使わない */
  aliases?: string[];
};
```

`organizationType`（`ORGANIZATION_TYPES`、部活/サークル/同好会/学内カンパニー/学生委員会/NEXT STEP工房/その他学生有志団体の7種、`app/constants/index.ts`）は、本書がこれまで「団体の形態」と呼んでいたものと同一。今後は`organizationType`という既存の呼び方に合わせる。

`CircleStatus`・`CircleRegistryEntry`・`CircleResolution`・`RecommendCard`はチャットボット固有の新規型のため、既存の`circle.ts`を汚さないよう別ファイルに置く。

```ts
// app/types/circle-registry.ts（新規）
import type { Circle } from "./circle";

export type CircleStatus = "detailed" | "registered" | "unknown";

// circle_registry（クラブ紹介ページ・手動書き起こし由来の名簿。§10）のエントリ。
// circle-infoのCircle型より情報が少ない「名前と分類だけ分かっている団体」を表す
export interface CircleRegistryEntry {
  name: string;
  kana: string | null;
  category: string;
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

**`circleRegistryId`という永続的な紐付けは持たない。** `circles`（`app/data/circles.ts`）と`circle_registry`（`app/data/circle-registry.ts`）はどちらも静的ファイルであり、`circle-resolution-service.ts`が問い合わせのたびに名前・かな・別名でその場突合して`CircleResolution`を導出する（§10-6）。DBのFK制約に相当する問題はそもそも発生しない（§8 item 10、対応済み）。

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

`CircleResolution.status` はどこにも保存しない。名前・かな・別名で`app/data/circles.ts`（既存の`circle-service.ts`経由）に一致すれば`detailed`、`app/data/circle-registry.ts`のみ一致すれば`registered`、どちらにも一致しなければ`unknown`と、`circle-resolution-service.ts`が問い合わせのたびに導出する（データの二重管理を避けるため）。

---

## 3. Supabase テーブル定義（DDL）

`qa_cache`は[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §1に定義済みのため、そのまま転記する（変更しない）。

**【2026-08-04変更】`circle_registry`・`circles`テーブルは作らない。** `circle-info`機能とのデータ統合方針（§0・§2・§9・§10）により、サークルデータは静的ファイル（`app/data/circles.ts`・`app/data/circle-registry.ts`）で持つことにした。Supabaseはチャンク・応答キャッシュ・質問ログのみに使う。

```sql
create extension if not exists vector;

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

alter table chunks enable row level security;
alter table qa_cache enable row level security;
alter table qa_logs enable row level security;
-- ポリシーは定義しない。service_roleキーはRLSをバイパスしてアクセスする一方、
-- anon/authenticatedロールからのアクセスはデフォルトで拒否される状態を維持する
-- （[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §1「RLSは多層防御」に対応）。
```

`qa_logs`にはIPアドレス・ユーザー識別子を保存する列を設けない（[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §10「個人特定情報は保存しない」に対応）。IPレート制限（§1-2 `rate-limit-service.server.ts`）はDBを使わない実装とする（具体的な保持方法は§8「要確認」参照）。

---

## 4. 既存資産の再利用 / 新規作成の切り分け

| # | 既存のもの | パス | 扱い |
|---|---|---|---|
| 1 | 共通ボトムナビの`NavLink`パターン | `app/components/layout/nav-items/app-nav-items.ts` | **既存ファイルを変更**。`APP_NAV_ITEMS`に「チャット」を1件追加する（§1-8） |
| 2 | 機能一覧カードのデータ | `app/components/features/feature-list/feature-items.ts` | **既存ファイルを変更**。`APP_FEATURES`に1件追加する（§1-8） |
| 3 | 問い合わせ導線（mailtoリンク） | `app/routes/ad-inquiry.tsx` | **参照のみ、新規作成なし**。「わかりません」時の問い合わせ導線として、`chat-message.tsx`内に同じ`mailto:developer.iFive@gmail.com`リンクを直接埋め込む |
| 4 | サークル関連FAQ2件 | `app/data/faq-list.ts` (`categoryId: "category4"`) | **内容を参照し、`app/data/chatbot-faq.ts`へ新規に書き起こす**。`faq-list.ts`自体は変更しない（対象読者が異なるため別データとして管理） |
| 5 | `NewsData`型の設計（`app/types/news.ts`） | `app/types/news.ts` | **参照のみ**。§2の型定義における命名スタイル（PascalCase、Union型でのステータス表現）の踏襲元 |
| 6 | `services/news-service.ts`の「UIから分離したデータ取得」構成 | `app/services/news-service.ts` | **参照のみ**。§1-2のサーバサービス群の設計方針（呼び出し元は`loader`/`action`、取得ロジックは`services/`）の踏襲元。ただし`news-service.ts`自体は`.server.ts`ではない（秘密情報を扱わないため）点との違いに注意 |
| 7 | `app/types/circle.ts`の`Circle`型 | `app/types/circle.ts` | **既存ファイルを拡張**。`kana`/`aliases`を省略可能フィールドとして追加する（§2）。既存フィールドは変更しない |
| 8 | `app/services/circle-service.ts`（`fetchCircles`/`fetchCircleById`） | `app/services/circle-service.ts` | **そのまま再利用、変更なし**。`circle-resolution-service.ts`から呼ぶ（§10-6） |
| 9 | `app/data/circles.ts`（サークル静的データ） | `app/data/circles.ts` | **`scripts/sync-circles.ts`の生成対象にする**。現状は`circle-info`チームが手動更新（サンプル5件）だが、フォームの実データ入稿タスクをこのスクリプトで肩代わりする形になる。両チームでの更新競合に注意（§8参照） |
| 10 | `app/constants/index.ts`の`ORGANIZATION_TYPES`/`CIRCLE_GENRES`/`RECRUITMENT_STATUSES` | `app/constants/index.ts` | **参照のみ、変更しない**。`organizationType`の7分類はそのまま使う（§2） |
| 11 | `circle-info.tsx`の独自レイアウト（共通ヘッダー・ボトムナビを持たない）パターン | `app/routes/circle-info.tsx` | **参照のみ**。`chat.tsx`も同様に独自レイアウトにする（§1-1） |
| 12 | `root.tsx`の`/circle-info`限定でボトムナビを隠す条件分岐 | `app/root.tsx` | **参照のみ、同じ形で`/chat`にも追加**（§1-8） |
| 13 | 写真の配置規約（`public/circles/<id>/`、長辺1200px程度に圧縮） | `docs/circle-info/spec.md` §6.3 | **参照のみ、同じ規約に合わせる**。`scripts/sync-photos.ts`の出力先はここに揃える（§8 item 6、対応済み） |
| — | `components/ui/`配下の共通UI | `app/components/ui/` | **現状空。今回が最初の追加**（`loading-spinner.tsx` / `empty-state.tsx`） |

---

## 5. Tailwind CSS v4 実装方針

**【2026-08-04変更】カラートークンはすでに`app/styles/app.css`に実装済み。** `circle-info`機能とあわせてデザイントークン体系（`docs/project/design-guidelines.md` §2・§26）が先行実装され、`develop`にマージされた。本書がフェーズ0として計画していたトークン追加作業は不要になった（§6参照）。

### 5-1. カラートークン（既存、参照のみ）

| トークン | Tailwindクラス例 | 用途 |
| --- | --- | --- |
| `primary` / `primary-hover` / `primary-active` / `primary-subtle` | `bg-primary` `text-primary` `hover:bg-primary-hover` | ブランド強調、主要ボタン |
| `ink` / `ink-muted` | `text-ink` `text-ink-muted` | 本文・見出し／補助テキスト |
| `surface` / `surface-card` | `bg-surface` `bg-surface-card` | 全体背景／カード背景 |
| `border` / `border-strong` | `border-border` `border-border-strong` | 区切り線・枠線 |
| `danger` / `danger-subtle` | `text-danger` `bg-danger` `bg-danger-subtle` | エラー表示 |

チャット機能固有の色（β バナー等）も、新規トークンを追加せずこの一覧から選ぶ（`docs/project/design-guidelines.md` §2.2「独断でトークン外の色を使わない」）。

### 5-2. クラス命名・CSS管理方針

- 本機能の新規コンポーネントは**Tailwindユーティリティクラスを主に**使用する。CSS Modulesは`docs/project/design-guidelines.md` §26.3の例外規定（複雑なキーフレームアニメーション等、理由をPRに記載）に該当する場合のみ使う
- 色は5-1のトークンを使う。`bg-[#004400]`のような任意値記法や、Tailwind標準パレット（`gray-500`等）は使わない（`docs/project/design-guidelines.md` §2.2）

### 5-3. レイアウト・ブレークポイント

`docs/project/design-guidelines.md` §6・§7に従う。

- カスタムブレークポイントは定義しない（Tailwind v4のデフォルトをそのまま使う）
- **本体は`max-w-lg`（512px）の単一カラムで、PCでも列数を増やさない。** `chat-window.tsx`のルート要素に`mx-auto w-full max-w-lg px-4`を適用する（既存の`_app.tsx`配下の画面・`circle-info.tsx`と同じパターン）
- モバイルファーストで書き、`md:`は主にナビゲーション（§1-1で決めた`/chat`独自レイアウトの表示切り替え等）にのみ使う。それ以外で`md:`を多用している場合はレイアウトを見直す

---

## 6. 実装フェーズ分割

`docs/project/development-guidelines.md` §5.4（タスク分割の目安）に従い、1フェーズ＝1 Issueとする。ブランチ運用は同§6.6に従い、フェーズごとに新しいブランチは切らず、機能全体で1本の作業ブランチを使う。各フェーズはそのブランチへのコミット（およびpush）として積み重ね、`main`へのマージは機能全体の完成時に1回行う。

| # | 優先度 | 依存 | 概要 | 対象ファイル（§1参照） |
|---|---|---|---|---|
| 0 | ~~必須・前提~~ | — | **完了（対応不要）。** `circle-info`機能とあわせてカラートークンが`develop`に実装済み（§5参照）。フェーズ番号は欠番として維持する | — |
| 1 | 必須 | なし | DDL適用（`chunks`/`qa_cache`/`qa_logs`のみ）、Supabaseクライアント、スナップショット読込・フォールバック、`.env.example` | 1-2 (`supabase-client.server.ts`, `snapshot-service.server.ts`)、1-6、1-7 |
| 2 | 必須 | 1 | サークルデータ取り込み（`sync-circles.ts`／`sync-registry.ts`）、3状態判定ロジック（§9・§10参照） | `app/types/circle.ts`（拡張）、`app/types/circle-registry.ts`、`scripts/sync-circles.ts`、`scripts/sync-registry.ts`、`app/services/circles/column-map.ts`、`app/services/circles/name-overrides.ts`、`app/services/circle-registry-service.ts`、`app/services/circle-resolution-service.ts` |
| 3 | 必須 | 1 | C層キーワードリスト作成、判定ロジック | `risk-filter.server.ts`、`app/data/risk-c-keywords.ts` |
| 4 | 高 | 1 | FAQ20件データ作成、一致判定 | `faq-service.server.ts`、`app/data/chatbot-faq.ts` |
| 5 | 必須 | 1 | `LLMProvider`実装、Gemini/Cerebrasアダプタ、縮退モード | 1-2の`llm/`配下一式、`app/types/llm.ts` |
| 6 | 必須 | 1, 2, 3, 4, 5 | `/api/chat`でカスケード1〜4段＋5b（キーワード検索のみ）＋LLM生成をストリーミングで結線 | `app/routes/api.chat.ts`、`search-service.server.ts`、`app/types/search.ts`、`app/types/chatbot.ts` |
| 7 | 必須 | 6 | チャット画面、サジェスト、βバナー、ガードレール文言、ナビ導線追加 | `app/routes/chat.tsx`、1-5一式、`beta-banner.tsx`、`app-nav-items.ts`（変更）、`feature-items.ts`（変更）、`root.tsx`（変更） |
| 8 | 高 | 6 | `qa_cache`完全一致／意味的一致、埋め込みサービス | `qa-cache-service.server.ts`、`embedding-service.server.ts` |
| 9 | 高 | 6 | `qa_logs`書き込み、フィードバックAPI、IPレート制限 | `qa-log-service.server.ts`、`rate-limit-service.server.ts`、`app/routes/api.chat.feedback.ts`、`feedback-buttons.tsx` |
| 10 | 中 | 2, 7 | 構造化抽出、レコメンドカードUI | `recommend-service.server.ts`、`circle-recommend-card.tsx` |
| 11 | 中 | 2, 8 | かな正規化・別名対応の強一致検索、タグフィルタ、雰囲気タグ | `circle-registry-service.ts`／`circle-resolution-service.ts`（拡張） |
| 12 | 低 | 8 | pgvectorによる類似検索本実装、RRF融合 | `search-service.server.ts`（拡張） |

[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §10の「省略しない4つ」（3状態分岐/C層ブロック/縮退モード/βバナーと非公式表記）はフェーズ0〜7に含まれる。「落とす順序」（ベクトル検索→レコメンド→応答キャッシュ）と対応させ、応答キャッシュ（8）→レコメンド（10）→ベクトル検索（12）の順で後方に配置している。

各フェーズはSupabaseへのマイグレーション適用・環境変数設定など**コード変更以外の準備作業を伴う場合がある**。PR本文にその旨と実施済みかどうかを明記する（`docs/project/development-guidelines.md` §8.3のPRテンプレートに従う）。

---

## 7. 受け入れ基準（手動確認シナリオ）

| # | シナリオ | 確認方法 |
|---|---|---|
| 1 | C層の質問（例:「今年の合格ボーダーは？」）を送信する | LLMを呼ばず、担当窓口への定型文が返る。ネットワークタブでLLM APIへのリクエストが発生していないことを確認する |
| 2 | 事前生成FAQに一致する質問（例:「サークルに入るにはどうしたらいい？」）を送信する | 静的回答が即座に返る。ネットワークタブでLLM API・埋め込みAPIへのリクエストが発生していないことを確認する |
| 3 | `detailed`状態のサークル名（`app/data/circles.ts`に掲載されている団体のいずれか）を尋ねる | 詳細情報・写真・`/circle-info/{id}`へのリンクが返る |
| 4 | `registered`状態のサークル名（名簿にあるがフォーム未回答）を尋ねる | 「詳細情報はまだありません」＋公式パンフレットへのリンク＋`CIRCLE_INFO_FORM_URL`（Googleフォーム）への導線が返る |
| 5 | 名簿にも存在しないサークル名を尋ねる | 「実在しない」と断定せず、確認できない旨と学生支援課の案内が返る |
| 6 | Gemini・Cerebras双方が429/5xxを返す状態を再現する | エラー画面を表示せず、検索結果カードのみを返す縮退モードで応答する |
| 7 | Supabaseへの接続を切断した状態でアプリを起動する | `app/data/snapshot.json`の内容にフォールバックし、正常に応答する |
| 8 | B層の話題（例:奨学金の具体的な金額）を尋ねる | 制度の存在のみを回答し、金額・条件・期限は生成せず公式ページへ誘導する文言になる |
| 9 | スマートフォン幅（375px程度）でチャット画面を表示する | レイアウト崩れがなく、βバナーと非公式表記が常時表示されている |
| 10 | 質問を送信する | 回答テキストが一括表示ではなく逐次（ストリーミング）で表示される |
| 11 | 回答に対して👍または👎を押す | ボタン押下後にUIへフィードバック反映があり、対応する`qa_logs`行の`feedback`列に値が記録される（DB確認は要Supabaseダッシュボードアクセス） |
| 12 | 曖昧なレコメンド質問（例:「文化系でゆるいところ」）を送信する | 3〜5件のサークルカードが推薦理由付きで返る。条件に該当がゼロ件の場合は、条件を緩めた代替提案が返る |
| 13 | 入力欄付近を確認する | 「入力内容は生成AIの提供元に送信されます。個人情報は入力しないでください」の文言が表示されている（初回表示・再読み込み時は必ず表示される。ユーザーの操作で閉じるボタンにより一時的に非表示にできる） |
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
| 6 | §1-6 | **対応済み。** 写真の保存先は`circle-info`側の既存規約（`public/circles/<id>/`、`docs/circle-info/spec.md` §6.3）に合わせる。Supabase Storageは使わない |
| 7 | §1-6 | `scripts/generate-snapshot.ts`の実行主体・タイミング（開発者が手動実行してコミットするか、CIで実行するか）が未確定。Renderのビルドコンテナにはgit push権限が無いため、「ビルド時に生成しリポジトリに含める」はRenderの`npm run build`内では成立しない |
| 9 | 全体 | β版公開（8/6）前に確認していた未確定事項（LLMモデルのGA確認、Cerebrasモデル選定、商用利用可否確認など）は公開時点で解消済み。新たな未確認事項が出た場合はこの表に追記する |
| 10 | §9-4 | **対応済み（問題自体が解消）。** `circle_registry`をSupabaseテーブルから静的ファイル（`app/data/circle-registry.ts`）に変更したため、FK制約は存在しない。§9-4の「registry未登録」警告は、単なる名寄せ結果の警告出力（データの書き込み先を問わない）として扱う |
| 11 | §1-6 | `scripts/sync-photos.ts`の実行方法（npm scriptにするか、手動実行のみか、実行タイミング）が未定 |
| 12 | §9-5a / §10-2 | `Circle.organizationType`（既存の`circle-info`の呼称。旧称「団体の形態」7種）は採用済み。`circle_registry`側の分類（学生委員会/体育系/文化系/同好会の4種）とは軸が異なるが、**別軸のまま許容する（対応済み、item 17参照）**。「種別」列との比較は不要（採用元は「団体の形態」＝`organizationType`で確定） |
| 13 | §9-5a | `images`（#7・#8の統合）と`contact.links`（#20・#21の統合）について、2列をどう1つのフィールドへ統合するか（順序、件数上限、重複排除）が未定 |
| 14 | §9-5a / §9-7 | 「ふりがな」「略称・別名」の質問はフォームに追加済みとされているが、スプレッドシートの列に反映されていない可能性がある。反映を確認し、`Circle.kana`/`aliases`の実際の取り込み元を確定させること |
| 15 | §10 | `circle_registry`の集約方針（データソース、取り込み方法、実行スクリプト）は§10で確定した。`scripts/sync-registry.ts`（§10-5）の具体的な実装（クラブ紹介ページのHTMLパース処理）はまだ書いていない |
| 16 | §10-2 / §10-3 | **対応済み。** `CircleRegistryEntry.kana`は`null`許容とした（§2）。ふりがなはフォーム回答済みの団体（`Circle.kana`）のみが持つ情報として扱い、名簿にしか無い団体（`circle_registry`のみ）はかな無しを許容する |
| 17 | §10-2 | **対応済み。** `CircleRegistryEntry.category`（4種）と`Circle.organizationType`（7種）は別軸のまま許容する。将来的に全団体がフォーム回答するようになれば名簿（`circle_registry`）の利用は縮小していく想定のため、今の時点で軸を揃える設計コストはかけない |
| 18 | §10-4 | 「その他学生有志団体」は`circle_registry`への投入元が無い。フォーム回答（`app/data/circles.ts`）があれば`detailed`として表示・回答はできるが、`circle_registry`には対応エントリが作れないため、フォーム未回答の同団体形態は`unknown`にしかならない。この制約を許容するかどうか確認すること（item 10のFK制約は解消済みのため、この点のみ残る） |
| 19 | §1-1 | **対応済み（暫定判断のまま確定、2026-08-04）。** `/chat`は`_app.tsx`配下に置かない独自レイアウトとする |
| 20 | §9-5a | `circle-info`の`Circle`型が持つ`genres`/`tags`/`recruitmentStatus`/`isRecommended`/`summary`/`recommendedFor`/`restriction`/`newcomerEvent`/`isOfficial`に対応するCSV列が、共有されているヘッダ一覧（§9-5a）に見当たらない。フォームに列が無いのか、まだ共有されていないだけかを確認すること。列が無い場合、`sync-circles.ts`はこれらのフィールドを空値／デフォルト値のまま生成し、`circle-info`チームが手動で補完する運用になる想定だが、その運用分担も確認が必要 |
| 21 | §4 / §9-2a | **対応済み（2026-08-04）。** `sync-circles.ts`は「実行前のgit未コミット変更チェック」と「フィールド単位マージ（`circle-info`所有フィールドは上書きしない）」の2段構えで、`circle-info`チームの手動編集との競合を防ぐ設計にした（§9-2a）。運用上の確認事項として残るのは、この設計の実装自体（マージロジックのテスト）のみ |
| 22 | §9-4 | `app/data/circles.ts`の新規エントリに振る`id`（スラッグ）の生成方法が未定。日本語の団体名から一意で読める`id`を機械的に生成する方法（ローマ字変換ライブラリの使用、連番、`name-overrides.ts`での手動指定等）を確認すること |
| 23 | §9-5a | `app/constants/index.ts`の`ORGANIZATION_TYPES`は`"NEXT STEP工房"`（スペースあり）だが、本書はこれまで`"NEXTSTEP工房"`（スペースなし）と表記していた。フォームの実際の回答値がどちらの表記かを確認し、`column-map.ts`の突合で表記ゆれとして扱う必要がある |
| 24 | §9-5a | CSVの1列とCircle型の構造化フィールドが対応しない箇所が2つある：(a) 「入会費・年会費など」が1列なのに`fee.admission`/`fee.annual`は別フィールド、(b) 「実績」が自由記述1つなのに`achievements`は`{year, content}[]`の配列。どちらも自動分割は信頼性が低い。暫定の格納方法を決めるか、フォーム自体の質問を分割するか確認すること |
| 25 | §9-5a | **対応済み（2026-08-04）。** `sync-circles.ts`はCSVの「代表者名」列を取り込まない（個人情報のため）。`contact.representative`への値の設定は`circle-info`チームの手動編集に委ねる（本書のスクリプトは書き込まない・上書きしない）。チャットボットの回答にも出さない |

---

## 9. サークル情報取り込み（`scripts/sync-circles.ts`）

サークル紹介フォーム（Googleフォーム。`circle-info`機能とのデータ統合方針、§0参照）の回答から`app/data/circles.ts`を生成するスクリプトの仕様。8/6当日の応答経路（`/api/chat`）には含めない、開発者が手動実行する運用ツールという位置づけ。**`circle-info`チームが計画していた「実データ入稿」（`docs/circle-info/spec.md` §11で未着手）を、このスクリプトが肩代わりする形になる。**

### 9-1. 取り込み方式

フォームの回答スプレッドシートをCSV公開し、そのURL（`CIRCLE_FORM_CSV_URL`、§1-7）を`fetch`して取得・正規化し、`app/data/circles.ts`（既存の`Circle[]`配列、§2）へ**マージする（上書きしない、§9-2a）**。Google Forms API・サービスアカウント認証は使わない（サークル情報は公開前提のデータであり、認証機構を導入するコストに見合わないため）。

### 9-2. 実行タイミング

`scripts/sync-circles.ts`として実装し、`npm run sync:circles`で開発者が手動実行する。cronによる定期実行、およびリクエスト時（`/api/chat`等）の実行は行わない。8/6当日の応答経路には載せない。

**生成物（`app/data/circles.ts`）は開発者が差分を確認してコミットする。** `scripts/generate-snapshot.ts`と同じ理由（§8 item 7）で、Renderのビルドコンテナには git push 権限が無いため、ビルド時の自動生成では成立しない。

`--dry-run`オプションを実装する。指定時はファイルへの書き込みを行わず、検出した差分（追加・更新・警告）を標準出力に表示するのみとする。

### 9-2a. `app/data/circles.ts`の安全な更新方法（`circle-info`チームとの競合対策）

`app/data/circles.ts`は`sync-circles.ts`（本スクリプト）と`circle-info`チームの手動編集の両方が触る（§9-9）。単純な「CSVの内容で全体を上書き」は、`circle-info`チームが加えた変更（未コミット・未pushのものを含む）を消してしまう事故につながる（§8 item 21）。これを防ぐため、以下の2つの対策をスクリプトの仕様として組み込む。

**① 実行前のgit状態チェック（未コミット変更の検知）**

スクリプト開始時に`git status --porcelain app/data/circles.ts`相当のチェックを行い、**このファイルに未コミットの変更がある場合は、書き込みを行わずエラーで停止する。** `circle-info`チームが作業中（ローカルで編集中、または未push）である可能性を機械的に検知するための安全装置。`--force`のような無視オプションは用意しない（無視したいなら先にコミットさせる）。

**② フィールド単位のマージ（上書きしない）**

CSVの各行を、既存の`app/data/circles.ts`の該当エントリ（§9-4の名寄せロジックで名前一致するもの）に対して**フィールド単位で**反映する。フィールドを「フォーム（sync-circles.ts）が所有する」ものと「`circle-info`チームが手動で管理する」ものに分け、後者は一切書き換えない。

| 区分 | フィールド |
|---|---|
| フォーム所有（`sync-circles.ts`が上書きする） | `name`, `organizationType`, `kana`, `aliases`, `description`, `activity.*`, `fee.*`, `members.*`, `achievements`, `images`, `logo`, `tags`, `contact.email`, `contact.links` |
| `circle-info`チーム所有（`sync-circles.ts`は触らない） | `genres`, `recruitmentStatus`, `isRecommended`, `summary`, `recommendedFor`, `restriction`, `newcomerEvent`, `isOfficial`, `contact.representative`（§8 item 25） |

- 既存エントリ（名寄せで一致）：フォーム所有フィールドのみ上書きし、`circle-info`チーム所有フィールドは既存の値をそのまま保持する
- CSVにあるが既存エントリに無い団体：新規エントリとして追加する。`circle-info`チーム所有フィールドは安全側のデフォルト値（`isRecommended: false`等）で初期化し、後から`circle-info`チームが手動で埋める前提とする
- 既存エントリにあるがCSVに無い団体（`circle-info`チームが独自に追加した団体等）：**削除しない**。そのまま残す

### 9-3. 重複行の扱い

フォーム側で「送信後に編集」を有効にしているため、修正による重複行は基本的に発生しない想定。それでも同一団体の行が複数存在する場合は、タイムスタンプが最新の行を採用する。採用しなかった団体名と件数を警告として標準出力に出す（無言で破棄しない）。

### 9-4. `circle_registry`との名寄せ（データ品質チェック）

団体名は自由記入のまま運用する（団体数が多くプルダウン化は見送り）。表記ゆれを吸収するため、以下の順で`app/data/circle-registry.ts`（§10）と突合する。**`circles`と`circle_registry`は静的ファイル同士で、FKのような永続的な紐付けは持たない（§2）。ここでの突合は「公式名簿に無い団体名で登録されていないか」を警告するデータ品質チェックであり、書き込み先を決めるものではない。**

1. 完全一致
2. 正規化後の一致。正規化は全角→半角、スペース除去、前後の空白除去のみ。「部」「同好会」「サークル」等の接尾辞は削除しない（別団体を指している可能性があるため）
3. `app/services/circles/name-overrides.ts`の手動対応表
4. いずれも一致しない場合、「registry未登録」として団体名を警告に出力する（無言でスキップしない。ただし`circles.ts`への追加自体は妨げない）

#### 9-4a. `id`（スラッグ）の生成

`Circle.id`はURLパラメータ（`/circle-info/:circleId`）にそのまま使われる文字列。既存のサンプルデータは`"sample-company"`のように英語スラッグだが、実データは日本語の団体名からの自動生成が必要になる。**生成方法（ローマ字変換ライブラリの使用、連番、`name-overrides.ts`での手動指定等）は未定（§8 item 22）。**

### 9-5. 列マッピング

`app/services/circles/column-map.ts`の1ファイルに集約する。CSVのヘッダ行はフォームの質問文そのものであるため、フィールドごとに候補となるヘッダ文字列のパターンを複数持たせる。いずれのパターンにも一致しないヘッダがある場合、`Circle`の必須フィールドに対応付けられないことを意味するため、即座にエラーでスクリプトを停止する（無言で`null`を入れない）。

#### 9-5a. CSVヘッダ実物（2026-08-03時点）

フォームのスプレッドシートの列は以下の22列。上から出現順。**対応する`Circle`フィールドは、既存の`circle-info`の型（ネスト構造、§2）に合わせて2026-08-04に全面的に見直した。**

| # | ヘッダ | 対応する`Circle`フィールド | 備考 |
|---|---|---|---|
| 1 | タイムスタンプ | なし | §9-3の重複判定にのみ使用。`Circle`型には対応しない |
| 2 | 団体の形態 | `organizationType`（採用） | 回答候補は7種（部活／サークル／同好会／学内カンパニー／学生委員会／NEXT STEP工房／その他学生有志団体、`ORGANIZATION_TYPES`）。表記が`"NEXTSTEP工房"`か`"NEXT STEP工房"`か要確認（§8 item 23） |
| 3 | 団体名 | `name` | |
| 4 | 種別 | **不採用** | `organizationType`には使わない（§8 item 12） |
| 5 | 紹介文 | `description` | `summary`（一覧カード用の短文）はCSVに対応列が無い。`circle-info`側の既存フォールバック（`description`冒頭を代用、`spec.md` §3-3）に任せ、`summary`は生成しない |
| 6 | ロゴ画像 | `logo` | 画像ファイルの扱いは`sync-photos.ts`（§9-8）と同じ枠組みで処理する想定 |
| 7 | 活動写真（アップロード、5枚まで） | `images`（統合） | 下記#8と合わせて`images`へ統合。`images[0]`がヒーロー画像・サムネイルに使われる（`circle-info`仕様）ため、統合順序が重要。件数上限（5+5枚）・重複排除ロジックは未定（§8 item 13） |
| 8 | 活動写真（SNS引用リンク、5枚まで） | `images`（統合） | 同上 |
| 9 | 活動動画（SNS引用リンク） | **取り込まない（確定）** | `Circle`型に対応フィールドが無い |
| 10 | 募集期間 | `activity.recruitmentPeriod` | |
| 11 | 活動場所 | `activity.place` | |
| 12 | 活動曜日・時間・頻度 | `activity.schedule` | |
| 13 | 入会費・年会費など | **要確認** | `Circle`型は`fee.admission`（入会費）と`fee.annual`（年会費）が別フィールドだが、CSVは1列にまとまっている。自動分割は信頼性が低いため、どちらか一方（例:`fee.annual`）にそのまま入れ、他方は空にするか、フォーム自体を2列に分けるか要確認（§8 item 24） |
| 14 | その他費用（用途・金額） | `fee.other` | |
| 15 | 総人数 | `members.total` | |
| 16 | 大まかな男女比 | `members.genderRatio` | |
| 17 | 大まかな初心者：経験者割合 | `members.beginnerRatio`（`string \| null`） | true/falseへの変換は情報が落ち変換ルールも恣意的になるため、フォームの回答をそのままテキストで保持する（既存の`circle-info`の型もこの設計） |
| 18 | 実績（テキストまたはURL） | **要確認** | `Circle.achievements`は`{ year, content }[]`の配列だが、CSVは1つの自由記述。年ごとに機械的に分割する方法が無いため、`content`にそのまま入れ`year`は空文字にする（1件のみの配列）か、`circle-info`チームが後から手動整形するかを確認（§8 item 24） |
| 19 | 代表者名 | **取り込まない（確定、2026-08-04）** | 個人情報のため`sync-circles.ts`では取り込まない。`Circle.contact.representative`は`circle-info`チームが手動で管理するフィールドとし、本スクリプトは書き込み・上書きのどちらも行わない（§8 item 25、§9-9の担当分担参照） |
| 20 | 団体との連絡手段（SNS・メール等） | `contact.email` / `contact.links`（統合） | メールアドレス形式なら`contact.email`、SNS/WebのURLなら下記#21と合わせて`contact.links`（`type`は`instagram`/`x`/`website`/`other`をURLパターンで判定） |
| 21 | その他SNSリンク | `contact.links`（統合） | 同上 |
| 22 | 雰囲気・特徴（チェックボックス） | `tags`（変更） | `circle-info`の`tags`は自由タグ（「ガチ」「エンジョイ」「初心者歓迎」「週1以下」等、`docs/circle-info/requirements.md` §6.3の例）を指しており、この列と一致する可能性が高い。**`moodTags`という独自フィールドは廃止し、既存の`tags`を使う** |

**`genres`（運動系/文化系/音楽系/学術系/ボランティア/その他）に対応するCSV列が無い。** `recruitmentStatus`（募集中/募集停止）・`isRecommended`・`recommendedFor`・`restriction`・`newcomerEvent`・`isOfficial`も同様に対応列が無い（§8 item 20）。

**「ふりがな」「略称・別名」列について**：フォームには質問を追加済みだが、スプレッドシート側に列としてまだ反映されていない可能性がある。確認・対応は別途行うため、`Circle.kana`／`Circle.aliases`は型定義に維持したままとする（§2）。

#### 9-5b. 「略称・別名」列のパース仕様（列反映後に適用）

- 必須回答ではないため空欄の場合がある。空欄・空文字は`aliases: []`（空配列）として扱う
- 回答者への指示は区切り文字を全角読点「、」としているが、実際の回答では「，」（全角カンマ）や「・」（中黒）で区切られる場合があるため、`、`／`，`／`・`のいずれでも分割できるようにする
- 「なし」という回答は略称が無いことを明示するテキストとして扱い、`aliases: []`とする（文字列`"なし"`をそのまま要素として含めない）
- 分割後は各要素の前後の空白を除去し、区切り文字の連続等で生じた空要素は除外する

### 9-6. バリデーション

必須項目（団体名）が欠けた行は警告を出してその行をスキップする。1行の不備でスクリプト全体を落とさない。

### 9-7. フォーム項目の追加（運用タスク）

フォームに「ふりがな」と「略称・別名」の質問を追加した。`Circle`型の`kana`・`aliases`（§2）に対応する。ただしスプレッドシート側の列にまだ反映されていない可能性があり、確認中（§8 item 14）。反映され次第、既存回答にはこれらの値が入っていないため、スプレッドシート上で手入力する。**これは実装タスクではなく運用タスクとして扱う**（`sync-circles.ts`は既存回答の欠損値を推測・補完しない）。

### 9-8. 活動写真・ロゴの取り込みの分離

活動写真・ロゴ画像の取得・リサイズは`scripts/sync-photos.ts`として`sync-circles.ts`とは別スクリプトにする。配置先は`public/circles/<id>/`とし、`circle-info`側の既存規約（`docs/circle-info/spec.md` §6.3、長辺1200px程度に圧縮）に合わせる（§8 item 6、対応済み）。実行方法は未確定（§8 item 11）。

### 9-9. `circle-info`との共有・更新の分担

`app/services/circles/column-map.ts`・`name-overrides.ts`の正規化ロジックは、サークル紹介ページ担当と同じものを使う（スプレッドシートを読むコードを2箇所に作らない）。

**`app/data/circles.ts`の更新は、`sync-circles.ts`（自動生成）と`circle-info`チームの手動編集の両方が発生する前提で設計する。** フィールド単位の所有権分担とgit状態チェックによる安全装置を§9-2aで定義済み（§8 item 21、対応済み）。

### 9-10. `circle_registry`の投入元について

`circle_registry`の投入元は`scripts/sync-circles.ts`（本節、`app/data/circles.ts`の生成）とは別物であり、独立した節（§10）で扱う。

---

## 10. サークル名簿（`circle_registry`）の取り込み

「サークル」と呼んでいる対象は、厳密には7つの団体形態（部活／サークル／同好会／学内カンパニー／学生委員会／NEXT STEP工房〈学内カンパニーの派生〉／その他学生有志団体、`organizationType`）の総称であり、フォームの「団体の形態」列（§9-5a）で管理される（[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §6参照）。それぞれの団体形態には対応する名簿が存在するが、様式は統一されていない。`circle_registry`（`app/data/circle-registry.ts`、`CircleRegistryEntry[]`、§2）はこれらを集約して作る**静的ファイル**（Supabaseは使わない、§3参照）。

### 10-1. 団体形態とデータソースの対応

| 団体形態 | 名簿のソース | 取り込み方法 |
|---|---|---|
| 部活・サークル・学生委員会 | [大学公式サイトのクラブ紹介ページ](https://www.iwate-u.ac.jp/campus/activity/club.html) | スクレイピング（§10-2） |
| 学内カンパニー・NEXT STEP工房 | 画像ファイル（一覧） | 手動で書き起こし、`app/data/circle-registry-manual.ts`に記載（§10-3） |
| その他学生有志団体 | ソースなし | 取り込まない（§10-4） |

### 10-2. 部活・サークル・学生委員会（クラブ紹介ページ）

`https://www.iwate-u.ac.jp/campus/activity/club.html`は、学生委員会（6団体）／体育系（約50団体）／文化系（約40団体）／同好会（約60団体以上）の4分類に分かれた単純な`ul`/`li`のリストで、約7〜8割の団体は個別紹介PDFへのリンクを持つ（本書作成時点での実地確認結果）。

- **団体名以外の情報がほぼ無い。ふりがな（かな）の記載が無い。** `CircleRegistryEntry.kana`は`null`許容（§2）とし、この情報源からはかなを取得しない。ふりがなはフォーム回答済みの団体（`Circle.kana`）のみが持つ情報として扱う（§8 item 16、対応済み）
- 個別紹介PDFの内容は転載しない（著作権のため、[decisions/0004-chatbot-architecture.md](../decisions/0004-chatbot-architecture.md) §6と同じ方針）。取得するのは団体名と分類（学生委員会/体育系/文化系/同好会）のみ
- ページの分類（学生委員会/体育系/文化系/同好会の4分類）と、フォームの`organizationType`（7分類、§9-5a）は軸が異なるが、揃えない設計とする。`CircleRegistryEntry.category`にはこのページの4分類がそのまま入り、`Circle.organizationType`（7分類）とは別軸として扱う（§8 item 17、対応済み）
- スクレイピングの実行方法（`scripts/sync-registry.ts`として`sync-circles.ts`と同様に手動実行する想定。§10-5）、および対象ページのHTML構造が変わった場合の検知方法は未定

### 10-3. 学内カンパニー・NEXT STEP工房（手動書き起こし）

一覧が画像ファイルでしか存在しないため、担当者が手動で文字起こしする。書き起こし先のファイル形式は本書で以下のように定める。

`app/data/circle-registry-manual.ts`（新規作成）に、他の静的データ（`app/data/chatbot-faq.ts`等）と同じ構成で、型付きの配列として記載する。

```ts
// app/data/circle-registry-manual.ts
import type { CircleRegistryEntry } from "~/types/circle-registry";

export const MANUAL_REGISTRY_ENTRIES: CircleRegistryEntry[] = [
  // 画像の一覧から手動で書き起こす。category は "学内カンパニー" か "NEXT STEP工房"
];
```

CSVではなくTypeScriptファイルを選んだ理由：`npm run typecheck`で入力ミス（フィールド抜け、`category`の値の誤記等）を機械的に検出できるため。CSVだとこの安全網が無い。

- 画像にふりがなの記載が無ければ`kana`は`null`のままでよい（§8 item 16、対応済み）。判明している範囲でのみ入力し、無理に推測しない
- このファイルは`app/data/circles.ts`とは無関係（`circle_registry`専用）。§9の取り込みと混同しないこと

### 10-4. その他学生有志団体（名簿ソースなし）

名簿となるソースが存在しないため、`circle_registry`へは投入しない。フォームでこの団体形態を選んだ団体は、`app/data/circles.ts`には入る（`detailed`扱い）が、`circle_registry`に対応するエントリが無いため、フォーム回答が無い同団体形態は`unknown`にしかならない。この制約を許容するかどうか、着手前に確認すること（§8 item 18）。

### 10-5. 実行スクリプト（`scripts/sync-registry.ts`）

`scripts/sync-registry.ts`として実装し、`npm run sync:registry`で手動実行する（`scripts/sync-circles.ts`とは別スクリプト）。§10-2（クラブ紹介ページのスクレイピング）と§10-3（`circle-registry-manual.ts`の読み込み）の結果を統合して`app/data/circle-registry.ts`を生成・上書きする。生成物は開発者が差分を確認してコミットする（§9-2と同じ理由）。cronやリクエスト時実行は行わず、8/6の応答経路には載せない。

### 10-6. `circles`取り込み（§9）との関係

`scripts/sync-circles.ts`（§9）は`app/data/circles.ts`のみを対象とし、`circle_registry`へは書き込まない。実行順序は「`sync-registry.ts`を先に実行し`circle_registry`を最新化してから、`sync-circles.ts`を実行する」ことを想定する（§9-4の名寄せが`circle_registry`の最新データを前提とするため）。この実行順序の依存関係は運用手順（READMEまたはPRテンプレート）に明記すること。

`circle-resolution-service.ts`（§1-2b）は、実行時に`app/services/circle-service.ts`（`app/data/circles.ts`）と`circle-registry-service.ts`（`app/data/circle-registry.ts`）の両方を読み、名前・かな・別名で突合して`CircleResolution`（§2）を都度導出する。