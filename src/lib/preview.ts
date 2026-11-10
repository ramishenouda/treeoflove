import { defaultLocale, isLocale } from './i18n/config'
import { siteUrl } from './site'

const collectionPaths: Record<string, string> = {
  programs: '/programs/',
  children: '/children/',
  news: '/news/',
  albums: '/gallery/',
}

const globalPaths: Record<string, string> = {
  home: '',
  about: '/about',
  privacy: '/privacy',
}

type Target = {
  collection?: string
  global?: string
  slug?: unknown
  locale?: unknown
}

function localeCode(locale: unknown) {
  const code =
    typeof locale === 'string'
      ? locale
      : locale && typeof locale === 'object' && 'code' in locale
        ? String(locale.code)
        : ''
  return isLocale(code) ? code : defaultLocale
}

/** The public path a document lives at, or null when it has no page (yet). */
export function publicPath({ collection, global, slug, locale }: Target) {
  const prefix = `/${localeCode(locale)}`
  if (global && global in globalPaths) return `${prefix}${globalPaths[global]}`
  if (collection && collection in collectionPaths && typeof slug === 'string' && slug) {
    return `${prefix}${collectionPaths[collection]}${encodeURIComponent(slug)}`
  }
  return null
}

/** URL that switches on preview for a signed-in staff member, then opens the page. */
export function previewUrl(target: Target) {
  const path = publicPath(target)
  if (!path) return null
  return `${siteUrl()}/api/preview?path=${encodeURIComponent(path)}`
}

/** Accept only same-site paths under a known locale. Blocks open redirects such as //evil.com. */
export function safePreviewPath(value: string | null) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\'))
    return null
  const locale = value.split('/')[1]?.split('?')[0] ?? ''
  return isLocale(locale) ? value : null
}

export const livePreviewBreakpoints = [
  { label: 'Phone', name: 'phone', width: 390, height: 844 },
  { label: 'Tablet', name: 'tablet', width: 820, height: 1180 },
  { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
]
