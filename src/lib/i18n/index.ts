export {
  defaultLocale,
  isLocale,
  localeLabels,
  locales,
  localeTags,
  parseLocale,
  type Locale,
} from '@/lib/i18n/config'
export { getDictionary, t } from '@/lib/i18n/get-dictionary'
export type { Dictionary } from '@/lib/i18n/dictionaries/en'
export { getPathLocale, localizedPath, stripLocale, switchLocalePath } from '@/lib/i18n/path'
export { requireLocale } from '@/lib/i18n/params'
