import { slugField, type CollectionConfig } from 'payload'

import { staffField, staffOnly, staffOrPublished } from '../access/staff'
import { requirePhotoConsent } from '../hooks/requirePhotoConsent'

export const Children: CollectionConfig = {
  slug: 'children',
  labels: {
    singular: 'Child',
    plural: 'Children',
  },
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'program', 'photoConsent', 'acceptDonations', '_status'],
    group: 'People',
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
  hooks: {
    beforeChange: [requirePhotoConsent],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    slugField({ useAsSlug: 'firstName' }),
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'shortStory',
      label: 'Short story',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Shown on the public profile. Do not include a last name, address, school, or health details.',
      },
    },
    {
      name: 'age',
      type: 'number',
      min: 0,
      max: 24,
    },
    {
      name: 'program',
      type: 'relationship',
      relationTo: 'programs',
      admin: {
        description: 'Optional. Lets visitors see the children in a program.',
      },
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
      name: 'photoConsent',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Required before this profile can be published.',
      },
    },
    {
      name: 'acceptDonations',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Shows the donate button and includes this child in donate search.',
      },
    },
    {
      type: 'collapsible',
      label: 'Staff only',
      admin: {
        description: 'Stored for staff. These fields are not returned by the public site.',
      },
      fields: [
        {
          name: 'legalName',
          type: 'text',
          access: {
            read: staffField,
          },
          admin: {
            description: 'Never shown on the website.',
          },
        },
        {
          name: 'privateNotes',
          type: 'textarea',
          access: {
            read: staffField,
          },
          admin: {
            description: 'Never shown on the website.',
          },
        },
      ],
    },
  ],
}
