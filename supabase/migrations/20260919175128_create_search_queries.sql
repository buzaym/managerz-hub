create table public.search_queries (
  id uuid primary key default gen_random_uuid(),
  query text not null,
  normalized_query text not null,
  trigger text not null,
  created_at timestamptz not null default now(),
  constraint search_queries_query_length check (char_length(btrim(query)) between 2 and 200),
  constraint search_queries_trigger_check check (trigger in ('type', 'submit', 'suggestion'))
);

create index search_queries_normalized_idx
  on public.search_queries (normalized_query);

create index search_queries_created_at_idx
  on public.search_queries (created_at desc);

alter table public.search_queries enable row level security;

revoke all on table public.search_queries from anon, authenticated;

grant insert on table public.search_queries to anon, authenticated;

create policy "Anyone can record a search"
  on public.search_queries
  for insert
  to anon, authenticated
  with check (
    char_length(btrim(query)) between 2 and 200
    and trigger in ('type', 'submit', 'suggestion')
  );
