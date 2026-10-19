import type { GlobalConfig } from 'payload'

import { staffField, staffOnly } from '../access/staff'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Website',
  },
  access: {
    read: () => true,
    update: staffOnly,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'Tree of Love',
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'footerEmail',
      label: 'Footer email',
      type: 'email',
    },
    {
      name: 'footerPhone',
      label: 'Footer phone',
      type: 'text',
    },
    {
      name: 'footerLocation',
      label: 'Footer location',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'City or country shown in the footer. No street address for a child belongs here.',
      },
    },
    {
      name: 'notificationEmail',
      label: 'Notification email',
      type: 'email',
      access: {
        read: staffField,
      },
      admin: {
        description: 'Where contact form messages are sent. Visitors do not see this address.',
      },
    },
    {
      name: 'suggestedAmounts',
      type: 'array',
      labels: {
        singular: 'Amount',
        plural: 'Suggested amounts',
      },
      defaultValue: [{ amount: 10 }, { amount: 25 }, { amount: 50 }, { amount: 100 }],
      admin: {
        description: 'Shown on the donate page, in euros.',
      },
      fields: [
        {
          name: 'amount',
          type: 'number',
          required: true,
          min: 1,
        },
      ],
    },
    {
      name: 'minimumAmount',
      label: 'Minimum amount (EUR)',
      type: 'number',
      required: true,
      min: 1,
      defaultValue: 5,
    },
  ],
}
