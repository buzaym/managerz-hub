"use client"

import { useState } from "react"
import { ChevronUpIcon } from "lucide-react"

import { AuthPrompt } from "@/components/community/auth-prompt"
import { Button } from "@/components/ui/button"
import { useCommunity } from "@/lib/community-store"
import { cn } from "@/lib/utils"

export function VoteControl({
  count,
  active,
  onToggle,
  label,
}: {
  count: number
  active: boolean
  onToggle: () => "ok" | "auth"
  label: string
}) {
  const { currentUser } = useCommunity()
  const [prompt, setPrompt] = useState(false)

  function handleClick() {
    if (!currentUser) {
      setPrompt(true)
      return
    }
    onToggle()
  }

  return (
    <>
      <Button
        type="button"
        variant={active ? "default" : "outline"}
        size="sm"
        aria-pressed={active}
        aria-label={label}
        onClick={handleClick}
        className={cn(
          "min-w-12 flex-col gap-0 px-2",
          active && "shadow-none",
        )}
      >
        <ChevronUpIcon className="size-3.5" />
        <span className="text-xs tabular-nums">{count}</span>
      </Button>
      <AuthPrompt
        open={prompt}
        onOpenChange={setPrompt}
        action="votar"
      />
    </>
  )
}
