import { badgeCatalog, type UserScore } from "@/lib/ranking"
import type { BadgeId } from "@/lib/types"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

export function UserBadges({
  badges,
  className,
}: {
  badges: BadgeId[]
  className?: string
}) {
  if (badges.length === 0) return null
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {badges.map((id) => (
        <Tooltip key={id}>
          <TooltipTrigger asChild>
            <span className="inline-flex h-6 items-center rounded-md bg-primary/8 px-1.5 font-medium text-sm leading-none">
              {badgeCatalog[id].glyph}
            </span>
          </TooltipTrigger>
          <TooltipContent>{badgeCatalog[id].label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}

export function ScoreLine({ row }: { row: UserScore }) {
  return (
    <p className="text-xs text-muted-foreground">
      {row.score} pts · {row.answered} respostas · {row.asked} perguntas
    </p>
  )
}
