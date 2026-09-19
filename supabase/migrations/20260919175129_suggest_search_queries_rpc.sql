create or replace function public.suggest_search_queries(prefix text)
returns table(query text, hits bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    sq.normalized_query,
    count(*)::bigint as hits
  from public.search_queries sq
  where char_length(btrim(prefix)) >= 2
    and sq.normalized_query like replace(replace(lower(btrim(prefix)), '%', ''), '_', '') || '%'
  group by sq.normalized_query
  order by count(*) desc, sq.normalized_query
  limit 8;
$$;

revoke all on function public.suggest_search_queries(text) from public;
grant execute on function public.suggest_search_queries(text) to anon, authenticated;
