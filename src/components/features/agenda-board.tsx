"use client"

import { useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"

import { MemberAvatar, MemberMeta } from "@/components/people/member-avatar"
import { EmptyState } from "@/components/layout/empty-state"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useCommunity } from "@/lib/community-store"
import { formatDateTime } from "@/lib/format"
import { currentUserId, getMember, members } from "@/lib/seed"

export function AgendaBoard() {
  const searchParams = useSearchParams()
  const presetGuest = searchParams.get("com")
  const { meetings, addMeeting } = useCommunity()
  const [open, setOpen] = useState(Boolean(presetGuest))
  const [title, setTitle] = useState("1:1 entre pares")
  const [guestId, setGuestId] = useState(presetGuest ?? members[1].id)
  const [startsAt, setStartsAt] = useState("2026-09-26T10:00")
  const [durationMin, setDurationMin] = useState("45")
  const [place, setPlace] = useState("Google Meet")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")

  const upcoming = useMemo(
    () =>
      [...meetings].sort(
        (a, b) => +new Date(a.startsAt) - +new Date(b.startsAt),
      ),
    [meetings],
  )

  const peers = members.filter((member) => member.id !== currentUserId)

  function handleCreate(event: React.FormEvent) {
    event.preventDefault()
    if (!title.trim() || !startsAt) {
      setError("Dê um nome e um horário para a conversa.")
      return
    }
    addMeeting({
      title: title.trim(),
      guestIds: [guestId],
      startsAt: new Date(startsAt).toISOString(),
      durationMin: Number(durationMin) || 45,
      place: place.trim() || "Google Meet",
      notes: notes.trim(),
    })
    setOpen(false)
    setError("")
    setNotice("Conversa marcada. Os dois recebem o horário em Brasília.")
  }

  return (
    <div className="space-y-6">
      <PageHeader
        kicker="Agenda"
        title="Marque tempo com quem também lidera."
        description="1:1 entre pares, mesas pequenas, conversas que não cabem no Slack da empresa. Tudo no horário de Brasília."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Nova conversa</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <form onSubmit={handleCreate} className="grid gap-4">
                <DialogHeader>
                  <DialogTitle>Agendar uma conversa</DialogTitle>
                  <DialogDescription>
                    Escolha um par e um horário. A mesa não cobra convite formal.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-2">
                  <Label htmlFor="mt-title">Nome</Label>
                  <Input
                    id="mt-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Com quem</Label>
                  <Select value={guestId} onValueChange={setGuestId}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {peers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.name} · {member.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="mt-when">Quando</Label>
                    <Input
                      id="mt-when"
                      type="datetime-local"
                      value={startsAt}
                      onChange={(event) => setStartsAt(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="mt-duration">Minutos</Label>
                    <Input
                      id="mt-duration"
                      type="number"
                      min={20}
                      max={120}
                      value={durationMin}
                      onChange={(event) => setDurationMin(event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mt-place">Onde</Label>
                  <Input
                    id="mt-place"
                    value={place}
                    onChange={(event) => setPlace(event.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="mt-notes">Pauta</Label>
                  <Textarea
                    id="mt-notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    placeholder="O que vocês querem resolver em 45 minutos?"
                  />
                </div>
                {error ? (
                  <p className="text-sm text-destructive">{error}</p>
                ) : null}
                <DialogFooter>
                  <Button type="submit">Marcar</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {notice ? (
        <p className="rounded-lg bg-accent/60 px-3 py-2 text-sm text-accent-foreground">
          {notice}
        </p>
      ) : null}

      {upcoming.length === 0 ? (
        <EmptyState
          title="Nenhuma conversa na agenda"
          description="Marque um 1:1 com alguém da mesa. Quarenta e cinco minutos já mudam a semana."
        />
      ) : (
        <div className="grid gap-3">
          {upcoming.map((meeting) => {
            const host = getMember(meeting.hostId)
            const guests = meeting.guestIds.map((guestId) => getMember(guestId))
            return (
              <Card key={meeting.id} className="shadow-none">
                <CardHeader>
                  <CardTitle>{meeting.title}</CardTitle>
                  <CardDescription>
                    {formatDateTime(meeting.startsAt)} · {meeting.durationMin} min ·{" "}
                    {meeting.place}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <MemberAvatar member={host} size="sm" />
                      <div>
                        <p className="text-xs text-muted-foreground">Quem puxou</p>
                        <p className="text-sm font-medium">{host.name}</p>
                      </div>
                    </div>
                    {guests.map((guest) => (
                      <div key={guest.id} className="flex items-center gap-2">
                        <MemberAvatar member={guest} size="sm" />
                        <MemberMeta member={guest} />
                      </div>
                    ))}
                  </div>
                  {meeting.notes ? (
                    <p className="text-sm leading-6 text-muted-foreground">
                      {meeting.notes}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
