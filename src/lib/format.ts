import { defaultLocale, localeTags, type Locale } from '@/lib/i18n'

export function formatDate(value: string, locale: Locale = defaultLocale) {
  return new Intl.DateTimeFormat(localeTags[locale], { dateStyle: 'long', timeZone: 'UTC' }).format(
    new Date(value),
  )
}
