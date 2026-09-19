"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
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
import { formatBRL } from "@/lib/format"
import { getMember } from "@/lib/seed"
import type { ListingKind } from "@/lib/types"

export function MarketplaceBoard() {
  const router = useRouter()
  const { listings, addListing } = useCommunity()
  const [kind, setKind] = useState<string>("all")
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [formKind, setFormKind] = useState<ListingKind>("service")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Mentoria")
  const [price, setPrice] = useState("450")
  const [tradeFor, setTradeFor] = useState("")
  const [city, setCity] = useState("São Paulo · remoto")
  const [error, setError] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return listings.filter((listing) => {
      const kindOk = kind === "all" || listing.kind === kind
      const queryOk =
        !q ||
        listing.title.toLowerCase().includes(q) ||
        listing.description.toLowerCase().includes(q) ||
        listing.category.toLowerCase().includes(q)
      return kindOk && queryOk
    })
  }, [kind, listings, query])

  function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (title.trim().length < 6 || description.trim().length < 20) {
      setError("Dê um nome e descreva o serviço ou a troca com clareza.")
      return
    }
    const id = addListing({
      kind: formKind,
      title: title.trim(),
      description: description.trim(),
      category: category.trim() || "Outro",
      priceCents:
        formKind === "service"
          ? Math.round(Number(price.replace(",", ".")) * 100) || 0
          : null,
      tradeFor: formKind === "trade" ? tradeFor.trim() : null,
      city: city.trim(),
    })
    setOpen(false)
    router.push(`/marketplace/${id}`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Marketplace"
        title="Serviços entre pares — ou troca de hora."
        description="Mentoria, workshop, offsite, coaching. Cobra em reais ou troca quatro horas da sua especialidade pelas quatro horas de outra pessoa."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Novo anúncio</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleCreate} className="grid gap-4">
                <DialogHeader>
                  <DialogTitle>Publicar no marketplace</DialogTitle>
                  <DialogDescription>
                    Serviço cobrado ou troca. Sem agência no meio.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <Select
                    value={formKind}
                    onValueChange={(value) => setFormKind(value as ListingKind)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="service">Serviço</SelectItem>
                      <SelectItem value="trade">Troca</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ls-title">Título</Label>
                  <Input
                    id="ls-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ls-desc">Descrição</Label>
                  <Textarea
                    id="ls-desc"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="ls-cat">Categoria</Label>
                    <Input
                      id="ls-cat"
                      value={category}
                      onChange={(event) => setCategory(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ls-city">Cidade</Label>
                    <Input
                      id="ls-city"
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                    />
                  </div>
                </div>
                {formKind === "service" ? (
                  <div className="grid gap-2">
                    <Label htmlFor="ls-price">Preço (R$)</Label>
                    <Input
                      id="ls-price"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                    />
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Label htmlFor="ls-trade">Em troca de</Label>
                    <Input
                      id="ls-trade"
                      value={tradeFor}
                      onChange={(event) => setTradeFor(event.target.value)}
                      placeholder="Ex.: 4h de mentoria de produto"
                    />
                  </div>
                )}
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
          placeholder="Buscar mentoria, workshop, troca…"
          aria-label="Buscar marketplace"
        />
        <Select value={kind} onValueChange={setKind}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tudo</SelectItem>
            <SelectItem value="service">Serviços</SelectItem>
            <SelectItem value="trade">Trocas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Nada neste recorte"
          description="Mude o filtro ou publique o que você sabe fazer — e o que precisa em troca."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((listing) => {
            const author = getMember(listing.authorId)
            return (
              <Card key={listing.id} className="shadow-none">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {listing.kind === "trade" ? "Troca" : listing.category}
                    </Badge>
                    <span className="text-sm font-medium">
                      {formatBRL(listing.priceCents)}
                    </span>
                  </div>
                  <CardTitle>
                    <Link
                      href={`/marketplace/${listing.id}`}
                      className="hover:underline"
                    >
                      {listing.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {listing.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{listing.city}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex items-center gap-2">
                    <MemberAvatar member={author} size="sm" />
                    <MemberMeta member={author} />
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
