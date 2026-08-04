# ドキュメント

Web版 がんちゃんねる の各種ドキュメントを管理する。

> **正本（Source of Truth）はこの `docs/` ディレクトリ。**
> Notion などの外部ツールは、あくまでリポジトリ外からでも閲覧できるようにするためのミラーとして扱う。
> 内容を更新する場合は、まず `docs/` を更新し、必要に応じてNotion側へ反映する。

## 一覧

### project/ … アプリ全体の方針

| ドキュメント | 内容 | 状態 |
| --- | --- | --- |
| [development-guidelines.md](./project/development-guidelines.md) | 開発規約（Git運用・コーディング・レビュー等） | 運用中 |
| [architecture.md](./project/architecture.md) | 技術構成・ディレクトリ構成・命名規約 | 運用中 |
| [design-guidelines.md](./project/design-guidelines.md) | デザイン規約（色・余白・フォント・UI） | 運用中 |
| [design-guidelines-input.md](./project/design-guidelines-input.md) | デザイン規約の要件定義書（規約のインプット・受領物） | 確定 |
| [hearing-points.md](./project/hearing-points.md) | 代表・関係者へのヒアリング事項（未決事項の記録） | 確認中 |
| [product-requirements.md](./project/product-requirements.md) | アプリ全体の要件・仕様 | 作成中 |
| [post-mvp-agenda.md](./project/post-mvp-agenda.md) | MVP公開後に担当者間で話し合う事項の一覧 | 運用中 |

### 機能ごとの要件・仕様

| ドキュメント | 内容 | 状態 |
| --- | --- | --- |
| [circle-info/](./circle-info/) | サークル情報機能の要件・仕様 | 作成中 |
| [chatbot/](./chatbot/) | 学内QAチャットボットの概要・仕様 | 運用中 |

### 記録

| ドキュメント | 内容 | 状態 |
| --- | --- | --- |
| [decisions/](./decisions/) | 重要な意思決定の記録（ADR） | 運用中 |
| [dev-report/](./dev-report/) | 開発日報（メンバーごと・日付ごと） | 運用中 |
| [images/](./images/) | ドキュメント本文で使う画像 | — |

## 運用ルール

- ファイル名は英語の kebab-case（中身は日本語でよい）
- **アプリ全体の方針**（規約・アーキテクチャ・全体要件）は `project/` にまとめる
- 機能単位の要件・仕様は `<機能名>/`（例: `circle-info/`）にまとめる。ディレクトリ名は `app/routes` のURL slug と揃える
  - `chatbot/` のみ、URL（`/chat`）ではなく機能名で揃えている（既存の呼称に合わせるため）
- 重要な意思決定は `decisions/` に ADR として残す（連番 + 内容が分かる名前）
- 開発規約 §4.1 に従い、日常的な連絡はSlack/LINE、正式な仕様・決定はここに集約する
