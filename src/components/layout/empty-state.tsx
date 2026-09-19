import type { ReactNode } from "react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border bg-card/60 px-5 py-10">
      <h2 className="font-heading text-xl tracking-tight">{title}</h2>
      <p className="max-w-lg text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      {action}
    </div>
  )
}

export function MissingRecord({
  title,
  description,
  href,
  hrefLabel,
}: {
  title: string
  description: string
  href: string
  hrefLabel: string
}) {
  return (
    <Alert>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <span>{description}</span>
        <Button asChild>
          <Link href={href}>{hrefLabel}</Link>
        </Button>
      </AlertDescription>
    </Alert>
  )
}
