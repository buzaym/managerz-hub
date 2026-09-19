"use client"

import type { ReactNode } from "react"

import { CommunityProvider } from "@/lib/community-store"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <TooltipProvider>
      <CommunityProvider>{children}</CommunityProvider>
    </TooltipProvider>
  )
}
