'use client'

import { usePathname } from 'next/navigation'

import { localeLabels, locales, type Locale } from '@/lib/i18n'
import { switchLocalePath } from '@/lib/i18n/path'

export function LanguageSwitcher({
  locale,
  className = '',
}: {
  locale: Locale
  className?: string
}) {
  const pathname = usePathname() || '/'

  return (
    <div aria-label="Language" className={`flex items-center gap-1 ${className}`} role="group">
      {locales.map((code) => {
        const active = code === locale
        return (
          <a
            key={code}
            aria-current={active ? 'true' : undefined}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition ${
              active
                ? 'bg-canopy-800 text-paper'
                : 'text-ink/60 hover:bg-canopy-50 hover:text-canopy-900'
            }`}
            href={switchLocalePath(pathname, code)}
            hrefLang={code}
            lang={code}
          >
            {code}
            <span className="sr-only"> ({localeLabels[code]})</span>
          </a>
        )
      })}
    </div>
  )
}
