# サークル情報（circle-info）仕様書

- ステータス: **レビュー待ち**
- 最終更新: 2026-08-02
- 対象: MVP（2026/08/06）
- 前提: [requirements.md](./requirements.md)、画面イメージ [images/](./images/)

---

## 1. 画面構成

| 画面 | URL | ルートファイル | 画面イメージ |
| --- | --- | --- | --- |
| 共通レイアウト | — | `app/routes/circle-info.tsx` | 全画像のヘッダー・ボトムナビ |
| ホーム | `/circle-info` | `app/routes/circle-info._index.tsx` | `ホームページ構成.png` |
| 探す | `/circle-info/search` | `app/routes/circle-info.search.tsx` | `探すページ構成.png` |
| 気になる | `/circle-info/favorites` | `app/routes/circle-info.favorites.tsx` | — |
| 詳細 | `/circle-info/:circleId` | `app/routes/circle-info.$circleId.tsx` | `サークル詳細ページ構成.png` |

`circle-info.tsx` をレイアウトルートとし、ヘッダーとボトムナビを共通化して `<Outlet />` に各画面を描画する。
`search` と `favorites` は静的セグメントのため、動的セグメント `$circleId` より優先してマッチする。

## 2. 共通要素

### 2.1 ヘッダー

- 左: アプリアイコン
- 中央: 画面タイトル（ホーム・詳細は「サークル情報」、探すは「サークルを探す」）
- 右: ハンバーガーメニュー
- 上部に固定表示（`sticky top-0`）

> ハンバーガーメニューの中身は未定。MVPではボタンのみ設置し、押下時の挙動は保留とする（§10-1）。

### 2.2 ボトムナビゲーション

| タブ | 遷移先 | MVPでの状態 |
| --- | --- | --- |
| ホーム | `/circle-info` | 実装 |
| 探す | `/circle-info/search` | 実装 |
| 気になる | `/circle-info/favorites` | 実装（`localStorage` 版） |
| TOP | `/` | がんちゃんねる本体のTOPへ戻る |

現在地のタブはアクティブ表示にする（上部のバー＋アイコン・ラベルの強調）。

> 画面イメージの4つ目は「その他」だが中身が未定のため（§10-1）、当面はがんちゃんねる本体への
> 戻り導線として使う。circle-info は共通フッターを隠しているため、機能内から本体へ戻る出口が
> 必要になる。「その他」の中身が決まった段階で、本体への導線をどこに置くかとあわせて再検討する。

あわせて、ホーム画面のメインコンテンツ左上にも本体TOPへの戻るボタンを置く（§3.1）。

## 3. 各画面の仕様

### 3.1 ホーム `/circle-info`

上から順に:

0. **本体TOPへの戻るボタン** — 左上。白背景の控えめな円形アイコンボタン
1. **紹介バナー** — 機能の説明。画面イメージではカルーセル（ドット3つ）だが、**MVPでは1枚固定**とする（カルーセルはP1）
2. **「サークルを探す」ボタン** — `/circle-info/search` へ遷移する大きなボタン
3. **おすすめの団体** — カードを2列グリッドで表示

**おすすめの選定ロジック（MVP）**

データに `isRecommended` フラグを持たせ、フラグが立っている団体を表示する。
件数が表示枠に満たない場合は、募集中の団体から補完する。

> ランダム表示はSSRとクライアントで結果がずれる（ハイドレーション不整合）ため、MVPでは採用しない。

### 3.2 探す `/circle-info/search`

上から順に:

1. **キーワードで探す** — テキスト入力。団体名・短い紹介文・詳しい紹介文・タグを対象に部分一致
2. **ジャンルで探す** — セレクトボックス。選択肢は `CIRCLE_GENRES` のみ（団体種別は含めない。2026-08-02 決定）
3. **タグで探す** — セレクトボックス
4. **おすすめの団体** — 「もっと見る」リンク付き

**絞り込みの挙動**

- 3つの条件は **AND** で結合する
- 絞り込みはクライアント側の state で行う（全件をローダーで取得済みのため）
- 条件が1つも指定されていない場合は「おすすめの団体」を表示する
- 条件を指定した場合は、その下に検索結果の一覧を表示する
- 該当0件の場合は「条件に合う団体が見つかりませんでした」と、条件をリセットするボタンを表示する

