import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

const hasValidPublicKey =
  supabaseAnonKey?.startsWith('eyJ') ||
  supabaseAnonKey?.startsWith('sb_publishable_')
const hasPlaceholderCredentials =
  !supabaseUrl ||
  !supabaseAnonKey ||
  /^https:\/\/your-project\.supabase\.co(?:\/|$)/i.test(supabaseUrl) ||
  /^your-(?:anon|publishable)-key$/i.test(supabaseAnonKey) ||
  !hasValidPublicKey

export const isLeaderboardConfigured = !hasPlaceholderCredentials

const supabase = isLeaderboardConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null

function getClient() {
  if (!supabase) {
    throw new Error('Supabase leaderboard is not configured.')
  }
  return supabase
}

export async function fetchLeaderboard(language) {
  const { data, error } = await getClient()
    .from('game_leaderboard')
    .select('id, player_name, score')
    .eq('language', language)
    .order('score', { ascending: false })
    .order('created_at', { ascending: true })
    .limit(10)

  if (error) throw error
  return data
}

export async function saveLeaderboardScore({ name, score, language }) {
  const { error } = await getClient()
    .from('game_scores')
    .insert({ player_name: name.trim(), score, language })

  if (error) throw error
}

export function subscribeToLeaderboard(language, onInsert) {
  if (!supabase) return null

  return supabase
    .channel(`anagram-leaderboard-${language}`)
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'game_scores', filter: `language=eq.${language}` },
      onInsert,
    )
    .subscribe()
}
