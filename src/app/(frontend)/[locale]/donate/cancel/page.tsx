import { LeafIcon } from '@/components/icons'
import { StatusPanel } from '@/components/status-panel'
import { ButtonLink } from '@/components/ui'
import { getSiteSettings } from '@/lib/cms'
import { getDictionary, localizedPath, requireLocale } from '@/lib/i18n'
import { pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  return pageMetadata({
    title: titleFrom(null, dictionary.status.cancelTitle, settings.siteName),
    description: dictionary.status.cancelBody,
    path: '/donate/cancel',
    locale,
    noindex: true,
  })
}

export default async function DonateCancelPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)

  return (
    <StatusPanel
      body={dictionary.status.cancelBody}
      icon={<LeafIcon className="h-7 w-7" />}
      title={dictionary.status.cancelTitle}
    >
      <ButtonLink href={localizedPath(locale, '/donate')} size="lg" variant="donate">
        {dictionary.status.tryAgain}
      </ButtonLink>
      <ButtonLink href={localizedPath(locale, '/')} size="lg" variant="outline">
        {dictionary.status.backHome}
      </ButtonLink>
    </StatusPanel>
  )
}
