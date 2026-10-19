import path from 'path'
import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access/staff'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Website',
    description: 'Every photo needs alt text. It is shown to people who cannot see the image.',
  },
  access: {
    create: staffOnly,
    read: () => true,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
  },
}
