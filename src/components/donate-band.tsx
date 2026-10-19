import { Blob, Sprig } from '@/components/decor'
import { HeartIcon } from '@/components/icons'
import { ButtonLink, Container } from '@/components/ui'
import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'

export function DonateBand({
  locale,
  dictionary,
  title,
  body,
  secondary,
}: {
  locale: Locale
  dictionary: Dictionary
  title?: string
  body?: string
  secondary?: { href: string; label: string }
}) {
  return (
    <section aria-labelledby="donate-band-title">
      <Container>
        <div className="relative overflow-hidden rounded-4xl bg-canopy-900 px-6 py-12 text-paper sm:px-12 lg:flex lg:items-center lg:justify-between lg:gap-10 lg:px-16 lg:py-16">
          <Blob className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 text-canopy-800" />
          <Sprig className="pointer-events-none absolute bottom-6 right-10 hidden h-20 w-20 text-sun-400/40 lg:block" />
          <div className="relative max-w-xl">
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl" id="donate-band-title">
              {title ?? dictionary.donateBand.title}
            </h2>
            <p className="mt-3 text-lg text-canopy-100/85">{body ?? dictionary.donateBand.body}</p>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3 lg:mt-0 lg:shrink-0">
            <ButtonLink href={localizedPath(locale, '/donate')} size="lg" variant="donate">
              <HeartIcon className="h-4 w-4" />
              {dictionary.nav.donate}
            </ButtonLink>
            {secondary ? (
              <ButtonLink href={localizedPath(locale, secondary.href)} size="lg" variant="onDark">
                {secondary.label}
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  )
}
