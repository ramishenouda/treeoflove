'use server'

import config from '@payload-config'
import { getPayload } from 'payload'
import { Resend } from 'resend'

export type ContactState = { ok: true } | { ok: false; error: string } | null

function clean(value: FormDataEntryValue | null, max: number) {
  return String(value ?? '').trim().slice(0, max)
}

export async function sendMessage(_previous: ContactState, formData: FormData): Promise<ContactState> {
  if (clean(formData.get('website'), 200)) return { ok: true }

  const name = clean(formData.get('name'), 80)
  const email = clean(formData.get('email'), 200)
  const message = clean(formData.get('message'), 4000)
  const consent = formData.get('consent') === 'on'

  if (name.length < 1) return { ok: false, error: 'Enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Enter a valid email address.' }
  if (message.length < 1) return { ok: false, error: 'Enter a message.' }
  if (!consent) return { ok: false, error: 'Agree to the privacy policy before sending.' }

  const payload = await getPayload({ config })
  await payload.create({
    collection: 'messages',
    overrideAccess: true,
    data: { name, email, message, consent: true },
  })

  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })
  const to = settings.notificationEmail || settings.footerEmail
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.RESEND_FROM

  if (apiKey && from && to) {
    const resend = new Resend(apiKey)
    const sent = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `Message from ${name}`,
      text: `${name} (${email}) wrote:\n\n${message}\n\nThey agreed to the privacy policy.`,
    })
    if (sent.error) console.error('Contact notification email failed')
  } else {
    console.error('Contact notification email is not configured')
  }

  return { ok: true }
}
