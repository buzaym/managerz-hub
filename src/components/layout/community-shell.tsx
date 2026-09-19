"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { MenuIcon } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { MemberAvatar } from "@/components/people/member-avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { communityNav } from "@/lib/nav"
import { getMember } from "@/lib/seed"
import { currentUserId } from "@/lib/seed"
import { cn } from "@/lib/utils"

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {communityNav.map((item) => {
        const active =
          item.href === "/comunidade"
            ? pathname === "/comunidade"
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-primary/10 font-medium text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function CommunityShell({ children }: { children: ReactNode }) {
  const you = getMember(currentUserId)

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <aside className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col border-r border-border bg-card/70 px-4 py-5 lg:flex">
        <Logo href="/comunidade" />
        <p className="mt-3 px-1 text-xs leading-5 text-muted-foreground">
          A mesa dos gestores. Horário de Brasília.
        </p>
        <Separator className="my-4" />
        <NavLinks />
        <div className="mt-auto rounded-xl bg-muted/70 p-3">
          <div className="flex items-center gap-3">
            <MemberAvatar member={you} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{you.name}</p>
              <p className="truncate text-xs text-muted-foreground">Você</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur-md lg:hidden">
          <Logo href="/comunidade" />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Abrir menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle className="sr-only">Navegação</SheetTitle>
                <Logo href="/comunidade" />
              </SheetHeader>
              <div className="px-4">
                <NavLinks />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
