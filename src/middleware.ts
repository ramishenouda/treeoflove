import { NextRequest, NextResponse } from 'next/server'

import { defaultLocale, isLocale, locales, type Locale } from '@/lib/i18n/config'

const PUBLIC_FILE = /\.[^/]+$/

function negotiateLocale(request: NextRequest): Locale {
  const header = request.headers.get('accept-language')
  if (!header) return defaultLocale

  const preferred = header
    .split(',')
    .map((part) => {
      const [tag, qValue] = part.trim().split(';')
      const quality = qValue?.startsWith('q=') ? Number(qValue.slice(2)) : 1
      return { tag: tag.toLowerCase(), quality: Number.isFinite(quality) ? quality : 0 }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { tag } of preferred) {
    const exact = locales.find((locale) => locale === tag)
    if (exact) return exact
    const base = tag.split('-')[0]
    const match = locales.find((locale) => locale === base)
    if (match) return match
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next()
  }

  const segments = pathname.split('/')
  const maybeLocale = segments[1]

  if (isLocale(maybeLocale || '')) {
    const response = NextResponse.next()
    response.headers.set('x-locale', maybeLocale)
    return response
  }

  const locale = negotiateLocale(request)
  const url = request.nextUrl.clone()
  url.pathname = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
