# Web版 がんちゃんねる デザイン規約

> 本規約は、UIの見た目と実装方法をチーム内で統一するための共通ルールである。
> 開発規約（[development-guidelines.md](./development-guidelines.md)）§1.2 の「画面の色、余白、フォント、コンポーネントの見た目」に相当する部分を、本規約が担当する。
> インプットとなった要件は [design-guidelines-input.md](./design-guidelines-input.md) を参照。ディレクトリ構成は [architecture.md](./architecture.md) に従う。

---

## 0. 本規約の使い方

### 0.1 対象

- 本リポジトリ（React Router v7 / React 19 / TypeScript / Tailwind CSS v4）で実装するすべての画面・コンポーネント
- AI開発支援ツールに実装を依頼する場合も、本規約をあわせて渡す

### 0.2 優先度

開発規約 §1.3 にならい、各ルールを以下に分類する。

- **必須**：原則として必ず守る。Pull Requestのレビューで指摘対象になる
- **推奨**：可能な限り守る。守れない場合は理由をPull Requestに書く

### 0.3 迷ったときの判断基準

優先順位が競合した場合は、以下の順で判断する（要件定義書 §16-4 より）。

1. スマートフォンで問題なく使えるか
2. 早く実装できるか
3. 実装・保守がしやすいか
4. 操作が分かりやすいか
5. 見た目が統一されているか

判断に迷う場合は独断で決めず、デザイン担当（開発規約 §3.2）に相談する。

### 0.4 要件定義書との差異（要確認事項）

要件定義書の記載と、実際のリポジトリ構成が食い違っている箇所がある。本規約では**リポジトリの実態を正**として記述している。確認内容と選択肢は [hearing-points.md](./hearing-points.md) にまとめてある。

| 項目 | 要件定義書の記載 | 本規約での扱い | 状態 |
| --- | --- | --- | --- |
| フレームワーク | Next.js | **React Router v7** | 決定済み（[decisions/0002-framework-react-router.md](./decisions/0002-framework-react-router.md)）。MVP公開後にNext.jsへ移行予定 |
| CSS管理方法 | CSS Modules（§15-2） | **Tailwind CSS v4 を主、CSS Modulesは例外** | 確認中（[hearing-points.md](./hearing-points.md) §2） |

決定後、開発規約 §19.2 に従い `docs/decisions/` にADRとして残すこと。

### 0.5 決定事項：ナビゲーション方式

要件定義書 §8-2 は「上部ナビゲーション／スマートフォン表示時はハンバーガーメニュー」だが、本プロジェクトでは以下を採用する。

| 画面幅 | ナビゲーション |
| --- | --- |
| **`md:` 未満（スマートフォン）** | 下部固定ナビ ＋ ハンバーガーメニュー |
| **`md:` 以上（タブレット・PC）** | 上部ナビ ＋ ハンバーガーメニュー |

スマートフォン最優先（§0.3）の方針から、スマートフォンでは親指の届く下部に主要導線を置く。詳細は §19 を参照。

---

## 1. デザイン原則

すべての判断の土台となる5つの原則。個別ルールが本原則と矛盾する場合は、本原則を優先して相談する。

### 原則1：スマートフォンから設計する（必須）

- レイアウトは常にスマートフォン幅（375px想定）から書き、必要な箇所だけ `md:` 以上を追加する
- スマートフォンで情報を省略しない（要件定義書 §11-3）。PCで見えるものはスマートフォンでも見える状態にする
- 片手・親指で操作できる位置に主要動作を置く

### 原則2：読めることを最優先する（必須）

- 本文は16px。14px未満の本文は使用しない
- 背景色に対して十分なコントラストを確保する（§24）
- 参考例2（iFive HP）で指摘された「テキストの視認性の低さ」を繰り返さない。薄いグレー文字を白背景に置かない

### 原則3：崩れない前提で作る（必須）

- テキストは必ず溢れる前提で書く。タイトル・説明文には `line-clamp-*` を付ける（要件定義書 §4-1、参考例1の反面教師）
- 画像は読み込めない前提で書く。代替表示を用意する
- データは0件の前提で書く。空状態を必ず実装する（§22）

### 原則4：迷わせない（必須）

- 導線は一本道にする。同じ画面に同格の主要ボタンを複数置かない
- 1画面の主要ボタン（Primary）は原則1つ
- ナビゲーションを階層的に複雑化しない（参考例3の反面教師）

### 原則5：足し算より引き算（推奨）

- 「シンプルでモダン」が最重要の印象（要件定義書 §3-1）。装飾は情報の理解を助けるときだけ足す
- 避けたい印象：子どもっぽい / 堅すぎる / 地味すぎる / 情報量が多すぎる / 古い / 安っぽい / ビジネス的すぎる
- 強い影・派手なグラデーション・過剰なアニメーションは「安っぽい」に直結するため使わない

---

## 2. カラーパレット

### 2.1 トークン一覧（必須）

色は**必ずトークン経由で指定する**。HEXコードをコンポーネントに直接書かない。

**ブランドカラー**

| トークン | HEX | Tailwindクラス例 | 用途 |
| --- | --- | --- | --- |
| `primary` | `#1B4D33` | `bg-primary` `text-primary` | ヘッダー、主要ボタン、アクティブタブ、ブランド強調 |
| `primary-hover` | `#143A26` | `hover:bg-primary-hover` | 主要ボタンのホバー |
| `primary-active` | `#0E2B1C` | `active:bg-primary-active` | 主要ボタンの押下中 |
| `primary-subtle` | `#E8F0EB` | `bg-primary-subtle` | 選択中タブの背景、控えめな強調背景 |

**ニュートラル**

| トークン | HEX | Tailwindクラス例 | 用途 |
| --- | --- | --- | --- |
| `ink` | `#1F2937` | `text-ink` | 本文・見出しの標準文字色、主要アイコン |
| `ink-muted` | `#4B5563` | `text-ink-muted` | 補助テキスト、日付、キャプション |
| `surface` | `#FFFFFF` | `bg-surface` | 全体ベース背景、入力フォーム背景 |
| `surface-card` | `#F4F6F4` | `bg-surface-card` | カード背景、コンテンツブロック背景 |
| `border` | `#E2E8E5` | `border-border` | 区切り線、カード枠線、非アクティブ背景 |
| `border-strong` | `#82908A` | `border-border-strong` | 入力欄など、境界の判別が必要なUIの枠線 |

**状態色**

| トークン | HEX | Tailwindクラス例 | 用途 |
| --- | --- | --- | --- |
| `danger` | `#B3261E` | `text-danger` `bg-danger` | エラーメッセージ、入力エラー枠、破壊的操作 |
| `danger-subtle` | `#FDECEA` | `bg-danger-subtle` | エラー通知の背景 |

成功を示す色は新設せず、`primary` を流用する（トークンを必要最低限に保つため。要件定義書 §15-3）。

### 2.2 使用禁止（必須）

- **蛍光色（ネオンカラー）の使用禁止**（要件定義書 §5-3）
- トークン外の色をコンポーネントに直接書くこと（`bg-[#004400]` `border-[#999999]` など）の禁止
- Tailwind標準のカラーパレット（`gray-500` `green-600` など）を新規コードで使うことの禁止。既存箇所は §27 の是正リストで置き換える

例外的に新しい色が必要になった場合は、独断で追加せず §26 のトークンとして定義してからチームに共有する。

### 2.3 色の割合（推奨）

「シンプルでモダン」を保つため、1画面での面積比を以下の目安にする。

- 背景（`surface` / `surface-card`）：70%以上
- 文字・線（`ink` / `ink-muted` / `border`）：20%程度
- `primary`：10%以下。押してほしいものに集中させる

`primary` を広い面に敷き詰めない。ブランド色は「アクセントとして効かせる」ことで洗練された印象になる。

### 2.4 ダークモード（推奨）

現時点では**対応しない**。ただし将来対応できるよう、以下を守る。

- 色は必ず §2.1 のトークン経由で指定する（トークン定義を差し替えるだけで対応できる状態を保つ）
- コンポーネント側に `dark:` バリアントを個別に書かない
- 現在 `app/styles/app.css` に残っている `dark:bg-gray-950` は中途半端な対応であり、削除対象（§27）

