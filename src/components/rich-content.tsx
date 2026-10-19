import { RichText } from '@payloadcms/richtext-lexical/react'

export function RichContent({ data, className = 'rich-text' }: { data?: unknown; className?: string }) {
  if (!data || typeof data !== 'object' || !('root' in data)) return null

  return <RichText className={className} data={data as never} />
}
