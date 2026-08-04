# 0002. フレームワークは当面 React Router v7 とし、MVP公開後にNext.jsへ移行する

- 日付: 2026-08-04
- ステータス: 採用

## 背景

要件定義書（[design-guidelines-input.md](../project/design-guidelines-input.md) §0「使用予定の技術」）と開発規約 §2 には、使用技術として `Next.js` と記載されていた。
一方でリポジトリの実態は **React Router v7（フレームワークモード・SSR有効）** であり、Next.js の依存は一切入っていない。

この食い違いは [hearing-points.md](../project/hearing-points.md) §1 に確認事項として記録し、代表への確認を行った。

## 決定

- MVP版（2026/08/06）までは、**React Router v7 のまま開発を進める**
- Next.js への移行は**カンパニー全体の意向**であり、方針としては維持する。MVP公開後、開発が落ち着いた段階で移行作業に着手する
- ドキュメント上の「使用技術」は、現時点の実態である React Router v7 を正として記述し、Next.js は「将来の移行予定」として明示する

## 理由

- MVP公開まで日数がなく、この時点でルーティング・SSR・ビルド設定を全面的に書き換えるのは現実的でない
- 現時点で Next.js 固有機能（App Router 固有のAPI、Image最適化、Vercel前提の機能など）に依存した実装はないため、移行を後ろ倒ししても負債が積み上がりにくい
- 規約に `Next.js` と書かれたままだと実装と規約が食い違う。特に本規約はAIエージェントへ渡して使う前提のため（開発規約 冒頭）、誤った前提でコードが生成される

## 影響

- 開発規約 §2 の技術構成を React Router v7 ベースに書き換え、Next.js への移行予定を注記した
- デザイン規約 §0.4 のフレームワーク行を「確認中」→「決定済み」に更新した
- 受領した要件定義書（`design-guidelines-input.md`）は**内容を変更しない**。記載と実態の差は本ADRで吸収する

## 移行時に影響する箇所（MVP後の作業用メモ）

| 対象 | 内容 |
| --- | --- |
| `app/routes/` | `@react-router/fs-routes` の flatRoutes 前提。ファイル名の規則が Next.js App Router とは異なるため全面的に再配置が必要 |
| `app/routes.ts` / `react-router.config.ts` | Next.js では不要。設定の移し替えが必要 |
| `package.json` | `@react-router/*`・`react-router` を Next.js へ差し替え |
| データ取得 | `loader` / `action` を Server Components や Route Handlers へ移す |
| `app/services/` `app/lib/` `app/types/` | フレームワーク非依存のため、概ねそのまま流用できる |
| デザイン規約 | パス表記・ナビゲーション実装（`NavLink` など）の見直しが必要 |
