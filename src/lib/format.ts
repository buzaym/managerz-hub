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

export function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 2 || part.length === 1)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
}
