# ドキュメント

Web版 がんちゃんねる の各種ドキュメントを管理する。

> **正本（Source of Truth）はこの `docs/` ディレクトリ。**
> Notion などの外部ツールは、あくまでリポジトリ外からでも閲覧できるようにするためのミラーとして扱う。
> 内容を更新する場合は、まず `docs/` を更新し、必要に応じてNotion側へ反映する。

## 一覧

| ドキュメント | 内容 | 状態 |
| --- | --- | --- |
| [development-guidelines.md](./development-guidelines.md) | 開発規約（Git運用・コーディング・レビュー等） | 運用中 |
| [architecture.md](./architecture.md) | 技術構成・ディレクトリ構成・命名規約 | 運用中 |
| [design-guidelines.md](./design-guidelines.md) | デザイン規約（色・余白・フォント・UI） | 作成中 |
| [requirements.md](./requirements.md) | 要件・仕様 | 作成中 |
| [decisions/](./decisions/) | 重要な意思決定の記録（ADR） | 運用中 |

## 運用ルール

- ファイル名は英語の kebab-case（中身は日本語でよい）
- 重要な意思決定は `decisions/` に ADR として残す（連番 + 内容が分かる名前）
- 開発規約 §4.1 に従い、日常的な連絡はSlack/LINE、正式な仕様・決定はここに集約する
