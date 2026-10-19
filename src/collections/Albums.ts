import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrVisible } from '../access/staff'

export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: {
    singular: 'Album',
    plural: 'Gallery',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'published'],
    group: 'News & gallery',
  },
  access: {
    create: staffOnly,
    read: staffOrVisible,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'photos',
      type: 'array',
      labels: {
        singular: 'Photo',
        plural: 'Photos',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
          localized: true,
        },
      ],
    },
  ],
}
