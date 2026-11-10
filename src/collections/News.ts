import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrPublished } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

export const News: CollectionConfig = {
  slug: 'news',
  labels: {
    singular: 'News article',
    plural: 'News',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'cover', 'publishedOn', '_status'],
    listSearchableFields: ['title', 'summary', 'slug'],
    group: 'Content',
    preview: (doc, { locale }) => previewUrl({ collection: 'news', slug: doc.slug, locale }),
  },
  access: {
    create: staffOnly,
    read: staffOrPublished,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-publishedOn',
  versions: draftVersions,
  fields: [
    {
      type: 'tabs',
      tabs: [
        contentTab('Article', [
          {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
          },
          {
            name: 'summary',
            type: 'textarea',
            localized: true,
            admin: {
              description:
                'A short introduction. Also used as the search description when that field is left blank.',
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
        ]),
      ],
    },
    slugField(),
    {
      name: 'publishedOn',
      label: 'Date',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: 'sidebar',
        description: 'Shown on the article. News is sorted by this date.',
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    updatedByField,
  ],
}
