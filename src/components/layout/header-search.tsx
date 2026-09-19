"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  FormEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { SearchIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { useCommunity } from "@/lib/community-store"
import {
  isSearchable,
  localSearchSuggestions,
  MIN_SEARCH_CHARS,
  SAVE_IDLE_MS,
  SUGGEST_DEBOUNCE_MS,
  normalizeSearch,
  type SearchSuggestion,
  type SearchTrigger,
} from "@/lib/search"
import { cn } from "@/lib/utils"

function recordSearch(query: string, trigger: SearchTrigger) {
  void fetch("/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, trigger }),
  })
}

export function HeaderSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { posts, users } = useCommunity()
  const listId = useId()
  const rootRef = useRef<HTMLFormElement>(null)
  const skipIdleSaveRef = useRef(false)
  const [query, setQuery] = useState(searchParams.get("q") ?? "")
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const [history, setHistory] = useState<SearchSuggestion[]>([])

  const local = useMemo(
    () => localSearchSuggestions(query, posts, users),
    [query, posts, users],
  )

  const suggestions = useMemo(() => {
    if (!isSearchable(query)) return []
    const needle = normalizeSearch(query)
    const seen = new Set<string>()
    const merged: SearchSuggestion[] = []
    for (const item of [...history, ...local]) {
      if (
        item.kind === "query" &&
        !normalizeSearch(item.label).startsWith(needle)
      ) {
        continue
      }
      const key = `${item.kind}:${item.label.toLowerCase()}`
      if (seen.has(key)) continue
      seen.add(key)
      merged.push(item)
    }
    return merged.slice(0, 8)
  }, [history, local, query])

  useEffect(() => {
    const value = query.trim()
    if (!isSearchable(value)) return

    const controller = new AbortController()
    const timeout = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search/suggest?q=${encodeURIComponent(value)}`,
          { signal: controller.signal },
        )
        if (!response.ok) return
        const payload = (await response.json()) as {
          suggestions?: { query: string; hits: number }[]
        }
        const needle = normalizeSearch(value)
        setHistory(
          (payload.suggestions ?? [])
            .filter((item) => normalizeSearch(item.query).startsWith(needle))
            .map((item) => ({
              id: `query-${item.query}`,
              kind: "query" as const,
              label: item.query,
              href: `/?q=${encodeURIComponent(item.query)}`,
              detail: item.hits === 1 ? "1 busca" : `${item.hits} buscas`,
            })),
        )
        setActive(0)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
      }
    }, SUGGEST_DEBOUNCE_MS)

    return () => {
      controller.abort()
      window.clearTimeout(timeout)
    }
  }, [query])

  useEffect(() => {
    const value = query.trim()
    if (!isSearchable(value)) return

    skipIdleSaveRef.current = false
    const timeout = window.setTimeout(() => {
      if (skipIdleSaveRef.current) return
      recordSearch(value, "type")
    }, SAVE_IDLE_MS)

    return () => window.clearTimeout(timeout)
  }, [query])

  useEffect(() => {
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    window.addEventListener("mousedown", onPointer)
    return () => window.removeEventListener("mousedown", onPointer)
  }, [])

  function goToResults(value: string) {
    const next = value.trim()
    if (!isSearchable(next)) return
    skipIdleSaveRef.current = true
    recordSearch(next, "submit")
    setOpen(false)
    router.push(`/?q=${encodeURIComponent(next)}`)
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    goToResults(query)
  }

  function onPick(item: SearchSuggestion) {
    recordSearch(item.label, "suggestion")
    setQuery(item.kind === "query" ? item.label : query)
    setOpen(false)
    router.push(item.href)
  }

  return (
    <form ref={rootRef} onSubmit={onSubmit} className="relative min-w-0 flex-1">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-4 -translate-y-1/2 text-primary-foreground/60" />
      <Input
        value={query}
        onChange={(event) => {
          setQuery(event.target.value)
          if (isSearchable(event.target.value)) setOpen(true)
        }}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true)
        }}
        onKeyDown={(event) => {
          if (!open || suggestions.length === 0) return
          if (event.key === "ArrowDown") {
            event.preventDefault()
            setActive((current) => (current + 1) % suggestions.length)
          } else if (event.key === "ArrowUp") {
            event.preventDefault()
            setActive((current) =>
              current === 0 ? suggestions.length - 1 : current - 1,
            )
          } else if (event.key === "Escape") {
            setOpen(false)
          } else if (event.key === "Enter" && suggestions[active]) {
            event.preventDefault()
            onPick(suggestions[active])
          }
        }}
        placeholder="Buscar conversas, cargos, problemas…"
        aria-label="Buscar conversas"
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={listId}
        role="combobox"
        className="h-9 border-white/15 bg-white/10 pl-8 text-primary-foreground placeholder:text-primary-foreground/55 focus-visible:border-white/40 focus-visible:ring-white/30"
      />
      {open && isSearchable(query) ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-[calc(100%+0.35rem)] z-50 w-full overflow-hidden rounded-lg border border-border bg-card py-1 text-card-foreground shadow-lg"
        >
          {suggestions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">
              Nenhuma sugestão ainda. Enter busca “{query.trim()}”.
            </li>
          ) : (
            suggestions.map((item, index) => (
              <li key={item.id} role="option" aria-selected={index === active}>
                <Link
                  href={item.href}
                  onMouseEnter={() => setActive(index)}
                  onClick={(event) => {
                    event.preventDefault()
                    onPick(item)
                  }}
                  className={cn(
                    "flex flex-col px-3 py-2 text-sm",
                    index === active ? "bg-accent" : "hover:bg-accent/70",
                  )}
                >
                  <span className="truncate font-medium">{item.label}</span>
                  {item.detail ? (
                    <span className="text-xs text-muted-foreground">
                      {item.detail}
                    </span>
                  ) : null}
                </Link>
              </li>
            ))
          )}
        </ul>
      ) : query.trim().length > 0 && query.trim().length < MIN_SEARCH_CHARS ? (
        <p className="absolute top-[calc(100%+0.35rem)] z-50 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-muted-foreground shadow-lg">
          Digite pelo menos {MIN_SEARCH_CHARS} caracteres.
        </p>
      ) : null}
    </form>
  )
}
