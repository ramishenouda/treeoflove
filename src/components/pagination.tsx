import type { Dictionary, Locale } from '@/lib/i18n'
import { localizedPath } from '@/lib/i18n'
import { listPath } from '@/lib/site'

const pill = 'inline-flex h-11 min-w-11 items-center justify-center rounded-full px-4 text-sm font-semibold transition'
const idle = 'bg-white text-canopy-900 ring-1 ring-canopy-900/15 hover:ring-canopy-900/35'

export function Pagination({
  base,
  page,
  totalPages,
  locale,
  dictionary,
  params,
}: {
  base: string
  page: number
  totalPages: number
  locale: Locale
  dictionary: Dictionary
  params?: Record<string, string | undefined>
}) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
  const href = (number: number) => localizedPath(locale, listPath(base, number, params))

  return (
    <nav aria-label={dictionary.common.pagination} className="mt-14 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <a className={`${pill} ${idle}`} href={href(page - 1)}>
          {dictionary.common.previous}
        </a>
      ) : null}
      {pages.map((number) => (
        <a
          key={number}
          aria-current={number === page ? 'page' : undefined}
          className={`${pill} ${number === page ? 'bg-canopy-800 text-paper' : idle}`}
          href={href(number)}
        >
          {number}
        </a>
      ))}
      {page < totalPages ? (
        <a className={`${pill} ${idle}`} href={href(page + 1)}>
          {dictionary.common.next}
        </a>
      ) : null}
    </nav>
  )
}