---

## 3. 文字色・背景色の使い分け

### 3.1 組み合わせ表（必須）

以下の組み合わせのみ使用する。カッコ内はコントラスト比（WCAG 2.1、4.5:1以上でAA適合）。

| 背景 | 標準テキスト | 補助テキスト | 使用場面 |
| --- | --- | --- | --- |
| `surface`（白） | `ink`（14.5:1） | `ink-muted`（7.6:1） | ページ全体、フォーム |
| `surface-card`（`#F4F6F4`） | `ink`（14.0:1） | `ink-muted`（7.0:1） | カード、情報ブロック |
| `primary`（`#1B4D33`） | 白（9.7:1） | 使用しない | 主要ボタン、アクティブタブ |
| `primary-subtle`（`#E8F0EB`） | `primary`（8.7:1） | 使用しない | 選択中タブ、控えめな強調 |
| `danger-subtle`（`#FDECEA`） | `danger`（6.2:1） | 使用しない | エラー通知 |

### 3.2 禁止事項（必須）

- `border`（`#E2E8E5`）を**テキストの背景として使わない**。文字が読めない
- `border-strong` 以下の明度のグレーを本文の文字色に使わない
- 画像の上に直接テキストを置かない。どうしても必要な場合は、`ink` の半透明オーバーレイ（`bg-ink/60`）を挟んでから白文字を載せる
- 色だけで情報を区別しない。必ず文字・アイコン・位置のいずれかを併用する（§24）

### 3.3 ロゴの背景（必須）

ロゴ（`docs/images/logo.png`、黒＋青）は、`surface`（白）または `border`（ライトグレー）の上にのみ配置する。`primary` などの濃色の上に載せない（要件定義書 §5-1）。

---

## 4. タイポグラフィ

### 4.1 フォント（必須）

日本語のみのサービスであるため、日本語グリフを持つフォントを指定する。

```css
--font-sans: "Noto Sans JP", ui-sans-serif, system-ui, -apple-system,
  "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif;
```

- Google Fonts の `Noto Sans JP` を使用する（無料。要件定義書 §17-1「有料フォントは使えない」に適合）
- 読み込むウェイトは **400（Regular）/ 700（Bold）の2種類のみ**。表示速度（要件定義書 §2-4）を優先し、ウェイトを増やさない
- 等幅フォント（`font-mono`）は使用しない。日本語では字面が揃わず古い印象になる

現在 `app/root.tsx` が読み込んでいる `Inter` はラテン文字専用で、日本語は結局フォールバックされる。差し替え対象（§27）。

### 4.2 サイズ・行間スケール（必須）

Tailwind標準スケールをそのまま使う（独自トークンを増やさない）。

| 用途 | クラス | サイズ | 行間 | ウェイト |
| --- | --- | --- | --- | --- |
| ページタイトル | `text-2xl font-bold` | 24px | `leading-snug` | 700 |
| セクション見出し | `text-xl font-bold` | 20px | `leading-snug` | 700 |
| カードタイトル | `text-base font-bold` | 16px | `leading-snug` | 700 |
| **本文（標準）** | `text-base` | **16px** | `leading-relaxed` | 400 |
| 補助テキスト・日付 | `text-sm` | 14px | `leading-normal` | 400 |
| タグ・バッジのみ | `text-xs` | 12px | `leading-none` | 400 |

**必須ルール**

- 本文・説明文は **16px（`text-base`）を標準**とする
- **14px（`text-sm`）未満を本文に使わない**（要件定義書 §6-4）
- `text-xs`（12px）は**タグ・バッジ・単語ラベルに限り**許可する。文章には使わない
- 見出しは `h1` → `h2` → `h3` の順に飛ばさず使う。見た目のサイズ調整はクラスで行い、タグを選び直さない

### 4.3 日本語組版（推奨）

- 長文の行間は `leading-relaxed`（1.625）。日本語は行間を広めに取ると読みやすい
- 不自然な位置で改行されないよう、段落には `[word-break:auto-phrase]` の使用を検討してよい（対応ブラウザのみ効く漸進的強化）
- 中央揃えは見出し・空状態などの短文のみ。本文は左揃え
- 英数字と日本語の間に半角スペースを手で入れない（文字量が変わると崩れる）

### 4.4 テキストの溢れ対策（必須）

原則3に基づき、**可変長テキストには必ず行数制限を付ける**。

| 対象 | クラス |
| --- | --- |
| カードタイトル | `line-clamp-2` |
| カード説明文 | `line-clamp-2` または `line-clamp-3` |
| タグ・バッジ | `line-clamp-1` |
| 一覧の1行項目 | `truncate` |

なお Tailwind CSS v4 では `line-clamp-*` は標準機能であり、`@tailwindcss/line-clamp` プラグインは不要（§27）。

---

## 5. 余白ルール

### 5.1 スケール（必須）

4pxを基準単位とし、以下の値のみ使う。奇数値・端数（`p-[13px]` など）を使わない。

| クラス | px | 主な用途 |
| --- | --- | --- |
| `gap-1` / `p-1` | 4px | アイコンと文字の間 |
| `gap-2` / `p-2` | 8px | 密接な要素どうし、タグの内側 |
| `gap-3` / `p-3` | 12px | カードの内側、グリッドの間隔 |
| `gap-4` / `p-4` | 16px | 画面の左右余白、カードの内側（広め） |
| `gap-6` | 24px | 関連するブロックの間 |
| `gap-8` | 32px | セクションどうしの間 |
| `gap-12` | 48px | ページ上下の大きな区切り |

### 5.2 適用ルール（必須）

- **画面の左右余白は `px-4`（16px）**で統一する
- **セクション間は `gap-8`（32px）**。「標準的な余白」（要件定義書 §3-3）を保ち、詰め込まない
- **カード内側は `p-3`（12px）**を基本、情報量が少ないカードは `p-4`
- **カードグリッドの間隔は `gap-3`（12px）**
- 余白は `margin` ではなく、親要素の `flex`/`grid` + `gap` で作る。要素の追加削除で崩れにくくするため
- 連続する要素の縦方向の余白は `space-y-*` を使い、子要素に個別の `mb-*` を付けない

### 5.3 下部固定領域の回避（必須）

本アプリは画面下部に固定要素（下部固定ナビ・広告バナー）があるため、**コンテンツが隠れないよう下余白を確保する**。

| 画面幅 | 固定要素 | 合計 | メイン領域に指定する下余白 |
| --- | --- | --- | --- |
| `md:` 未満 | 下部固定ナビ64px ＋ 広告バナー80px | 144px | `pb-36`（144px） |
| `md:` 以上 | 広告バナー80px のみ（ナビは `md:hidden`） | 80px | `md:pb-24`（96px） |

- **ページのメイン領域には `pb-36 md:pb-24` を指定する**
- 固定要素の高さを変更した場合は、この値も必ず更新する

---

## 6. レイアウトルール

### 6.1 コンテンツ幅（必須）

スマートフォン最優先のため、**単一カラムのモバイルレイアウトをPCでもそのまま中央寄せする**。

```tsx
<div className="mx-auto w-full max-w-lg px-4">
```

- `max-w-lg`（512px）を標準とする（要件定義書 §8-3）
- スマートフォンでは実質的に全幅になる
- **サイドバーは作らない**（要件定義書 §8-4）
- **画面下部に固定する要素（下部固定ナビ・広告バナー）にも同じ `max-w-lg mx-auto` を適用する**。PCで画面幅いっぱいに広がると、中央のコンテンツ列と噛み合わず崩れて見える

### 6.2 画面の基本構造（必須）

**スマートフォン（`md:` 未満）**

```
┌─────────────────────────┐
│ ヘッダー（sticky top-0）  │  ロゴ / 検索 / ハンバーガー
├─────────────────────────┤
│ パンくずリスト（任意）      │
├─────────────────────────┤
│                         │
│ メインコンテンツ           │  max-w-lg mx-auto px-4 pb-36
│                         │
├─────────────────────────┤
│ 広告バナー（fixed）        │  80px
├─────────────────────────┤
│ 下部固定ナビ（fixed）    │  64px
└─────────────────────────┘
```

