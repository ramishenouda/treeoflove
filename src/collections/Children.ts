import { slugField, type CollectionConfig } from 'payload'

import { adminField, isAdmin, staffOnly, staffOrPublished } from '../access/staff'
import { contentTab, draftVersions, updatedByField } from '../fields/shared'
import { requirePhotoConsent } from '../hooks/requirePhotoConsent'
import { previewUrl } from '../lib/preview'

export const Children: CollectionConfig = {
  slug: 'children',
  labels: {
    singular: 'Child',
    plural: 'Children',
  },
  orderable: true,
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'photo', 'program', 'photoConsent', 'acceptDonations', '_status'],
    listSearchableFields: ['firstName', 'slug'],
    group: 'People',
    preview: (doc, { locale }) => previewUrl({ collection: 'children', slug: doc.slug, locale }),
  },
  access: {
    create: staffOnly,
    read: staffOrPublished,
    update: staffOnly,
    delete: staffOnly,
  },
  versions: draftVersions,
  hooks: {
    beforeChange: [requirePhotoConsent],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        contentTab('Profile', [
          {
            name: 'firstName',
            type: 'text',
            required: true,
          },
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
              description:
                'Shown on the public profile. Do not include a last name, address, school, or health details.',
            },
          },
          {
            type: 'row',
            fields: [
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
            ],
          },
        ]),
        {
          label: 'Private (admins)',
          description: 'Only admins can see or change these. They are never shown on the website.',
          admin: {
            condition: (_data, _siblingData, { user }) => isAdmin(user),
          },
          fields: [
            {
              name: 'legalName',
              type: 'text',
              access: {
                read: adminField,
                create: adminField,
                update: adminField,
              },
            },
            {
              name: 'privateNotes',
              type: 'textarea',
              access: {
                read: adminField,
                create: adminField,
                update: adminField,
              },
            },
          ],
        },
      ],
    },
    slugField({ useAsSlug: 'firstName' }),
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
    updatedByField,
  ],
}
