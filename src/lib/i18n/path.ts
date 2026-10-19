import { isLocale, type Locale } from '@/lib/i18n/config'

/** Strip a leading locale segment from a pathname. */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/')
  if (segments.length > 1 && isLocale(segments[1])) {
    const rest = segments.slice(2).join('/')
    return rest ? `/${rest}` : '/'
  }
  return pathname || '/'
}

/** Build a public pathname for a locale. Every locale is prefixed. */
export function localizedPath(locale: Locale, path = '/'): string {
  const [pathname, query = ''] = path.split('?')
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`
  const base = normalized === '/' ? `/${locale}` : `/${locale}${normalized}`
  return query ? `${base}?${query}` : base
}

/** Swap the locale on the current public pathname. */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  return localizedPath(nextLocale, stripLocale(pathname))
}

export function getPathLocale(pathname: string): Locale | null {
  const segment = pathname.split('/')[1]
  return segment && isLocale(segment) ? segment : null
}
