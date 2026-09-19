import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({
  className,
  href = "/",
}: {
  className?: string
  href?: string
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5 text-foreground", className)}
    >
      <span className="grid size-8 place-items-center rounded-md bg-primary font-heading text-lg leading-none text-primary-foreground shadow-[inset_0_-1px_0_oklch(0_0_0/0.15)]">
        M
      </span>
      <span className="font-heading text-[1.35rem] leading-none tracking-tight">
        Managerz
      </span>
    </Link>
  )
}