**タブレット・PC（`md:` 以上）**

```
┌─────────────────────────┐
│ ヘッダー（sticky top-0）  │  ロゴ / 上部ナビ / 検索 / ハンバーガー
├─────────────────────────┤
│ パンくずリスト（任意）      │
├─────────────────────────┤
│                         │
│ メインコンテンツ           │  max-w-lg mx-auto px-4 md:pb-24
│                         │
├─────────────────────────┤
│ 広告バナー（fixed）        │  80px
└─────────────────────────┘   下部固定ナビは md:hidden
```

- ページ本体は必ず `<main>` で囲む。1ページに `<main>` は1つ
- ヘッダーは `<header>`、ナビゲーションは `<nav>` を使う

### 6.3 一覧のレイアウト（必須）

- データ表示は**カード形式**（要件定義書 §9-5）。テーブルを一覧の第一選択にしない
- スマートフォンは **2列グリッド**：`grid grid-cols-2 gap-3`
- 1件あたりの情報量が多い場合（ニュース等）は1列（`flex flex-col gap-3`）でもよい
- PC（`md:` 以上）でも `max-w-lg` を維持するため、列数は増やさない

### 6.4 z-index（必須）

値の乱立を防ぐため、以下の4段階のみ使う。

| 層 | クラス | 対象 |
| --- | --- | --- |
| 0 | （指定なし） | 通常コンテンツ |
| 10 | `z-10` | 下部固定ナビ |
| 20 | `z-20` | 広告バナー、sticky ヘッダー |
| 50 | `z-50` | モーダル、ハンバーガーメニューのドロワー、オーバーレイ、トースト |

---

## 7. ブレークポイント

### 7.1 定義（必須）

Tailwind CSS v4 の標準ブレークポイントをそのまま使う。独自定義は追加しない。

| 名前 | 最小幅 | 主な対象 |
| --- | --- | --- |
| （デフォルト） | 0px | **スマートフォン（最優先）** |
| `sm:` | 640px | 大型スマートフォン横向き |
| `md:` | 768px | タブレット |
| `lg:` | 1024px | ノートPC |
| `xl:` `2xl:` | 1280px / 1536px | 原則使わない |

### 7.2 記述ルール（必須）

- **モバイルファーストで書く**。ブレークポイントなしの記述がスマートフォン用、`md:` 以降で上書きする
- `max-*` 系（`max-md:` など）の逆方向指定は使わない。読み手が混乱する
- **`md:`（768px）がナビゲーションの切り替え点**である（§19.0）。ここ以外でレイアウトの構造を変えない
- 本アプリは `max-w-lg` の単一カラムであるため、ナビゲーション以外で**ブレークポイントを使う場面はほとんどない**。多用している場合はレイアウト設計を見直す
- 動作確認は最低限 **375px（スマートフォン）/ 768px（タブレット）/ 1280px（PC）** の3幅で行う（開発規約 §17.1）

---

## 8. 角丸

### 8.1 スケール（必須）

「やや丸みがある」（要件定義書 §3-3）を、以下の3段階＋`rounded-full` で表現する。

| トークン | クラス | 半径 | 対象 |
| --- | --- | --- | --- |
| control | `rounded-control` | 8px | ボタン、入力欄、セレクト、タブ |
| card | `rounded-card` | 12px | カード、情報ブロック、画像 |
| sheet | `rounded-sheet` | 16px | モーダル、ボトムシート |
| — | `rounded-full` | 円形 | タグ、バッジ、アバター、アイコンボタン |

### 8.2 ルール

- **必須**：上記以外の角丸（`rounded-sm` `rounded-3xl` など）を使わない
- **必須**：`rounded-none`（直角）を使わない。「堅すぎる」印象を避けるため
- **必須**：入れ子になる要素の角丸は、外側より内側を小さくする（カード12px の中の画像は8px）
- **推奨**：画面端に接する要素（ヘッダー・下部固定ナビ）は角丸を付けない

---

## 9. 境界線

### 9.1 使い分け（必須）

| 用途 | 指定 | 備考 |
| --- | --- | --- |
| カードの枠 | `border border-border` | 影ではなく線で区切るのが基本 |
| セクションの区切り | `border-t border-border` | 罫線を引きすぎない |
| 入力欄・セレクト | `border border-border-strong` | 境界が判別できる必要があるため濃い線を使う（WCAG 1.4.11） |
| 入力エラー時 | `border-2 border-danger` | 太さでも差を付ける |
| フォーカス時 | §24.3 のフォーカスリング | `border` の色変更だけで表現しない |

### 9.2 ルール

- **必須**：線の太さは `border`（1px）を基本とし、強調時のみ `border-2`（2px）。3px以上は使わない
- **必須**：入力欄に `border-border`（`#E2E8E5`）を使わない。白背景に対して1.2:1しかなく、境界が見えない
- **推奨**：区切り線とカード枠を同一画面で重ねない。どちらか一方で構造を表現する
- **推奨**：`ring-*` は §24.3 のフォーカス表現に予約する。装飾目的で使わない

---

## 10. 影

### 10.1 スケール（必須）

「安っぽい」印象を避けるため、影は最小限にする。

| トークン | クラス | 対象 |
| --- | --- | --- |
| card | `shadow-card` | 押下可能なカード、sticky ヘッダー |
| overlay | `shadow-overlay` | モーダル、ボトムシート、トースト |
| — | （指定なし） | 上記以外すべて |

### 10.2 ルール

- **必須**：カードの立体表現は**まず境界線で行う**。影は「浮いている・重なっている」ことを示す必要があるときだけ使う
- **必須**：Tailwind標準の `shadow-md` `shadow-lg` `shadow-xl` を新規コードで使わない
- **必須**：色付きの影・内側の影（`inset`）を使わない
- **推奨**：同一階層の要素に異なる影を付けない

---

## 11. アイコンルール

### 11.1 ライブラリ（必須）

- **`react-icons` のみ**を使用する（要件定義書 §10-4）。他のアイコンライブラリ・SVG直書き・絵文字は使わない
- **アイコンファミリーは Material Design（`react-icons/md`）に統一する**。1画面に複数ファミリー（`im` / `fa` / `md` など）を混在させると、線の太さや角の処理が揃わず「統一感がない」印象になる
- 現在 `footer.tsx` は `im` / `md` / `fa` の3ファミリーを混在させている。是正対象（§27）

### 11.2 サイズ（必須）

| 用途 | サイズ |
| --- | --- |
| 文中・タグ内 | 16px |
| ボタン内・入力欄内 | 20px |
| 下部固定ナビ | 24px |
| 空状態・エラー表示の見出し横 | 24px |

- 32px以上のアイコンを使わない。「子どもっぽい」印象になり、情報密度も下がる
- アイコンの色は `text-*` で指定する（`react-icons` は `currentColor` を継承する）。`color` propに直接HEXを渡さない

### 11.3 アクセシビリティ（必須）

- **意味を持つアイコン**（アイコンのみのボタン等）：親要素に `aria-label` を付ける
- **装飾のアイコン**（文字ラベルが隣にある場合）：`aria-hidden` を付ける

```tsx
// アイコンのみのボタン
<button type="button" aria-label="検索">
  <MdSearch size={20} aria-hidden />
</button>

// ラベル付き
<span className="inline-flex items-center gap-1">
  <MdPlace size={16} aria-hidden />
  <span>工学部食堂</span>
</span>
```

- **必須**：アイコンだけで意味を伝える箇所を、主要導線に作らない。下部固定ナビには必ず文字ラベルを併記する（§19.2）

---

## 12. 画像ルール

### 12.1 表示（必須）

- 比率は **`aspect-video`（16:9）または `aspect-square`（1:1）** のいずれかに統一する。同一の一覧内で比率を混在させない
- 必ず `object-cover` を指定し、コンテナいっぱいに表示する。`object-contain` は透過ロゴなど、余白が出てよい場合のみ
- 角丸はコンテナに `rounded-card`＋`overflow-hidden` を指定する
- 写真の雰囲気は「明るい / 自然体 / 活動的」（要件定義書 §10-2）に揃える

