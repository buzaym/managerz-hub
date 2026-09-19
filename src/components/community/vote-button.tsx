"use client"

import { ChevronUpIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function VoteButton({
  count,
  active,
  onClick,
  label,
}: {
  count: number
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <Button
      type="button"
      variant={active ? "default" : "outline"}
      size="sm"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={cn("min-w-12 flex-col gap-0 px-2", active && "shadow-none")}
    >
      <ChevronUpIcon className="size-3.5" />
      <span className="text-xs tabular-nums">{count}</span>
    </Button>
  )
}
