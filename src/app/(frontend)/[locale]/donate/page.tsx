import { CmsImage } from '@/components/cms-image'
import { Blob, Sprig, TreeMark } from '@/components/decor'
import { DonateForm } from '@/components/donate-form'
import { CheckIcon, HeartIcon } from '@/components/icons'
import { Container, Eyebrow } from '@/components/ui'
import { getChild, getProgram, getSiteSettings, isMedia } from '@/lib/cms'
import { getDictionary, requireLocale, t } from '@/lib/i18n'
import { pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ program?: string; child?: string }>
}) {
  const [locale, query] = await Promise.all([requireLocale(params), searchParams])
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  return pageMetadata({
    title: titleFrom(null, dictionary.donate.title, settings.siteName),
    description: dictionary.donate.description,
    path: '/donate',
    locale,
    noindex: Boolean(query.program || query.child),
  })
}

export default async function DonatePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ program?: string; child?: string }>
}) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const { program, child } = await searchParams
  const [settings, programDoc, childDoc] = await Promise.all([
    getSiteSettings(locale),
    program ? getProgram(program, locale) : Promise.resolve(null),
    child ? getChild(child, locale) : Promise.resolve(null),
  ])
  const amounts = (settings.suggestedAmounts ?? [])
    .map((item) => item.amount)
    .filter((amount): amount is number => typeof amount === 'number' && amount >= (settings.minimumAmount || 1))
  const choices = amounts.length ? amounts : [10, 25, 50, 100]
  const initialTarget = childDoc?.acceptDonations
    ? { kind: 'child' as const, id: childDoc.id, name: childDoc.firstName }
    : programDoc?.acceptDonations
      ? { kind: 'program' as const, id: programDoc.id, name: programDoc.title }
      : { kind: 'general' as const, name: dictionary.donate.generalFund }
  const targetImage =
    initialTarget.kind === 'child' && isMedia(childDoc?.photo)
      ? childDoc.photo
      : initialTarget.kind === 'program' && isMedia(programDoc?.cover)
        ? programDoc.cover
        : null
  const assurances = [
    dictionary.donate.onceOrMonthly,
    dictionary.donate.cardOrSepa,
    dictionary.donate.receiptByStripe,
    dictionary.donate.detailsStayWithStripe,
  ]

  return (
    <main className="hero-wash">
      <Container className="grid items-start gap-10 pb-6 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 lg:pt-20">
        <div>
          <Eyebrow>{dictionary.donate.eyebrow}</Eyebrow>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-canopy-950 sm:text-5xl lg:text-6xl">
            {dictionary.donate.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink/75">{dictionary.donate.description}</p>

          {targetImage ? (
            <figure className="relative mt-10 hidden sm:block">
              <Blob className="absolute -inset-8 translate-x-6 translate-y-6 text-sun-200" />
              <div className="relative -rotate-1 rounded-4xl bg-white p-2.5 shadow-lift">
                <CmsImage
                  className="aspect-[4/3] w-full rounded-[1.6rem] object-cover"
                  media={targetImage}
                  priority
                  sizes="(min-width: 1024px) 40vw, 90vw"
                />
              </div>
              <figcaption className="absolute bottom-6 left-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-canopy-950 shadow-soft">
                <HeartIcon className="h-4 w-4 text-clay-500" />
                {t(dictionary.donate.giftGoesTo, { name: initialTarget.name })}
              </figcaption>
            </figure>
          ) : (
            <div className="relative mt-10 hidden overflow-hidden rounded-4xl bg-canopy-900 p-10 text-paper sm:block">
              <Blob className="absolute -right-20 -top-20 h-72 w-72 text-canopy-800" />
              <Sprig className="absolute bottom-6 right-8 h-20 w-20 text-sun-400/40" />
              <TreeMark className="relative h-14 w-14" />
              <p className="relative mt-6 max-w-sm font-display text-2xl leading-snug">
                {settings.tagline || settings.siteName}
              </p>
            </div>
          )}

          <ul className="relative mt-10 grid gap-3 sm:grid-cols-2">
            {assurances.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-ink/75">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canopy-100 text-canopy-700">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-4xl bg-white p-6 shadow-lift ring-1 ring-canopy-900/5 sm:p-10 lg:sticky lg:top-28">
          <DonateForm
            amounts={choices}
            dictionary={dictionary}
            initialTarget={initialTarget}
            locale={locale}
            minimumAmount={settings.minimumAmount || 5}
            stripeReady={Boolean(process.env.STRIPE_SECRET_KEY)}
          />
        </div>
      </Container>
    </main>
  )
}
