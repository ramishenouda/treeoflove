import type Stripe from 'stripe'

import { readGiftMeta, recordDonation } from '@/lib/donations'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

function giftFromSession(session: Stripe.Checkout.Session) {
  if (session.mode !== 'payment' || session.payment_status !== 'paid' || !session.amount_total || !session.id) {
    return null
  }
  const meta = readGiftMeta(session.metadata)
  if (!meta || meta.frequency !== 'once') return null
  return {
    ...meta,
    stripeId: session.id,
    amountCents: session.amount_total,
    paidAt: new Date((session.created || Math.floor(Date.now() / 1000)) * 1000),
  }
}

async function giftFromInvoice(stripe: Stripe, invoice: Stripe.Invoice) {
  let metadata = invoice.parent?.subscription_details?.metadata ?? null
  if (!metadata?.targetType) {
    const subscription = invoice.parent?.subscription_details?.subscription
    const subscriptionId = typeof subscription === 'string' ? subscription : subscription?.id
    if (!subscriptionId) return null
    const retrieved = await stripe.subscriptions.retrieve(subscriptionId)
    metadata = retrieved.metadata
  }
  const meta = readGiftMeta(metadata)
  if (!meta || meta.frequency !== 'monthly' || !invoice.amount_paid || !invoice.id) return null
  const paidAt = invoice.status_transitions.paid_at || invoice.created || Math.floor(Date.now() / 1000)
  return {
    ...meta,
    stripeId: invoice.id,
    amountCents: invoice.amount_paid,
    paidAt: new Date(paidAt * 1000),
  }
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) return new Response('Stripe webhook is not configured', { status: 500 })

  const signature = request.headers.get('stripe-signature')
  if (!signature) return new Response('Invalid signature', { status: 400 })

  const body = await request.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret)
  } catch {
    return new Response('Invalid signature', { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const gift = giftFromSession(event.data.object)
      if (gift) await recordDonation(gift)
    } else if (event.type === 'invoice.paid') {
      const gift = await giftFromInvoice(stripe, event.data.object)
      if (gift) await recordDonation(gift)
    }
  } catch (error) {
    console.error('Donation log failed')
    console.error(error instanceof Error ? error.message : 'Unknown webhook error')
    return new Response('Donation log failed', { status: 500 })
  }

  return new Response('ok')
}
