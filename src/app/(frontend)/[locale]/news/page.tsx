import { requireLocale } from '@/lib/i18n'

import { NewsListing, newsMetadata } from './listing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  return newsMetadata(locale, 1)
}

export default async function NewsPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  return <NewsListing locale={locale} page={1} />
}
