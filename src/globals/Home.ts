import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home page',
  admin: {
    group: 'Content',
    preview: (_doc, { locale }) => previewUrl({ global: 'home', locale }),
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
        contentTab('Home page', [
          {
            name: 'heading',
            type: 'text',
            required: true,
            localized: true,
          },
          {
            name: 'intro',
            type: 'textarea',
            localized: true,
          },
          {
            name: 'sections',
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
              {
                name: 'image',
                type: 'upload',
                relationTo: 'media',
              },
            ],
          },
        ]),
      ],
    },
    updatedByField,
  ],
}