**キーワード検索の正規化**

大文字小文字を区別せず、前後の空白を除去して比較する。全角・半角やひらがな・カタカナの吸収は
MVPでは行わない（P1）。

### 3.3 詳細 `/circle-info/:circleId`

上から順に:

1. **ヒーロー画像** — 1枚目の写真を横幅いっぱいに表示。左上に戻るボタン
2. **団体名・ロゴ・バッジ** — バッジは `団体種別` `ジャンル` `募集ステータス` の順
3. **紹介文** — 詳しい紹介文
4. **こんな人におすすめ** — 箇条書き
5. **タグ** — `#タグ名` 形式で横並び
6. **活動情報** — 活動場所 / 活動日時・頻度 / 募集期間
7. **費用** — 入会費 / 年会費 / その他費用
8. **メンバー構成** — 総人数 / 男女比 / 初心者割合
9. **実績・活動内容** — 年ごとの箇条書き（年表形式）
10. **SNS・連絡先** — 代表者 / 連絡先 / Instagram / X / Webサイト

該当IDが存在しない場合は 404 を返し、`root.tsx` の ErrorBoundary に委ねる。

**任意項目が未入力のときの扱い（重要）**

必須項目は団体名のみのため、未入力への対応を明確にする。

| 状況 | 表示 |
| --- | --- |
| セクション内の一部の項目が未入力 | その**行だけ**表示しない |
| セクション内の項目がすべて未入力 | その**セクションごと**表示しない |
| 写真が0枚 | ヒーロー画像を出さず、代替画像（iFiveアイコン）を表示 |
| 短い紹介文が未入力 | 一覧カードでは詳しい紹介文の冒頭を代用。それも無ければ空欄 |

「未登録」という文字を並べない方針とする（情報が少ない団体ほど画面が「未登録」で埋まるため）。

### 3.4 気になる `/circle-info/favorites`

お気に入り登録した団体を、ホームと同じ2列グリッドのカードで表示する。
1件も無い場合は、その旨と「サークルを探す」への導線を表示する。

## 4. お気に入り（気になる）の実装方式

ログイン導入前の暫定実装。**`localStorage` に団体IDの配列のみを保存する。**

| 項目 | 内容 |
| --- | --- |
| 保存キー | `ganchannel:circle-info:favorites` |
| 保存する値 | 団体IDの配列を JSON 文字列化したもの。例: `["ifive","basketball"]` |
| 読み書き | `app/lib/favorites-storage.ts` に閉じ込め、直接 `localStorage` を触らない |
| 参照 | `app/hooks/use-favorites.ts` から利用する |

**SSRでの注意**

`localStorage` はサーバ側に存在しない。初期描画をサーバとクライアントで一致させるため、
**初期stateは必ず空配列とし、`useEffect` の中で読み込んで反映する**。
これを守らないとハイドレーション不整合になる。

**存在しないIDの扱い**

掲載を取り下げた団体のIDが残る可能性があるため、表示時に現在の掲載データと突き合わせ、
**該当しないIDは無視する**（保存データ自体の掃除は行わない）。

**ログイン導入時の移行**

保存しているのはIDの配列だけなので、ログイン後に端末内のリストをアカウントへ送って
マージすれば移行できる。移行後は `localStorage` 側をサーバのキャッシュとして扱う。

## 5. データ構造

型定義は `app/types/circle.ts`。

### 5.1 型

