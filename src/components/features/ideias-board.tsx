"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { VoteButton } from "@/components/community/vote-button"
import { TagList } from "@/components/community/tag-list"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDate } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function IdeiasBoard() {
  const router = useRouter()
  const { ideas, replies, ideaVotes, toggleIdeaVote, addIdea } = useCommunity()
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [tags, setTags] = useState("")
  const [error, setError] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return [...ideas]
      .sort((a, b) => b.votes - a.votes)
      .filter((idea) => {
        if (!q) return true
        return (
          idea.title.toLowerCase().includes(q) ||
          idea.body.toLowerCase().includes(q) ||
          idea.tags.some((tag) => tag.toLowerCase().includes(q))
        )
      })
  }, [ideas, query])

  function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (title.trim().length < 8 || body.trim().length < 20) {
      setError("Escreva um título claro e um texto com o suficiente para a mesa responder.")
      return
    }
    const id = addIdea({
      title: title.trim(),
      body: body.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    setOpen(false)
    setTitle("")
    setBody("")
    setTags("")
    setError("")
    router.push(`/ideias/${id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Ideias"
        title="O que vocês estão tentando no time."
        description="Não é um fórum de frases prontas. Traga o rito, a decisão, o experimento — e o que quebrou."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Nova ideia</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleCreate} className="grid gap-4">
                <DialogHeader>
                  <DialogTitle>Colocar uma ideia na mesa</DialogTitle>
                  <DialogDescription>
                    Um parágrafo honesto vale mais do que um framework.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="idea-title">Título</Label>
                  <Input
                    id="idea-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Ex.: Decisão escrita antes da reunião"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idea-body">O que você está fazendo</Label>
                  <Textarea
                    id="idea-body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder="Contexto, o que tentou, o que quer saber."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idea-tags">Temas (separados por vírgula)</Label>
                  <Input
                    id="idea-tags"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                    placeholder="1:1, Reuniões"
                  />
                </div>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <DialogFooter>
                  <Button type="submit">Publicar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar ideias, ritos, temas…"
        aria-label="Buscar ideias"
      />

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhuma ideia com esse filtro"
          description="Limpe a busca ou publique a primeira versão do que você está tentando no time."
          action={
            <Button variant="outline" onClick={() => setQuery("")}>
              Limpar busca
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((idea) => {
            const author = getMember(idea.authorId)
            const count = replies.filter((reply) => reply.ideaId === idea.id)
              .length
            return (
              <Card key={idea.id} className="shadow-none">
                <CardHeader className="flex flex-row items-start gap-3">
                  <VoteButton
                    count={idea.votes}
                    active={ideaVotes.includes(idea.id)}
                    onClick={() => toggleIdeaVote(idea.id)}
                    label={`Votar em ${idea.title}`}
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <CardTitle className="text-lg">
                      <Link href={`/ideias/${idea.id}`} className="hover:underline">
                        {idea.title}
                      </Link>
                    </CardTitle>
                    <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {idea.body}
                    </p>
                    <TagList tags={idea.tags} />
                  </div>
                </CardHeader>
                <CardFooter className="justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={author} size="sm" />
                    <MemberMeta member={author} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {count} respostas · {formatDate(idea.createdAt)}
                  </p>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
