import { AlbumCard } from '@/components/cards'
import { EmptyState } from '@/components/empty-state'
import { PageHero } from '@/components/page-hero'
import { Container } from '@/components/ui'
import { getAlbums, getSiteSettings } from '@/lib/cms'
import { getDictionary, requireLocale, t } from '@/lib/i18n'
import { descriptionFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  return pageMetadata({
    title: titleFrom(null, dictionary.gallery.title, settings.siteName),
    description: descriptionFrom(null, t(dictionary.gallery.description, { siteName: settings.siteName })),
    path: '/gallery',
    locale,
  })
}

export default async function GalleryPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const [settings, albums] = await Promise.all([getSiteSettings(locale), getAlbums(locale)])

  return (
    <main>
      <PageHero
        description={t(dictionary.gallery.description, { siteName: settings.siteName })}
        eyebrow={dictionary.gallery.eyebrow}
        title={dictionary.gallery.title}
      />
      <Container>
        {albums.length ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {albums.map((album) => (
              <li key={album.id}>
                <AlbumCard album={album} dictionary={dictionary} level={2} locale={locale} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState body={dictionary.common.empty} title={dictionary.gallery.title} />
        )}
      </Container>
    </main>
  )
}
