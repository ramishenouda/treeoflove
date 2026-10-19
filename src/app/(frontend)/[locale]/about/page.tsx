import { ImagePlaceholder } from '@/components/cards'
import { CmsImage } from '@/components/cms-image'
import { Sprig } from '@/components/decor'
import { DonateBand } from '@/components/donate-band'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { RichContent } from '@/components/rich-content'
import { Container, Eyebrow, SectionHeader } from '@/components/ui'
import { getAbout, getSiteSettings, getTeam, isMedia } from '@/lib/cms'
import { getDictionary, requireLocale } from '@/lib/i18n'
import { descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, about, dictionary] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getDictionary(locale),
  ])
  const visible = about?._status === 'published' ? about : null
  return pageMetadata({
    title: titleFrom(visible?.meta, visible?.heading || dictionary.about.fallbackTitle, settings.siteName),
    description: descriptionFrom(visible?.meta, settings.tagline),
    path: '/about',
    locale,
    image: imageFrom(visible?.meta),
  })
}

function StorySection({ title, data }: { title: string; data: unknown }) {
  return (
    <section className="grid gap-6 border-t border-canopy-900/10 pt-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-canopy-950 sm:text-3xl">{title}</h2>
      <div className="max-w-3xl">
        <RichContent className="rich-text rich-text-lg" data={data} />
      </div>
    </section>
  )
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const [settings, about, team] = await Promise.all([
    getSiteSettings(locale),
    getAbout(locale),
    getTeam(locale),
  ])
  const visible = about?._status === 'published' ? about : null

  return (
    <main>
      <PageHero
        description={settings.tagline}
        eyebrow={dictionary.about.eyebrow}
        title={visible?.heading || dictionary.about.fallbackTitle}
      />
      <Container>
        {visible ? (
          <div className="space-y-16">
            {visible.mission ? (
              <section className="relative overflow-hidden rounded-4xl bg-sun-100 px-6 py-10 sm:px-12 sm:py-14">
                <Sprig className="pointer-events-none absolute -right-2 -top-2 h-28 w-28 text-sun-300" />
                <Eyebrow>{dictionary.about.mission}</Eyebrow>
                <h2 className="sr-only">{dictionary.about.mission}</h2>
                <div className="relative mt-5 max-w-3xl">
                  <RichContent className="rich-text rich-text-display" data={visible.mission} />
                </div>
              </section>
            ) : null}
            {visible.story ? <StorySection data={visible.story} title={dictionary.about.ourStory} /> : null}
            {visible.sections?.map((section) => (
              <StorySection key={section.id || section.heading} data={section.body} title={section.heading} />
            ))}
          </div>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.about.fallbackTitle} />
        )}

        <section aria-labelledby="about-team" className="mt-20 lg:mt-28">
          <SectionHeader
            eyebrow={dictionary.about.teamEyebrow}
            id="about-team"
            title={dictionary.about.teamTitle}
          />
          {team.length ? (
            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {team.map((member) => {
                const photo = isMedia(member.photo) ? member.photo : null
                return (
                  <li key={member.id} className="rounded-3xl bg-white p-5 shadow-soft ring-1 ring-canopy-900/5">
                    {photo ? (
                      <CmsImage
                        className="aspect-square w-full rounded-2xl object-cover"
                        media={photo}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : (
                      <ImagePlaceholder className="aspect-[3/2] w-full rounded-2xl" />
                    )}
                    <h3 className="mt-5 font-display text-xl font-semibold text-canopy-950">{member.name}</h3>
                    {member.role ? <p className="text-sm font-semibold text-canopy-600">{member.role}</p> : null}
                    {member.bio ? <p className="mt-3 text-ink/70">{member.bio}</p> : null}
                  </li>
                )
              })}
            </ul>
          ) : (
            <div className="mt-10">
              <EmptyState body={dictionary.common.empty} title={dictionary.about.teamTitle} />
            </div>
          )}
        </section>
      </Container>
      <div className="mt-20 lg:mt-28">
        <DonateBand
          dictionary={dictionary}
          locale={locale}
          secondary={{ href: '/programs', label: dictionary.common.seePrograms }}
        />
      </div>
    </main>
  )
}
