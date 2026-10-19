import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { RichContent } from '@/components/rich-content'
import { Container } from '@/components/ui'
import { getPrivacy, getSiteSettings } from '@/lib/cms'
import { getDictionary, requireLocale } from '@/lib/i18n'
import { descriptionFrom, imageFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, privacy, dictionary] = await Promise.all([
    getSiteSettings(locale),
    getPrivacy(locale),
    getDictionary(locale),
  ])
  const visible = privacy?._status === 'published' ? privacy : null
  return pageMetadata({
    title: titleFrom(visible?.meta, visible?.title || dictionary.privacy.fallbackTitle, settings.siteName),
    description: descriptionFrom(visible?.meta, dictionary.privacy.fallbackTitle),
    path: '/privacy',
    locale,
    image: imageFrom(visible?.meta),
  })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const privacy = await getPrivacy(locale)
  const visible = privacy?._status === 'published' ? privacy : null

  return (
    <main>
      <PageHero
        eyebrow={dictionary.nav.privacy}
        title={visible?.title || dictionary.privacy.fallbackTitle}
      />
      <Container className="max-w-4xl">
        {visible?.body ? (
          <div className="rounded-4xl bg-white px-6 py-10 shadow-soft ring-1 ring-canopy-900/5 sm:px-12 sm:py-14">
            <RichContent data={visible.body} />
          </div>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.privacy.fallbackTitle} />
        )}
      </Container>
    </main>
  )
}
