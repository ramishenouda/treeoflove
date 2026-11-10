'use client'

import { useLocale } from '@payloadcms/ui'

export function LocaleNotice({ translated = [] }: { translated?: string[] }) {
  const locale = useLocale()
  if (!translated.length) return null
  const label = typeof locale?.label === 'string' ? locale.label : locale?.code?.toUpperCase()

  return (
    <div className="tol-locale-notice" role="note">
      <strong>You are editing the {label} version.</strong> These fields have a separate English and
      German text: {translated.join(', ')}. Switch language with the <em>Locale</em> menu at the top
      of the page. Every other field is shared by both languages.
    </div>
  )
}
