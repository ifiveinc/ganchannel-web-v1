# MVP公開後の協議事項

MVP公開（2026/08/06）までは各担当者がそれぞれの進め方を優先し、
**全体に影響する判断・大規模な改修は公開後にまとめて行う**
（[decisions/0003](../decisions/0003-css-modules-and-feature-directories.md) 適用時期）。

本書は、そのときに話し合う必要がある事項を1か所に集めたもの。

作成日：2026-08-05

## 使い方

- 決まったものは「状態」を更新し、全体構成に影響するものは `docs/decisions/` にADRとして残す（開発規約 §19.2）
- 個別の機能に閉じる論点は、決定後に各機能のドキュメント（`docs/circle-info/`、`docs/chatbot/`）へ反映する
- 新しく出てきた論点はここに追記する

---

## A. 最優先（これが決まらないと他が進まない）

| # | 論点 | 背景・現状 | 決めること |
| --- | --- | --- | --- |
| A-1 | **`docs/chatbot-decisions.md` の扱い** | コード・ドキュメントの**59箇所**から設計根拠として参照されているが、`.gitignore` で除外されており**リポジトリにも手元にも存在しない**。現状、設計判断の理由を誰も辿れない | ①コミット対象に含める ②参照先を `docs/chatbot/spec.md` に振り替える ③非公開のままにするなら参照を消す、のいずれか |
| A-2 | **ブランチ保護の設定** | 開発規約 §6.2 で `main`・`develop` への直接pushを禁止したが、**GitHub側は未設定**で実際には通ってしまう。規約が文面だけの状態 | 両ブランチに「直接push禁止 / PR必須 / 承認1人以上」を設定する。設定者と実施時期 |
| A-3 | **開発体制の空欄を埋める** | 開発規約 §3.1（役割の担当者）、§3.2（意思決定者）が空欄。§28.1 パッケージ管理ツール、§28.2 マージ方法、§28.3 ブランチ削除、§28.6 定例ミーティングも未記入 | 各欄の記入。特に「技術構成・ライブラリの最終決定者」は以降の判断の前提になる |

---

## B. コード構成・規約の統一

| # | 論点 | 背景・現状 | 決めること |
| --- | --- | --- | --- |
| B-1 | **CSS Modules への移行範囲と順序** | `components/features/circle-info/` のみ移行済み。chat / news / layout / ui は Tailwind のまま（ADR 0003 の適用時期により、8/6までは違反扱いとしない） | 移行する範囲・順序・担当。全面移行するのか、新規と大改修時のみに留めるのか |
| B-2 | **`docs/chatbot/spec.md` §402 の記述** | 「新機能の新規コンポーネントは**Tailwindユーティリティクラスを主に**使用する」とあり、改訂後のデザイン規約 §26.3 と矛盾する | B-1 の結論に合わせて記述を更新するか、chatbot を例外として明記するか |
| B-3 | **機能単位分割の残り** | `services` / `data` / `types` / `lib` は分割済み。`hooks/`（1ファイル）、`components/layout/`・`components/ui/` は機能横断のため未分割 | `hooks/` も機能で分けるか。`layout` / `ui` は現状維持でよいか |
| B-4 | **デザイン規約 §29 の未対応5件** | `news-card.tsx` のHEX直書き（#4）、ハンバーガーメニュー未実装（#11）、`news-card.tsx` の `display` 重複（#13）、`@tailwindcss/line-clamp` の削除（#14）、上部ナビ未実装（#10の残り） | Issue化と担当・優先度 |
| B-5 | **不要ファイルの削除** | `app/routes/kakunin.tsx`（`/kakunin` で公開中の確認ページ。ローマ字名で命名規約違反）、`app/hooks/.gitkeep`、`app/lib/chatbot/text-similarity.ts`（どこからも import されていない） | 削除してよいか。特に `text-similarity.ts` は chatbot 側の意図確認が必要 |
| B-6 | **`docs/chatbot/` の命名** | `docs/README.md` の運用ルールは「ディレクトリ名は URL slug と揃える」だが、チャットボットのURLは `/chat`。現在は機能名に合わせて `chatbot/` としている | 例外として許容するか、`docs/chat/` に揃えるか |

---

## C. サークル情報（circle-info）の仕様・データ

