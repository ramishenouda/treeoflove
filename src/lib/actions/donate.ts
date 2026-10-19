'use server'

import { redirect } from 'next/navigation'

import { searchDonationChildren, searchDonationPrograms } from '@/lib/cms'
import { createCheckoutSession } from '@/lib/checkout'
import type { Locale } from '@/lib/i18n'

export async function searchTargets(kind: string, query: string, locale: Locale = 'en') {
  if (kind === 'program') {
    const programs = await searchDonationPrograms(query, locale)
    return programs.map((program) => ({ id: program.id, name: program.title, kind: 'program' as const }))
  }
  if (kind === 'child') {
    const children = await searchDonationChildren(query, locale)
    return children.map((child) => ({ id: child.id, name: child.firstName, kind: 'child' as const }))
  }
  return []
}

export async function startCheckout(
  _previous: { error: string } | null,
  formData: FormData,
): Promise<{ error: string }> {
  const result = await createCheckoutSession(formData)
  if ('url' in result) redirect(result.url)
  return result
}
