import { notFound, redirect } from 'next/navigation'

import { localizedPath, requireLocale } from '@/lib/i18n'
import { listPath, parsePage } from '@/lib/site'

import { ChildrenListing, childrenMetadata } from '../../listing'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; page: string }>
  searchParams: Promise<{ q?: string; program?: string }>
}) {
  const [{ locale: raw, page }, query] = await Promise.all([params, searchParams])
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) return {}
  return childrenMetadata(locale, pageNumber, query.q, query.program)
}

export default async function ChildrenPaged({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; page: string }>
  searchParams: Promise<{ q?: string; program?: string }>
}) {
  const [{ locale: raw, page }, query] = await Promise.all([params, searchParams])
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const pageNumber = parsePage(page)
  if (!Number.isFinite(pageNumber)) notFound()
  if (pageNumber === 1) redirect(localizedPath(locale, listPath('/children', 1, query)))
  return <ChildrenListing locale={locale} page={pageNumber} program={query.program} q={query.q} />
}
