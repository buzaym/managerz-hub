import { createClient } from "@supabase/supabase-js"

import type { Database } from "@/lib/supabase/database.types"
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env"

export function createSupabaseClient() {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}
