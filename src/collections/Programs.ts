import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrPublished } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

export const Programs: CollectionConfig = {
  slug: 'programs',
  orderable: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'cover', 'acceptDonations', '_status'],
    listSearchableFields: ['title', 'summary', 'slug'],
    group: 'Content',
    preview: (doc, { locale }) => previewUrl({ collection: 'programs', slug: doc.slug, locale }),
  },
  access: {
    create: staffOnly,
    read: staffOrPublished,
    update: staffOnly,
    delete: staffOnly,
  },
  versions: draftVersions,
  fields: [
    {
      type: 'tabs',
      tabs: [
        contentTab('Program', [
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
            name: 'story',
            type: 'richText',
            localized: true,
          },
        ]),
      ],
    },
    slugField(),
    {
      name: 'acceptDonations',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description:
          'Turn this on to list the program on the donate page. No Stripe product is required.',
      },
    },
    updatedByField,
  ],
}
