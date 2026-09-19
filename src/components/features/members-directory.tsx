"use client"

import Link from "next/link"

import { MemberAvatar } from "@/components/people/member-avatar"
import { TagList } from "@/components/community/tag-list"
import { PageHeader } from "@/components/layout/page-header"
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
import { currentUserId, members } from "@/lib/seed"

export function MembersDirectory() {
  const { resetDemo } = useCommunity()

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Membros"
        title="O círculo inicial."
        description="Oito gestores de people, produto, engenharia, vendas, operação e loja. Você entra como Camila Ribeiro, Head of People da Leme Pay."
      />
      <div className="grid gap-3 md:grid-cols-2">
        {members.map((member) => (
          <Card key={member.id} className="shadow-none">
            <CardHeader className="flex flex-row items-start gap-3">
              <MemberAvatar member={member} size="lg" />
              <div>
                <CardTitle>
                  {member.name}
                  {member.id === currentUserId ? " · você" : ""}
                </CardTitle>
                <CardDescription>
                  {member.role} · {member.company}
                </CardDescription>
                <p className="text-xs text-muted-foreground">{member.city}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm leading-6 text-muted-foreground">
                {member.bio}
              </p>
              <TagList tags={member.specialties} />
            </CardContent>
            {member.id !== currentUserId ? (
              <CardFooter>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/agenda?com=${member.id}`}>Marcar conversa</Link>
                </Button>
              </CardFooter>
            ) : null}
          </Card>
        ))}
      </div>
      <Button variant="ghost" size="sm" onClick={resetDemo}>
        Restaurar dados de demonstração
      </Button>
    </div>
  )
}
