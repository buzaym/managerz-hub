"use client"

import { useState } from "react"
import { CheckIcon, LinkIcon, Share2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { linkedinShareUrl, shareCopy, twitterShareUrl } from "@/lib/share"

export function ShareButton({
  title,
  path,
}: {
  title: string
  path: string
}) {
  const [copied, setCopied] = useState(false)

  function url() {
    if (typeof window === "undefined") return `https://managerz.com.br${path}`
    return `${window.location.origin}${path}`
  }

  async function nativeShare() {
    const href = url()
    if (navigator.share) {
      await navigator.share({
        title: `${title} · Managerz`,
        text: shareCopy(title, href),
        url: href,
      })
      return
    }
    await copy()
  }

  async function copy() {
    await navigator.clipboard.writeText(shareCopy(title, url()))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {copied ? <CheckIcon /> : <Share2Icon />}
          Compartilhar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={nativeShare}>
          <Share2Icon /> Enviar
        </DropdownMenuItem>
        <DropdownMenuItem onClick={copy}>
          <LinkIcon /> Copiar pergunta e link
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={linkedinShareUrl(url())} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={twitterShareUrl(title, url())} target="_blank" rel="noreferrer">
            X / Twitter
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
