import { notFound } from 'next/navigation'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { CmsImage } from '@/components/cms-image'
import { EmptyState } from '@/components/empty-state'
import { Container, Eyebrow } from '@/components/ui'
import { getAlbum, getSiteSettings, isMedia } from '@/lib/cms'
import { getDictionary, requireLocale } from '@/lib/i18n'
import { descriptionFrom, pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const [settings, album] = await Promise.all([getSiteSettings(locale), getAlbum(slug, locale)])
  if (!album) return {}
  const first = album.photos?.find((photo) => isMedia(photo.image))
  return pageMetadata({
    title: titleFrom(null, album.title, settings.siteName),
    description: descriptionFrom(null, album.title),
    path: `/gallery/${album.slug}`,
    locale,
    image: first && isMedia(first.image) ? first.image : null,
  })
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale: raw, slug } = await params
  const locale = await requireLocale(Promise.resolve({ locale: raw }))
  const dictionary = await getDictionary(locale)
  const album = await getAlbum(slug, locale)
  if (!album) notFound()
  const photos = (album.photos ?? []).filter((photo) => isMedia(photo.image))

  return (
    <main>
      <Container className="pt-8 sm:pt-10">
        <Breadcrumbs
          ariaLabel={dictionary.common.breadcrumb}
          homeLabel={dictionary.nav.home}
          items={[
            { name: dictionary.nav.gallery, path: '/gallery' },
            { name: album.title, path: `/gallery/${album.slug}` },
          ]}
          locale={locale}
        />
        <div className="mt-8">
          <Eyebrow>
            {photos.length} {photos.length === 1 ? dictionary.common.photo : dictionary.common.photos}
          </Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-canopy-950 sm:text-5xl lg:text-6xl">
            {album.title}
          </h1>
        </div>
        {photos.length ? (
          <ul className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3">
            {photos.map((photo) => {
              if (!isMedia(photo.image)) return null
              return (
                <li key={photo.id || photo.image.id} className="mb-6 break-inside-avoid">
                  <figure className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-canopy-900/5">
                    <CmsImage
                      className="h-auto w-full object-cover"
                      media={photo.image}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    {photo.caption ? (
                      <figcaption className="px-5 py-4 text-sm text-ink/70">{photo.caption}</figcaption>
                    ) : null}
                  </figure>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-10">
            <EmptyState body={dictionary.common.empty} title={dictionary.gallery.title} />
          </div>
        )}
      </Container>
    </main>
  )
}
