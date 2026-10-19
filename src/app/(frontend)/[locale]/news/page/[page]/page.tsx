import { notFound, redirect } from 'next/navigation'

import { localizedPath, requireLocale } from '@/lib/i18n'
import { parsePage } from '@/lib/site'

import { NewsListing, newsMetadata } from '../../listing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale: raw, page } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) return {}
  return newsMetadata(locale, pageNumber)
}

export default async function NewsPaged({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale: raw, page } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) notFound()
  if (pageNumber === 1) redirect(localizedPath(locale, '/news'))
  return <NewsListing locale={locale} page={pageNumber} />
}
