import { categories } from "@/lib/categories"
import type { Post, User } from "@/lib/types"

export const MIN_SEARCH_CHARS = 2

export type SearchTrigger = "type" | "submit" | "suggestion"

export type SearchSuggestion = {
  id: string
  kind: "post" | "category" | "person" | "query"
  label: string
  href: string
  detail?: string
}

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .trim()
    .toLowerCase()
    .slice(0, 200)
}

export function isSearchable(value: string) {
  return normalizeSearch(value).length >= MIN_SEARCH_CHARS
}

export function localSearchSuggestions(
  query: string,
  posts: Post[],
  users: User[],
): SearchSuggestion[] {
  const needle = normalizeSearch(query)
  if (needle.length < MIN_SEARCH_CHARS) return []

  const matches = (value: string) => normalizeSearch(value).includes(needle)
  const results: SearchSuggestion[] = []

  for (const category of categories) {
    if (matches(category.label) || matches(category.pitch) || matches(category.slug)) {
      results.push({
        id: `category-${category.slug}`,
        kind: "category",
        label: category.label,
        href: `/categoria/${category.slug}`,
        detail: "Categoria",
      })
    }
  }

  for (const user of users) {
    if (matches(user.name) || matches(user.role) || matches(user.company)) {
      results.push({
        id: `person-${user.id}`,
        kind: "person",
        label: user.name,
        href: `/?q=${encodeURIComponent(user.name)}`,
        detail: user.role,
      })
    }
  }

  for (const post of posts) {
    if (matches(post.title) || matches(post.body)) {
      results.push({
        id: `post-${post.id}`,
        kind: "post",
        label: post.title,
        href: `/q/${post.id}`,
        detail: post.kind === "hotseat" ? "Hotseat" : "Conversa",
      })
    }
  }

  return results.slice(0, 8)
}
