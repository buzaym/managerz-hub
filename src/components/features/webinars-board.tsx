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

export function WebinarsBoard() {
  const { webinars, rsvps } = useCommunity()

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Webinars"
        title="Uma hora, um ofício."
        description="Sessões ao vivo sobre a prática de gerir gente — 1:1, feedback, contratação — sem guru de palco."
      />
      <div className="grid gap-4">
        {webinars.map((webinar) => {
          const host = getMember(webinar.hostId)
          const going = rsvps.includes(webinar.id)
          return (
            <Card key={webinar.id} className="shadow-none">
              <CardHeader>
                {going ? <Badge variant="secondary">Você está inscrito</Badge> : null}
                <CardTitle className="font-heading text-2xl">
                  <Link href={`/webinars/${webinar.id}`} className="hover:underline">
                    {webinar.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {formatDateTime(webinar.startsAt)} · {webinar.durationMin} min ·{" "}
                  {webinar.capacity} lugares
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="leading-6 text-muted-foreground">{webinar.summary}</p>
                <TagList tags={webinar.topics} />
                <div className="flex items-center gap-3">
                  <MemberAvatar member={host} />
                  <MemberMeta member={host} />
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild>
                  <Link href={`/webinars/${webinar.id}`}>
                    {going ? "Ver inscrição" : "Inscrever-se"}
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