```ts
export type Circle = {
  id: string;
  name: string;                        // 必須
  organizationType: OrganizationType;  // 団体種別（1つ）
  genres: Genre[];                     // ジャンル（複数可）
  tags: string[];                      // 自由タグ
  recruitmentStatus: RecruitmentStatus;
  isRecommended: boolean;              // ホーム・探すの「おすすめ」に出すか

  summary: string;                     // 一覧カード用の短い紹介文（1〜2行）
  description: string;                 // 詳細ページ用の本文
  recommendedFor: string[];            // 「こんな人におすすめ」

  logo: string | null;                 // 円形ロゴ画像
  images: string[];                    // 活動写真。images[0] をヒーロー／カードサムネに使う

  activity: {
    place: string | null;              // 例: "学生センター 2F / オンライン"
    schedule: string | null;           // 例: "毎週火曜 18:00〜20:00 / 週1回"
    recruitmentPeriod: string | null;  // 例: "通年募集"
  };

  fee: {
    admission: string | null;          // 入会費
    annual: string | null;             // 年会費
    other: string | null;              // その他費用
  };

  members: {
    total: string | null;              // 例: "28名"
    genderRatio: string | null;        // 例: "6:4"
    beginnerRatio: string | null;      // 例: "初心者多め"
  };

  achievements: { year: string; content: string }[];

  contact: {
    representative: string | null;
    email: string | null;
    links: CircleLink[];
  };

  restriction: string | null;          // 対象学部・学年の制限
  newcomerEvent: string | null;        // 新歓イベントの日程
  isOfficial: boolean | null;          // 公認 / 非公認

  updatedAt: string;                   // "YYYY-MM-DD"
};

export type CircleLink = {
  type: "instagram" | "x" | "website" | "other";
  label: string;
  url: string;
};
```

**設計上の判断**

- **数値項目も `string` で持つ** — 総人数「28名」、男女比「6:4」、初心者割合「初心者多め」のように、
  フォームの自由入力をそのまま表示するため。集計する要件が出た段階で型を分ける
- **未入力は `null`、未入力の配列は `[]`** — `"none"` という文字列で表現していた `news` の方式は、
  値なのか未入力なのか型で判別できないため踏襲しない
- **`activity` / `fee` / `members` / `contact` をネストさせる** — 詳細画面のカード区切りと1対1に対応させ、
  「セクション内が全て未入力ならセクションごと隠す」判定を書きやすくするため

### 5.2 定数（`app/constants/index.ts`）

```ts
export const ORGANIZATION_TYPES = [
  "部活", "サークル", "同好会", "学内カンパニー",
  "学生委員会", "NEXT STEP工房", "その他学生有志団体",
] as const;

export const CIRCLE_GENRES = [
  "運動系", "文化系", "音楽系", "学術系", "ボランティア", "その他",
] as const;

export const RECRUITMENT_STATUSES = ["募集中", "募集停止"] as const;
```

タグは自由入力のため定数にしない。「探す」画面のタグ選択肢は、掲載中の全団体のタグから
重複を除いて動的に生成する。

## 6. データソース

### 6.1 MVP

**`app/data/circles.ts` に TypeScript の配列として持つ。**

| 理由 | 内容 |
| --- | --- |
| 件数 | 10〜15団体（最終的にも30〜50団体）。APIを用意するコストに見合わない |
| 更新体制 | iFiveメンバーが手動更新。デプロイを伴う更新で運用上問題ない |
| 型安全 | 型定義から外れたデータは `npm run typecheck` で検出できる |
| 期限 | 残り期間でAPIを新設する余裕がない |

`app/services/circle-service.ts` を必ず経由させ、UIから直接データを import しない。
これによりデータソースを差し替えても影響を `services/` 内に閉じ込められる。

### 6.2 移行の道筋

```
[MVP]        app/data/circles.ts（リポジトリ内の静的データ）
   ↓  掲載団体が増え、更新頻度が上がったら
[第2段階]    フォーム → スプレッドシート → JSON書き出し → public/circles.json を fetch
   ↓  リアルタイム更新や運営側の編集が必要になったら
[第3段階]    外部API（news と同じ構成）または ヘッドレスCMS
```

第2段階まではフロント側の変更が `circle-service.ts` のみで済む。

### 6.3 画像

- MVPは `public/circles/<id>/` 配下に配置し、`/circles/<id>/1.jpg` の形で参照する
- リポジトリ肥大化を避けるため、配置前に長辺1200px程度・JPEG/WebPへ圧縮する
- 掲載枚数の上限は未定（§10-4）

## 7. がんちゃんねる本体との統合

**ここは本体の全ページに影響する。**

### 7.1 課題

`app/root.tsx` が全ページに共通フッター（`Footer`）と広告バナー（`Ad`）を描画している。
一方 circle-info の画面イメージには機能専用のボトムナビがあり、**画面下部で衝突する**。

### 7.2 決定（2026-08-02）

