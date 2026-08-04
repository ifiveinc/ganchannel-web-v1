-- qa_cacheに出典URL・レコメンドカードを追加保存する。
-- 追加前（Phase 8）はanswerのテキストのみをキャッシュしていたため、
-- キャッシュヒット時（第3段・5a段）にサークル紹介ページへのリンクや
-- レコメンドカードが失われる問題があった（Phase 10後の追加対応）。
alter table qa_cache add column if not exists source_urls jsonb;
alter table qa_cache add column if not exists recommend_cards jsonb;
