"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function CommunityError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <AlertTitle>A mesa travou</AlertTitle>
        <AlertDescription>
          {error.message || "Algo deu errado ao carregar esta parte da comunidade."}
        </AlertDescription>
      </Alert>
      <Button onClick={reset}>Tentar de novo</Button>
    </div>
  )
}
