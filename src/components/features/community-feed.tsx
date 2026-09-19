"use client"

import Link from "next/link"
import {
  CalendarDaysIcon,
  CircleHelpIcon,
  FlameIcon,
  MessagesSquareIcon,
  StoreIcon,
  VideoIcon,
} from "lucide-react"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { TagList } from "@/components/community/tag-list"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

export function CommunityFeed() {
  const { ideas, problems, hotseats, webinars, listings, rsvps, replies } =
    useCommunity()

  const live = hotseats.find((item) => item.status === "live")
  const nextHotseat = hotseats.find((item) => item.status === "upcoming")
  const latestIdea = [...ideas].sort(
    (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt),
  )[0]
  const openProblem = problems.find((item) => item.status === "open")
  const nextWebinar = [...webinars].sort(
    (a, b) => +new Date(a.startsAt) - +new Date(b.startsAt),
  )[0]
  const trade = listings.find((item) => item.kind === "trade")

  return (
    <div className="space-y-8">
      <PageHeader
        kicker="Comunidade"
        title="A mesa está aberta."
        description="Hoje tem hotseat ao vivo, problemas sem resposta fácil e pares prontos para marcar um horário. Entre na conversa — não no silêncio educado."
      />

      {live ? (
        <Card className="border-primary/30 bg-primary/5 shadow-none">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <Badge>Ao vivo</Badge>
              <span className="text-xs text-muted-foreground">
                {rsvps.includes(live.id)
                  ? "Você já está na sala"
                  : `${live.seats} cadeiras`}
              </span>
            </div>
            <CardTitle className="font-heading text-2xl">{live.title}</CardTitle>
            <CardDescription className="leading-6">
              {live.summary}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/hotseats/${live.id}`}>Entrar no hotseat</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="shadow-none">
          <CardHeader>
            <MessagesSquareIcon className="size-4 text-primary" />
            <CardTitle>Ideia em circulação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestIdea ? (
              <>
                <Link
                  href={`/ideias/${latestIdea.id}`}
                  className="font-medium hover:underline"
                >
                  {latestIdea.title}
                </Link>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {latestIdea.body}
                </p>
                <TagList tags={latestIdea.tags} />
                <p className="text-xs text-muted-foreground">
                  {replies.filter((reply) => reply.ideaId === latestIdea.id).length}{" "}
                  respostas · {latestIdea.votes} votos
                </p>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CircleHelpIcon className="size-4 text-primary" />
            <CardTitle>Problema na mesa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openProblem ? (
              <>
                <Link
                  href={`/problemas/${openProblem.id}`}
                  className="font-medium hover:underline"
                >
                  {openProblem.title}
                </Link>
                <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                  {openProblem.body}
                </p>
                <div className="flex items-center gap-2">
                  <MemberAvatar member={getMember(openProblem.authorId)} size="sm" />
                  <span className="text-xs text-muted-foreground">
                    {getMember(openProblem.authorId).name}
                  </span>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <FlameIcon className="size-4 text-primary" />
            <CardTitle>Próximo hotseat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextHotseat ? (
              <>
                <p className="font-medium">{nextHotseat.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(nextHotseat.startsAt)} ·{" "}
                  {getMember(nextHotseat.hostId).name}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/hotseats/${nextHotseat.id}`}>Reservar cadeira</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <VideoIcon className="size-4 text-primary" />
            <CardTitle>Webinar da semana</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextWebinar ? (
              <>
                <p className="font-medium">{nextWebinar.title}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(nextWebinar.startsAt)}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/webinars/${nextWebinar.id}`}>Inscrever-se</Link>
                </Button>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>

      {trade ? (
        <Card className="shadow-none">
          <CardHeader>
            <StoreIcon className="size-4 text-primary" />
            <CardTitle>Troca no marketplace</CardTitle>
            <CardDescription>{trade.title}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <MemberAvatar member={getMember(trade.authorId)} />
              <MemberMeta member={getMember(trade.authorId)} />
            </div>
            <Button asChild>
              <Link href={`/marketplace/${trade.id}`}>Ver oferta</Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button asChild variant="outline">
          <Link href="/agenda">
            <CalendarDaysIcon />
            Marcar uma conversa
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/ideias">Publicar uma ideia</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/problemas">Trazer um problema</Link>
        </Button>
      </div>
    </div>
  )
}
