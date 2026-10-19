import { CmsImage } from '@/components/cms-image'
import { ArrowRightIcon, HeartIcon, LeafIcon } from '@/components/icons'
import { isMedia } from '@/lib/cms'
import { formatDate } from '@/lib/format'
import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath, t } from '@/lib/i18n'
import type { Album, Child, News, Program } from '@/payload-types'

type Level = 2 | 3

function Heading({ level, className, children }: { level: Level; className: string; children: React.ReactNode }) {
  return level === 2 ? <h2 className={className}>{children}</h2> : <h3 className={className}>{children}</h3>
}

export function ImagePlaceholder({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-linear-to-br from-canopy-100 via-sun-100 to-clay-100 ${className}`}
    >
      <LeafIcon className="h-10 w-10 text-canopy-600/60" />
    </div>
  )
}

export function ProgramCard({
  program,
  locale,
  dictionary,
  level = 3,
}: {
  program: Program
  locale: Locale
  dictionary: Dictionary
  level?: Level
}) {
  const cover = isMedia(program.cover) ? program.cover : null
  return (
    <a
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-canopy-900/5 transition hover:-translate-y-1 hover:shadow-lift"
      href={localizedPath(locale, `/programs/${program.slug}`)}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {cover ? (
          <CmsImage
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            media={cover}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        {program.acceptDonations ? (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-canopy-900 backdrop-blur">
            <HeartIcon className="h-3.5 w-3.5 text-clay-500" />
            {dictionary.common.openForGifts}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <Heading className="font-display text-xl font-semibold tracking-tight text-canopy-950" level={level}>
          {program.title}
        </Heading>
        {program.summary ? <p className="mt-2 line-clamp-3 text-ink/70">{program.summary}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-canopy-700">
          {dictionary.common.readAboutIt}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

export function ChildCard({
  child,
  locale,
  dictionary,
  level = 3,
}: {
  child: Child
  locale: Locale
  dictionary: Dictionary
  level?: Level
}) {
  const photo = isMedia(child.photo) ? child.photo : null
  return (
    <a className="group block" href={localizedPath(locale, `/children/${child.slug}`)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-canopy-100 shadow-soft">
        {photo ? (
          <CmsImage
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            media={photo}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-canopy-950/85 via-canopy-950/25 to-transparent p-5 pt-20">
          <Heading className="font-display text-2xl font-semibold text-white" level={level}>
            {child.firstName}
          </Heading>
          {typeof child.age === 'number' ? (
            <p className="mt-0.5 text-sm text-white/80">{t(dictionary.common.age, { age: child.age })}</p>
          ) : null}
        </div>
      </div>
      {child.shortStory ? <p className="mt-3 line-clamp-2 px-1 text-sm text-ink/70">{child.shortStory}</p> : null}
    </a>
  )
}

export function NewsCard({
  article,
  locale,
  dictionary,
  level = 3,
  featured = false,
}: {
  article: News
  locale: Locale
  dictionary: Dictionary
  level?: Level
  featured?: boolean
}) {
  const cover = isMedia(article.cover) ? article.cover : null
  return (
    <a
      className={`group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-canopy-900/5 transition hover:-translate-y-1 hover:shadow-lift ${
        featured ? 'md:flex-row' : ''
      }`}
      href={localizedPath(locale, `/news/${article.slug}`)}
    >
      <div className={`relative overflow-hidden ${featured ? 'aspect-[16/10] md:aspect-auto md:min-h-80 md:w-1/2' : 'aspect-[16/10]'}`}>
        {cover ? (
          <CmsImage
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            media={cover}
            sizes={featured ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'}
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
      </div>
      <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:justify-center md:p-10' : ''}`}>
        <time
          className="inline-flex w-fit rounded-full bg-sun-100 px-3 py-1 text-xs font-semibold text-canopy-900"
          dateTime={article.publishedOn}
        >
          {formatDate(article.publishedOn, locale)}
        </time>
        <Heading
          className={`mt-4 font-display font-semibold tracking-tight text-canopy-950 ${featured ? 'text-2xl md:text-3xl' : 'text-xl'}`}
          level={level}
        >
          {article.title}
        </Heading>
        {article.summary ? <p className="mt-2 line-clamp-3 text-ink/70">{article.summary}</p> : null}
        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-canopy-700">
          {dictionary.common.readTheStory}
          <ArrowRightIcon className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </a>
  )
}

export function AlbumCard({
  album,
  locale,
  dictionary,
  level = 3,
}: {
  album: Album
  locale: Locale
  dictionary: Dictionary
  level?: Level
}) {
  const photos = (album.photos ?? []).map((photo) => photo.image).filter(isMedia)
  const cover = photos[0]
  return (
    <a className="group block" href={localizedPath(locale, `/gallery/${album.slug}`)}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-canopy-100 shadow-soft">
        {cover ? (
          <CmsImage
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            media={cover}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          <ImagePlaceholder className="h-full w-full" />
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-linear-to-t from-canopy-950/80 to-transparent p-5 pt-16">
          <Heading className="font-display text-xl font-semibold text-white" level={level}>
            {album.title}
          </Heading>
          <span className="shrink-0 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-canopy-900">
            {photos.length} {photos.length === 1 ? dictionary.common.photo : dictionary.common.photos}
          </span>
        </div>
      </div>
    </a>
  )
}
