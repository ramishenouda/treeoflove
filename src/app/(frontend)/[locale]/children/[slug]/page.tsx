import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { ImagePlaceholder } from '@/components/cards'
import { CmsImage } from '@/components/cms-image'
import { Blob } from '@/components/decor'
import { DonateAside } from '@/components/donate-aside'
import { LeafIcon } from '@/components/icons'
import { Container } from '@/components/ui'
import { getChild, getSiteSettings, isMedia } from '@/lib/cms'
import { getDictionary, localizedPath, requireLocale, t } from '@/lib/i18n'
import { descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'
import type { Program } from '@/payload-types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const [settings, child] = await Promise.all([getSiteSettings(locale), getChild(slug, locale)])
  if (!child) return {}
  return pageMetadata({
    title: titleFrom(child.meta, child.firstName, settings.siteName),
    description: descriptionFrom(child.meta, child.shortStory),
    path: `/children/${child.slug}`,
    locale,
    image: imageFrom(child.meta, child.photo),
  })
}

export default async function ChildPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const dictionary = await getDictionary(locale)
  const child = await getChild(slug, locale)
  if (!child) notFound()
  const photo = isMedia(child.photo) ? child.photo : null
  const program = child.program && typeof child.program === 'object' ? (child.program as Program) : null

  return (
    <main>
      <Container className="pt-8 sm:pt-10">
        <Breadcrumbs
          ariaLabel={dictionary.common.breadcrumb}
          homeLabel={dictionary.nav.home}
          items={[
            { name: dictionary.nav.children, path: '/children' },
            { name: child.firstName, path: `/children/${child.slug}` },
          ]}
          locale={locale}
        />
      </Container>
      <Container className="mt-8 grid items-start gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-20">
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <Blob className="absolute -inset-10 translate-x-8 translate-y-8 text-sun-200" />
          <figure className="relative -rotate-2 rounded-4xl bg-white p-2.5 shadow-lift">
            {photo ? (
              <CmsImage
                className="aspect-[4/5] w-full rounded-[1.6rem] object-cover"
                media={photo}
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            ) : (
              <ImagePlaceholder className="aspect-[4/5] w-full rounded-[1.6rem]" />
            )}
          </figure>
        </div>
        <article className="md:pt-6">
          <div className="flex flex-wrap gap-2">
            {program ? (
              <a
                className="inline-flex items-center gap-1.5 rounded-full bg-canopy-50 px-3.5 py-1.5 text-sm font-semibold text-canopy-800 hover:bg-canopy-100"
                href={localizedPath(locale, `/programs/${program.slug}`)}
              >
                <LeafIcon className="h-4 w-4" />
                {program.title}
              </a>
            ) : null}
            {typeof child.age === 'number' ? (
              <span className="inline-flex items-center rounded-full bg-sun-100 px-3.5 py-1.5 text-sm font-semibold text-canopy-900">
                {t(dictionary.common.age, { age: child.age })}
              </span>
            ) : null}
          </div>
          <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-canopy-950 sm:text-6xl lg:text-7xl">
            {child.firstName}
          </h1>
          {child.shortStory ? (
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/80">{child.shortStory}</p>
          ) : null}
          <div className="mt-10 max-w-md">
            <DonateAside
              dictionary={dictionary}
              href={localizedPath(
                locale,
                child.acceptDonations ? `/donate?child=${child.slug}` : '/donate',
              )}
              name={child.acceptDonations ? child.firstName : undefined}
              sticky={false}
            />
          </div>
        </article>
      </Container>
    </main>
  )
}
