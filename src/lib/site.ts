export const PAGE_SIZE = 12

export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return value.replace(/\/$/, '')
}

export function absoluteUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) return path
  return `${siteUrl()}${path.startsWith('/') ? path : `/${path}`}`
}

export function parsePage(value: string | undefined) {
  if (!value || !/^[1-9]\d*$/.test(value)) return Number.NaN
  return Number(value)
}

export function listPath(base: string, page: number, params?: Record<string, string | undefined>) {
  const path = page <= 1 ? base : `${base}/page/${page}`
  const search = new URLSearchParams()
  for (const [key, entry] of Object.entries(params ?? {})) {
    if (entry) search.set(key, entry)
  }
  const query = search.toString()
  return query ? `${path}?${query}` : path
}
