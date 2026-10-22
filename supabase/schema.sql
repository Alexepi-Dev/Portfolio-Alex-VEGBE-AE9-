create table if not exists public.game_scores (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(btrim(player_name)) between 1 and 24),
  score integer not null check (score >= 0),
  language text not null check (language in ('fr', 'en')),
  created_at timestamptz not null default now()
);

do $$
begin
  if to_regclass('public.anagram_leaderboard') is not null then
    execute $migration$
      insert into public.game_scores (id, player_name, score, language, created_at)
      select id, player_name, score, language, created_at
      from public.anagram_leaderboard
      on conflict (id) do nothing
    $migration$;
  end if;
end
$$;

alter table public.game_scores enable row level security;
grant select, insert on public.game_scores to anon, authenticated;

drop policy if exists "Anyone can read game scores" on public.game_scores;
create policy "Anyone can read game scores"
  on public.game_scores for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit game scores" on public.game_scores;
create policy "Anyone can submit game scores"
  on public.game_scores for insert
  to anon, authenticated
  with check (
    char_length(btrim(player_name)) between 1 and 24
    and score >= 0
    and language in ('fr', 'en')
  );

create or replace view public.game_leaderboard
  with (security_invoker = true)
as
  select id, player_name, score, language, created_at
  from public.game_scores;

grant select on public.game_leaderboard to anon, authenticated;

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'game_scores'
  ) then
    alter publication supabase_realtime add table public.game_scores;
  end if;
end
$$;
