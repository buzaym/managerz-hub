import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"

import { Providers } from "@/app/providers"
import { SiteHeader } from "@/components/layout/site-header"

import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://managerz.com.br"),
  title: {
    default: "Managerz",
    template: "%s · Managerz",
  },
  description:
    "Aqui é o lugar onde country, business development, product e outros managers se encontram para discutir ideias e colaborar.",
  applicationName: "Managerz",
  keywords: [
    "gestores",
    "country manager",
    "product manager",
    "business development",
    "comunidade",
    "forum",
    "Brasil",
  ],
  openGraph: {
    title: "Managerz",
    description:
      "Aqui é o lugar onde country, business development, product e outros managers se encontram para discutir ideias e colaborar.",
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
      className={`${inter.className} ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background">
        <Providers>
          <SiteHeader />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6">
            {children}
          </main>
          <footer className="border-t border-border bg-card">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p>Managerz · managerz.com.br</p>
              <p>Leia grátis. Entre para votar, responder e abrir um hotseat.</p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
