import { NextResponse } from "next/server"

import { createSupabaseClient } from "@/lib/supabase/client"
import {
  isSearchable,
  normalizeSearch,
  type SearchTrigger,
} from "@/lib/search"

const triggers = new Set<SearchTrigger>(["type", "submit", "suggestion"])

export async function POST(request: Request) {
  let body: { query?: string; trigger?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const query = typeof body.query === "string" ? body.query.trim() : ""
  const trigger = body.trigger
  if (!isSearchable(query) || !triggers.has(trigger as SearchTrigger)) {
    return NextResponse.json({ error: "invalid_search" }, { status: 400 })
  }

  const supabase = createSupabaseClient()
  const { error } = await supabase.from("search_queries").insert({
    query: query.slice(0, 200),
    normalized_query: normalizeSearch(query),
    trigger: trigger as SearchTrigger,
  })

  if (error) {
    return NextResponse.json({ error: "not_saved" }, { status: 502 })
  }

  return NextResponse.json({ ok: true })
}
