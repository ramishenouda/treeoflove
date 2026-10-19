import type { SiteSetting } from '@/payload-types'
import { CmsImage } from '@/components/cms-image'
import { TreeMark } from '@/components/decor'
import { HeartIcon, MenuIcon } from '@/components/icons'
import { LanguageSwitcher } from '@/components/language-switcher'
import { LocaleLink } from '@/components/locale-link'
import { ButtonLink, Container, buttonClass } from '@/components/ui'
import { isMedia } from '@/lib/cms'
import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'

export function siteLinks(dictionary: Dictionary) {
  return [
    { href: '/about', label: dictionary.nav.about },
    { href: '/programs', label: dictionary.nav.programs },
    { href: '/children', label: dictionary.nav.children },
    { href: '/news', label: dictionary.nav.news },
    { href: '/gallery', label: dictionary.nav.gallery },
    { href: '/contact', label: dictionary.nav.contact },
  ]
}

export function SiteLogo({
  settings,
  locale,
  tone = 'dark',
}: {
  settings: SiteSetting
  locale: Locale
  tone?: 'dark' | 'light'
}) {
  const logo = isMedia(settings.logo) ? settings.logo : null
  return (
    <LocaleLink className="flex min-w-0 items-center gap-3" href="/" locale={locale}>
      {logo ? (
        <CmsImage className="h-10 w-10 shrink-0 rounded-full object-cover" media={logo} sizes="40px" />
      ) : (
        <TreeMark className="h-10 w-10 shrink-0" />
      )}
      <span className="min-w-0">
        <span
          className={`block truncate font-display text-lg font-semibold leading-tight tracking-tight ${
            tone === 'dark' ? 'text-canopy-950' : 'text-paper'
          }`}
        >
          {settings.siteName}
        </span>
        {settings.tagline && tone === 'dark' ? (
          <span className="hidden truncate text-xs text-ink/60 xl:block">{settings.tagline}</span>
        ) : null}
      </span>
    </LocaleLink>
  )
}

export function SiteHeader({
  settings,
  locale,
  dictionary,
}: {
  settings: SiteSetting
  locale: Locale
  dictionary: Dictionary
}) {
  const links = siteLinks(dictionary)

  return (
    <header className="sticky top-0 z-40 border-b border-canopy-900/5 bg-paper/85 backdrop-blur-md">
      <Container className="flex h-18 items-center justify-between gap-4">
        <SiteLogo locale={locale} settings={settings} />
        <nav aria-label={dictionary.nav.primary} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <LocaleLink
              key={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/75 transition hover:bg-canopy-50 hover:text-canopy-900"
              href={link.href}
              locale={locale}
            >
              {link.label}
            </LocaleLink>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher className="hidden sm:flex" locale={locale} />
          <ButtonLink className="px-4 sm:px-5" href={localizedPath(locale, '/donate')} variant="donate">
            <HeartIcon className="h-4 w-4" />
            {dictionary.nav.donate}
          </ButtonLink>
          <details className="relative lg:hidden">
            <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-full bg-white text-canopy-900 ring-1 ring-canopy-900/10 [&::-webkit-details-marker]:hidden">
              <MenuIcon />
              <span className="sr-only">{dictionary.nav.menu}</span>
            </summary>
            <nav
              aria-label={dictionary.nav.mobile}
              className="absolute right-0 mt-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-3xl bg-white p-3 shadow-lift ring-1 ring-canopy-900/5"
            >
              <div className="flex flex-col">
                {links.map((link) => (
                  <LocaleLink
                    key={link.href}
                    className="rounded-2xl px-4 py-3 text-base font-medium text-canopy-950 hover:bg-canopy-50"
                    href={link.href}
                    locale={locale}
                  >
                    {link.label}
                  </LocaleLink>
                ))}
                <LanguageSwitcher className="mt-2 px-2" locale={locale} />
                <a className={buttonClass('donate', 'lg', 'mt-2')} href={localizedPath(locale, '/donate')}>
                  <HeartIcon className="h-4 w-4" />
                  {dictionary.nav.donate}
                </a>
              </div>
            </nav>
          </details>
        </div>
      </Container>
    </header>
  )
}