### 12.2 代替表示と属性（必須）

原則3に基づき、**画像は読み込めない前提で書く**。

- `alt` を必ず記述する。装飾目的の画像は `alt=""`
- 画像URLが存在しない・取得に失敗する場合のフォールバック画像を用意する（`app/assets/ifive-icon.png`）
- 画面外の画像には `loading="lazy"` を付ける。ファーストビューの画像には付けない
- レイアウトシフトを防ぐため、コンテナ側で高さ（`aspect-*`）を確定させる

```tsx
<div className="aspect-video w-full overflow-hidden rounded-card bg-surface-card">
  <img
    src={imageUrl ?? fallbackIcon}
    alt=""
    loading="lazy"
    className="h-full w-full object-cover"
  />
</div>
```

### 12.3 禁止（必須）

- 画像の上に直接テキストを重ねること（§3.2）
- 画像そのものに文字を焼き込むこと（拡大時に読めず、検索・読み上げの対象にもならない）
- 大きな画像ファイルをそのまま配置すること。表示速度は重要な要件（要件定義書 §2-4）

---

## 13. ボタン

### 13.1 種類（必須）

| 種類 | 用途 | スタイル |
| --- | --- | --- |
| Primary | 画面の主要動作（検索実行、送信、機能一覧） | `bg-primary text-white hover:bg-primary-hover active:bg-primary-active` |
| Secondary | 補助動作（条件クリア、一覧へ戻る） | `bg-surface text-primary border border-primary hover:bg-primary-subtle` |
| Text | 優先度の低い動作（取り消し） | `text-primary hover:underline` |
| Icon | スペースがない場所の動作 | `rounded-full text-ink hover:bg-surface-card` + `aria-label` |
| External | 外部リンク（公式SNS等） | Secondaryに準拠＋外部リンクアイコン |
| Danger | 破壊的操作 | `bg-danger text-white` |

### 13.2 サイズ（必須）

| サイズ | 高さ | クラス | 用途 |
| --- | --- | --- | --- |
| lg | 48px | `h-12 px-6 text-base` | 主要ボタン、SNS遷移ボタン、フォーム送信 |
| md | 44px | `h-11 px-4 text-base` | 標準 |
| sm | 36px | `h-9 px-3 text-sm` | カード内の補助動作のみ |

- **必須**：タップ領域は**最低44×44px**を確保する（要件定義書 §9-2、WCAG 2.5.5）。`sm` を使う場合は周囲に十分な余白を取る
- **必須**：主要ボタンは横幅いっぱい（`w-full`）にしてよいが、1画面に `w-full` の Primary を2つ並べない
- **推奨**：ボタン内のテキストは折り返さない（`whitespace-nowrap`）。長い場合は文言を短くする

### 13.3 共通仕様（必須）

- 角丸は `rounded-control`（8px）。アイコンボタンのみ `rounded-full`
- `<button>` には必ず `type` を明示する（`button` / `submit`）
- ページ遷移は `<button>` ではなく React Router の `<Link>` / `<NavLink>` を使う
- 状態を必ず実装する：`hover` / `active` / `focus-visible`（§24.3）/ `disabled`
- `disabled` 時：`disabled:opacity-50 disabled:cursor-not-allowed`。色を薄くするだけで、レイアウトを変えない
- 送信中は `disabled` にし、ラベルを「送信中…」に変える。二重送信を防ぐ

```tsx
<button
  type="submit"
  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-control bg-primary px-6 text-base font-bold text-white transition-colors hover:bg-primary-hover active:bg-primary-active focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
>
  検索する
</button>
```

### 13.4 禁止（必須）

- ボタンに見えない要素に `onClick` を付けること（`<div onClick>`）。キーボード操作できない
- 影・グラデーションでボタンを装飾すること
- 絵文字をボタンのアイコン代わりに使うこと（現在 `ad-banner.tsx` の `🔘` が該当。§27）

---

## 14. モーダル

### 14.1 使用方針（必須）

- **モーダルは最小限にする**。スマートフォンでは画面を占有し、戻る操作と競合しやすい
- 情報の表示だけが目的なら、モーダルではなく**詳細ページへの遷移**を選ぶ
- 使ってよい場面：削除などの確認、絞り込み条件の入力、短い補足説明

### 14.2 形式（必須）

- スマートフォンでは**下から出るボトムシート形式**とする（親指で届く位置に操作を置くため）

```tsx
<div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50">
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="dialog-title"
    className="w-full max-w-lg rounded-t-sheet bg-surface p-4 shadow-overlay"
  >
    <h2 id="dialog-title" className="text-xl font-bold text-ink">絞り込み条件</h2>
    ...
  </div>
</div>
```

### 14.3 必須要件

- `role="dialog"` `aria-modal="true"` `aria-labelledby`（見出しと紐付け）を付ける
- 背景オーバーレイは `bg-ink/50`
- **閉じる手段を2つ以上用意する**：閉じるボタン＋背景タップ＋`Esc`キー
- 開いている間は背景をスクロールさせない
- 開いたときモーダル内へフォーカスを移し、閉じたとき元の要素へ戻す
- モーダルの中にモーダルを開かない

---

## 15. フォーム

### 15.1 構成（必須）

- 1画面の入力項目は**3項目程度**に抑える（要件定義書 §9-4）
- 確認画面は作らない。送信後はトーストとメッセージで結果を伝える
- 自動保存は行わない
- 画像アップロードは行わない

### 15.2 ラベル（必須）

- **すべての入力欄にラベルを付ける**。`placeholder` をラベル代わりにしない（入力すると消えて何の欄か分からなくなる）
- ラベルと入力欄は `htmlFor` / `id` で紐付ける
- 必須項目には「必須」バッジを付ける。任意項目には何も付けない（`※` 記号だけで示さない）
- `placeholder` は入力例の提示にのみ使う（例：`例：軽音楽`）

### 15.3 入力欄（必須）

| 要素 | 高さ | クラス |
| --- | --- | --- |
| テキスト入力・セレクト | 48px | `h-12 w-full rounded-control border border-border-strong bg-surface px-3 text-base` |
| テキストエリア | 可変 | `min-h-32 w-full rounded-control border border-border-strong bg-surface p-3 text-base` |
| チェックボックス・ラジオ | 20px | `size-5 accent-primary` + ラベル全体をタップ可能にする |

- **必須**：文字サイズは16px（`text-base`）。iOSでは16px未満の入力欄をタップすると画面が自動でズームする
- **必須**：適切な `type` と `inputMode` を指定する（`type="email"` `inputMode="numeric"` 等）。スマートフォンで最適なキーボードが出る
- **必須**：チェックボックス・ラジオはラベル込みで44px以上のタップ領域を確保する

### 15.4 エラー表示（必須）

- エラーは**該当する入力欄の直下**に表示する。画面上部にまとめない
- 入力欄に `border-2 border-danger` と `aria-invalid="true"` を付ける
- エラーメッセージは `aria-describedby` で入力欄と紐付ける
- 文言は「何が問題か」と「どうすればよいか」を書く（§23.4）
- 送信ボタンを押す前にエラーを出さない（入力中に赤くしない）。フォーカスが外れた時点、または送信時に検証する

```tsx
<div className="flex flex-col gap-1">
  <label htmlFor="email" className="text-base font-bold text-ink">
    メールアドレス
    <span className="ml-2 rounded-full bg-danger-subtle px-2 py-0.5 text-xs text-danger">必須</span>
  </label>
  <input
    id="email"
    type="email"
    aria-invalid={hasError}
    aria-describedby={hasError ? "email-error" : undefined}
    className="h-12 w-full rounded-control border border-border-strong px-3 text-base focus-visible:ring-2 focus-visible:ring-primary"
  />
  {hasError && (
    <p id="email-error" className="text-sm text-danger">
      メールアドレスの形式が正しくありません。「@」を含む形式で入力してください。
    </p>
  )}
</div>
```

