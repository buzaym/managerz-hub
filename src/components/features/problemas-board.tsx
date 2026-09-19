"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDate } from "@/lib/format"
import { getMember } from "@/lib/seed"
import type { ProblemStatus } from "@/lib/types"

const statusCopy: Record<ProblemStatus, string> = {
  open: "Aberto",
  "in-progress": "Em andamento",
  resolved: "Resolvido",
}

export function ProblemasBoard() {
  const router = useRouter()
  const { problems, solutions, addProblem } = useCommunity()
  const [status, setStatus] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [context, setContext] = useState("")
  const [tags, setTags] = useState("")
  const [error, setError] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return problems.filter((problem) => {
      const statusOk = status === "all" || problem.status === status
      const queryOk =
        !q ||
        problem.title.toLowerCase().includes(q) ||
        problem.body.toLowerCase().includes(q)
      return statusOk && queryOk
    })
  }, [problems, query, status])

  function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (title.trim().length < 8 || body.trim().length < 20) {
      setError("Descreva o caso com título e contexto suficientes.")
      return
    }
    const id = addProblem({
      title: title.trim(),
      body: body.trim(),
      context: context.trim(),
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    setOpen(false)
    router.push(`/problemas/${id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Problemas"
        title="Traga o caso feio da semana."
        description="A mesa não quer o PowerPoint. Quer o que está emperrado: gente, poder, calendário, RH."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Novo problema</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleCreate} className="grid gap-4">
                <DialogHeader>
                  <DialogTitle>Colocar um problema na mesa</DialogTitle>
                  <DialogDescription>
                    Quanto mais concreto, melhor a resposta.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="pb-title">Título</Label>
                  <Input
                    id="pb-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pb-body">O caso</Label>
                  <Textarea
                    id="pb-body"
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pb-context">Contexto do time</Label>
                  <Input
                    id="pb-context"
                    value={context}
                    onChange={(event) => setContext(event.target.value)}
                    placeholder="Tamanho do time, cidade, restrição"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="pb-tags">Temas</Label>
                  <Input
                    id="pb-tags"
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
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

      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar problemas…"
          aria-label="Buscar problemas"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="open">Abertos</SelectItem>
            <SelectItem value="in-progress">Em andamento</SelectItem>
            <SelectItem value="resolved">Resolvidos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nenhum problema nesse recorte"
          description="Mude o filtro ou traga o caso que está te tirando o sono."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((problem) => {
            const author = getMember(problem.authorId)
            const count = solutions.filter(
              (solution) => solution.problemId === problem.id,
            ).length
            return (
              <Card key={problem.id} className="shadow-none">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">{statusCopy[problem.status]}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(problem.createdAt)}
                    </span>
                  </div>
                  <CardTitle>
                    <Link
                      href={`/problemas/${problem.id}`}
                      className="hover:underline"
                    >
                      {problem.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                    {problem.body}
                  </p>
                  <TagList tags={problem.tags} />
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={author} size="sm" />
                    <MemberMeta member={author} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "resposta" : "respostas"}
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
