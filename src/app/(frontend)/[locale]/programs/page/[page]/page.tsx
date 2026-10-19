import { notFound, redirect } from 'next/navigation'

import { localizedPath, requireLocale } from '@/lib/i18n'
import { parsePage } from '@/lib/site'

import { ProgramsListing, programsMetadata } from '../../listing'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; page: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const [{ locale: raw, page }, { q }] = await Promise.all([params, searchParams])
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) return {}
  return programsMetadata(locale, pageNumber, q)
}

export default async function ProgramsPaged({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; page: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const [{ locale: raw, page }, { q }] = await Promise.all([params, searchParams])
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) notFound()
  if (pageNumber === 1) {
    redirect(localizedPath(locale, q ? `/programs?q=${encodeURIComponent(q)}` : '/programs'))
  }
  return <ProgramsListing locale={locale} page={pageNumber} q={q} />
}
