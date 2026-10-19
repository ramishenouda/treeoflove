import { APIError, type CollectionBeforeChangeHook } from 'payload'

export const requirePhotoConsent: CollectionBeforeChangeHook = ({ data, originalDoc }) => {
  const status = data._status ?? originalDoc?._status
  const consent = data.photoConsent ?? originalDoc?.photoConsent

  if (status === 'published' && !consent) {
    throw new APIError('Check photo consent before publishing this child.', 400)
  }

  return data
}
