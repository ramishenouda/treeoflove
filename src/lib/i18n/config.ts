export const locales = ['en', 'de'] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeLabels: Record<Locale, string> = {
  en: 'English',
  de: 'Deutsch',
}

/** BCP 47 tags for dates, numbers, and Stripe Checkout. */
export const localeTags: Record<Locale, string> = {
  en: 'en-GB',
  de: 'de',
}

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function parseLocale(value: string | undefined | null): Locale {
  if (value && isLocale(value)) return value
  return defaultLocale
}
