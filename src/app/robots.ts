import type { MetadataRoute } from 'next'

import { locales } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-dynamic'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin',
        '/api/',
        ...locales.flatMap((locale) => [`/${locale}/donate/success`, `/${locale}/donate/cancel`]),
      ],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  }
}
