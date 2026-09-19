export function shareCopy(title: string, url: string) {
  return `${title}\n\nUma conversa na Managerz — a comunidade onde country managers, product managers e business development managers se conectam, votam e se ajudam.\n\n${url}`
}

export function twitterShareUrl(title: string, url: string) {
  const text = `${title} — Managerz, a comunidade de gestores.`
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
}

export function linkedinShareUrl(url: string) {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
}
