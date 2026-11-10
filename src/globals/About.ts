import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About page',
  admin: {
    group: 'Content',
    preview: (_doc, { locale }) => previewUrl({ global: 'about', locale }),
  },
  access: {
    read: () => true,
    update: staffOnly,
  },
  versions: draftVersions,
  fields: [
    {
      type: 'tabs',
      tabs: [
        contentTab('About page', [
          {
            name: 'heading',
            type: 'text',
            required: true,
            localized: true,
          },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            admin: {
              description: 'Shown near the top of the About page.',
            },
          },
          {
            name: 'mission',
            type: 'richText',
            localized: true,
          },
          {
            name: 'story',
            type: 'richText',
            localized: true,
          },
          {
            name: 'sections',
            label: 'Extra sections',
            type: 'array',
            localized: true,
            fields: [
              {
                name: 'heading',
                type: 'text',
                required: true,
              },
              {
                name: 'body',
                type: 'richText',
              },
            ],
          },
        ]),
      ],
    },
    updatedByField,
  ],
}
