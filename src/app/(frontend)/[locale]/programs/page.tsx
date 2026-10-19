import { requireLocale } from '@/lib/i18n'

import { ProgramsListing, programsMetadata } from './listing'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const [locale, { q }] = await Promise.all([requireLocale(params), searchParams])
  return programsMetadata(locale, 1, q)
}

export default async function ProgramsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const [locale, { q }] = await Promise.all([requireLocale(params), searchParams])
  return <ProgramsListing locale={locale} page={1} q={q} />
}
