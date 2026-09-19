import Link from "next/link"

import { Logo } from "@/components/brand/logo"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-6 py-16">
      <Logo variant="navy" />
      <Alert>
        <AlertTitle>Essa cadeira está vazia</AlertTitle>
        <AlertDescription>
          Não encontramos essa página. Volte às conversas ou entre para
          participar.
        </AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Conversas</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/entrar">Entrar</Link>
        </Button>
      </div>
    </div>
  )
}
