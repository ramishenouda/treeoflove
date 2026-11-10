import fs from 'fs/promises'
import path from 'path'
import type { Payload } from 'payload'

/**
 * Creates the resized versions (thumbnail, card, large) for photos uploaded before those sizes existed.
 * Photos that already have a thumbnail are skipped, so running it again is cheap.
 */
export async function createMissingImageSizes(payload: Payload) {
  const upload = payload.collections.media.config.upload
  const staticDir = path.resolve(
    typeof upload === 'object' && upload.staticDir ? upload.staticDir : 'media',
  )
  const { docs } = await payload.find({
    collection: 'media',
    pagination: false,
    depth: 0,
    overrideAccess: true,
    where: { 'sizes.thumbnail.filename': { exists: false } },
  })

  let done = 0
  for (const doc of docs) {
    if (!doc.filename || !doc.mimeType?.startsWith('image/')) continue
    const filePath = path.join(staticDir, doc.filename)
    try {
      const data = await fs.readFile(filePath)
      await payload.update({
        collection: 'media',
        id: doc.id,
        data: {},
        file: { data, mimetype: doc.mimeType, name: doc.filename, size: data.length },
        overwriteExistingFiles: true,
        overrideAccess: true,
      })
      done += 1
    } catch (error) {
      payload.logger.warn({ err: error, msg: `Could not resize media ${doc.id} (${filePath})` })
    }
  }
  return { done, checked: docs.length }
}
