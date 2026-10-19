import type { Dictionary } from '@/lib/i18n/dictionaries/en'
import type { Locale } from '@/lib/i18n/config'

const dictionaries: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  en: () => import('@/lib/i18n/dictionaries/en'),
  de: () => import('@/lib/i18n/dictionaries/de'),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const load = dictionaries[locale] ?? dictionaries.en
  return (await load()).default
}

export function t(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  )
}
