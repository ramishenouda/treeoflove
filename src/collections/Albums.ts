import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrVisible } from '../access/staff'
import { localeNotice, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

const contentFields: CollectionConfig['fields'] = [
  {
    name: 'title',
    type: 'text',
    required: true,
    localized: true,
  },
  {
    name: 'photos',
    type: 'upload',
    relationTo: 'media',
    hasMany: true,
    admin: {
      description:
        'Pick existing photos, or drop several new ones in at once. Drag to reorder. Each photo keeps its own caption, edited on the photo itself.',
    },
  },
]

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: 'Album',
    plural: 'Gallery',
  },
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'photos', 'published'],
    listSearchableFields: ['title', 'slug'],
    group: 'Content',
    preview: (doc, { locale }) => previewUrl({ collection: 'albums', slug: doc.slug, locale }),
  },
  access: {
    create: staffOnly,
    read: staffOrVisible,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    localeNotice(contentFields),
    ...contentFields,
    slugField(),
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this album on the website.',
      },
    },
    updatedByField,
  ],
}
