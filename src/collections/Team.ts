import type { CollectionConfig } from 'payload'

import { staffOnly, staffOrVisible } from '../access/staff'
import { localeNotice, updatedByField } from '../fields/shared'

const contentFields: CollectionConfig['fields'] = [
  {
    type: 'row',
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
    ],
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
]

export const Team: CollectionConfig = {
  slug: 'team',
  labels: {
    singular: 'Team member',
    plural: 'Team',
  },
  orderable: true,
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'photo', 'role', 'published'],
    listSearchableFields: ['name', 'role'],
    group: 'People',
    description: 'Shown on the About page.',
  },
  access: {
    create: staffOnly,
    read: staffOrVisible,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    localeNotice(contentFields),
    ...contentFields,
    {
      name: 'published',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Show this person on the About page.',
      },
    },
    updatedByField,
  ],
}
