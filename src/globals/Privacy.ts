import type { GlobalConfig } from 'payload'

import { staffOnly } from '../access/staff'

export const Privacy: GlobalConfig = {
  slug: 'privacy',
  label: 'Privacy policy',
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
  ],
}
