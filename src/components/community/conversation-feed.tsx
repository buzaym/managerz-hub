"use client"

import Link from "next/link"
import { useMemo, type ReactNode } from "react"

import { CategoryPills } from "@/components/community/category-pills"
import { PostCard } from "@/components/community/post-card"
import { EmptyState } from "@/components/layout/empty-state"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCommunity } from "@/lib/community-store"
import { unanswered, voteCount, trendingScore } from "@/lib/ranking"
import type { CategorySlug, Post } from "@/lib/types"

export function ConversationFeed({
  category,
  query = "",
  kind,
  heading,
  description,
}: {
  category?: CategorySlug
  query?: string
  kind?: Post["kind"]
  heading: ReactNode
  description: string
}) {
  const { posts, answers, postVotes, currentUser } = useCommunity()

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return posts.filter((post) => {
      if (category && post.category !== category) return false
      if (kind && post.kind !== kind) return false
      if (!q) return true
      return (
        post.title.toLowerCase().includes(q) ||
        post.body.toLowerCase().includes(q)
      )
    })
  }, [posts, category, kind, query])

  const trending = [...filtered].sort(
    (a, b) =>
      trendingScore(b, voteCount(postVotes, b.id)) -
      trendingScore(a, voteCount(postVotes, a.id)),
  )
  const recent = [...filtered].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )
  const open = filtered.filter((post) => unanswered(post, answers))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0 w-full max-w-3xl flex-1 space-y-2">
          <h1 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl">
            {heading}
          </h1>
          <p className="text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        <Button asChild className="shrink-0">
          <Link href={currentUser ? "/nova" : "/entrar?next=/nova"}>
            {currentUser ? "Nova conversa" : "Entrar para publicar"}
          </Link>
        </Button>
      </div>

      <CategoryPills active={category} />

      {!currentUser ? (
        <p className="rounded-lg bg-primary/6 px-3 py-2 text-sm leading-6 text-foreground">
          A comunidade é aberta. Para votar, responder ou criar um hotseat,{" "}
          <Link href="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">
            entre
          </Link>
          .
        </p>
      ) : null}

      {query ? (
        <p className="text-sm text-muted-foreground">
          Resultados para <span className="font-medium text-foreground">“{query}”</span>
        </p>
      ) : null}

      <Tabs defaultValue="trending">
        <TabsList variant="line">
          <TabsTrigger value="trending">Em alta</TabsTrigger>
          <TabsTrigger value="recent">Recentes</TabsTrigger>
          <TabsTrigger value="open">Sem resposta</TabsTrigger>
        </TabsList>
        <TabsContent value="trending" className="mt-4 space-y-3">
          <List posts={trending} empty="Nada em alta nesse recorte." />
        </TabsContent>
        <TabsContent value="recent" className="mt-4 space-y-3">
          <List posts={recent} empty="Nenhuma conversa ainda." />
        </TabsContent>
        <TabsContent value="open" className="mt-4 space-y-3">
          <List posts={open} empty="Todas as conversas já têm resposta." />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function List({ posts, empty }: { posts: Post[]; empty: string }) {
  if (posts.length === 0) {
    return <EmptyState title="Nada por aqui" description={empty} />
  }
  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
