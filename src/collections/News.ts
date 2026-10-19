import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrPublished } from '../access/staff'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'News article',
    plural: 'News',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishedOn', '_status'],
    group: 'News & gallery',
  },
  access: {
    create: staffOnly,
    read: staffOrPublished,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-publishedOn',
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField(),
    {
      name: 'publishedOn',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'A short introduction. Also used as the search description when that field is left blank.',
      },
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
    },
  ],
}
