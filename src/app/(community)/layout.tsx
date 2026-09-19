import type { ReactNode } from "react"

import { CommunityProvider } from "@/lib/community-store"
import { CommunityShell } from "@/components/layout/community-shell"

export default function CommunityGroupLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <CommunityProvider>
      <CommunityShell>{children}</CommunityShell>
    </CommunityProvider>
  )
}
