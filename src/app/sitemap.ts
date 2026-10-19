import type { MetadataRoute } from 'next'

import { getAlbums, getChildren, getNewsList, getProgramOptions, getPrograms } from '@/lib/cms'
import { defaultLocale, locales, localizedPath } from '@/lib/i18n'
import { PAGE_SIZE, siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

function pages(base: string, totalDocs: number) {
  const totalPages = Math.ceil(totalDocs / PAGE_SIZE)
  const urls = [base]
  for (let page = 2; page <= totalPages; page += 1) urls.push(`${base}/page/${page}`)
  return urls
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [programs, children, news, albums] = await Promise.all([
    getPrograms({ page: 1 }),
    getChildren({ page: 1 }),
    getNewsList({ page: 1 }),
    getAlbums(),
  ])
  const programOptions = await getProgramOptions()

  const paths = [
    '/',
    '/about',
    '/contact',
    '/donate',
    '/privacy',
    '/gallery',
    ...pages('/programs', programs.totalDocs),
    ...pages('/children', children.totalDocs),
    ...pages('/news', news.totalDocs),
    ...programOptions.map((program) => `/programs/${program.slug}`),
    ...albums.map((album) => `/gallery/${album.slug}`),
  ]

  const childDocs = children.docs
  if (children.totalPages > 1) {
    for (let page = 2; page <= children.totalPages; page += 1) {
      const more = await getChildren({ page })
      childDocs.push(...more.docs)
    }
  }
  paths.push(...childDocs.map((child) => `/children/${child.slug}`))

  const newsDocs = news.docs
  if (news.totalPages > 1) {
    for (let page = 2; page <= news.totalPages; page += 1) {
      const more = await getNewsList({ page })
      newsDocs.push(...more.docs)
    }
  }
  paths.push(...newsDocs.map((article) => `/news/${article.slug}`))

  const origin = siteUrl()
  const unique = [...new Set(paths)]

  return unique.flatMap((path) =>
    locales.map((locale) => ({
      url: `${origin}${localizedPath(locale, path)}`,
      alternates: {
        languages: Object.fromEntries(
          locales.map((code) => [code, `${origin}${localizedPath(code, path)}`]),
        ),
      },
      ...(locale === defaultLocale ? {} : {}),
    })),
  )
}
