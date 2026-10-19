import type { CollectionConfig } from 'payload'

import { staffOnly, staffOrVisible } from '../access/staff'

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Team member',
    plural: 'Team',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'published'],
    group: 'People',
  },
  access: {
    create: staffOnly,
    read: staffOrVisible,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      localized: true,
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'bio',
      type: 'textarea',
      localized: true,
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
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
