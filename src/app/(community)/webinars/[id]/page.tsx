import { WebinarDetail } from "@/components/features/webinar-detail"

export const metadata = {
  title: "Webinar",
}

export default async function WebinarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <WebinarDetail id={id} />
}
