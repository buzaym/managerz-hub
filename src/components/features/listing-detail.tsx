"use client"

import { useState } from "react"
import Link from "next/link"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { MissingRecord } from "@/components/layout/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatBRL, formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function ListingDetail({ id }: { id: string }) {
  const { listings, inquiries, addInquiry, currentUserId } = useCommunity()
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const listing = listings.find((item) => item.id === id)

  if (!listing) {
    return (
      <MissingRecord
        title="Anúncio não encontrado"
        description="Esse serviço ou troca não está neste navegador."
        href="/marketplace"
        hrefLabel="Voltar ao marketplace"
      />
    )
  }

  const author = getMember(listing.authorId)
  const thread = inquiries.filter((item) => item.listingId === listing.id)
  const isOwner = listing.authorId === currentUserId

  function handleInquiry(event: React.FormEvent) {
    event.preventDefault()
    if (message.trim().length < 10) {
      setError("Escreva o que você precisa e quando consegue conversar.")
      return
    }
    addInquiry(id, message.trim())
    setMessage("")
    setError("")
  }

  return (
    <article className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">
          {listing.kind === "trade" ? "Troca" : listing.category}
        </Badge>
        <span className="font-medium">{formatBRL(listing.priceCents)}</span>
      </div>
      <h1 className="font-heading text-3xl tracking-tight text-balance">
        {listing.title}
      </h1>
      <p className="text-sm text-muted-foreground">{listing.city}</p>
      {listing.tradeFor ? (
        <p className="rounded-lg bg-muted/70 px-3 py-2 text-sm">
          Em troca de: {listing.tradeFor}
        </p>
      ) : null}
      <p className="max-w-2xl leading-7">{listing.description}</p>

      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MemberAvatar member={author} size="lg" />
          <MemberMeta member={author} />
        </div>
        <Button asChild variant="outline">
          <Link href={`/agenda?com=${author.id}`}>Marcar uma conversa</Link>
        </Button>
      </div>

      <section className="space-y-4">
        <h2 className="font-heading text-xl">
          {isOwner ? "Pedidos recebidos" : "Conversar sobre este anúncio"}
        </h2>
        {thread.map((inquiry) => {
          const from = getMember(inquiry.authorId)
          return (
            <Card key={inquiry.id} className="shadow-none">
              <CardHeader className="flex flex-row items-center gap-3">
                <MemberAvatar member={from} size="sm" />
                <MemberMeta member={from} />
                <span className="ml-auto text-xs text-muted-foreground">
                  {formatDateTime(inquiry.createdAt)}
                </span>
              </CardHeader>
              <CardContent>
                <p className="leading-6">{inquiry.message}</p>
              </CardContent>
            </Card>
          )
        })}
        {thread.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma mensagem ainda.
          </p>
        ) : null}
      </section>

      {!isOwner ? (
        <form onSubmit={handleInquiry} className="grid max-w-2xl gap-3">
          <Label htmlFor="inq">Sua mensagem</Label>
          <Textarea
            id="inq"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Contexto, prazo, se prefere pagar ou trocar."
          />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="w-fit">
            Enviar pedido
          </Button>
        </form>
      ) : null}
    </article>
  )
}
