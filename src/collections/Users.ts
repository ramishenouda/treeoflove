import type { CollectionConfig } from 'payload'

import { siteUrl } from '../lib/site'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Website',
  },
  auth: {
    cookies: {
      secure: siteUrl().startsWith('https://'),
      sameSite: 'Lax',
    },
  },
  fields: [],
}
