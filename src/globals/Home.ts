import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  admin: {
    group: 'Website',
  },
  access: {
    read: () => true,
    update: staffOnly,
  },
  versions: {
    drafts: true,
  },
  fields: [
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
  ],
}
