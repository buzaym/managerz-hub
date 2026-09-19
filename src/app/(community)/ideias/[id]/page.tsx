import { IdeaDetail } from "@/components/features/idea-detail"

export const metadata = {
  title: "Ideia",
}

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <IdeaDetail id={id} />
}