`root.tsx` で現在のパスを判定し、`/circle-info` 配下では共通フッターを描画しない。
機能内ボトムナビが同じ位置を担う。広告バナーは全ページ共通で残す。

- 影響範囲は `root.tsx` の数行に収まる
- 「がんちゃんねるの中の小さなアプリ」という方針とも一致する
- 他機能にも同じ形が広がるなら、ADR（`docs/decisions/`）に残す

### 7.3 あわせて修正が必要な箇所

`app/components/layout/footer/footer.tsx` のサークルタブが存在しないパス `/circle` を指している。
`/circle-info` に修正する。

## 8. コンポーネント構成

```
app/
├── routes/
│   ├── circle-info.tsx                  # レイアウト（ヘッダー＋ボトムナビ）
│   ├── circle-info._index.tsx           # ホーム
│   ├── circle-info.search.tsx           # 探す
│   ├── circle-info.favorites.tsx        # 気になる
│   └── circle-info.$circleId.tsx        # 詳細
├── components/features/circle-info/
│   ├── circle-header.tsx                # ヘッダー
│   ├── circle-bottom-nav.tsx            # ボトムナビ
│   ├── circle-card.tsx                  # 一覧カード（2列グリッド用）
│   ├── circle-badge.tsx                 # 種別・ジャンル・募集ステータスのバッジ
│   ├── circle-tag-list.tsx              # #タグ の一覧
│   ├── circle-search-form.tsx           # 探す画面の検索フォーム
│   ├── favorite-button.tsx              # ハートボタン
│   └── detail/
│       ├── circle-detail-section.tsx    # 詳細のカード枠（全項目が空なら描画しない）
│       ├── circle-activity-info.tsx     # 活動情報
│       ├── circle-fee-info.tsx          # 費用
│       ├── circle-member-info.tsx       # メンバー構成
│       ├── circle-achievements.tsx      # 実績・活動内容
│       └── circle-contact.tsx           # SNS・連絡先
├── services/circle-service.ts
├── types/circle.ts
├── data/circles.ts
├── hooks/use-favorites.ts               # お気に入りの読み書き
├── lib/
│   ├── filter-circles.ts                # 検索・絞り込みの純粋関数
│   └── favorites-storage.ts             # localStorage アクセスの隔離
└── constants/index.ts
```

検索・絞り込みは純粋関数として `lib/` に置き、UIから分離する。

## 9. デザイン

[design-guidelines.md](../project/design-guidelines.md) に準拠する。

**前提作業（2026-08-02 決定）:** デザイン規約 §2.1 のカラートークン（`primary` `ink` `surface`
`border` 等）を `app/styles/app.css` の `@theme` に定義してから実装する。
規約 §2.2 で HEX の直接指定が禁止されているため、これが済まないと規約準拠で書けない。
画面イメージの配色（濃緑・淡緑・グレー背景）は規約のトークンとおおむね一致する。

> 既存ページ（`news` 等）に残る HEX 直接指定の是正（規約 §27）は、MVP後に別途対応する。

## 10. 未決事項

| # | 論点 | 影響 |
| --- | --- | --- |
| 1 | ハンバーガーメニューと「その他」タブの中身 | 未定なら空のまま置く |
| 2 | ジャンルの正式な値 | §5-2 の定数 |
| 3 | 連絡先メールアドレスの公開可否 | §3-3 の表示項目 |
| 4 | 写真の掲載枚数の上限 | 入稿ルール |

## 11. 実装状況

| 項目 | 状態 |
| --- | --- |
| カラートークン定義（前提作業） | **完了**（§9） |
| 型・定数の定義 | **完了**（§5） |
| レイアウトルート（ヘッダー・ボトムナビ） | **完了**（§2） |
| 本体との統合（§7） | **完了** |
| ホーム画面 | **完了**（§3.1） |
| 探す画面 | **完了**（§3.2） |
| 詳細画面 | **完了**（§3.3） |
| 気になる画面・お気に入り | **完了**（§3.4・§4） |
| 一覧カード | **完了** |
| 実データ入稿 | 未着手（現在はサンプル5件・画像なし） |
| 紹介バナーのカルーセル | 未着手（P1） |
| 並び替え・詳細条件での絞り込み | 未着手（P1） |
