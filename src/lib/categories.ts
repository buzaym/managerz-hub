import type { CategorySlug } from "@/lib/types"

export const categories: {
  slug: CategorySlug
  label: string
  pitch: string
}[] = [
  {
    slug: "product-manager",
    label: "Product Manager",
    pitch: "De IC a gestor de produto — priorização, gente e o que parar de fazer.",
  },
  {
    slug: "country-manager",
    label: "Country Manager",
    pitch: "HQ, operação local e o meio do campo entre os dois.",
  },
  {
    slug: "business-development",
    label: "Business Development",
    pitch: "Quota, parceria e relacionamento sem queimar o time.",
  },
  {
    slug: "people",
    label: "People",
    pitch: "1:1, promoção, cultura e a conversa que o RH empurra.",
  },
  {
    slug: "engenharia",
    label: "Engenharia",
    pitch: "Staff, reestruturação e delivery com gente no meio.",
  },
  {
    slug: "comercial",
    label: "Comercial",
    pitch: "Gerentes de vendas, território e meta.",
  },
  {
    slug: "operacoes",
    label: "Operações",
    pitch: "Turno, SLA e cadência híbrida.",
  },
  {
    slug: "varejo",
    label: "Varejo",
    pitch: "Loja, encarregado e o que o HQ não vê.",
  },
]

export function getCategory(slug: string) {
  return categories.find((item) => item.slug === slug)
}
