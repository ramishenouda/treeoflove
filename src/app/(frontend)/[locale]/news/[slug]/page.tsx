import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { CmsImage } from '@/components/cms-image'
import { DonateBand } from '@/components/donate-band'
import { ArrowRightIcon } from '@/components/icons'
import { JsonLd } from '@/components/json-ld'
import { RichContent } from '@/components/rich-content'
import { Container } from '@/components/ui'
import { getNewsArticle, getSiteSettings, isMedia } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import { getDictionary, localizedPath, requireLocale } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site'
import { descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const [settings, article] = await Promise.all([getSiteSettings(locale), getNewsArticle(slug, locale)])
  if (!article) return {}
  return pageMetadata({
    title: titleFrom(article.meta, article.title, settings.siteName),
    description: descriptionFrom(article.meta, article.summary),
    path: `/news/${article.slug}`,
    locale,
    image: imageFrom(article.meta, article.cover),
    type: 'article',
  })
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const dictionary = await getDictionary(locale)
  const [settings, article] = await Promise.all([getSiteSettings(locale), getNewsArticle(slug, locale)])
  if (!article) notFound()
  const cover = isMedia(article.cover) ? article.cover : null
  const image = imageFrom(article.meta, article.cover)

  return (
    <main>
      <article>
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'NewsArticle',
            headline: article.title,
            datePublished: article.publishedOn,
            description: article.summary || undefined,
            image: image?.url ? absoluteUrl(image.url) : undefined,
            inLanguage: locale,
            mainEntityOfPage: absoluteUrl(localizedPath(locale, `/news/${article.slug}`)),
            publisher: {
              '@type': 'Organization',
              name: settings.siteName,
            },
          }}
        />
        <Container className="max-w-3xl pt-8 sm:pt-10">
          <Breadcrumbs
            ariaLabel={dictionary.common.breadcrumb}
            homeLabel={dictionary.nav.home}
            items={[
              { name: dictionary.nav.news, path: '/news' },
              { name: article.title, path: `/news/${article.slug}` },
            ]}
            locale={locale}
          />
          <time
            className="mt-10 inline-flex rounded-full bg-sun-100 px-3.5 py-1.5 text-sm font-semibold text-canopy-900"
            dateTime={article.publishedOn}
          >
            {formatDate(article.publishedOn, locale)}
          </time>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.08] tracking-tight text-canopy-950 sm:text-5xl lg:text-6xl">
            {article.title}
          </h1>
          {article.summary ? <p className="mt-5 text-xl leading-relaxed text-ink/75">{article.summary}</p> : null}
        </Container>
        {cover ? (
          <Container className="mt-10 max-w-5xl">
            <CmsImage
              className="aspect-[16/9] w-full rounded-4xl object-cover shadow-lift"
              media={cover}
              priority
              sizes="(min-width: 1024px) 64rem, 100vw"
            />
          </Container>
        ) : null}
        <Container className="mt-10 max-w-3xl">
          <RichContent className="rich-text rich-text-lg" data={article.body} />
          <a
            className="group mt-12 inline-flex items-center gap-1.5 text-sm font-semibold text-canopy-700 hover:text-canopy-950"
            href={localizedPath(locale, '/news')}
          >
            {dictionary.home.newsMore}{' '}
            <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
          </a>
        </Container>
      </article>
      <div className="mt-20">
        <DonateBand dictionary={dictionary} locale={locale} />
      </div>
    </main>
  )
}
