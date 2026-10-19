import { CheckIcon, HeartIcon } from '@/components/icons'
import { ButtonLink } from '@/components/ui'
import type { Dictionary } from '@/lib/i18n'
import { t } from '@/lib/i18n'

export function DonateAside({
  href,
  name,
  dictionary,
  sticky = true,
}: {
  href: string
  name?: string
  dictionary: Dictionary
  sticky?: boolean
}) {
  const d = dictionary.donate
  return (
    <aside
      aria-label={dictionary.donateAside.label}
      className={`rounded-3xl bg-white p-6 shadow-lift ring-1 ring-canopy-900/5 sm:p-7 ${sticky ? 'lg:sticky lg:top-28' : ''}`}
    >
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-sun-100 text-clay-500">
          <HeartIcon className="h-5 w-5" />
        </span>
        <p className="font-display text-xl font-semibold text-canopy-950">
          {name ? t(d.supportName, { name }) : d.supportGeneral}
        </p>
      </div>
      <p className="mt-3 text-ink/70">{name ? t(d.giftGoesTo, { name }) : d.giftGeneral}</p>
      <ButtonLink className="mt-6 w-full" href={href} size="lg" variant="donate">
        {name ? t(d.donateToName, { name }) : dictionary.nav.donate}
      </ButtonLink>
      <ul className="mt-5 space-y-2 text-sm text-ink/65">
        <li className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 text-canopy-600" />
          {d.cardOrSepa}
        </li>
        <li className="flex items-center gap-2">
          <CheckIcon className="h-4 w-4 text-canopy-600" />
          {d.receiptByStripe}
        </li>
      </ul>
    </aside>
  )
}
