import { notFound } from "next/navigation"

import { ConversationFeed } from "@/components/community/conversation-feed"
import { getCategory } from "@/lib/categories"
import type { CategorySlug } from "@/lib/types"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  return {
    title: category?.label ?? "Categoria",
    description: category?.pitch,
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategory(slug)
  if (!category) notFound()
  return (
    <ConversationFeed
      category={category.slug as CategorySlug}
      heading={category.label}
      description={category.pitch}
    />
  )
}
