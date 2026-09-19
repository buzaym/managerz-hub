"use client"

import Link from "next/link"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { PageHeader } from "@/components/layout/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { getMember } from "@/lib/seed"

const statusLabel = {
  live: "Ao vivo",
  upcoming: "Em breve",
  done: "Encerrado",
} as const

export function HotseatsBoard() {
  const { hotseats, rsvps, questions } = useCommunity()

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Hotseats"
        title="Uma cadeira. Perguntas de verdade."
        description="O anfitrião traz um caso aberto. A mesa pergunta. Ninguém sai com um carrossel de slides."
      />
      <div className="grid gap-4">
        {hotseats.map((hotseat) => {
          const host = getMember(hotseat.hostId)
          const going = rsvps.includes(hotseat.id)
          const qCount = questions.filter(
            (question) => question.hotseatId === hotseat.id,
          ).length
          return (
            <Card key={hotseat.id} className="shadow-none">
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={hotseat.status === "live" ? "default" : "secondary"}>
                    {statusLabel[hotseat.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(hotseat.startsAt)} · {hotseat.durationMin} min
                  </span>
                </div>
                <CardTitle className="font-heading text-2xl">
                  <Link href={`/hotseats/${hotseat.id}`} className="hover:underline">
                    {hotseat.title}
                  </Link>
                </CardTitle>
                <CardDescription className="leading-6">
                  {hotseat.summary}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <MemberAvatar member={host} />
                  <MemberMeta member={host} />
                </div>
                <TagList tags={hotseat.topics} />
              </CardContent>
              <CardFooter className="justify-between">
                <p className="text-xs text-muted-foreground">
                  {qCount} perguntas · {hotseat.seats} cadeiras
                  {going ? " · você confirmou" : ""}
                </p>
                <Button asChild size="sm">
                  <Link href={`/hotseats/${hotseat.id}`}>
                    {hotseat.status === "live" ? "Entrar" : "Ver sessão"}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