### 15.5 送信（必須）

- 送信中はボタンを `disabled` にし、ラベルを「送信中…」にする
- 成功時：トーストで「送信しました。」を表示し、フォームをリセットする
- 失敗時：フォームの内容を消さずに、エラーメッセージを表示する

---

## 16. カード

### 16.1 基本仕様（必須）

- 背景 `bg-surface-card`、枠 `border border-border`、角丸 `rounded-card`、内側 `p-3`
- **カード全体をクリック可能にする**（要件定義書 §9-3）
- クリック可能なカードは `<Link>` または `<a>` をルート要素にする。`<div onClick>` にしない
- カード内にリンクやボタンを入れ子にしない（リンクの入れ子はHTML上不正）。どうしても必要なら、カード全体のリンクをやめて個別リンクにする

### 16.2 表示要素の順序（推奨）

上から順に：画像 → タグ・バッジ → タイトル → 説明文 → 補足情報（日付・場所・数値）。
一覧内のすべてのカードで順序と要素を揃える。要素が無い場合も**高さを揃える**（`flex flex-col` + `mt-auto` で下端を揃える）。

### 16.3 崩れ対策（必須）

- タイトルは `line-clamp-2`、説明文は `line-clamp-2` または `line-clamp-3`
- 画像は §12 に従い `aspect-*` + `object-cover` + フォールバック
- 2列グリッドでは各カードの高さを揃える（`grid` の既定で揃う。`h-*` を固定しない）

### 16.4 状態（必須）

- ホバー：`hover:border-primary`（枠の色のみ変える）。拡大・回転などのアニメーションは付けない
- フォーカス：§24.3 のフォーカスリング
- 押下：`active:opacity-90`

```tsx
<Link
  to={`/circles/${circle.id}`}
  className="flex flex-col gap-2 rounded-card border border-border bg-surface-card p-3 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
>
  <div className="aspect-video w-full overflow-hidden rounded-control bg-surface">
    <img src={circle.image ?? fallbackIcon} alt="" loading="lazy" className="h-full w-full object-cover" />
  </div>
  <p className="line-clamp-2 text-base font-bold text-ink">{circle.name}</p>
  <p className="line-clamp-1 text-xs text-ink-muted">#{circle.category}</p>
</Link>
```

---

## 17. タグ・バッジ

### 17.1 使い分け（必須）

| 種類 | 意味 | スタイル |
| --- | --- | --- |
| タグ | 分類・属性（`#運動系` `#文化系`） | `rounded-full bg-primary-subtle px-2 py-0.5 text-xs text-primary` |
| バッジ（強調） | 状態・注目（「新着」「募集中」） | `rounded-full bg-primary px-2 py-0.5 text-xs text-white` |
| バッジ（注意） | 「必須」「終了」 | `rounded-full bg-danger-subtle px-2 py-0.5 text-xs text-danger` |

### 17.2 ルール（必須）

- 高さは20px程度に抑える。タップ対象にする場合は §13.2 のサイズ規約に従う
- 1つの要素に付けるタグは**最大3つ**まで。超える場合は「他N件」とまとめる
- タグは1行に収める（`line-clamp-1`）。折り返して2行にしない
- **タグの色で分類を表現しない**。色は上記3種のみで、分類は文字で示す（色覚特性への配慮、および色数の増加防止）
- タグ自体をリンクにする場合は、カード全体のリンクと入れ子にしない（§16.1）

---

## 18. テーブル

### 18.1 使用方針（必須）

- **一覧表示にテーブルを使わない**。カード形式を使う（要件定義書 §9-5）
- テーブルを使ってよいのは、**行と列に意味がある2次元データ**のみ（時間割、比較表、成績一覧など）

### 18.2 実装（必須）

- スマートフォンでは横スクロールできるコンテナに入れる

```tsx
<div className="-mx-4 overflow-x-auto px-4">
  <table className="w-full min-w-[480px] border-collapse text-sm">
    <thead>
      <tr className="border-b border-border-strong text-left">
        <th scope="col" className="p-2 font-bold text-ink">曜日</th>
      </tr>
    </thead>
    <tbody>
      <tr className="border-b border-border">
        <td className="p-2 text-ink">月</td>
      </tr>
    </tbody>
  </table>
</div>
```

- **必須**：見出しセルは `<th scope="col">` / `<th scope="row">` を使う。`<td>` に太字を当てて代用しない
- **必須**：ページ全体（`<body>`）が横スクロールする状態にしない。スクロールはテーブルのコンテナ内に閉じ込める
- **推奨**：行の縞模様（ゼブラ）は使わず、`border-b border-border` で区切る
- **推奨**：セル内文字は14px（`text-sm`）まで許容する（本文ではないため）。12px以下にしない

---

## 19. ナビゲーション

### 19.0 全体方針（必須）

§0.5 の決定に従い、画面幅で主たるナビゲーションを切り替える。

| 画面幅 | 主要導線 | 全機能への入口 |
| --- | --- | --- |
| `md:` 未満（スマートフォン） | **下部固定ナビ**（§19.2） | ヘッダーのハンバーガー（§19.3） |
| `md:` 以上（タブレット・PC） | **ヘッダー内の上部ナビ**（§19.1） | ヘッダーのハンバーガー（§19.3） |

- **ハンバーガーメニューは全画面幅で常に表示する**。上部ナビ・下部ナビには収まらない機能（学食メニュー、施設予約、図書館混雑予想、チャットボット等）への入口となるため
- **同じ項目を上部ナビと下部ナビの両方に出す**（画面幅で表示が切り替わるだけ）。項目の並び順も揃え、幅によって導線の構造が変わらないようにする
- 上部ナビと下部ナビが同時に表示される状態を作らない（`md:hidden` / `hidden md:flex` で排他にする）

### 19.1 ヘッダー（必須）

全画面幅で上部固定する（要件定義書 §11-4）。

- `sticky top-0 z-20 bg-surface/95 backdrop-blur-sm`
- 高さ56px（`h-14`）
- 内側は `mx-auto w-full max-w-lg px-4` で本文と左右を揃える
- スクロール時のみ `shadow-card` を付ける（常時影を出さない）

**表示要素**

| 要素 | スマートフォン | タブレット・PC |
| --- | --- | --- |
| ロゴ＋サービス名 | 表示 | 表示 |
| 上部ナビ（主要4項目） | 非表示（`hidden md:flex`） | 表示 |
| 検索 | アイコンのみ（検索ページへ遷移） | アイコンのみ（検索ページへ遷移） |
| ハンバーガー | 表示 | 表示 |

**上部ナビ（`md:` 以上）**

- 項目数は**下部ナビと同じ4項目**。増やさない
- 文字サイズは `text-sm`、アイコンは付けず文字ラベルのみ（横幅を節約するため）
- 非アクティブ：`text-ink-muted` / アクティブ：`text-primary font-bold`
- アクティブ項目に `aria-current="page"` を付ける
- タップ領域は44px以上（`min-h-11 px-2`）
- **収まらない場合は項目を削り、ハンバーガーに寄せる**。文字を12px以下にしたり、横スクロールさせたりして詰め込まない

```tsx
<header className="sticky top-0 z-20 bg-surface/95 backdrop-blur-sm">
  <div className="mx-auto flex h-14 w-full max-w-lg items-center gap-2 px-4">
    <Link to="/" className="flex shrink-0 items-center gap-2">
      <img src={logo} alt="がんちゃんねる" className="h-8 w-auto" />
    </Link>

    {/* 上部ナビ：md以上でのみ表示 */}
    <nav aria-label="メインナビゲーション" className="ml-auto hidden md:flex md:items-center md:gap-1">
      <NavLink
        to="/news"
        className={({ isActive }) =>
          `inline-flex min-h-11 items-center rounded-control px-2 text-sm ${
            isActive ? "font-bold text-primary" : "text-ink-muted"
          }`
        }
      >
        ニュース
      </NavLink>
      {/* 以下、下部ナビと同じ4項目 */}
    </nav>

    <button type="button" aria-label="メニューを開く" className="ml-auto md:ml-0 ...">
      <MdMenu size={24} aria-hidden />
    </button>
  </div>
</header>
```

