import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access/staff'

const nobody = () => false

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: 'Message',
    plural: 'Messages',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['createdAt', 'name', 'email'],
    group: 'Messages',
    description: 'Sent from the contact form and emailed to the notification address.',
  },
  access: {
    create: nobody,
    read: staffOnly,
    update: nobody,
    delete: staffOnly,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 4000,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      admin: {
        readOnly: true,
        description: 'The sender agreed to the privacy policy.',
      },
    },
  ],
}
