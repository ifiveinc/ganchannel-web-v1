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
-- （docs/chatbot-decisions.md §4「RLSは多層防御」に対応）。
