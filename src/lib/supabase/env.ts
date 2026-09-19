export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  "https://mdlahkshmlokkduuccpu.supabase.co"

export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_0rYsj0DCjC1WSxjKprbvJg_kiMnYfMl"

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey)
}
