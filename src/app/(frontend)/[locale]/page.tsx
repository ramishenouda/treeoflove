import { ChildCard, NewsCard, ProgramCard } from '@/components/cards'
import { CmsImage } from '@/components/cms-image'
import { Blob, Squiggle } from '@/components/decor'
import { DonateBand } from '@/components/donate-band'
import { EmptyState } from '@/components/empty-state'
import { ArrowRightIcon, HeartIcon } from '@/components/icons'
import { JsonLd } from '@/components/json-ld'
import { PhotoCollage } from '@/components/photo-collage'
import { RichContent } from '@/components/rich-content'
import { ButtonLink, Container, Eyebrow, SectionHeader, TextLink } from '@/components/ui'
import { getChildren, getHome, getNewsList, getPrograms, getSiteSettings, isMedia } from '@/lib/cms'
import { getDictionary, localizedPath, requireLocale } from '@/lib/i18n'
import { organizationJsonLd, descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'
import { siteUrl } from '@/lib/site'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, home] = await Promise.all([getSiteSettings(locale), getHome(locale)])
  const visible = home?._status === 'published' ? home : null
  return pageMetadata({
    title: titleFrom(visible?.meta, visible?.heading || settings.siteName, settings.siteName),
    description: descriptionFrom(visible?.meta, visible?.intro || settings.tagline),
    path: '/',
    locale,
    image: imageFrom(visible?.meta, isMedia(settings.logo) ? settings.logo : null),
  })
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const [settings, home, programs, children, news] = await Promise.all([
    getSiteSettings(locale),
    getHome(locale),
    getPrograms({ page: 1, locale }),
    getChildren({ page: 1, locale }),
    getNewsList({ page: 1, locale }),
  ])
  const visible = home?._status === 'published' ? home : null
  const heading = visible?.heading
  const intro = visible?.intro
  const sections = visible?.sections
  const collage = [...(sections ?? []).map((section) => section.image), ...programs.docs.map((program) => program.cover)]
    .filter(isMedia)
    .slice(0, 3)

  const facts: { value: string; label: string }[] = [
    ...(programs.totalDocs
      ? [
          {
            value: String(programs.totalDocs),
            label: programs.totalDocs === 1 ? dictionary.common.program : dictionary.common.programs,
          },
        ]
      : []),
    ...(children.totalDocs
      ? [{ value: String(children.totalDocs), label: dictionary.common.childrensStories }]
      : []),
    { value: dictionary.common.onceOrMonthly, label: dictionary.common.giftsInEuros },
    { value: dictionary.common.cardOrSepa, label: dictionary.common.paidThroughStripe },
  ]

  return (
    <main>
      <JsonLd data={organizationJsonLd(settings)} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: settings.siteName,
          url: siteUrl(),
          description: settings.tagline || undefined,
          inLanguage: locale,
        }}
      />

      <section className="hero-wash relative overflow-hidden">
        <Container className="relative grid items-center gap-12 pb-14 pt-12 sm:pt-16 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-20">
          <div>
            <Eyebrow>{settings.siteName}</Eyebrow>
            <h1 className="mt-5 font-display text-[2.6rem] font-semibold leading-[1.02] tracking-tight text-canopy-950 sm:text-6xl lg:text-7xl">
              {heading || settings.siteName}
            </h1>
            <Squiggle className="mt-5 h-3 w-36 text-sun-400" />
            {intro ? (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">{intro}</p>
            ) : settings.tagline ? (
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">{settings.tagline}</p>
            ) : null}
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href={localizedPath(locale, '/donate')} size="lg" variant="donate">
                <HeartIcon className="h-4 w-4" />
                {dictionary.nav.donate}
              </ButtonLink>
              <ButtonLink href={localizedPath(locale, '/programs')} size="lg" variant="outline">
                {dictionary.home.seePrograms}
                <ArrowRightIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
          </div>
          <PhotoCollage images={collage} />
        </Container>
      </section>

      <Container className="relative -mt-2">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-canopy-900/5 shadow-soft ring-1 ring-canopy-900/5 lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-white px-5 py-6 sm:px-7">
              <dt className="text-sm text-ink/60">{fact.label}</dt>
              <dd className="mt-1 font-display text-lg font-semibold text-canopy-900 sm:text-xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </Container>

      {sections?.length ? (
        <Container className="mt-20 space-y-20 lg:mt-28 lg:space-y-28">
          {sections.map((section, index) => {
            const image = isMedia(section.image) ? section.image : null
            if (!image) {
              return (
                <section key={section.id || section.heading} className="max-w-3xl">
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-canopy-950 sm:text-4xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5">
                    <RichContent data={section.body} />
                  </div>
                </section>
              )
            }
            return (
              <section key={section.id || section.heading} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <div className={`relative ${index % 2 ? 'lg:order-2' : ''}`}>
                  <Blob className="absolute -inset-8 translate-x-6 translate-y-6 text-canopy-100" />
                  <CmsImage
                    className="relative aspect-[4/3] w-full rounded-4xl object-cover shadow-lift"
                    media={image}
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-semibold tracking-tight text-canopy-950 sm:text-4xl">
                    {section.heading}
                  </h2>
                  <div className="mt-5">
                    <RichContent className="rich-text rich-text-lg" data={section.body} />
                  </div>
                </div>
              </section>
            )
          })}
        </Container>
      ) : null}

      <Container className="mt-20 lg:mt-28">
        <section aria-labelledby="home-programs">
          <SectionHeader
            action={
              <TextLink href={localizedPath(locale, '/programs')}>
                {dictionary.home.programsMore}{' '}
                <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </TextLink>
            }
            eyebrow={dictionary.home.programsEyebrow}
            id="home-programs"
            title={dictionary.home.programsTitle}
          />
          {programs.docs.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.docs.slice(0, 3).map((program) => (
                <li key={program.id}>
                  <ProgramCard dictionary={dictionary} locale={locale} program={program} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState body={dictionary.common.empty} title={dictionary.common.programs} />
            </div>
          )}
        </section>
      </Container>

      {children.docs.length ? (
        <Container className="mt-20 lg:mt-28">
          <section aria-labelledby="home-children">
            <SectionHeader
              action={
                <TextLink href={localizedPath(locale, '/children')}>
                  {dictionary.home.childrenMore}{' '}
                  <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
                </TextLink>
              }
              eyebrow={dictionary.home.childrenEyebrow}
              id="home-children"
              title={dictionary.home.childrenTitle}
            />
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {children.docs.slice(0, 4).map((child) => (
                <li key={child.id}>
                  <ChildCard child={child} dictionary={dictionary} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        </Container>
      ) : null}

      <div className="mt-20 lg:mt-28">
        <DonateBand
          dictionary={dictionary}
          locale={locale}
          secondary={{ href: '/children', label: dictionary.common.meetTheChildren }}
        />
      </div>

      <Container className="mt-20 lg:mt-28">
        <section aria-labelledby="home-news">
          <SectionHeader
            action={
              <TextLink href={localizedPath(locale, '/news')}>
                {dictionary.home.newsMore} <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
              </TextLink>
            }
            eyebrow={dictionary.home.newsEyebrow}
            id="home-news"
            title={dictionary.home.newsTitle}
          />
          {news.docs.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {news.docs.slice(0, 3).map((article) => (
                <li key={article.id}>
                  <NewsCard article={article} dictionary={dictionary} locale={locale} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState body={dictionary.common.empty} title={dictionary.common.news} />
            </div>
          )}
        </section>
      </Container>
    </main>
  )
}
