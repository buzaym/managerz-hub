import { ListingDetail } from "@/components/features/listing-detail"

export const metadata = {
  title: "Anúncio",
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ListingDetail id={id} />
}
