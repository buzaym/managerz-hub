"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AuthPrompt({
  open,
  onOpenChange,
  action = "participar",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: string
}) {
  const pathname = usePathname()
  const next = encodeURIComponent(pathname || "/")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entre para {action}</DialogTitle>
          <DialogDescription>
            A Managerz é aberta para ler. Para votar, responder ou abrir um
            hotseat, você entra com nome e e-mail — leva um minuto.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="w-full sm:w-auto">
            <Link href={`/entrar?next=${next}`}>Entrar</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
