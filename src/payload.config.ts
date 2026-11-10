import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig, type CollectionConfig, type GlobalConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Albums } from './collections/Albums'
import { Children } from './collections/Children'
import { Donations } from './collections/Donations'
import { Media } from './collections/Media'
import { Messages } from './collections/Messages'
import { News } from './collections/News'
import { Programs } from './collections/Programs'
import { Team } from './collections/Team'
import { Users } from './collections/Users'
import { About } from './globals/About'
import { Home } from './globals/Home'
import { Privacy } from './globals/Privacy'
import { SiteSettings } from './globals/SiteSettings'
import { createMissingImageSizes } from './lib/media-sizes'
import { livePreviewBreakpoints, previewUrl } from './lib/preview'
import { siteUrl } from './lib/site'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const leaveGuard = '/components/admin/AutosaveLeaveGuard#AutosaveLeaveGuard'

function autosaves(versions: CollectionConfig['versions'] | GlobalConfig['versions']) {
  return (
    typeof versions === 'object' &&
    typeof versions.drafts === 'object' &&
    Boolean(versions.drafts.autosave)
  )
}

/** Forms that autosave get Payload's "Leave without saving?" dialog back. Payload turns it off for them. */
function withLeaveGuard(collection: CollectionConfig): CollectionConfig {
  if (!autosaves(collection.versions)) return collection
  const components = collection.admin?.components
  return {
    ...collection,
    admin: {
      ...collection.admin,
      components: {
        ...components,
        edit: {
          ...components?.edit,
          beforeDocumentControls: [...(components?.edit?.beforeDocumentControls ?? []), leaveGuard],
        },
      },
    },
  }
}

function withGlobalLeaveGuard(global: GlobalConfig): GlobalConfig {
  if (!autosaves(global.versions)) return global
  const components = global.admin?.components
  return {
    ...global,
    admin: {
      ...global.admin,
      components: {
        ...components,
        elements: {
          ...components?.elements,
          beforeDocumentControls: [
            ...(components?.elements?.beforeDocumentControls ?? []),
            leaveGuard,
          ],
        },
      },
    },
  }
}

export default buildConfig({
  serverURL: siteUrl(),
  csrf: [siteUrl()],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · Tree of Love admin',
    },
    dateFormat: 'd MMM yyyy, HH:mm',
    components: {
      graphics: {
        Logo: '/components/admin/Graphics#Logo',
        Icon: '/components/admin/Graphics#Icon',
      },
      actions: ['/components/admin/DashboardButton#DashboardButton'],
      beforeDashboard: ['/components/admin/Dashboard#Dashboard'],
      beforeLogin: ['/components/admin/LoginNote#LoginNote'],
    },
    livePreview: {
      collections: ['programs', 'children', 'news', 'albums'],
      globals: ['home', 'about', 'privacy'],
      breakpoints: livePreviewBreakpoints,
      url: ({ data, collectionConfig, globalConfig, locale }) =>
        previewUrl({
          collection: collectionConfig?.slug,
          global: globalConfig?.slug,
          slug: data?.slug,
          locale,
        }),
    },
  },
  // Order matters: the admin menu lists groups in the order they first appear.
  collections: [News, Albums, Programs, Media, Children, Team, Messages, Donations, Users].map(
    withLeaveGuard,
  ),
  globals: [Home, About, Privacy, SiteSettings].map(withGlobalLeaveGuard),
  localization: {
    locales: [
      { code: 'en', label: 'English' },
      { code: 'de', label: 'Deutsch' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
    prodMigrations: migrations,
  }),
  sharp,
  onInit: (payload) => {
    // Photos uploaded before thumbnails existed get their sizes once, in the background, when the site starts.
    if (
      process.env.NODE_ENV !== 'production' ||
      process.env.NEXT_PHASE === 'phase-production-build'
    )
      return
    void createMissingImageSizes(payload)
      .then(({ done }) => done && payload.logger.info(`Created image sizes for ${done} photos.`))
      .catch((error) => payload.logger.error({ err: error, msg: 'Creating image sizes failed' }))
  },
  plugins: [
    seoPlugin({
      tabbedUI: true,
      collections: ['programs', 'children', 'news'],
      globals: ['home', 'about', 'privacy'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => {
        const label =
          (doc && 'title' in doc && doc.title) ||
          (doc && 'firstName' in doc && doc.firstName) ||
          (doc && 'heading' in doc && doc.heading) ||
          'Tree of Love'
        return `${label} | Tree of Love`
      },
      generateDescription: ({ doc }) => {
        if (!doc) return ''
        if ('summary' in doc && typeof doc.summary === 'string') return doc.summary
        if ('intro' in doc && typeof doc.intro === 'string') return doc.intro
        if ('shortStory' in doc && typeof doc.shortStory === 'string') return doc.shortStory
        return ''
      },
    }),
  ],
})
