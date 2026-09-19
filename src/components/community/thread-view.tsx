"use client"

import { useState } from "react"
import Link from "next/link"

import { AuthPrompt } from "@/components/community/auth-prompt"
import { ShareButton } from "@/components/community/share-button"
import { UserBadges } from "@/components/community/user-badges"
import { VoteControl } from "@/components/community/vote-control"
import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { MissingRecord } from "@/components/layout/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCategory } from "@/lib/categories"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { badgesForUser, isTrending, voteCount } from "@/lib/ranking"

export function ThreadView({ id }: { id: string }) {
  const community = useCommunity()
  const {
    posts,
    answers,
    users,
    postVotes,
    answerVotes,
    sessionUserId,
    currentUser,
    togglePostVote,
    toggleAnswerVote,
    addAnswer,
  } = community
  const [body, setBody] = useState("")
  const [error, setError] = useState("")
  const [prompt, setPrompt] = useState(false)

  const post = posts.find((item) => item.id === id)
  if (!post) {
    return (
      <MissingRecord
        title="Essa conversa não está na mesa"
        description="O link pode ter expirado neste navegador."
        href="/"
        hrefLabel="Ver conversas"
      />
    )
  }

  const author = users.find((user) => user.id === post.authorId) ?? users[0]
  const category = getCategory(post.category)
  const thread = answers
    .filter((answer) => answer.postId === post.id)
    .sort(
      (a, b) =>
        voteCount(answerVotes, b.id) - voteCount(answerVotes, a.id) ||
        +new Date(a.createdAt) - +new Date(b.createdAt),
    )
  const snapshot = {
    users,
    sessionUserId,
    posts,
    answers,
    postVotes,
    answerVotes,
  }

  function handleAnswer(event: React.FormEvent) {
    event.preventDefault()
    if (!currentUser) {
      setPrompt(true)
      return
    }
    if (body.trim().length < 12) {
      setError("Escreva o que você faria na segunda-feira — um parágrafo já basta.")
      return
    }
    addAnswer(id, body.trim())
    setBody("")
    setError("")
  }

  return (
    <article className="space-y-6">
      <div className="flex items-start gap-3">
        <VoteControl
          count={voteCount(postVotes, post.id)}
          active={(postVotes[post.id] ?? []).includes(sessionUserId ?? "")}
          onToggle={() => togglePostVote(post.id)}
          label="Votar na pergunta"
        />
        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {isTrending(post, posts, postVotes) ? <Badge>Em alta</Badge> : null}
            {post.kind === "hotseat" ? (
              <Badge variant="secondary">Hotseat</Badge>
            ) : null}
            <Link href={`/categoria/${post.category}`}>
              <Badge variant="outline">{category?.label}</Badge>
            </Link>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
            {post.title}
          </h1>
        </div>
      </div>

      <p className="max-w-3xl text-base leading-7">{post.body}</p>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MemberAvatar member={author} />
          <div>
            <div className="flex items-center gap-2">
              <MemberMeta member={author} />
              <UserBadges badges={badgesForUser(snapshot, author.id)} />
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDateTime(post.createdAt)}
              {post.startsAt ? ` · hotseat ${formatDateTime(post.startsAt)}` : ""}
            </p>
          </div>
        </div>
        <ShareButton title={post.title} path={`/q/${post.id}`} />
      </div>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          {thread.length} {thread.length === 1 ? "resposta" : "respostas"}
        </h2>
        {thread.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Ainda ninguém respondeu. A mesa está esperando a primeira frase útil.
          </p>
        ) : (
          thread.map((answer) => {
            const member =
              users.find((user) => user.id === answer.authorId) ?? users[0]
            return (
              <Card key={answer.id} className="shadow-none">
                <CardHeader className="flex flex-row items-start gap-3">
                  <VoteControl
                    count={voteCount(answerVotes, answer.id)}
                    active={(answerVotes[answer.id] ?? []).includes(
                      sessionUserId ?? "",
                    )}
                    onToggle={() => toggleAnswerVote(answer.id)}
                    label="Votar na resposta"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <MemberAvatar member={member} size="sm" />
                      <MemberMeta member={member} />
                      <UserBadges badges={badgesForUser(snapshot, member.id)} />
                    </div>
                    <p className="leading-6">{answer.body}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(answer.createdAt)}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            )
          })
        )}
      </section>

      <form onSubmit={handleAnswer} className="grid max-w-2xl gap-3">
        <Label htmlFor="answer">
          {currentUser ? "Sua resposta" : "Entre para responder"}
        </Label>
        <Textarea
          id="answer"
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="O que você faria no lugar dessa pessoa?"
        />
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <Button type="submit" className="w-fit">
          {currentUser ? "Publicar resposta" : "Entrar para responder"}
        </Button>
      </form>
      <AuthPrompt open={prompt} onOpenChange={setPrompt} action="responder" />
    </article>
  )
}
