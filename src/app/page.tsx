import { Suspense } from "react"

import { ConversationFeed } from "@/components/community/conversation-feed"
import { Skeleton } from "@/components/ui/skeleton"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = "" } = await searchParams
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <ConversationFeed
        query={q}
        heading="Gestores se conectam, votam e se ajudam."
        description="Country managers, product managers, business development e o resto de quem lidera gente. Leia tudo. Entre para votar, responder ou abrir um hotseat."
      />
    </Suspense>
  )
}
