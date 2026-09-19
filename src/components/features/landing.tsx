import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarDaysIcon,
  CircleHelpIcon,
  FlameIcon,
  MessagesSquareIcon,
  StoreIcon,
  VideoIcon,
} from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { MemberAvatar } from "@/components/people/member-avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatDateTime } from "@/lib/format"
import { landingStats, members, seedState } from "@/lib/seed"

const features = [
  {
    href: "/ideias",
    title: "Ideias",
    text: "Troque ritos, decisões e o que realmente funciona com quem também lidera gente.",
    icon: MessagesSquareIcon,
  },
  {
    href: "/hotseats",
    title: "Hotseats",
    text: "Um gestor senta na cadeira. O resto pergunta. Sem palco, sem recorte de LinkedIn.",
    icon: FlameIcon,
  },
  {
    href: "/problemas",
    title: "Problemas",
    text: "Traga o caso feio da semana. A mesa responde com o que faria na segunda-feira.",
    icon: CircleHelpIcon,
  },
  {
    href: "/agenda",
    title: "Agenda",
    text: "Marque 1:1 entre pares, mesas pequenas e conversas que não cabem no Slack.",
    icon: CalendarDaysIcon,
  },
  {
    href: "/webinars",
    title: "Webinars",
    text: "Sessões ao vivo sobre 1:1, feedback, contratação de gestores e o resto da prática.",
    icon: VideoIcon,
  },
  {
    href: "/marketplace",
    title: "Marketplace",
    text: "Venda, compre ou troque mentoria, workshop, offsite e coaching entre pares.",
    icon: StoreIcon,
  },
]

const nextHotseat = seedState.hotseats.find((item) => item.status === "live")
const nextWebinar = seedState.webinars[0]

export function LandingPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <Link href="/#mesa" className="hover:text-foreground">
              A mesa
            </Link>
            <Link href="/#pratica" className="hover:text-foreground">
              A prática
            </Link>
            <Link href="/membros" className="hover:text-foreground">
              Membros
            </Link>
          </div>
          <Button asChild>
            <Link href="/comunidade">
              Entrar
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
          <div className="space-y-6">
            <p className="text-xs font-medium tracking-[0.2em] text-primary uppercase">
              managerz.com.br
            </p>
            <h1 className="font-heading text-4xl leading-[1.1] tracking-tight text-balance sm:text-6xl">
              A mesa dos gestores.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Managerz é a comunidade em que quem lidera pessoas troca ideias,
              senta no hotseat, resolve problemas reais, marca conversas, entra
              em webinars e negocia serviços — entre pares, em português, no
              horário de Brasília.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/comunidade">Entrar na comunidade</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/hotseats">Ver hotseats</Link>
              </Button>
            </div>
            <dl className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-3">
              {landingStats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-heading text-2xl">{stat.value}</dt>
                  <dd className="text-xs leading-5 text-muted-foreground">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute inset-6 rounded-3xl bg-primary/8" />
            <Card className="relative rotate-[-1.5deg] shadow-none">
              <CardHeader>
                <Badge variant="secondary">Ao vivo agora</Badge>
                <CardTitle className="font-heading text-2xl">
                  {nextHotseat?.title}
                </CardTitle>
                <CardDescription>
                  {nextHotseat
                    ? formatDateTime(nextHotseat.startsAt)
                    : "Hotseat"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="leading-6 text-muted-foreground">
                  {nextHotseat?.summary}
                </p>
                <Button asChild className="w-full">
                  <Link href={`/hotseats/${nextHotseat?.id ?? ""}`}>
                    Entrar no hotseat
                  </Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="relative mt-4 ml-8 rotate-[1.2deg] shadow-none">
              <CardHeader>
                <CardTitle>Próximo webinar</CardTitle>
                <CardDescription>
                  {nextWebinar ? formatDateTime(nextWebinar.startsAt) : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{nextWebinar?.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {nextWebinar?.summary}
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          id="mesa"
          className="border-y border-border bg-card/60 py-16"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-6">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-heading text-3xl tracking-tight">
                Um círculo, não um feed infinito.
              </h2>
              <p className="text-muted-foreground leading-7">
                Managerz começa pequeno de propósito. São gestores de produto,
                engenharia, people, vendas, operação e loja — de Recife a Porto
                Alegre — sentados na mesma mesa.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-start gap-3 rounded-xl bg-background p-3 ring-1 ring-foreground/8"
                >
                  <MemberAvatar member={member} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{member.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {member.role}
                    </p>
                    <p className="text-xs text-muted-foreground">{member.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pratica" className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
          <div className="mb-8 max-w-2xl space-y-3">
            <h2 className="font-heading text-3xl tracking-tight">
              O que acontece na mesa.
            </h2>
            <p className="text-muted-foreground leading-7">
              Seis práticas. Nenhuma delas é um grupo de WhatsApp com PDF de
              liderança.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href} className="group">
                <Card className="h-full shadow-none transition-colors group-hover:bg-muted/40">
                  <CardHeader>
                    <feature.icon className="size-5 text-primary" />
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="leading-6">
                      {feature.text}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Managerz · managerz.com.br · São Paulo, Brasil</p>
          <p>Comunidade de gestores. Horário de Brasília.</p>
        </div>
      </footer>
    </div>
  )
}
