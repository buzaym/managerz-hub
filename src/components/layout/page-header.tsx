import type { ReactNode } from "react"

export function PageHeader({
  kicker,
  title,
  description,
  action,
}: {
  kicker?: string
  title: string
  description: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl space-y-2">
        {kicker ? (
          <p className="text-xs font-medium tracking-[0.16em] text-primary uppercase">
            {kicker}
          </p>
        ) : null}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h1>
        <p className="text-sm leading-6 text-muted-foreground text-pretty sm:text-base">
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  )
}
