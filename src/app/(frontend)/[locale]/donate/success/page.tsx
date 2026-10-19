import { HeartIcon } from '@/components/icons'
import { StatusPanel } from '@/components/status-panel'
import { ButtonLink } from '@/components/ui'
import { getSiteSettings } from '@/lib/cms'
import { getDictionary, localizedPath, requireLocale } from '@/lib/i18n'
import { pageMetadata, titleFrom } from '@/lib/seo'
import { getStripe } from '@/lib/stripe'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  return pageMetadata({
    title: titleFrom(null, dictionary.status.successTitle, settings.siteName),
    description: dictionary.status.successBody,
    path: '/donate/success',
    locale,
    noindex: true,
  })
}

export default async function DonateSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ session_id?: string }>
}) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const { session_id: sessionId } = await searchParams
  const stripe = getStripe()
  let title: string = dictionary.status.successTitle
  let body: string = dictionary.status.successBody

  if (stripe && sessionId) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId)
      if (session.payment_status === 'paid') {
        body = dictionary.status.successBody
      } else if (session.payment_status === 'unpaid') {
        title = dictionary.status.successTitle
        body = dictionary.status.successBody
      } else {
        title = dictionary.status.cancelTitle
        body = dictionary.status.cancelBody
      }
    } catch {
      body = dictionary.status.successBody
    }
  }

  return (
    <StatusPanel body={body} icon={<HeartIcon className="h-7 w-7" />} title={title}>
      <ButtonLink href={localizedPath(locale, '/')} size="lg" variant="primary">
        {dictionary.status.backHome}
      </ButtonLink>
      <ButtonLink href={localizedPath(locale, '/news')} size="lg" variant="outline">
        {dictionary.home.newsMore}
      </ButtonLink>
    </StatusPanel>
  )
}
