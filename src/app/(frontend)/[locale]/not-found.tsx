import { headers } from 'next/headers'

import { LeafIcon } from '@/components/icons'
import { StatusPanel } from '@/components/status-panel'
import { ButtonLink } from '@/components/ui'
import { getDictionary, localizedPath, parseLocale } from '@/lib/i18n'

export default async function NotFound() {
  const locale = parseLocale((await headers()).get('x-locale'))
  const dictionary = await getDictionary(locale)

  return (
    <StatusPanel
      body={dictionary.status.notFoundBody}
      icon={<LeafIcon className="h-7 w-7" />}
      title={dictionary.status.notFoundTitle}
    >
      <ButtonLink href={localizedPath(locale, '/')} size="lg" variant="primary">
        {dictionary.status.backHome}
      </ButtonLink>
      <ButtonLink href={localizedPath(locale, '/programs')} size="lg" variant="outline">
        {dictionary.common.seePrograms}
      </ButtonLink>
    </StatusPanel>
  )
}
