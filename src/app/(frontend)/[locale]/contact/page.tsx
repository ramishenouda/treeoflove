import { ContactForm } from '@/components/contact-form'
import { MailIcon, PhoneIcon, PinIcon } from '@/components/icons'
import { PageHero } from '@/components/page-hero'
import { Container } from '@/components/ui'
import { getSiteSettings } from '@/lib/cms'
import { getDictionary, requireLocale } from '@/lib/i18n'
import { pageMetadata, titleFrom } from '@/lib/seo'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const [settings, dictionary] = await Promise.all([getSiteSettings(locale), getDictionary(locale)])
  return pageMetadata({
    title: titleFrom(null, dictionary.contact.title, settings.siteName),
    description: dictionary.contact.description,
    path: '/contact',
    locale,
  })
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const locale = await requireLocale(params)
  const dictionary = await getDictionary(locale)
  const settings = await getSiteSettings(locale)
  const details: { icon: React.ReactElement; label: string; value: string; href?: string }[] = []
  if (settings.footerEmail) {
    details.push({
      icon: <MailIcon />,
      label: dictionary.contactForm.email,
      value: settings.footerEmail,
      href: `mailto:${settings.footerEmail}`,
    })
  }
  if (settings.footerPhone) {
    details.push({ icon: <PhoneIcon />, label: dictionary.contact.phone, value: settings.footerPhone })
  }
  if (settings.footerLocation) {
    details.push({ icon: <PinIcon />, label: dictionary.contact.location, value: settings.footerLocation })
  }

  return (
    <main>
      <PageHero
        description={dictionary.contact.description}
        eyebrow={dictionary.contact.eyebrow}
        title={dictionary.contact.title}
      />
      <Container className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12">
        {details.length ? (
          <ul className="space-y-4">
            {details.map((item) => (
              <li key={item.label} className="flex gap-4 rounded-3xl bg-white p-6 shadow-soft ring-1 ring-canopy-900/5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy-700">
                  {item.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm text-ink/60">{item.label}</p>
                  {item.href ? (
                    <a className="break-all font-semibold text-canopy-900 hover:underline" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    <p className="whitespace-pre-line font-semibold text-canopy-900">{item.value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div />
        )}
        <div className="rounded-4xl bg-white p-6 shadow-lift ring-1 ring-canopy-900/5 sm:p-10">
          <h2 className="font-display text-2xl font-semibold text-canopy-950">
            {dictionary.footer.sendMessage}
          </h2>
          <ContactForm dictionary={dictionary} locale={locale} />
        </div>
      </Container>
    </main>
  )
}
