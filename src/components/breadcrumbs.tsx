import { JsonLd } from '@/components/json-ld'
import type { Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'
import { absoluteUrl } from '@/lib/site'

export function Breadcrumbs({
  items,
  locale,
  homeLabel,
  ariaLabel = 'Breadcrumb',
}: {
  items: { name: string; path: string }[]
  locale: Locale
  homeLabel: string
  ariaLabel?: string
}) {
  const trail = [{ name: homeLabel, path: '/' }, ...items]

  return (
    <>
      <nav aria-label={ariaLabel} className="text-sm text-ink/55">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((item, index) => {
            const last = index === trail.length - 1
            const href = localizedPath(locale, item.path)
            return (
              <li key={item.path} className="flex items-center gap-2">
                {index > 0 ? (
                  <span aria-hidden="true" className="text-canopy-300">
                    /
                  </span>
                ) : null}
                {last ? (
                  <span aria-current="page" className="font-medium text-canopy-900">
                    {item.name}
                  </span>
                ) : (
                  <a className="underline-offset-4 hover:text-canopy-800 hover:underline" href={href}>
                    {item.name}
                  </a>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: absoluteUrl(localizedPath(locale, item.path)),
          })),
        }}
      />
    </>
  )
}
