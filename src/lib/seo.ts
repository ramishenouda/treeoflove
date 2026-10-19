import type { Metadata } from 'next'

import type { Media } from '@/payload-types'
import { defaultLocale, locales, localizedPath, type Locale } from '@/lib/i18n'
import { absoluteUrl, siteUrl } from '@/lib/site'
import { isMedia } from '@/lib/cms'

type SeoDoc = {
  title?: string | null
  description?: string | null
  image?: number | Media | null
}

export function pageMetadata({
  title,
  description,
  path,
  locale = defaultLocale,
  image,
  noindex = false,
  type = 'website',
}: {
  title: string
  description?: string | null
  path: string
  locale?: Locale
  image?: Media | null
  noindex?: boolean
  type?: 'website' | 'article'
}): Metadata {
  const localized = localizedPath(locale, path)
  const url = absoluteUrl(localized)
  const imageUrl = image?.url ? absoluteUrl(image.url) : undefined

  return {
    title: { absolute: title },
    description: description || undefined,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(
        locales.map((code) => [code, absoluteUrl(localizedPath(code, path))]),
      ),
    },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true },
    openGraph: {
      title,
      description: description || undefined,
      url,
      locale: locale === 'de' ? 'de_DE' : 'en_GB',
      siteName: 'Tree of Love',
      type,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: image?.alt,
              width: image?.width || undefined,
              height: image?.height || undefined,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description: description || undefined,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export function titleFrom(meta: SeoDoc | null | undefined, fallback: string, siteName: string) {
  return meta?.title?.trim() || `${fallback} | ${siteName}`
}

export function descriptionFrom(meta: SeoDoc | null | undefined, fallback?: string | null) {
  return meta?.description?.trim() || fallback || undefined
}

export function imageFrom(meta: SeoDoc | null | undefined, fallback?: unknown) {
  if (isMedia(meta?.image)) return meta.image
  if (isMedia(fallback)) return fallback
  return null
}

export function organizationJsonLd(settings: {
  siteName: string
  tagline?: string | null
  footerEmail?: string | null
  logo?: unknown
}) {
  const logo = isMedia(settings.logo) && settings.logo.url ? absoluteUrl(settings.logo.url) : undefined
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: settings.siteName,
    url: siteUrl(),
    description: settings.tagline || undefined,
    email: settings.footerEmail || undefined,
    logo,
  }
}
