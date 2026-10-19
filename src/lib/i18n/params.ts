import { notFound } from 'next/navigation'

import { isLocale, type Locale } from '@/lib/i18n/config'

export async function requireLocale(params: Promise<{ locale: string }> | { locale: string }): Promise<Locale> {
  const resolved = await params
  if (!isLocale(resolved.locale)) notFound()
  return resolved.locale
}
