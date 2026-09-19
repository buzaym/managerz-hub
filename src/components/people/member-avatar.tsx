import { initials } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Member } from "@/lib/types"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function MemberAvatar({
  member,
  size = "default",
  className,
}: {
  member: Member
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback
        className="font-medium text-white"
        style={{ backgroundColor: member.accent }}
      >
        {initials(member.name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function MemberMeta({
  member,
  className,
}: {
  member: Member
  className?: string
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <p className="truncate font-medium text-foreground">{member.name}</p>
      <p className="truncate text-xs text-muted-foreground">
        {member.role} · {member.company}
      </p>
    </div>
  )
}
