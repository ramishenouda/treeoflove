import { slugField, type CollectionConfig } from 'payload'

import { staffOnly, staffOrPublished } from '../access/staff'

export const Programs: CollectionConfig = {
  slug: 'programs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'acceptDonations', '_status'],
    group: 'Programs',
  },
  access: {
    create: staffOnly,
    read: staffOrPublished,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: 'sortOrder',
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
      name: 'summary',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'A short introduction. Also used as the search description when that field is left blank.',
      },
    },
    {
      name: 'story',
      type: 'richText',
      localized: true,
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
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
      name: 'acceptDonations',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Turn this on to list the program on the donate page. No Stripe product is required.',
      },
    },
  ],
}
