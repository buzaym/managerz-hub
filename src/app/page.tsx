import { Suspense } from "react"

import { ConversationFeed } from "@/components/community/conversation-feed"
import { RotatingRole } from "@/components/community/rotating-role"
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
        heading={
          <>
            <span className="sr-only">
              Aqui é o lugar onde country, business development, product e
              outros managers se encontram para discutir ideias e colaborar.
            </span>
            <span aria-hidden="true">
              Aqui é o lugar onde <RotatingRole /> managers se encontram para
              discutir ideias e colaborar.
            </span>
          </>
        }
        description="Leia tudo. Entre para votar, responder ou abrir um hotseat."
      />
    </Suspense>
  )
}