### 19.2 下部固定ナビ（必須）

スマートフォンでの主要導線。**`md:` 未満でのみ表示する**。

- 高さ64px（`h-16`）、`fixed bottom-0 z-10`、`border-t border-border`、`bg-surface`
- **`md:hidden` を必ず付ける**。PCでは上部ナビが担当するため表示しない
- 幅は `mx-auto w-full max-w-lg`（§6.1）
- **項目数は4つまで**。増える場合はハンバーガーメニューに集約する
- **各項目にアイコン（24px）と文字ラベル（12px）を必ず併記する**。アイコンのみにしない
- 各項目のタップ領域は44px以上
- 非アクティブ：`text-ink-muted` / アクティブ：`text-primary` + `font-bold`
- アクティブ項目に `aria-current="page"` を付ける
- iOSのホームインジケーターを避けるため `pb-[env(safe-area-inset-bottom)]` を付ける

```tsx
<nav
  aria-label="メインナビゲーション"
  className="fixed bottom-0 z-10 mx-auto flex h-16 w-full max-w-lg items-stretch border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
>
  <NavLink
    to="/news"
    className={({ isActive }) =>
      `flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 ${
        isActive ? "font-bold text-primary" : "text-ink-muted"
      }`
    }
  >
    <MdArticle size={24} aria-hidden />
    <span className="text-xs">ニュース</span>
  </NavLink>
</nav>
```

`NavLink` の状態はTailwindのクラス関数で表現する。グローバルCSSのクラス（現在の `.page-button.active`）は使わない（§26.3）。

上部ナビと下部ナビはどちらも `<nav aria-label="メインナビゲーション">` を使うが、**同時に表示されない**ため重複しない。

### 19.3 ハンバーガーメニュー（必須）

全機能への入口。**全画面幅で表示する**。

**ボタン**

- ヘッダーの右端に配置。44×44px以上
- アイコンは `MdMenu`（開く）/ `MdClose`（閉じる）、24px
- `aria-label="メニューを開く"` / `aria-label="メニューを閉じる"` を状態に応じて切り替える
- `aria-expanded` と `aria-controls`（パネルの `id`）を付ける

**パネル**

| 画面幅 | 形式 |
| --- | --- |
| `md:` 未満 | 右から出るドロワー（幅は画面の80%、最大320px）。または全画面 |
| `md:` 以上 | ヘッダー直下に開くドロップダウン（`max-w-lg` 内、右寄せ） |

- 背景オーバーレイは `bg-ink/50`
- 角丸は `rounded-sheet`、影は `shadow-overlay`
- モーダルに準じた要件を満たす（§14.3）：`role="dialog"` `aria-modal="true"`、閉じる手段を2つ以上（閉じるボタン＋背景タップ＋`Esc`）、背景スクロールの停止、フォーカスの移動と復帰
- **ページ遷移したら必ず閉じる**

**中身**

- 主要4項目（上部ナビ・下部ナビと同じもの）＋ それ以外の全機能を並べる
- 機能が多い場合は見出し（`text-sm font-bold text-ink-muted`）でグループ分けする。**階層メニュー（開くと下位が出る入れ子）は作らない**（原則4、参考例3の反面教師）
- 各項目は高さ48px以上、`text-base`、アイコン20pxを左に添える
- 現在のページには `aria-current="page"` を付け、`text-primary font-bold` にする

### 19.4 タブ（必須）

一覧ページの「探しかた」切替などに使う。

- 選択中：`bg-primary-subtle text-primary font-bold`
- 非選択：`text-ink-muted`
- 下線ではなく背景で選択状態を示す（角丸 `rounded-control`）
- タブ数は4つまで。横スクロールするタブは作らない（項目が隠れて気付かれない）
- `role="tablist"` / `role="tab"` / `aria-selected` を付ける

### 19.5 パンくずリスト（推奨）

- 詳細ページで、階層が2段以上ある場合に表示する
- `text-sm text-ink-muted`、区切りは `/`
- 現在地はリンクにせず `aria-current="page"` を付ける
- `<nav aria-label="パンくずリスト">` で囲む

### 19.6 導線設計（必須）

- **「機能一覧」ボタンを最重要コンポーネントとして扱う**（要件定義書 §1-4）。トップページの目立つ位置に Primary ボタンとして置く。ハンバーガーメニュー（§19.3）と同じ内容へ導く導線であり、ハンバーガーがあることを理由に省略しない
- 階層は最大3段（トップ → 一覧 → 詳細）に抑える。それ以上深くしない（参考例3の反面教師）
- 外部サイト（WebClass、アイアシスタント等）へのリンクには、外部リンクであることを示すアイコンを付ける

---

## 20. ローディング表示

### 20.1 方針（必須）

- 表示は**文章のみ**とする（要件定義書 §14-2）。凝ったアニメーションやイラストは使わない
- 読み込み中に画面が真っ白になる状態を作らない
- 読み込み前後で**レイアウトが動かない**ようにする（コンテナの高さを先に確定させる）

### 20.2 実装（必須）

```tsx
<div role="status" aria-live="polite" className="py-12 text-center">
  <p className="text-base text-ink-muted">読み込み中です。</p>
</div>
```

- `role="status"` と `aria-live="polite"` を付け、読み上げ環境にも状態を伝える
- ボタン起点の処理は、画面全体ではなくボタン内で状態を示す（§13.3）
- 処理が長引く場合でも、追加の説明を足すだけにする（「読み込みに時間がかかっています。」）

### 20.3 推奨

- カード一覧の読み込み中は、同じ寸法の枠を `bg-surface-card` で並べる（スケルトン）。アニメーションは付けない
- 200ms以内に終わる処理には、ローディング表示を出さない（ちらついて逆に遅く感じる）

---

## 21. エラー表示

### 21.1 種類と文言（必須）

| 状況 | 見出し | 本文 | 主な導線 |
| --- | --- | --- | --- |
| 404 | ページが見つかりません | お探しのページは削除されたか、URLが変更された可能性があります。 | トップページへ戻る / 一覧ページへ戻る |
| 通信エラー | 情報を取得できませんでした | 通信状態を確認して、もう一度お試しください。 | 再読み込み / トップページへ戻る |
| メンテナンス中 | ただいまメンテナンス中です | 時間をおいて、もう一度お試しください。 | トップページへ戻る |
| 入力エラー | （見出しなし） | §15.4 に従い入力欄の直下に表示 | — |

### 21.2 実装（必須）

- 表示は**文章のみ**（要件定義書 §14-2）。イラスト・大きなアイコン・エラーコードの羅列は使わない
- **必ず次の操作への導線を置く**（要件定義書 §7-3 ページ5）。行き止まりを作らない
- 技術的な情報（スタックトレース、例外メッセージ）を利用者に表示しない。開発環境のみとする
- 「エラーが発生しました」だけで終わらせない。何が起きて、次に何をすればよいかを書く

```tsx
<div role="alert" className="flex flex-col items-center gap-4 py-12 text-center">
  <h1 className="text-xl font-bold text-ink">ページが見つかりません</h1>
  <p className="text-base text-ink-muted">
    お探しのページは削除されたか、URLが変更された可能性があります。
  </p>
  <div className="flex w-full flex-col gap-2">
    <Link to="/" className="...Primary...">トップページへ戻る</Link>
    <Link to="/circles" className="...Secondary...">一覧ページへ戻る</Link>
  </div>
</div>
```

- 画面全体のエラーには `role="alert"`、フォーム内の軽微なエラーには `aria-describedby` を使う

---

## 22. 空状態

### 22.1 種類（必須）

| 状況 | 文言 | 導線 |
| --- | --- | --- |
| データがない | まだ登録されていません。 | トップページへ戻る |
| 検索結果がない | 条件に一致する情報は見つかりませんでした。 | 検索条件をリセット / 一覧ページへ戻る |
| 絞り込み結果がない | 条件に一致する情報は見つかりませんでした。 | 絞り込みを解除 |

