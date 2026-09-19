"use client"

import { useState } from "react"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { VoteButton } from "@/components/community/vote-button"
import { MissingRecord } from "@/components/layout/empty-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function IdeaDetail({ id }: { id: string }) {
  const { ideas, replies, ideaVotes, toggleIdeaVote, addReply } = useCommunity()
  const [body, setBody] = useState("")
  const [error, setError] = useState("")
  const idea = ideas.find((item) => item.id === id)

  if (!idea) {
    return (
      <MissingRecord
        title="Essa ideia não está mais na mesa"
        description="Ela pode ter sido removida ou ainda não foi sincronizada neste navegador."
        href="/ideias"
        hrefLabel="Voltar às ideias"
      />
    )
  }

  const author = getMember(idea.authorId)
  const thread = replies
    .filter((reply) => reply.ideaId === idea.id)
    .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))

  function handleReply(event: React.FormEvent) {
    event.preventDefault()
    if (body.trim().length < 8) {
      setError("Escreva uma resposta com substância — um parágrafo já basta.")
      return
    }
    addReply(id, body.trim())
    setBody("")
    setError("")
  }

  return (
    <article className="space-y-6">
      <div className="flex items-start gap-3">
        <VoteButton
          count={idea.votes}
          active={ideaVotes.includes(idea.id)}
          onClick={() => toggleIdeaVote(idea.id)}
          label={`Votar em ${idea.title}`}
        />
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
            Ideia
          </p>
          <h1 className="font-heading text-3xl tracking-tight text-balance">
            {idea.title}
          </h1>
          <TagList tags={idea.tags} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <MemberAvatar member={author} />
        <MemberMeta member={author} />
        <span className="text-xs text-muted-foreground">
          {formatDateTime(idea.createdAt)}
        </span>
      </div>

      <p className="max-w-3xl text-base leading-7 text-pretty">{idea.body}</p>

      <Separator />

      <section className="space-y-4">
        <h2 className="font-heading text-xl">
          {thread.length} {thread.length === 1 ? "resposta" : "respostas"}
        </h2>
        {thread.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda ninguém respondeu. A mesa está esperando a primeira frase útil.
          </p>
        ) : (
          thread.map((reply) => {
            const member = getMember(reply.authorId)
            return (
              <Card key={reply.id} className="shadow-none">
                <CardHeader className="flex flex-row items-center gap-3">
                  <MemberAvatar member={member} size="sm" />
                  <MemberMeta member={member} />
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatDateTime(reply.createdAt)}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="leading-6">{reply.body}</p>
                </CardContent>
              </Card>
            )
          })
        )}
      </section>

      <form onSubmit={handleReply} className="grid max-w-2xl gap-3">
        <Label htmlFor="reply">Sua resposta</Label>
        <Textarea
          id="reply"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="O que você faria no lugar dessa pessoa?"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-fit">
          Responder
        </Button>
      </form>
    </article>
  )
}
