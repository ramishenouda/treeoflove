import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import type { About, Album, Child, Home, Media, News, Privacy, Program, SiteSetting, Team } from '@/payload-types'
import { defaultLocale, type Locale } from '@/lib/i18n'
import { PAGE_SIZE } from '@/lib/site'

export const getCms = cache(async () => getPayload({ config }))

const settingDefaults: SiteSetting = {
  id: 0,
  siteName: 'Tree of Love',
  minimumAmount: 5,
  suggestedAmounts: [{ amount: 10 }, { amount: 25 }, { amount: 50 }, { amount: 100 }],
}

type LocaleArg = Locale | undefined

export const getSiteSettings = cache(async (locale: LocaleArg = defaultLocale) => {
  try {
    const payload = await getCms()
    return await payload.findGlobal({
      slug: 'site-settings',
      depth: 1,
      locale,
      fallbackLocale: defaultLocale,
      overrideAccess: false,
    })
  } catch {
    return settingDefaults
  }
})

async function publishedGlobal<T>(slug: 'home' | 'about' | 'privacy', locale: LocaleArg = defaultLocale) {
  try {
    const payload = await getCms()
    return (await payload.findGlobal({
      slug,
      depth: 1,
      locale,
      fallbackLocale: defaultLocale,
      overrideAccess: false,
      draft: false,
    })) as T
  } catch {
    return null
  }
}

export const getHome = cache((locale: LocaleArg = defaultLocale) => publishedGlobal<Home>('home', locale))
export const getAbout = cache((locale: LocaleArg = defaultLocale) => publishedGlobal<About>('about', locale))
export const getPrivacy = cache((locale: LocaleArg = defaultLocale) =>
  publishedGlobal<Privacy>('privacy', locale),
)

export async function getTeam(locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'team',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 100,
    where: { published: { equals: true } },
  })
  return result.docs as Team[]
}

function textQuery(fields: string[], q?: string) {
  const term = q?.trim().slice(0, 80)
  if (!term) return undefined
  return {
    or: fields.map((field) => ({ [field]: { contains: term } })),
  }
}

export async function getPrograms({
  page,
  q,
  locale = defaultLocale,
}: {
  page: number
  q?: string
  locale?: Locale
}) {
  const payload = await getCms()
  return payload.find({
    collection: 'programs',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    page,
    limit: PAGE_SIZE,
    where: textQuery(['title', 'summary'], q),
  })
}

export async function getProgramOptions(locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'programs',
    depth: 0,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 200,
    select: { title: true, slug: true },
  })
  return result.docs as Program[]
}

export async function searchDonationPrograms(q: string, locale: LocaleArg = defaultLocale) {
  const term = q.trim().slice(0, 80)
  if (term.length < 2) return []
  const payload = await getCms()
  const result = await payload.find({
    collection: 'programs',
    depth: 0,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 8,
    select: { title: true, slug: true },
    where: {
      and: [
        { acceptDonations: { equals: true } },
        { or: [{ title: { contains: term } }, { summary: { contains: term } }] },
      ],
    },
  })
  return result.docs as Pick<Program, 'id' | 'title' | 'slug'>[]
}

export async function searchDonationChildren(q: string, locale: LocaleArg = defaultLocale) {
  const term = q.trim().slice(0, 80)
  if (term.length < 2) return []
  const payload = await getCms()
  const result = await payload.find({
    collection: 'children',
    depth: 0,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 8,
    select: { legalName: false, privateNotes: false },
    where: {
      and: [{ acceptDonations: { equals: true } }, { firstName: { contains: term } }],
    },
  })
  return result.docs as Pick<Child, 'id' | 'firstName' | 'slug'>[]
}

export async function getProgram(slug: string, locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'programs',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as Program | undefined) ?? null
}

export async function getChildren({
  page,
  q,
  programId,
  locale = defaultLocale,
}: {
  page: number
  q?: string
  programId?: number
  locale?: Locale
}) {
  const payload = await getCms()
  const search = textQuery(['firstName', 'shortStory'], q)
  const programFilter = programId ? { program: { equals: programId } } : undefined
  const where =
    search && programFilter ? { and: [programFilter, search] } : (programFilter ?? search)

  return payload.find({
    collection: 'children',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    page,
    limit: PAGE_SIZE,
    where,
    select: {
      legalName: false,
      privateNotes: false,
    },
  })
}

export async function getChild(slug: string, locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'children',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    limit: 1,
    where: { slug: { equals: slug } },
    select: {
      legalName: false,
      privateNotes: false,
    },
  })
  return (result.docs[0] as Child | undefined) ?? null
}

export async function getChildrenForProgram(programId: number, locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'children',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 24,
    where: { program: { equals: programId } },
    select: {
      legalName: false,
      privateNotes: false,
    },
  })
  return result.docs as Child[]
}

export async function getNewsList({ page, locale = defaultLocale }: { page: number; locale?: Locale }) {
  const payload = await getCms()
  return payload.find({
    collection: 'news',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: '-publishedOn',
    page,
    limit: PAGE_SIZE,
  })
}

export async function getNewsArticle(slug: string, locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'news',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as News | undefined) ?? null
}

export async function getAlbums(locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'albums',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    sort: 'sortOrder',
    limit: 100,
  })
  return result.docs as Album[]
}

export async function getAlbum(slug: string, locale: LocaleArg = defaultLocale) {
  const payload = await getCms()
  const result = await payload.find({
    collection: 'albums',
    depth: 1,
    locale,
    fallbackLocale: defaultLocale,
    overrideAccess: false,
    limit: 1,
    where: { slug: { equals: slug } },
  })
  return (result.docs[0] as Album | undefined) ?? null
}

export function isMedia(value: unknown): value is Media {
  return Boolean(value && typeof value === 'object' && 'url' in value && 'alt' in value)
}
