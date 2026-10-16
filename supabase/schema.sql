create table if not exists public.anagram_leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_name text not null check (char_length(btrim(player_name)) between 1 and 24),
  score integer not null check (score >= 0),
  language text not null check (language in ('fr', 'en')),
  created_at timestamptz not null default now()
);

alter table public.anagram_leaderboard enable row level security;
grant select, insert on public.anagram_leaderboard to anon, authenticated;

drop policy if exists "Anyone can read anagram leaderboard" on public.anagram_leaderboard;
create policy "Anyone can read anagram leaderboard"
  on public.anagram_leaderboard for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can submit anagram scores" on public.anagram_leaderboard;
create policy "Anyone can submit anagram scores"
  on public.anagram_leaderboard for insert
  to anon, authenticated
  with check (
    char_length(btrim(player_name)) between 1 and 24
    and score >= 0
    and language in ('fr', 'en')
  );

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'anagram_leaderboard'
  ) then
    alter publication supabase_realtime add table public.anagram_leaderboard;
  end if;
end
$$;
