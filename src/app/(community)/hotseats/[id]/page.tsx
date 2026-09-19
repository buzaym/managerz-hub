import { HotseatDetail } from "@/components/features/hotseat-detail"

export const metadata = {
  title: "Hotseat",
}

export default async function HotseatPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <HotseatDetail id={id} />
}
