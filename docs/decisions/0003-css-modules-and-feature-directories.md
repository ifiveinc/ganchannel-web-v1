# 0003. スタイルは CSS Modules を主とし、関連ファイルは機能単位でまとめる

- 日付: 2026-08-05
- ステータス: 採用

## 背景

### CSS管理方法

受領した要件定義書（[../project/design-guidelines-input.md](../project/design-guidelines-input.md) §15-2）は **CSS Modules** を指定していたが、
同 §0 は「CSS/UIライブラリ：なし（Tailwind CSSを使用）」とあり、要件定義書の中で記載が食い違っていた。
実装は Tailwind CSS v4 のユーティリティクラスで進んでおり、デザイン規約 §26.3 も
「CSS Modules は複雑なアニメーション等の例外時のみ」としていた。

この食い違いは hearing-points.md §2（決定後に削除。内容は本ADRに統合済み）に確認事項として記録していた。

JSX に長いユーティリティクラス列が並び、マークアップと見た目の指定が読み分けにくくなっていたため、
要件定義書の指定どおり CSS Modules へ寄せる判断をした。

### ディレクトリ構成

ADR 0001 で `routes` / `components` / `services` / `types` / `data` の層構成を採ったが、
その時点で「機能単位で1ディレクトリに固める案は**ページ数が増えた段階で再検討**」として保留していた。
その後 circle-info とチャットボットの2機能が加わり、`services` に21ファイルが平場で並ぶなど、
どのファイルがどの機能のものか名前でしか判別できない状態になっていた。

## 決定

### 1. スタイルは CSS Modules を主とする

- コンポーネントのスタイルは、同じ場所に置いた `<コンポーネント名>.module.css` に書く
- **デザイントークン（色・角丸・影）は `app/styles/app.css` の `@theme` に一元定義し、
  CSS Modules からは `var(--color-primary)` のように参照する**。トークンを二重に持たない
- Tailwind のユーティリティクラスは、既存実装の維持と、
  1〜2クラスで済む軽微な指定に限って使用してよい

### 2. 各層の中を機能名のディレクトリで分ける

`services` / `data` / `types` / `lib` の直下に機能名のディレクトリを作り、その中にファイルを置く。
`components/features/<機能>/` と粒度が揃う。

```
app/services/  circle-info/  chatbot/  news/
app/data/      circle-info/  chatbot/  news/  faq/
app/types/     circle-info/  chatbot/  news/
app/lib/       circle-info/  chatbot/
```

`routes/` は flatRoutes がファイル名からURLを決めるため、フラットのまま変えない。

## 理由

### CSS Modules

- 要件定義書 §15-2 の指定に沿う。指定に反する構成を続けると、以後の判断のたびに整合を取り直す必要がある
- クラス名がビルド時にハッシュ化されるため、グローバルCSS（旧 `footer.css`）で問題になった
  クラス名衝突が構造的に起きない
- `@theme` の変数は素のCSSカスタムプロパティとして出力されるため、
  **CSS Modules へ移してもデザイントークンの一元管理は崩れない**。これが成立するため移行コストが低い
- 見た目の指定がJSXから分離され、マークアップの構造が読みやすくなる

### 機能単位のディレクトリ

- 2チーム（circle-info・chatbot）が並行して作業しており、触るディレクトリが分かれるとコンフリクトが減る
- ADR 0001 の層構成を捨てずに済む。層の中を分けるだけなので、import パスの変更で完結する

## 適用時期

**本ADRの内容を全体に適用するのは、MVP公開（2026/08/06）以降とする。**

MVP公開までは、各担当者がそれぞれ選んだ進め方を優先する。
公開前にコードベース全体へ横断的な変更を入れると、リリース直前に広い範囲の再確認が必要になり、
複数人が同時に別の機能を触っている状況では衝突も起きやすいため。

- 08/05時点で適用済み：`app/components/features/circle-info/` のCSS Modules化、
  `services` / `data` / `types` / `lib` の機能別ディレクトリ分割
- 08/06以降：担当者間で作業範囲を調整したうえで、残りの機能へ順次適用する
- それまでの間、他機能が本ADRと異なる方法で書かれていても規約違反として扱わない

## 影響

- `app/components/features/circle-info/` の10コンポーネントを CSS Modules へ移行済み。
  詳細カード3種で共通する枠・見出しは `detail/detail-card.module.css` に切り出し、`composes` で取り込む
- **chat / news / layout / ui の各コンポーネントは Tailwind のまま**。
  遡及的な一括移行は行わず、新規作成・大きな改修のタイミングで CSS Modules に寄せる
- デザイン規約 §26 を CSS Modules 前提に改訂した
- 開発規約 §12 に「関連ファイルは機能単位でまとめる」を追記した
- ディレクトリ構成の詳細は [../project/architecture.md](../project/architecture.md) に記載

## 移行しなかったもの

Tailwind CSS 自体は引き続き依存に残す。理由は以下。

- `app/styles/app.css` の `@theme` がデザイントークンの定義場所であり、
  ここを外すとトークンの一元管理の仕組みごと作り直しになる
- 既存コンポーネント（chat・news・layout・ui）が Tailwind で書かれている
