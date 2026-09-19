"use client"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { MissingRecord } from "@/components/layout/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function WebinarDetail({ id }: { id: string }) {
  const { webinars, rsvps, toggleRsvp } = useCommunity()
  const webinar = webinars.find((item) => item.id === id)

  if (!webinar) {
    return (
      <MissingRecord
        title="Webinar não encontrado"
        description="Essa sessão não está na grade deste navegador."
        href="/webinars"
        hrefLabel="Ver webinars"
      />
    )
  }

  const host = getMember(webinar.hostId)
  const going = rsvps.includes(webinar.id)

  return (
    <article className="space-y-6">
      <p className="text-xs font-medium tracking-[0.18em] text-primary uppercase">
        Webinar
      </p>
      <h1 className="font-heading text-3xl tracking-tight text-balance sm:text-4xl">
        {webinar.title}
      </h1>
      <p className="text-sm text-muted-foreground">
        {formatDateTime(webinar.startsAt)} · {webinar.durationMin} min · até{" "}
        {webinar.capacity} pessoas
      </p>
      <p className="max-w-2xl leading-7">{webinar.summary}</p>
      <TagList tags={webinar.topics} />

      <div className="flex flex-col gap-4 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <MemberAvatar member={host} size="lg" />
          <div>
            <p className="text-xs text-muted-foreground">Quem conduz</p>
            <MemberMeta member={host} />
          </div>
        </div>
        <div className="flex items-center gap-3">
          {going ? <Badge variant="secondary">Inscrito</Badge> : null}
          <Button
            variant={going ? "outline" : "default"}
            onClick={() => toggleRsvp(webinar.id)}
          >
            {going ? "Cancelar inscrição" : "Inscrever-se"}
          </Button>
        </div>
      </div>

      {going ? (
        <p className="rounded-lg bg-accent/60 px-3 py-2 text-sm leading-6">
          Você está na lista. O link da sala entra no e-mail da Camila no dia —
          nesta versão de demonstração, a presença fica salva neste navegador.
        </p>
      ) : null}
    </article>
  )
}
