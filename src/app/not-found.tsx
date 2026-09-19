import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col justify-center gap-6 px-4 py-16">
      <Logo />
      <Alert>
        <AlertTitle>Essa cadeira está vazia</AlertTitle>
        <AlertDescription>
          Não encontramos essa página no Managerz. Volte para a mesa ou abra a
          comunidade.
        </AlertDescription>
      </Alert>
      <div className="flex gap-2">
        <Button asChild>
          <Link href="/">Início</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/comunidade">Comunidade</Link>
        </Button>
      </div>
    </div>
  )
}