### 22.2 ルール（必須）

- **一覧を表示するすべての画面で、0件時の表示を実装する**（原則3）
- 検索結果が0件の場合は、**適用中の検索条件を画面に残す**。何で絞ったのか分からなくなるため
- 検索結果ページには、0件でなくても**件数を表示する**（要件定義書 §7-3 ページ4）
- 空状態を「エラー」として見せない。`danger` の色を使わない
- 表示は文章のみ。イラストは使わない

```tsx
<div className="flex flex-col items-center gap-4 py-12 text-center">
  <p className="text-base text-ink">条件に一致する情報は見つかりませんでした。</p>
  <p className="text-sm text-ink-muted">条件を変えると、見つかる場合があります。</p>
  <button type="button" className="...Secondary...">検索条件をリセットする</button>
</div>
```

---

## 23. UI文言

### 23.1 文体（必須）

- 丁寧な「です・ます」調
- 短く簡潔に。1文は40文字程度までを目安にする
- フォーマルな表現を使う。くだけた表現・感嘆符の多用をしない

### 23.2 呼びかけ（必須）

- **利用者への呼びかけを使わない**（要件定義書 §13-2）
- ❌「あなたにおすすめのサークル」→ ⭕「おすすめのサークル」
- ❌「サークルを探そう！」→ ⭕「サークルを探す」

### 23.3 統一用語（必須）

| 使う | 使わない |
| --- | --- |
| ログイン | サインイン |
| 登録 | アカウント作成、新規作成 |
| 取り消し | キャンセル、やめる |
| ユーザー | 利用者、ユーザー様 |
| 検索する | 探す（ボタンラベルとして） |
| 送信する | 送る |

新しい用語が必要になった場合は、独断で決めずこの表に追記してからチームに共有する。

### 23.4 メッセージの書き方（必須）

- **状況＋次の操作**の2つを書く
  - ❌「エラー」
  - ⭕「情報を取得できませんでした。通信状態を確認して、もう一度お試しください。」
- 利用者を責める書き方をしない
  - ❌「入力が間違っています」→ ⭕「メールアドレスの形式が正しくありません。」
- 専門用語には必要に応じて補足を付ける（要件定義書 §13-3）。「WebClass（課題・講義情報のシステム）」など

### 23.5 ボタンラベル（必須）

- 動詞で終える（「検索する」「送信する」「戻る」）
- 「OK」「はい/いいえ」を単独で使わない。何が起きるか書く（「削除する」「取り消し」）
- 6文字程度までを目安にし、折り返さない長さにする

---

## 24. アクセシビリティ

WCAG 2.1 の A〜AA 相当を目標とする（要件定義書 §12-1）。

### 24.1 必須要件

- [ ] `<html lang="ja">` を指定する（現在 `en`。§27）
- [ ] 見出しは `h1` から順に使い、レベルを飛ばさない。1ページに `h1` は1つ
- [ ] 画像に `alt` を付ける（装飾は `alt=""`）
- [ ] アイコンのみのボタンに `aria-label` を付ける
- [ ] フォームのラベルを `htmlFor` / `id` で紐付ける
- [ ] キーボード（Tab / Enter / Space / Esc）だけで主要操作を完了できる
- [ ] タップ領域を44×44px以上確保する
- [ ] 色だけで情報を区別しない（色＋文字、色＋アイコン）
- [ ] 動的に変化する領域に `aria-live` を付ける

### 24.2 コントラスト（必須）

- 本文テキスト：**4.5:1 以上**
- 大きい文字（24px以上、または18px以上の太字）：**3:1 以上**
- UI部品の境界（入力欄の枠、フォーカスリング）：**3:1 以上**

§3.1 の組み合わせ表はすべてこの基準を満たしている。表にない組み合わせを使う場合は、実装前にコントラスト比を確認する。

### 24.3 フォーカス表示（必須）

キーボード操作時にどこを操作しているかが必ず分かる状態にする。

```
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
```

- **`outline-none` / `focus:outline-none` を単独で書かない**。代替のフォーカス表示を必ず用意する
- `focus` ではなく `focus-visible` を使う。マウス操作時に不要なリングが出ないようにする
- 操作可能な要素（ボタン、リンク、入力欄、タブ、カード）すべてに適用する

### 24.4 推奨

- 動きに敏感な利用者のため、アニメーションは `motion-reduce:transition-none` を併記する
- 「詳しくはこちら」のようなリンクテキストを避け、リンク先が分かる文言にする
- ページ遷移後、フォーカスをページ先頭（`h1`）へ移す

---

## 25. Figma上の命名規則

Figmaの使用は必須ではないが（要件定義書 §0）、開発規約 §15-6 のフローで案を作る場合は以下に従う。

### 25.1 ページ・フレーム

```
ページ：01_トップ / 02_一覧 / 03_詳細 / 04_検索 / 05_エラー
フレーム：<画面名>/<状態>     例）一覧/通常、一覧/0件、一覧/読み込み中
```

- フレーム幅は **375（スマートフォン）** を基本とし、必要な場合のみ 768 / 1280 を追加する

### 25.2 スタイル・変数

**実装のトークン名（§2.1、§26）と1対1で一致させる。** 名前が食い違うと、デザインと実装の対応が追えなくなる。

```
color/primary          → --color-primary
color/ink-muted        → --color-ink-muted
color/surface-card     → --color-surface-card
radius/card            → --radius-card
text/body              → text-base
```

### 25.3 コンポーネント

```
Component：<種別>/<名前>            例）UI/Button、Layout/BottomNav、Feature/CircleCard
Variant：  Type=Primary, Size=md, State=Default
```

- Variant のプロパティ名は実装のprops名と揃える（`type` `size` `disabled`）
- レイヤー名を `Frame 123` `Rectangle 4` のまま残さない

---

## 26. CSS変数 / Tailwind CSS設定

### 26.1 方針（必須）

- **スタイルは Tailwind CSS v4 のユーティリティクラスで書く**
- デザイントークンは `app/styles/app.css` の `@theme` に**一元的に定義する**。他の場所で色や角丸を定義しない
- トークンは必要最低限に保つ（要件定義書 §15-3）。文字サイズ・余白・ブレークポイントはTailwind標準スケールをそのまま使い、独自定義しない

### 26.2 トークン定義

以下を `app/styles/app.css` に反映する。

```css
@import "tailwindcss";

@theme {
  /* フォント */
  --font-sans: "Noto Sans JP", ui-sans-serif, system-ui, -apple-system,
    "Hiragino Kaku Gothic ProN", "Yu Gothic", Meiryo, sans-serif;

  /* カラー：ブランド */
  --color-primary: #1b4d33;
  --color-primary-hover: #143a26;
  --color-primary-active: #0e2b1c;
  --color-primary-subtle: #e8f0eb;

  /* カラー：ニュートラル */
  --color-ink: #1f2937;
  --color-ink-muted: #4b5563;
  --color-surface: #ffffff;
  --color-surface-card: #f4f6f4;
  --color-border: #e2e8e5;
  --color-border-strong: #82908a;

  /* カラー：状態 */
  --color-danger: #b3261e;
  --color-danger-subtle: #fdecea;

  /* 角丸 */
  --radius-control: 0.5rem;  /* 8px：ボタン・入力欄・タブ */
  --radius-card: 0.75rem;    /* 12px：カード */
  --radius-sheet: 1rem;      /* 16px：モーダル */

  /* 影 */
  --shadow-card: 0 1px 2px 0 rgb(31 41 55 / 0.06);
  --shadow-overlay: 0 8px 24px -4px rgb(31 41 55 / 0.18);
}

html,
body {
  @apply bg-surface text-ink;
}
```

Tailwind v4 では `@theme` に定義した変数から自動的にユーティリティが生成される（`--color-primary` → `bg-primary` / `text-primary` / `border-primary`、`--radius-card` → `rounded-card`、`--shadow-card` → `shadow-card`）。

### 26.3 CSSファイルの扱い（必須）

