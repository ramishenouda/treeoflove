import { requireLocale } from '@/lib/i18n'

import { ChildrenListing, childrenMetadata } from './listing'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; program?: string }>
}) {
  const [locale, { q, program }] = await Promise.all([requireLocale(params), searchParams])
  return childrenMetadata(locale, 1, q, program)
}

export default async function ChildrenPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; program?: string }>
}) {
  const [locale, { q, program }] = await Promise.all([requireLocale(params), searchParams])
  return <ChildrenListing locale={locale} page={1} program={program} q={q} />
}
