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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"
import type { ProblemStatus } from "@/lib/types"

export function ProblemDetail({ id }: { id: string }) {
  const {
    problems,
    solutions,
    solutionVotes,
    addSolution,
    toggleSolutionHelpful,
    setProblemStatus,
    currentUserId,
  } = useCommunity()
  const [body, setBody] = useState("")
  const [error, setError] = useState("")
  const problem = problems.find((item) => item.id === id)

  if (!problem) {
    return (
      <MissingRecord
        title="Problema não encontrado"
        description="Esse caso não está neste navegador."
        href="/problemas"
        hrefLabel="Ver problemas"
      />
    )
  }

  const author = getMember(problem.authorId)
  const isOwner = problem.authorId === currentUserId
  const thread = solutions
    .filter((solution) => solution.problemId === problem.id)
    .sort((a, b) => b.helpful - a.helpful)

  function handleSolution(event: React.FormEvent) {
    event.preventDefault()
    if (body.trim().length < 16) {
      setError("Responda com o que você faria na segunda-feira, não com um slogan.")
      return
    }
    addSolution(id, body.trim())
    setBody("")
    setError("")
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {problem.status === "open"
            ? "Aberto"
            : problem.status === "in-progress"
              ? "Em andamento"
              : "Resolvido"}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {formatDateTime(problem.createdAt)}
        </span>
      </div>
      <h1 className="font-heading text-3xl tracking-tight text-balance">
        {problem.title}
      </h1>
      <div className="flex items-center gap-3">
        <MemberAvatar member={author} />
        <MemberMeta member={author} />
      </div>
      <p className="max-w-3xl leading-7">{problem.body}</p>
      {problem.context ? (
        <p className="max-w-3xl rounded-lg bg-muted/70 px-3 py-2 text-sm leading-6 text-muted-foreground">
          Contexto: {problem.context}
        </p>
      ) : null}
      <TagList tags={problem.tags} />

      {isOwner ? (
        <div className="flex items-center gap-2">
          <Label>Status do caso</Label>
          <Select
            value={problem.status}
            onValueChange={(value) =>
              setProblemStatus(problem.id, value as ProblemStatus)
            }
          >
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Aberto</SelectItem>
              <SelectItem value="in-progress">Em andamento</SelectItem>
              <SelectItem value="resolved">Resolvido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <section className="space-y-4">
        <h2 className="font-heading text-xl">O que a mesa faria</h2>
        {thread.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma resposta ainda. Se você já viveu isso, escreva o próximo passo.
          </p>
        ) : (
          thread.map((solution) => {
            const member = getMember(solution.authorId)
            return (
              <Card key={solution.id} className="shadow-none">
                <CardHeader className="flex flex-row items-start gap-3">
                  <VoteButton
                    count={solution.helpful}
                    active={solutionVotes.includes(solution.id)}
                    onClick={() => toggleSolutionHelpful(solution.id)}
                    label="Marcar como útil"
                  />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MemberAvatar member={member} size="sm" />
                      <MemberMeta member={member} />
                    </div>
                    <p className="leading-6">{solution.body}</p>
                  </div>
                </CardHeader>
              </Card>
            )
          })
        )}
      </section>

      <form onSubmit={handleSolution} className="grid max-w-2xl gap-3">
        <Label htmlFor="solution">Sua resposta</Label>
        <Textarea
          id="solution"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="O que você faria na segunda-feira?"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-fit">
          Enviar resposta
        </Button>
      </form>
    </article>
  )
}
