import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { ChildCard } from '@/components/cards'
import { CmsImage } from '@/components/cms-image'
import { DonateAside } from '@/components/donate-aside'
import { HeartIcon } from '@/components/icons'
import { RichContent } from '@/components/rich-content'
import { ButtonLink, Container, Eyebrow, SectionHeader } from '@/components/ui'
import { getChildrenForProgram, getProgram, getSiteSettings, isMedia } from '@/lib/cms'
import { getDictionary, localizedPath, requireLocale, t } from '@/lib/i18n'
import { descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const [settings, program] = await Promise.all([getSiteSettings(locale), getProgram(slug, locale)])
  if (!program) return {}
  return pageMetadata({
    title: titleFrom(program.meta, program.title, settings.siteName),
    description: descriptionFrom(program.meta, program.summary),
    path: `/programs/${program.slug}`,
    locale,
    image: imageFrom(program.meta, program.cover),
  })
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const dictionary = await getDictionary(locale)
  const program = await getProgram(slug, locale)
  if (!program) notFound()
  const children = await getChildrenForProgram(program.id, locale)
  const cover = isMedia(program.cover) ? program.cover : null
  const donateHref = localizedPath(
    locale,
    program.acceptDonations ? `/donate?program=${program.slug}` : '/donate',
  )

  return (
    <main>
      <Container className="pt-8 sm:pt-10">
        <Breadcrumbs
          ariaLabel={dictionary.common.breadcrumb}
          homeLabel={dictionary.nav.home}
          items={[
            { name: dictionary.nav.programs, path: '/programs' },
            { name: program.title, path: `/programs/${program.slug}` },
          ]}
          locale={locale}
        />
      </Container>
      <Container className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-14">
        <article>
          <Eyebrow>{dictionary.common.program}</Eyebrow>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-canopy-950 sm:text-5xl lg:text-6xl">
            {program.title}
          </h1>
          {program.summary ? (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/75 sm:text-xl">{program.summary}</p>
          ) : null}
          {program.acceptDonations ? (
            <ButtonLink className="mt-7 lg:hidden" href={donateHref} size="lg" variant="donate">
              <HeartIcon className="h-4 w-4" />
              {t(dictionary.donate.donateToName, { name: program.title })}
            </ButtonLink>
          ) : null}
          {cover ? (
            <CmsImage
              className="mt-10 aspect-[16/9] w-full rounded-4xl object-cover shadow-lift"
              media={cover}
              priority
              sizes="(min-width: 1280px) 52rem, (min-width: 1024px) 65vw, 100vw"
            />
          ) : null}
          <div className="mt-10 max-w-3xl">
            <RichContent className="rich-text rich-text-lg" data={program.story} />
          </div>
        </article>
        <div>
          <DonateAside
            dictionary={dictionary}
            href={donateHref}
            name={program.acceptDonations ? program.title : undefined}
          />
        </div>
      </Container>
      {children.length ? (
        <Container className="mt-20 lg:mt-28">
          <section aria-labelledby="program-children">
            <SectionHeader
              eyebrow={dictionary.programs.inThisProgram}
              id="program-children"
              title={dictionary.programs.childrenHeading}
            />
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {children.map((child) => (
                <li key={child.id}>
                  <ChildCard child={child} dictionary={dictionary} locale={locale} />
                </li>
              ))}
            </ul>
          </section>
        </Container>
      ) : null}
    </main>
  )
}
