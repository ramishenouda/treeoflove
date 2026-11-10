import { APIError, type Access, type CollectionConfig } from 'payload'

import { adminField, adminOnly, isAdmin, staffOnly } from '../access/staff'
import { siteUrl } from '../lib/site'

const adminOrSelf: Access = ({ req }) => {
  if (!req.user) return false
  if (isAdmin(req.user)) return true
  return { id: { equals: req.user.id } }
}

async function otherAdmins(req: Parameters<Access>[0]['req'], id: number | string) {
  const { totalDocs } = await req.payload.count({
    collection: 'users',
    req,
    where: { and: [{ role: { equals: 'admin' } }, { id: { not_equals: id } }] },
  })
  return totalDocs
}

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Staff account',
    plural: 'Staff accounts',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    listSearchableFields: ['name', 'email'],
    group: 'Settings',
    description:
      'Admins can do everything. Editors manage website content and the inbox, but cannot see children’s private details, change site settings, or manage accounts.',
  },
  auth: {
    cookies: {
      secure: siteUrl().startsWith('https://'),
      sameSite: 'Lax',
    },
  },
  access: {
    read: staffOnly,
    create: adminOnly,
    update: adminOrSelf,
    delete: adminOnly,
  },
  hooks: {
    beforeChange: [
      async ({ data, operation, originalDoc, req }) => {
        // The very first account is created from the sign-up screen. It must be an admin, or nobody could manage the site.
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', req })
          if (totalDocs === 0) data.role = 'admin'
        }
        if (
          operation === 'update' &&
          originalDoc?.role === 'admin' &&
          data.role &&
          data.role !== 'admin' &&
          (await otherAdmins(req, originalDoc.id)) === 0
        ) {
          throw new APIError(
            'Make someone else an admin first. The site needs at least one admin.',
            400,
          )
        }
        return data
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        const user = await req.payload.findByID({ collection: 'users', id, depth: 0, req })
        if (user?.role === 'admin' && (await otherAdmins(req, id)) === 0) {
          throw new APIError(
            'This is the last admin account. Make someone else an admin before deleting it.',
            400,
          )
        }
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        description: 'Shown in the admin next to the changes this person makes.',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      saveToJWT: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
      access: {
        create: adminField,
        update: adminField,
      },
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