- **コンポーネント単位のグローバルCSSファイルを新規に作らない**。クラス名が全体で衝突する
- 現在の `app/components/layout/footer/footer.css`（`.page-button`）はグローバルCSSであり、Tailwindのクラスに置き換える（§27）
- 例外的に素のCSSが必要な場合（複雑なキーフレームアニメーション等）は、**CSS Modules（`*.module.css`）**を使い、理由をPull Requestに記載する

### 26.4 禁止（必須）

- 任意値の乱用（`bg-[#004400]` `p-[13px]` `text-[15px]`）。トークンとスケールの範囲で表現する
  - 例外：`pb-[env(safe-area-inset-bottom)]` のようなCSS環境変数
- インラインの `style` 属性でのスタイル指定（動的な値を除く）
- `!important` / `!` 修飾子の使用
- `@apply` の多用。共通化したい見た目は、CSSではなくReactコンポーネントとして共通化する（§27.1）

---

## 27. コンポーネント命名規則

### 27.1 配置（必須）

[architecture.md](./architecture.md) のディレクトリ構成に従う。

| ディレクトリ | 入れるもの | 命名 |
| --- | --- | --- |
| `components/ui/` | 複数画面で使う汎用UI | 一般名詞（`button.tsx` → `Button`） |
| `components/layout/` | アプリ全体の枠組み | 役割名（`header.tsx` → `Header`） |
| `components/features/<機能>/` | 特定機能専用 | `<機能>-<役割>`（`news-card.tsx` → `NewsCard`） |

- 同じ見た目のUIが**2画面以上で必要になった時点で** `ui/` に切り出す。1回しか使わないものを先回りして共通化しない（開発規約 §12.3）
- 本規約 §13〜§22 のUI部品は、いずれ `ui/` の共通コンポーネントとして実装する。実装済みのものがある場合、同等の見た目を個別に書き直さない

### 27.2 命名（必須）

開発規約 §10.2 に準拠。

| 対象 | 規則 | 例 |
| --- | --- | --- |
| ファイル名 | kebab-case | `circle-card.tsx` |
| コンポーネント関数 | PascalCase | `CircleCard` |
| Props型 | `<コンポーネント名>Props` | `CircleCardProps` |
| 真偽値のprops | `is` / `has` / `can` で始める | `isActive` `hasImage` |
| イベントハンドラのprops | `on` で始める | `onSelect` |

- 1ファイル1コンポーネントを原則とする（そのファイル内でのみ使う小さな下位コンポーネントは例外）
- `export default` を使う（既存実装に合わせる）

### 27.3 Propsの設計（推奨）

- 見た目のバリエーションは `variant` / `size` で受け取り、`className` で外から自由に上書きさせない
- 汎用UIコンポーネントは、`className` を追加で受け取れるようにしてよい（余白の調整用）
- Props型は `type` で定義し、`any` を使わない（開発規約 §10.4）

```tsx
type ButtonProps = {
  variant?: "primary" | "secondary" | "text" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
} & React.ComponentProps<"button">;
```

---

## 28. 実装チェックリスト

Pull Request作成前に確認する（開発規約 §17.1 の「画面変更がある場合」に対応）。

**表示**

- [ ] 375px / 768px / 1280px で崩れない
- [ ] 色をトークン経由で指定している（HEX直書きがない）
- [ ] 本文が16px、14px未満の本文がない
- [ ] 余白が4px単位のスケールに収まっている
- [ ] 角丸・影が §8 / §10 の範囲内である

**崩れ対策**

- [ ] 可変長テキストに `line-clamp-*` を付けている
- [ ] 極端に長い文字列を入れても崩れない
- [ ] 画像が読み込めない場合の表示を確認した
- [ ] データ0件の表示を実装した

**操作**

- [ ] タップ領域が44px以上ある
- [ ] 下部固定要素にコンテンツが隠れていない（`pb-36 md:pb-24`）
- [ ] 上部ナビと下部ナビが同時に表示されていない（`md:` の前後で確認）
- [ ] ハンバーガーメニューが閉じられる（ボタン / 背景タップ / `Esc`）、遷移後に閉じる
- [ ] キーボードだけで操作できる
- [ ] フォーカス表示が見える

**文言**

- [ ] です・ます調である
- [ ] 呼びかけ表現がない
- [ ] §23.3 の統一用語に従っている
- [ ] エラー・空状態に次の操作への導線がある

---

## 29. 既存コードの是正リスト

本規約の制定時点で、規約に適合していない箇所。順次Issueを作成して対応する。

| # | 対象 | 内容 | 該当する規約 | 優先度 |
| --- | --- | --- | --- | --- |
| 1 | `app/root.tsx:31` | `<html lang="en">` を `lang="ja"` にする | §24.1 | 高 |
| 2 | `app/root.tsx:15-26` | `Inter`（ラテン専用）を `Noto Sans JP` に差し替える | §4.1 | 高 |
| 3 | `app/styles/app.css` | `@theme` にトークンを定義する。`dark:bg-gray-950` を削除する | §26.2、§2.4 | 高 |
| 4 | `app/components/features/news/news-card.tsx:24,33,37` | `#999999` / `#bccec2` / `#004400` の直書きをトークンに置き換える。グラデーション背景を廃止する | §2.2、§10.2 | 高 |
| 5 | `app/components/layout/footer/footer.tsx` | 高さ96px→64px、アイコン40px→24px、文字ラベルを併記、`aria-current` を付ける、`max-w-lg mx-auto` を適用 | §19.2 | 高 |
| 6 | `app/components/layout/footer/footer.tsx` | **`md:hidden` を追加する**（PCでは上部ナビが担当するため）。ディレクトリ名も役割に合わせ `layout/bottom-nav/` への改名を検討する | §19.0、§19.2 | 高 |
| 7 | `app/components/layout/footer/footer.tsx` | アイコンファミリーを `react-icons/md` に統一する | §11.1 | 中 |
| 8 | `app/components/layout/footer/footer.css` | グローバルCSSを廃止し、`NavLink` のクラス関数で状態を表現する | §26.3 | 中 |
| 9 | `app/components/layout/ad-banner/ad-banner.tsx` | `max-w-lg mx-auto` を適用、`img` に `alt` を付ける、`🔘` を `react-icons` に置き換える | §6.1、§12.2、§13.4 | 中 |
| 10 | 全ページ | ヘッダー（`components/layout/header/`）が未実装。**`md:` 以上の上部ナビを含む** | §19.1 | 中 |
| 11 | 全ページ | ハンバーガーメニュー（`components/layout/menu-drawer/`）が未実装 | §19.3 | 中 |
| 12 | 全ページ | 下部固定要素ぶんの `pb-36 md:pb-24` が未適用 | §5.3 | 中 |
| 13 | `app/components/features/news/news-card.tsx:24` | `block` と `flex` が同一要素に指定されている（`display` の重複） | — | 低 |
| 14 | `package.json` | `@tailwindcss/line-clamp` は Tailwind v4 では不要のため削除する | §4.4 | 低 |

---

## 30. 規約の運用

### 30.1 変更手順

デザインの変更・追加は、開発規約 §15-6 の流れに従う。

1. Issueを作成する
2. 案を作る（Figmaは任意。§25）
3. チームでレビューする
4. 実装する
5. Pull Requestで確認する

本規約そのものを変更する場合は、デザイン担当の承認を得たうえで、変更理由をPull Requestに記載する（開発規約 §3.2）。

### 30.2 見直し時期

開発規約 §26.1 に準じ、以下のタイミングで見直す。

- MVP版リリース（2026/08/06）の直後
- 同じ指摘がレビューで3回以上出たとき
- 新しい画面種別・UI部品が必要になったとき
- ダークモード対応を開始するとき

### 30.3 未決事項

- §0.4 のCSS管理方法の代表への確認 → [hearing-points.md](./hearing-points.md) §2
- ハンバーガーメニューに載せる機能項目の確定（要件定義書 §1-3 の7機能のうち、どこまでをMVPで出すか）
- ダークモードの対応時期
- トップページの「機能一覧」ボタンの具体的な配置（要件定義書 §1-4）

---

制定日：2026-08-02
最終更新日：2026-08-02
規約バージョン：Version 0.1
