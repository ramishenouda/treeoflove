import type { Access, FieldAccess } from 'payload'

export const staffOnly: Access = ({ req }) => Boolean(req.user)

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
