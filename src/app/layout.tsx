import type { Metadata } from "next"
import { Fraunces, Geist, Geist_Mono } from "next/font/google"

import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://managerz.com.br"),
  title: {
    default: "Managerz",
    template: "%s · Managerz",
  },
  description:
    "A mesa dos gestores. Comunidade para trocar ideias, sentar no hotseat, resolver problemas, marcar conversas, participar de webinars e negociar serviços — em português, no Brasil.",
  applicationName: "Managerz",
  keywords: [
    "gestores",
    "liderança",
    "comunidade",
    "hotseat",
    "webinar",
    "marketplace",
    "Brasil",
  ],
  openGraph: {
    title: "Managerz",
    description:
      "A comunidade de gestores do Brasil. Ideias, hotseats, problemas reais, agenda, webinars e marketplace.",
    url: "https://managerz.com.br",
    siteName: "Managerz",
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
