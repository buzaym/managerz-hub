"use client"

import { FormEvent, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

import { LogoStacked } from "@/components/brand/logo"
import { MemberAvatar } from "@/components/people/member-avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCommunity } from "@/lib/community-store"

export function AuthForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get("next") || "/"
  const { users, login, signup, loginAs, currentUser } = useCommunity()
  const [mode, setMode] = useState<"entrar" | "criar">("entrar")
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("Product Manager")
  const [company, setCompany] = useState("")
  const [city, setCity] = useState("São Paulo")
  const [error, setError] = useState("")

  const demos = useMemo(() => users.slice(0, 4), [users])

  useEffect(() => {
    if (currentUser) router.replace(next)
  }, [currentUser, next, router])

  if (currentUser) {
    return null
  }

  function go() {
    router.push(next)
  }

  function handleLogin(event: FormEvent) {
    event.preventDefault()
    if (!email.trim()) {
      setError("Informe o e-mail.")
      return
    }
    const ok = login(email)
    if (!ok) {
      setError("Não achamos esse e-mail. Crie uma conta.")
      setMode("criar")
      return
    }
    go()
  }

  function handleSignup(event: FormEvent) {
    event.preventDefault()
    if (name.trim().length < 3 || !email.includes("@")) {
      setError("Nome e e-mail válidos, por favor.")
      return
    }
    signup({ name, email, role, company, city })
    go()
  }

  return (
    <div className="mx-auto grid max-w-md gap-6">
      <div className="rounded-xl bg-primary px-6 py-8 text-center">
        <LogoStacked className="mx-auto" />
      </div>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {mode === "entrar" ? "Entre para participar" : "Crie sua cadeira"}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground">
          Leia tudo sem conta. Para votar, responder ou abrir um hotseat, entre.
        </p>
      </div>

      {mode === "entrar" ? (
        <form onSubmit={handleLogin} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit">Entrar</Button>
          <Button type="button" variant="ghost" onClick={() => setMode("criar")}>
            Ainda não tenho conta
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSignup} className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="mail">E-mail</Label>
            <Input
              id="mail"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="role">Cargo</Label>
            <Input
              id="role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              placeholder="Country Manager, Product Manager…"
            />
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                value={company}
                onChange={(event) => setCompany(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              />
            </div>
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit">Criar conta e entrar</Button>
          <Button type="button" variant="ghost" onClick={() => setMode("entrar")}>
            Já tenho conta
          </Button>
        </form>
      )}

      <div className="space-y-2">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Demo — entrar como
        </p>
        <div className="grid gap-2">
          {demos.map((user) => (
            <button
              key={user.id}
              type="button"
              onClick={() => {
                loginAs(user.id)
                go()
              }}
              className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 text-left hover:bg-muted/60"
            >
              <MemberAvatar member={user} size="sm" />
              <span>
                <span className="block text-sm font-medium">{user.name}</span>
                <span className="block text-xs text-muted-foreground">
                  {user.role}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
