import type { Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  locale: Locale
}

/** Anchor that prefixes the active locale when needed. */
export function LocaleLink({ href, locale, ...props }: Props) {
  const isExternal = href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:')
  const isAdmin = href.startsWith('/admin')
  const resolved = isExternal || isAdmin ? href : localizedPath(locale, href)
  return <a href={resolved} {...props} />
}
