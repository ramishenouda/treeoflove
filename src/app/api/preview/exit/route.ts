import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

import { safePreviewPath } from '@/lib/preview'
import { defaultLocale } from '@/lib/i18n/config'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const path = safePreviewPath(new URL(request.url).searchParams.get('path')) ?? `/${defaultLocale}`
  const draft = await draftMode()
  draft.disable()
  redirect(path)
}
