import fs from 'fs/promises'
import path from 'path'
import type { Payload } from 'payload'

export const DEMO_SEED = 'tree-of-love-demo'
export const PRIVACY_DRAFT_WATERMARK = '[DRAFT — requires legal review]'

export function richText(...paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal' as const,
            style: '',
            text,
            version: 1,
          },
        ],
      })),
    },
  }
}

export function seedAssetPath(filename: string) {
  return path.resolve(process.cwd(), 'seedassets', filename)
}

function mimeFor(filename: string) {
  const ext = path.extname(filename).toLowerCase()
  if (ext === '.webp') return 'image/webp'
  if (ext === '.png') return 'image/png'
  return 'image/jpeg'
}

export async function findBySlug(
  payload: Payload,
  collection: 'programs' | 'children' | 'news' | 'albums',
  slug: string,
) {
  const result = await payload.find({
    collection,
    overrideAccess: true,
    depth: 0,
    limit: 1,
    draft: true,
    where: { slug: { equals: slug } },
  })
  return result.docs[0]
}

export async function findMediaByFilename(payload: Payload, filename: string) {
  const result = await payload.find({
    collection: 'media',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: { filename: { equals: filename } },
  })
  return result.docs[0]
}

/** Upload a file from seedassets/, reusing an existing media row with the same filename. */
export async function ensureSeedMedia(payload: Payload, filename: string, alt: string): Promise<number> {
  const existing = await findMediaByFilename(payload, filename)
  if (existing) {
    if (existing.alt !== alt) {
      await payload.update({
        collection: 'media',
        id: existing.id,
        data: { alt },
      })
    }
    return Number(existing.id)
  }

  const filePath = seedAssetPath(filename)
  const data = await fs.readFile(filePath)
  const media = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      mimetype: mimeFor(filename),
      name: filename,
      size: data.length,
    },
  })
  return Number(media.id)
}
