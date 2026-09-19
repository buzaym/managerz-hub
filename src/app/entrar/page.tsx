import { Suspense } from "react"

import { AuthForm } from "@/components/community/auth-form"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata = {
  title: "Entrar",
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<Skeleton className="h-64 w-full" />}>
      <AuthForm />
    </Suspense>
  )
}
