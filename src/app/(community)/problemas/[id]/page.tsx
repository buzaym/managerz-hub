import { ProblemDetail } from "@/components/features/problem-detail"

export const metadata = {
  title: "Problema",
}

export default async function ProblemPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <ProblemDetail id={id} />
}
