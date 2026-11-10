import config from '@payload-config'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { safePreviewPath } from '@/lib/preview'

export const dynamic = 'force-dynamic'

/** Turns on preview for signed-in staff, then opens the page. Used by the admin Preview button and Live Preview. */
export async function GET(request: Request) {
  const path = safePreviewPath(new URL(request.url).searchParams.get('path'))
  if (!path) return new Response('Unknown page.', { status: 400 })

  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return new Response('Sign in to the admin to preview unpublished pages.', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()
  redirect(path)
}
