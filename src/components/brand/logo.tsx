import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"

export function Logo({
  variant = "white",
  href = "/",
  className,
}: {
  variant?: "white" | "navy"
  href?: string
  className?: string
}) {
  const lockup =
    variant === "white"
      ? "/brand/logo-lockup-white.png"
      : "/brand/logo-lockup-navy.png"
  const mark =
    variant === "white" ? "/brand/mark-white.png" : "/brand/mark-navy.png"

  return (
    <Link href={href} className={cn("flex items-center", className)}>
      <Image
        src={lockup}
        alt="Managerz"
        width={196}
        height={24}
        className="hidden h-7 w-auto sm:block"
        priority
      />
      <Image
        src={mark}
        alt="Managerz"
        width={32}
        height={32}
        className="h-8 w-8 sm:hidden"
        priority
      />
    </Link>
  )
}

export function LogoStacked({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/logo-white.png"
      alt="Managerz"
      width={280}
      height={144}
      className={cn("h-auto w-48 sm:w-64", className)}
      priority
    />
  )
}
