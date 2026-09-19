"use client"

import Link from "next/link"

import { MemberAvatar } from "@/components/people/member-avatar"
import { ScoreLine, UserBadges } from "@/components/community/user-badges"
import { PageHeader } from "@/components/layout/page-header"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCommunity } from "@/lib/community-store"
import { rankedUsers } from "@/lib/ranking"
import { cn } from "@/lib/utils"

export function RankingBoard() {
  const state = useCommunity()
  const rows = rankedUsers(state)

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Ranking"
        title="Quem mais ajuda a mesa."
        description="A pontuação soma votos nas suas perguntas e o dobro dos votos nas suas respostas. Badges 🏆1 🏆A 🏆H marcam posição, respostas em alta e quem abre hotseat."
      />
      <div className="space-y-3">
        {rows.map((row) => (
          <Card
            key={row.user.id}
            className={cn(
              "shadow-none",
              row.rank <= 3 && "ring-1 ring-primary/20",
            )}
          >
            <CardHeader className="flex flex-row items-center gap-4">
              <span className="w-8 text-center text-lg font-semibold tabular-nums text-primary">
                {row.rank}
              </span>
              <MemberAvatar member={row.user} size="lg" />
              <div className="min-w-0 flex-1">
                <CardTitle className="flex flex-wrap items-center gap-2">
                  {row.user.name}
                  <UserBadges badges={row.badges} />
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {row.user.role} · {row.user.company} · {row.user.city}
                </p>
                <ScoreLine row={row} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-muted-foreground">
                {row.user.bio}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Quer aparecer aqui?{" "}
        <Link href="/entrar" className="font-medium text-primary underline-offset-4 hover:underline">
          Entre
        </Link>{" "}
        e responda uma conversa em alta.
      </p>
    </div>
  )
}
