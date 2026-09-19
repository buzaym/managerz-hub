import { NextResponse } from "next/server"

import { createSupabaseClient } from "@/lib/supabase/client"
import { isSearchable, MIN_SEARCH_CHARS, normalizeSearch } from "@/lib/search"

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? ""
  if (!isSearchable(query)) {
    return NextResponse.json({ suggestions: [] })
  }

  const supabase = createSupabaseClient()
  const { data, error } = await supabase.rpc("suggest_search_queries", {
    prefix: normalizeSearch(query).slice(0, 80),
  })

  if (error) {
    return NextResponse.json({ suggestions: [], min: MIN_SEARCH_CHARS })
  }

  return NextResponse.json({
    suggestions: (data ?? []).map((row) => ({
      query: row.query,
      hits: row.hits,
    })),
  })
}
