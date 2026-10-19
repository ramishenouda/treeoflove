import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'About',
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
  ],
}
