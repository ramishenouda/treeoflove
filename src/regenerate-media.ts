/**
 * Creates the resized versions for photos uploaded before those sizes existed.
 * The site also does this by itself on startup; this script is for local use.
 *
 *   npm run media:regenerate
 */
import config from '@payload-config'
import { getPayload } from 'payload'

import { createMissingImageSizes } from './lib/media-sizes'

const payload = await getPayload({ config })

try {
  const { done, checked } = await createMissingImageSizes(payload)
  payload.logger.info(`Resized ${done} of ${checked} photos without sizes.`)
} finally {
  await payload.destroy()
}
