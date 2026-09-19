const timeZone = "America/Sao_Paulo"

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso))
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function formatTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso))
}

export function formatBRL(cents: number | null) {
  if (cents === null) return "Troca"
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100)
}

export function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 2 || part.length === 1)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}

export function relativeLabel(iso: string) {
  const now = Date.now()
  const then = new Date(iso).getTime()
  const diffMin = Math.round((then - now) / 60000)

  if (Math.abs(diffMin) < 2) return "agora"
  if (diffMin > 0 && diffMin < 60) return `em ${diffMin} min`
  if (diffMin > 0 && diffMin < 60 * 24) return `em ${Math.round(diffMin / 60)} h`
  if (diffMin < 0 && diffMin > -60) return `há ${Math.abs(diffMin)} min`
  if (diffMin < 0 && diffMin > -60 * 24) {
    return `há ${Math.round(Math.abs(diffMin) / 60)} h`
  }
  return formatDateTime(iso)
}
