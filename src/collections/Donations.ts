import type { CollectionConfig } from 'payload'

import { staffOnly } from '../access/staff'

const nobody = () => false

export const Donations: CollectionConfig = {
  slug: 'donations',
  labels: {
    singular: 'Donation',
    plural: 'Donations',
  },
  admin: {
    useAsTitle: 'targetName',
    defaultColumns: ['paidAt', 'amount', 'frequency', 'targetName', 'stripeId'],
    group: 'Donations',
    description: 'Stripe writes a row when a gift is paid. Staff can read it. Card numbers are not stored.',
  },
  access: {
    create: nobody,
    read: staffOnly,
    update: nobody,
    delete: nobody,
  },
  defaultSort: '-paidAt',
  fields: [
    {
      name: 'amount',
      label: 'Amount (EUR)',
      type: 'number',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'frequency',
      type: 'select',
      required: true,
      options: [
        { label: 'One-time', value: 'once' },
        { label: 'Monthly', value: 'monthly' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'targetType',
      label: 'Target',
      type: 'select',
      required: true,
      options: [
        { label: 'General fund', value: 'general' },
        { label: 'Program', value: 'program' },
        { label: 'Child', value: 'child' },
      ],
      admin: { readOnly: true },
    },
    {
      name: 'targetName',
      label: 'Target name',
      type: 'text',
      required: true,
      admin: { readOnly: true },
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: { readOnly: true },
    },
    {
      name: 'child',
      type: 'relationship',
      relationTo: 'children',
      admin: { readOnly: true },
    },
    {
      name: 'stripeId',
      label: 'Stripe id',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: 'Checkout session id for a one-time gift, or invoice id for a monthly gift.',
      },
    },
    {
      name: 'paidAt',
      label: 'Paid at',
      type: 'date',
      required: true,
      admin: { readOnly: true },
    },
  ],
}
