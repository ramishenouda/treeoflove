import type { CollectionConfig, FieldAccess } from 'payload'

import { staffOnly } from '../access/staff'

const nobody = () => false
const locked: { update: FieldAccess } = { update: nobody }

export const Messages: CollectionConfig = {
  slug: 'messages',
  labels: {
    singular: 'Message',
    plural: 'Messages',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['status', 'createdAt', 'name', 'email'],
    listSearchableFields: ['name', 'email', 'message'],
    group: 'Inbox',
    description:
      'Sent from the contact form and emailed to the notification address. Mark a message as handled once someone has replied.',
  },
  access: {
    create: nobody,
    read: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 80,
      access: locked,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      access: locked,
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 4000,
      access: locked,
    },
    {
      name: 'consent',
      type: 'checkbox',
      required: true,
      access: locked,
      admin: {
        readOnly: true,
        description: 'The sender agreed to the privacy policy.',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      index: true,
      options: [
        { label: 'New', value: 'new' },
        { label: 'Handled', value: 'handled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'staffNote',
      label: 'Staff note',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        description:
          'Who replied, and anything the next person should know. Not sent to the sender.',
      },
    },
  ],
}
