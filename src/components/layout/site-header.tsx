"use client"

import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FormEvent, Suspense, useState } from "react"
import { MenuIcon, SearchIcon } from "lucide-react"

import { Logo } from "@/components/brand/logo"
import { MemberAvatar } from "@/components/people/member-avatar"
import { UserBadges } from "@/components/community/user-badges"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCommunity } from "@/lib/community-store"
import { communityNav } from "@/lib/nav"
import { badgesForUser } from "@/lib/ranking"
import { cn } from "@/lib/utils"

function HeaderSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get("q") ?? "")

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    const value = query.trim()
    router.push(value ? `/?q=${encodeURIComponent(value)}` : "/")
  }

  return (
    <form onSubmit={onSubmit} className="relative min-w-0 flex-1">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-primary-foreground/60" />
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar conversas, cargos, problemas…"
        aria-label="Buscar conversas"
        className="h-9 border-white/15 bg-white/10 pl-8 text-primary-foreground placeholder:text-primary-foreground/55 focus-visible:border-white/40 focus-visible:ring-white/30"
      />
    </form>
  )
}

function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void
  className?: string
}) {
  const pathname = usePathname()
  return (
    <nav className={cn("flex items-center gap-1", className)}>
      {communityNav.map((item) => {
        const active =
          item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-white/15 text-white"
                : "text-white/75 hover:bg-white/10 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

function UserMenu() {
  const { currentUser, logout, posts, answers, postVotes, answerVotes, users } =
    useCommunity()

  if (!currentUser) {
    return (
      <Button
        asChild
        size="sm"
        className="bg-white text-primary hover:bg-white/90"
      >
        <Link href="/entrar">Entrar</Link>
      </Button>
    )
  }

  const badges = badgesForUser(
    { users, sessionUserId: currentUser.id, posts, answers, postVotes, answerVotes },
    currentUser.id,
  )

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md px-1 py-0.5 hover:bg-white/10"
        >
          <MemberAvatar member={currentUser} size="sm" />
          <span className="hidden max-w-28 truncate text-sm font-medium lg:block">
            {currentUser.name.split(" ")[0]}
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{currentUser.name}</p>
          <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          <div className="mt-1">
            <UserBadges badges={badges} />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/nova">Nova conversa</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/ranking">Ver ranking</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Sair</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderBar() {
  return (
    <header className="sticky top-0 z-40 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 sm:h-16 sm:px-6">
        <Logo variant="white" />
        <div className="hidden min-w-0 flex-1 md:block">
          <HeaderSearch />
        </div>
        <NavLinks className="hidden lg:flex" />
        <UserMenu />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/10 hover:text-white lg:hidden"
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-primary text-primary-foreground">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <Logo variant="white" />
            </SheetHeader>
            <div className="flex flex-col gap-4 px-4">
              <HeaderSearch />
              <NavLinks className="flex-col items-stretch" />
              <Button asChild className="bg-white text-primary hover:bg-white/90">
                <Link href="/nova">Nova conversa</Link>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <div className="border-t border-white/10 px-4 py-2 md:hidden">
        <HeaderSearch />
      </div>
    </header>
  )
}

export function SiteHeader() {
  return (
    <Suspense
      fallback={
        <header className="h-14 bg-primary sm:h-16" />
      }
    >
      <HeaderBar />
    </Suspense>
  )
}
