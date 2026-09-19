import { ThreadView } from "@/components/community/thread-view"
import { seedState } from "@/lib/seed"
import type { Metadata } from "next"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const post = seedState.posts.find((item) => item.id === id)
  if (!post) return { title: "Conversa" }
  return {
    title: post.title,
    description: post.body.slice(0, 160),
    openGraph: {
      title: `${post.title} · Managerz`,
      description: post.body.slice(0, 160),
    },
  }
}

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ThreadView id={id} />
}
