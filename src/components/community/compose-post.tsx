"use client"

import { FormEvent, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
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
import { categories } from "@/lib/categories"
import { useCommunity } from "@/lib/community-store"
import type { CategorySlug, PostKind } from "@/lib/types"

export function ComposePost() {
  const router = useRouter()
  const { currentUser, addPost } = useCommunity()
  const [kind, setKind] = useState<PostKind>("question")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [category, setCategory] = useState<CategorySlug>("product-manager")
  const [startsAt, setStartsAt] = useState("2026-09-26T12:00")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!currentUser) router.replace("/entrar?next=/nova")
  }, [currentUser, router])

  if (!currentUser) {
    return null
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (title.trim().length < 10 || body.trim().length < 20) {
      setError("Título e contexto claros — a mesa responde melhor assim.")
      return
    }
    const id = addPost({
      kind,
      title: title.trim(),
      body: body.trim(),
      category,
      startsAt: kind === "hotseat" ? new Date(startsAt).toISOString() : undefined,
    })
    if (id === "auth") {
      router.replace("/entrar?next=/nova")
      return
    }
    router.push(`/q/${id}`)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <PageHeader
        kicker="Publicar"
        title="Coloque um problema — ou sente no hotseat."
        description="Pergunta para a comunidade resolver, ou uma sessão em que você está na cadeira e os outros perguntam."
      />
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-2">
          <Label>Tipo</Label>
          <Select value={kind} onValueChange={(value) => setKind(value as PostKind)}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="question">Pergunta / problema</SelectItem>
              <SelectItem value="hotseat">Hotseat</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="O caso em uma frase"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="body">Contexto</Label>
          <Textarea
            id="body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="O que está emperrado, o que você já tentou, o que precisa da mesa."
          />
        </div>
        <div className="grid gap-2">
          <Label>Categoria</Label>
          <Select
            value={category}
            onValueChange={(value) => setCategory(value as CategorySlug)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {kind === "hotseat" ? (
          <div className="grid gap-2">
            <Label htmlFor="when">Quando você senta na cadeira</Label>
            <Input
              id="when"
              type="datetime-local"
              value={startsAt}
              onChange={(event) => setStartsAt(event.target.value)}
            />
          </div>
        ) : null}
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <div className="flex gap-2">
          <Button type="submit">Publicar</Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/">Cancelar</Link>
          </Button>
        </div>
      </form>
    </div>
  )
}
