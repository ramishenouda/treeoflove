import path from 'path'
import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access/staff'
import { localeNotice } from '../fields/shared'

const contentFields: CollectionConfig['fields'] = [
  {
    name: 'alt',
    label: 'Alt text',
    type: 'text',
    required: true,
    localized: true,
    admin: {
      description:
        'Describe what is in the photo for people who cannot see it, e.g. “Two children reading at a table”.',
    },
  },
  {
    name: 'caption',
    type: 'text',
    localized: true,
    admin: {
      description: 'Optional. Shown under the photo in gallery albums.',
    },
  },
]

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Photo',
    plural: 'Photos',
  },
  admin: {
    group: 'Content',
    defaultColumns: ['filename', 'alt', 'caption', 'updatedAt'],
    listSearchableFields: ['alt', 'caption', 'filename'],
    description:
      'Every photo needs alt text. Use “Bulk upload” to add many at once. Click the photo to set the focal point so crops keep faces in view.',
  },
  access: {
    create: staffOnly,
    read: () => true,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [localeNotice(contentFields), ...contentFields],
  upload: {
    staticDir: process.env.MEDIA_DIR || path.resolve(process.cwd(), 'media'),
    mimeTypes: ['image/*'],
    focalPoint: true,
    crop: true,
    adminThumbnail: ({ doc }) => {
      const sizes = doc.sizes as { thumbnail?: { url?: string | null } } | undefined
      return sizes?.thumbnail?.url || (typeof doc.url === 'string' ? doc.url : null)
    },
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300 },
      { name: 'card', width: 900, height: 675 },
      { name: 'large', width: 1800, withoutEnlargement: true },
    ],
  },
}
