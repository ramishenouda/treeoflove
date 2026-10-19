import { notFound } from 'next/navigation'

import { ProgramCard } from '@/components/cards'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { SearchForm } from '@/components/search-form'
import { Container } from '@/components/ui'
import { getPrograms, getSiteSettings } from '@/lib/cms'
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n'
import { descriptionFrom, pageMetadata, titleFrom } from '@/lib/seo'
import { listPath } from '@/lib/site'

export async function programsMetadata(locale: Locale, page: number, q?: string) {
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  const suffix = page > 1 ? ` — ${dictionary.common.page} ${page}` : ''
  return pageMetadata({
    title: titleFrom(null, `${dictionary.programs.title}${suffix}`, settings.siteName),
    description: descriptionFrom(null, dictionary.programs.description),
    path: listPath('/programs', page),
    locale,
    noindex: Boolean(q),
  })
}

export async function ProgramsListing({
  locale,
  page,
  q,
}: {
  locale: Locale
  page: number
  q?: string
}) {
  if (!Number.isFinite(page) || page < 1) notFound()
  const dictionary = await getDictionary(locale)
  const result = await getPrograms({ page, q, locale })
  if (page > 1 && page > result.totalPages) notFound()
  const term = q?.trim()

  return (
    <main>
      <PageHero
        description={dictionary.programs.description}
        eyebrow={dictionary.programs.eyebrow}
        title={dictionary.programs.title}
      >
        <SearchForm
          action={localizedPath(locale, '/programs')}
          defaultValue={term}
          id="program-search"
          label={dictionary.programs.searchPlaceholder}
          placeholder={dictionary.programs.searchPlaceholder}
          submitLabel={dictionary.common.search}
        />
        {term ? (
          <p className="mt-4 text-sm text-ink/65">
            “{term}” ·{' '}
            <a
              className="font-semibold text-canopy-700 underline-offset-4 hover:underline"
              href={localizedPath(locale, '/programs')}
            >
              {dictionary.common.search}
            </a>
          </p>
        ) : null}
      </PageHero>
      <Container>
        {result.docs.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.docs.map((program) => (
              <li key={program.id}>
                <ProgramCard dictionary={dictionary} level={2} locale={locale} program={program} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.programs.title} />
        )}
        <Pagination
          base="/programs"
          dictionary={dictionary}
          locale={locale}
          page={result.page || page}
          params={{ q: term }}
          totalPages={result.totalPages}
        />
      </Container>
    </main>
  )
}
