import config from '@payload-config'
import { getPayload } from 'payload'
import type Stripe from 'stripe'

import { defaultLocale, localizedPath, parseLocale } from '@/lib/i18n'
import { parseEurosToCents } from '@/lib/money'
import { siteUrl } from '@/lib/site'
import { getStripe } from '@/lib/stripe'

export type CheckoutResult = { error: string } | { url: string }

const MAX_CENTS = 100_000 * 100

export async function createCheckoutSession(formData: FormData): Promise<CheckoutResult> {
  const stripe = getStripe()
  if (!stripe) return { error: 'Gifts are not open yet.' }

  const frequency = String(formData.get('frequency') || '')
  if (frequency !== 'once' && frequency !== 'monthly') {
    return { error: 'Choose a one-time gift or a monthly gift.' }
  }

  const targetType = String(formData.get('targetKind') || '')
  if (targetType !== 'general' && targetType !== 'program' && targetType !== 'child') {
    return { error: 'Choose where the gift goes.' }
  }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true, depth: 0 })
  const minimumCents = Math.max(1, Number(settings.minimumAmount) || 5) * 100
  const amountChoice = String(formData.get('amount') || '')
  const cents = parseEurosToCents(amountChoice === 'custom' ? String(formData.get('customAmount') || '') : amountChoice)
  if (cents === null || cents < minimumCents || cents > MAX_CENTS) {
    return { error: `Enter an amount of at least €${minimumCents / 100}.` }
  }

  const targetIdRaw = String(formData.get('targetId') || '')
  let targetId = ''
  let targetName = 'General fund'

  if (targetType === 'program' || targetType === 'child') {
    if (!/^\d+$/.test(targetIdRaw)) {
      return { error: targetType === 'program' ? 'Choose a program.' : 'Choose a child.' }
    }
    const id = Number(targetIdRaw)
    if (targetType === 'program') {
      const found = await payload.find({
        collection: 'programs',
        overrideAccess: false,
        depth: 0,
        limit: 1,
        where: { and: [{ id: { equals: id } }, { acceptDonations: { equals: true } }] },
      })
      const program = found.docs[0]
      if (!program) return { error: 'That program is not open for gifts.' }
      targetId = String(program.id)
      targetName = program.title
    } else {
      const found = await payload.find({
        collection: 'children',
        overrideAccess: false,
        depth: 0,
        limit: 1,
        select: { legalName: false, privateNotes: false },
        where: { and: [{ id: { equals: id } }, { acceptDonations: { equals: true } }] },
      })
      const child = found.docs[0]
      if (!child) return { error: 'That child is not open for gifts.' }
      targetId = String(child.id)
      targetName = child.firstName
    }
  }

  const metadata: Stripe.MetadataParam = {
    frequency,
    targetType,
    targetId,
    targetName: targetName.slice(0, 200),
  }
  const origin = siteUrl()
  const locale = parseLocale(String(formData.get('locale') || defaultLocale))

  try {
    const session = await stripe.checkout.sessions.create({
      mode: frequency === 'monthly' ? 'subscription' : 'payment',
      locale,
      submit_type: frequency === 'once' ? 'donate' : undefined,
      success_url: `${origin}${localizedPath(locale, '/donate/success')}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${localizedPath(locale, '/donate/cancel')}`,
      billing_address_collection: 'auto',
      allowed_payment_method_types: ['card', 'sepa_debit'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'eur',
            unit_amount: cents,
            recurring: frequency === 'monthly' ? { interval: 'month' } : undefined,
            product_data: {
              name: `Gift to ${targetName}`.slice(0, 120),
              description: frequency === 'monthly' ? 'Monthly gift' : 'One-time gift',
            },
          },
        },
      ],
      metadata,
      payment_intent_data: frequency === 'once' ? { metadata } : undefined,
      subscription_data: frequency === 'monthly' ? { metadata } : undefined,
    })
    if (!session.url) return { error: 'Stripe could not start the payment. Try again in a moment.' }
    return { url: session.url }
  } catch (error) {
    if (error instanceof stripe.errors.StripeError && error.message) return { error: error.message }
    return { error: 'Stripe could not start the payment. Try again in a moment.' }
  }
}
