import { Suspense } from "react"

import { AgendaBoard } from "@/components/features/agenda-board"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Agenda",
}

export default function AgendaPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <AgendaBoard />
    </Suspense>
  )
}
