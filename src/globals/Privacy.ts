import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { previewUrl } from '../lib/preview'

export const Privacy: GlobalConfig = {
  slug: 'privacy',
  label: 'Privacy policy',
  admin: {
    group: 'Content',
    preview: (_doc, { locale }) => previewUrl({ global: 'privacy', locale }),
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
        contentTab('Privacy policy', [
          {
            name: 'title',
            type: 'text',
            required: true,
            localized: true,
            defaultValue: 'Privacy policy',
          },
          {
            name: 'body',
            type: 'richText',
            localized: true,
          },
        ]),
      ],
    },
    updatedByField,
  ],
}
