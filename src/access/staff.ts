import type { Access, FieldAccess } from 'payload'

type StaffUser = { collection?: string; role?: string | null } | null | undefined

export const isAdmin = (user: StaffUser) => Boolean(user && user.role === 'admin')

export const staffOnly: Access = ({ req }) => Boolean(req.user)

export const adminOnly: Access = ({ req }) => isAdmin(req.user)

export const staffOrPublished: Access = ({ req }) => {
  if (req.user) return true
  return {
    _status: {
      equals: 'published',
    },
  }
}

export const staffOrVisible: Access = ({ req }) => {
  if (req.user) return true
  return {
    published: {
      equals: true,
    },
  }
}

export const staffField: FieldAccess = ({ req }) => Boolean(req.user)

export const adminField: FieldAccess = ({ req }) => isAdmin(req.user)
