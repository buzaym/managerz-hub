"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="space-y-3 py-10">
      <h1 className="text-xl font-semibold">A mesa travou</h1>
      <p className="text-sm text-muted-foreground">
        {error.message || "Algo deu errado ao carregar esta página."}
      </p>
      <Button onClick={reset}>Tentar de novo</Button>
    </div>
  )
}
