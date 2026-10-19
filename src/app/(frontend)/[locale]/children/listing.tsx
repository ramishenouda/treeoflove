import { notFound } from 'next/navigation'

import { ChildCard } from '@/components/cards'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { SearchForm } from '@/components/search-form'
import { Container, chipClass } from '@/components/ui'
import { getChildren, getProgram, getProgramOptions, getSiteSettings } from '@/lib/cms'
import { getDictionary, localizedPath, type Locale } from '@/lib/i18n'
import { descriptionFrom, pageMetadata, titleFrom } from '@/lib/seo'
import { listPath } from '@/lib/site'

export async function childrenMetadata(locale: Locale, page: number, q?: string, program?: string) {
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  const suffix = page > 1 ? ` — ${dictionary.common.page} ${page}` : ''
  return pageMetadata({
    title: titleFrom(null, `${dictionary.children.title}${suffix}`, settings.siteName),
    description: descriptionFrom(null, dictionary.children.description),
    path: listPath('/children', page),
    locale,
    noindex: Boolean(q || program),
  })
}

export async function ChildrenListing({
  locale,
  page,
  q,
  program,
}: {
  locale: Locale
  page: number
  q?: string
  program?: string
}) {
  if (!Number.isFinite(page) || page < 1) notFound()
  const dictionary = await getDictionary(locale)
  const [programMatch, programList] = await Promise.all([
    program ? getProgram(program, locale) : Promise.resolve(null),
    getProgramOptions(locale),
  ])
  if (program && !programMatch) notFound()
  const result = await getChildren({ page, q, programId: programMatch?.id, locale })
  if (page > 1 && page > result.totalPages) notFound()
  const term = q?.trim()

  return (
    <main>
      <PageHero
        description={dictionary.children.description}
        eyebrow={dictionary.children.eyebrow}
        title={dictionary.children.title}
      >
        <SearchForm
          action={localizedPath(locale, '/children')}
          defaultValue={term}
          hidden={{ program }}
          id="child-search"
          label={dictionary.children.searchPlaceholder}
          placeholder={dictionary.children.searchPlaceholder}
          submitLabel={dictionary.common.search}
        />
        {programList.length ? (
          <nav aria-label={dictionary.common.programs} className="mt-5 flex flex-wrap gap-2">
            <a
              className={chipClass(!program)}
              href={localizedPath(locale, listPath('/children', 1, { q: term }))}
            >
              {dictionary.children.allPrograms}
            </a>
            {programList.map((item) => (
              <a
                key={item.id}
                aria-current={program === item.slug ? 'true' : undefined}
                className={chipClass(program === item.slug)}
                href={localizedPath(locale, listPath('/children', 1, { program: item.slug, q: term }))}
              >
                {item.title}
              </a>
            ))}
          </nav>
        ) : null}
      </PageHero>
      <Container>
        {result.docs.length ? (
          <ul className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {result.docs.map((child) => (
              <li key={child.id}>
                <ChildCard child={child} dictionary={dictionary} level={2} locale={locale} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.children.title} />
        )}
        <Pagination
          base="/children"
          dictionary={dictionary}
          locale={locale}
          page={result.page || page}
          params={{ q: term, program }}
          totalPages={result.totalPages}
        />
      </Container>
    </main>
  )
}