| # | 論点 | 背景・現状 | 決めること |
| --- | --- | --- | --- |
| C-1 | **ジャンル分類の見直し** | `CIRCLE_GENRES` は運動系/文化系/音楽系/学術系/ボランティア/その他の6分類で、**学内カンパニーの活動を想定していない**。DearU・研磨工業・クラフトビール部を暫定で「学術系」に割り当てているが実態は事業寄り。「探す」はジャンルでしか絞り込めないため、ずれると見つけてもらえない | 分類の追加（例：ビジネス系）か、現行維持か。`app/constants/index.ts` にも「正式な値は要確認」のTODOあり |
| C-2 | **画像入稿の運用** | フォーム回答の画像はGoogle Driveの**非公開ファイル**で `<img>` から読めない。現在は表示層で除外しプレースホルダを出している。手順は `public/circles/README.md` に記載済み | ダウンロードと配置の担当者・タイミング。掲載枚数の上限（spec §10-4） |
| C-3 | **`summary` / `recommendedFor` の内容確認** | 8団体分をこちらで紹介文から起こした草案。事実ではなく訴求文のため、団体の意図と合っているか未確認 | 団体への確認方法。フォームに項目を追加して各団体に書いてもらうか |
| C-4 | **`isRecommended` の運用** | 現在は実データ8団体すべて `true`。おすすめ枠の上限は10件（`RECOMMENDED_CIRCLE_LIMIT`）なので、11団体目から選定が必要になる | おすすめに出す基準と、誰が選ぶか |
| C-5 | **`Circle.id` の生成方法** | `sync-circles.ts` は団体名のハッシュ（`circle-d178a0af`）を暫定採用。URLにそのまま出るため読めない（chatbot spec §8 item22） | ローマ字変換 / 連番 / `name-overrides.ts` での手動指定のいずれか。URL変更は既存リンクに影響する |
| C-6 | **CSV列とCircle型の不一致** | (a) 「入会費・年会費など」が1列なのに `fee.admission` / `fee.annual` は別フィールド、(b)「実績」が自由記述1つなのに `achievements` は `{year, content}[]`。現在は暫定格納（chatbot spec §8 item24） | フォームの質問を分割するか、暫定格納を正式仕様にするか |
| C-7 | **フォームに無い項目の更新分担** | `genres` / `summary` / `recommendedFor` / `isRecommended` などに対応するCSV列が無く、circle-info チームの手動補完に依存している（chatbot spec §8 item20） | フォームに列を追加するか、手動運用を正式化するか |
| C-8 | **情報の更新頻度と反映フロー** | 団体側の情報が変わったときの申請〜反映の流れが未定 | 更新申請の受け口と、`npm run sync:circles` の実行タイミング・担当 |
| C-9 | **spec §10 の未決4件** | ①ハンバーガーメニューと「その他」タブの中身 ②ジャンルの正式値（C-1） ③連絡先メールアドレスの公開可否 ④写真の掲載枚数上限（C-2） | 各項目の決定 |
| C-10 | **要件定義・仕様書のレビュー** | `docs/circle-info/requirements.md` と `spec.md` が**レビュー待ち**のまま実装が先行している | レビュー実施と、実装との差分の反映 |

---

## D. チャットボット

circle-info 側からは判断できないため、担当者主導で決める事項。

| # | 論点 | 背景・現状 |
| --- | --- | --- |
| D-1 | **環境変数の閾値が未確定** | `CIRCLE_INFO_FORM_URL` / `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_SECONDS` / `SEARCH_SCORE_THRESHOLD` / `CIRCLE_STRONG_MATCH_THRESHOLD` が空欄（spec §8 item2〜5） |
| D-2 | **`generate-snapshot.ts` の実行主体** | 手動実行してコミットするか、CIで回すか未確定。Renderのビルドコンテナにはgit push権限が無い（spec §8 item7） |
| D-3 | **`sync-photos.ts` の実行方法** | npm script にするか手動のみか未定（spec §8 item11） |
| D-4 | **`sync-registry.ts` のHTMLパース未実装** | クラブ紹介ページのパース処理が未着手（spec §8 item15） |
| D-5 | **「その他学生有志団体」の扱い** | `circle_registry` に投入元が無く、フォーム未回答だと `unknown` にしかならない制約を許容するか（spec §8 item18） |
| D-6 | **spec の記述が古い箇所** | §154 / §375 / §548 に「サンプルデータ5件」とあるが、サンプルは2026-08-05 に削除済み。§548 の `sample-company` も現存しない |

---

## E. リリース・運用

| # | 論点 | 背景・現状 | 決めること |
| --- | --- | --- | --- |
| E-1 | **`main` ブランチの同期** | `origin/main` は初期コミット（`beb4025`）のままで、テンプレートしか入っていない。MVP公開時に `develop` → `main` のPRを出す想定 | 公開時のマージ実施と、リリースタグの運用（§6.2） |
| E-2 | **`origin/pwa` ブランチの扱い** | 作成意図が不明なため残している。開発規約 §6.1 の3層構成に当てはまらない | 内容を確認し、develop に取り込むか削除するか |
| E-3 | **Next.jsへの移行** | カンパニー全体の方針として決定済み。MVP公開後、落ち着いた段階で着手（[decisions/0002](../decisions/0002-framework-react-router.md)） | 着手時期と担当。影響範囲の一覧はADR 0002に記載済み |
| E-4 | **依存パッケージの脆弱性** | `npm install` 時に22件（critical 6 / high 12）の警告。MVP直前の `npm audit fix` は動作影響があるため見送った | 対応時期と範囲 |
| E-5 | **日報の運用** | `docs/dev-report/` に numata の2026-08-02分のみ。運用ルールが未定 | 書く頻度・対象者・粒度 |
| E-6 | **本番環境とデプロイ** | 開発規約 §2 の「本番環境URL」「インフラ・デプロイ先」が未定、§18.1 のデプロイ担当も空欄 | デプロイ先の確定と担当者 |

---

## 関連ドキュメント

- [development-guidelines.md](./development-guidelines.md) … 開発規約
- [design-guidelines.md](./design-guidelines.md) … デザイン規約（§29 是正リスト）
- [hearing-points.md](./hearing-points.md) … 代表へのヒアリング事項（§1〜3は決定済み）
- [../decisions/](../decisions/) … ADR
- [../circle-info/spec.md](../circle-info/spec.md) … §10 未決事項
- [../chatbot/spec.md](../chatbot/spec.md) … §8 未確認事項
