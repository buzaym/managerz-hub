"use client"

import { useState } from "react"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { VoteButton } from "@/components/community/vote-button"
import { MissingRecord } from "@/components/layout/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function HotseatDetail({ id }: { id: string }) {
  const {
    hotseats,
    questions,
    questionVotes,
    rsvps,
    toggleRsvp,
    addHotseatQuestion,
    toggleQuestionVote,
  } = useCommunity()
  const [text, setText] = useState("")
  const [error, setError] = useState("")
  const hotseat = hotseats.find((item) => item.id === id)

  if (!hotseat) {
    return (
      <MissingRecord
        title="Hotseat não encontrado"
        description="Essa sessão não existe neste navegador."
        href="/hotseats"
        hrefLabel="Ver hotseats"
      />
    )
  }

  const host = getMember(hotseat.hostId)
  const going = rsvps.includes(hotseat.id)
  const thread = questions
    .filter((question) => question.hotseatId === hotseat.id)
    .sort((a, b) => b.votes - a.votes)

  function handleQuestion(event: React.FormEvent) {
    event.preventDefault()
    if (text.trim().length < 10) {
      setError("Faça uma pergunta específica. Evite 'fala mais sobre isso'.")
      return
    }
    addHotseatQuestion(id, text.trim())
    setText("")
    setError("")
  }

  return (
    <article className="space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{hotseat.status === "live" ? "Ao vivo" : "Em breve"}</Badge>
          <span className="text-sm text-muted-foreground">
            {formatDateTime(hotseat.startsAt)} · {hotseat.durationMin} min
          </span>
        </div>
        <h1 className="font-heading text-3xl tracking-tight text-balance sm:text-4xl">
          {hotseat.title}
        </h1>
        <p className="max-w-2xl leading-7 text-muted-foreground">{hotseat.summary}</p>
        <TagList tags={hotseat.topics} />
      </div>

      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MemberAvatar member={host} size="lg" />
          <div>
            <p className="text-xs text-muted-foreground">Na cadeira</p>
            <MemberMeta member={host} />
          </div>
        </div>
        <Button
          variant={going ? "outline" : "default"}
          onClick={() => toggleRsvp(hotseat.id)}
        >
          {going ? "Cancelar presença" : "Confirmar presença"}
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl">Fila de perguntas</h2>
        {thread.map((question) => {
          const author = getMember(question.authorId)
          return (
            <Card key={question.id} className="shadow-none">
              <CardHeader className="flex flex-row items-start gap-3">
                <VoteButton
                  count={question.votes}
                  active={questionVotes.includes(question.id)}
                  onClick={() => toggleQuestionVote(question.id)}
                  label="Votar pergunta"
                />
                <div className="space-y-2">
                  <p className="leading-6">{question.text}</p>
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={author} size="sm" />
                    <span className="text-xs text-muted-foreground">
                      {author.name} · {formatDateTime(question.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </section>

      <form onSubmit={handleQuestion} className="grid max-w-2xl gap-3">
        <Label htmlFor="question">Fazer uma pergunta</Label>
        <Textarea
          id="question"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Pergunte o que o palco normalmente esconde."
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-fit">
          Enviar pergunta
        </Button>
      </form>
    </article>
  )
}
