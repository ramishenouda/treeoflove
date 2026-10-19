import type { Metadata } from 'next'
import { Fraunces, Plus_Jakarta_Sans } from 'next/font/google'
import { notFound } from 'next/navigation'

import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getSiteSettings } from '@/lib/cms'
import { getDictionary, isLocale, locales, type Locale } from '@/lib/i18n'
import { siteUrl } from '@/lib/site'

const display = Fraunces({ subsets: ['latin'], variable: '--font-heading', display: 'swap' })
const body = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-body', display: 'swap' })

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLocale(raw)) return {}
  const settings = await getSiteSettings(raw)
  return {
    metadataBase: new URL(siteUrl()),
    title: { absolute: settings.siteName },
    description: settings.tagline || 'Tree of Love',
    alternates: {
      languages: Object.fromEntries(locales.map((code) => [code, `/${code}`])),
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: raw } = await params
  if (!isLocale(raw)) notFound()
  const locale: Locale = raw
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])

  return (
    <html className={`${display.variable} ${body.variable}`} lang={locale}>
      <body className="flex min-h-screen flex-col bg-paper font-sans text-ink antialiased">
        <a
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift"
          href="#content"
        >
          {dictionary.skipToContent}
        </a>
        <SiteHeader dictionary={dictionary} locale={locale} settings={settings} />
        <div className="flex-1" id="content">
          {children}
        </div>
        <SiteFooter dictionary={dictionary} locale={locale} settings={settings} />
      </body>
    </html>
  )
}
