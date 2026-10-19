import Image from 'next/image'

import type { Media } from '@/payload-types'

export function mediaSrc(media: Media) {
  if (!media.url) return null
  if (media.url.startsWith('/')) return media.url
  try {
    return new URL(media.url).pathname
  } catch {
    return null
  }
}

export function CmsImage({
  media,
  className,
  sizes,
  priority = false,
}: {
  media: Media
  className?: string
  sizes?: string
  priority?: boolean
}) {
  const src = mediaSrc(media)
  if (!src) return null

  return (
    <Image
      src={src}
      alt={media.alt}
      width={media.width || 1600}
      height={media.height || 1000}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  )
}
