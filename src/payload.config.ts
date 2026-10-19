import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Team, Programs, Children, News, Albums, Messages, Donations],
  globals: [SiteSettings, Home, About, Privacy],
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
  }),
  sharp,
  plugins: [
    seoPlugin({
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
