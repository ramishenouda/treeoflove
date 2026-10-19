import { notFound } from 'next/navigation'

import { NewsCard } from '@/components/cards'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { Pagination } from '@/components/pagination'
import { Container } from '@/components/ui'
import { getNewsList, getSiteSettings } from '@/lib/cms'
import { getDictionary, t, type Locale } from '@/lib/i18n'
import { descriptionFrom, pageMetadata, titleFrom } from '@/lib/seo'

export { formatDate } from '@/lib/format'

export async function newsMetadata(locale: Locale, page: number) {
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  const suffix = page > 1 ? ` — ${dictionary.common.page} ${page}` : ''
  return pageMetadata({
    title: titleFrom(null, `${dictionary.news.title}${suffix}`, settings.siteName),
    description: descriptionFrom(null, t(dictionary.news.description, { siteName: settings.siteName })),
    path: page <= 1 ? '/news' : `/news/page/${page}`,
    locale,
  })
}

export async function NewsListing({ locale, page }: { locale: Locale; page: number }) {
  if (!Number.isFinite(page) || page < 1) notFound()
  const dictionary = await getDictionary(locale)
  const [settings, result] = await Promise.all([
    getSiteSettings(locale),
    getNewsList({ page, locale }),
  ])
  if (page > 1 && page > result.totalPages) notFound()
  const [first, ...rest] = result.docs
  const featured = page === 1 && first

  return (
    <main>
      <PageHero
        description={t(dictionary.news.description, { siteName: settings.siteName })}
        eyebrow={dictionary.news.eyebrow}
        title={dictionary.news.title}
      />
      <Container>
        {result.docs.length ? (
          <>
            {featured ? (
              <div className="mb-6">
                <NewsCard article={first} dictionary={dictionary} featured level={2} locale={locale} />
              </div>
            ) : null}
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(featured ? rest : result.docs).map((article) => (
                <li key={article.id}>
                  <NewsCard article={article} dictionary={dictionary} level={2} locale={locale} />
                </li>
              ))}
            </ul>
          </>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.news.title} />
        )}
        <Pagination
          base="/news"
          dictionary={dictionary}
          locale={locale}
          page={result.page || page}
          totalPages={result.totalPages}
        />
      </Container>
    </main>
  )
}
