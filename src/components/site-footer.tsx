import type { SiteSetting } from '@/payload-types'
import { Wave } from '@/components/decor'
import { HeartIcon, MailIcon, PhoneIcon, PinIcon } from '@/components/icons'
import { LocaleLink } from '@/components/locale-link'
import { SiteLogo, siteLinks } from '@/components/site-header'
import { ButtonLink, Container } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'

const linkClass = 'text-canopy-100/80 transition hover:text-paper'

export function SiteFooter({
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
    <div className="mt-auto pt-24">
      <Wave className="block h-10 w-full text-canopy-950 sm:h-14" />
      <footer className="bg-canopy-950 text-canopy-100">
        <Container className="grid gap-12 pb-10 pt-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:pt-14">
          <div>
            <SiteLogo locale={locale} settings={settings} tone="light" />
            {settings.tagline ? <p className="mt-4 max-w-xs text-canopy-100/75">{settings.tagline}</p> : null}
            <ButtonLink className="mt-6" href={localizedPath(locale, '/donate')} variant="donate">
              <HeartIcon className="h-4 w-4" />
              {dictionary.nav.donate}
            </ButtonLink>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-sun-300">
              {dictionary.footer.explore}
            </h2>
            <ul className="mt-4 space-y-2.5">
              {links
                .filter((link) => link.href !== '/contact')
                .map((link) => (
                  <li key={link.href}>
                    <LocaleLink className={linkClass} href={link.href} locale={locale}>
                      {link.label}
                    </LocaleLink>
                  </li>
                ))}
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-sun-300">
              {dictionary.footer.getInvolved}
            </h2>
            <ul className="mt-4 space-y-2.5">
              <li>
                <LocaleLink className={linkClass} href="/donate" locale={locale}>
                  {dictionary.nav.donate}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink className={linkClass} href="/contact" locale={locale}>
                  {dictionary.nav.contact}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink className={linkClass} href="/privacy" locale={locale}>
                  {dictionary.nav.privacy}
                </LocaleLink>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-sun-300">
              {dictionary.footer.reachUs}
            </h2>
            <ul className="mt-4 space-y-3">
              {settings.footerLocation ? (
                <li className="flex gap-3">
                  <PinIcon className="mt-0.5 h-5 w-5 shrink-0 text-canopy-300" />
                  <span className="whitespace-pre-line text-canopy-100/80">{settings.footerLocation}</span>
                </li>
              ) : null}
              {settings.footerEmail ? (
                <li className="flex gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-canopy-300" />
                  <a className={`${linkClass} break-all`} href={`mailto:${settings.footerEmail}`}>
                    {settings.footerEmail}
                  </a>
                </li>
              ) : null}
              {settings.footerPhone ? (
                <li className="flex gap-3">
                  <PhoneIcon className="mt-0.5 h-5 w-5 shrink-0 text-canopy-300" />
                  <span className="text-canopy-100/80">{settings.footerPhone}</span>
                </li>
              ) : null}
              <li>
                <LocaleLink className={linkClass} href="/contact" locale={locale}>
                  {dictionary.footer.sendMessage}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </Container>
        <Container className="flex flex-col gap-3 border-t border-paper/10 py-6 text-sm text-canopy-100/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.siteName}
          </p>
          <a className={linkClass} href="/admin">
            {dictionary.footer.staffSignIn}
          </a>
        </Container>
      </footer>
    </div>
  )
}
