import config from '@payload-config'
import { getPayload } from 'payload'
import type Stripe from 'stripe'

import { eurosFromCents } from '@/lib/money'

export type GiftFrequency = 'once' | 'monthly'
export type GiftTargetType = 'general' | 'program' | 'child'

export type GiftMeta = {
  frequency: GiftFrequency
  targetType: GiftTargetType
  targetName: string
  targetId?: string
}

export function readGiftMeta(metadata: Stripe.Metadata | null | undefined): GiftMeta | null {
  if (!metadata) return null
  const { targetType, frequency } = metadata
  const targetName = metadata.targetName?.trim()
  if (
    (targetType !== 'general' && targetType !== 'program' && targetType !== 'child') ||
    (frequency !== 'once' && frequency !== 'monthly') ||
    !targetName
  ) {
    return null
  }
  return {
    frequency,
    targetType,
    targetName: targetName.slice(0, 200),
    targetId: metadata.targetId || undefined,
  }
}

export async function recordDonation(input: GiftMeta & { stripeId: string; amountCents: number; paidAt: Date }) {
  const payload = await getPayload({ config })
  const existing = await payload.find({
    collection: 'donations',
    overrideAccess: true,
    depth: 0,
    limit: 1,
    where: { stripeId: { equals: input.stripeId } },
  })
  if (existing.docs.length) return

  const targetId = input.targetId && /^\d+$/.test(input.targetId) ? Number(input.targetId) : undefined
  let program: number | undefined
  let child: number | undefined

  if (input.targetType === 'program' && targetId) {
    const found = await payload.find({
      collection: 'programs',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { id: { equals: targetId } },
    })
    if (found.docs[0]) program = targetId
  }

  if (input.targetType === 'child' && targetId) {
    const found = await payload.find({
      collection: 'children',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { id: { equals: targetId } },
    })
    if (found.docs[0]) child = targetId
  }

  try {
    await payload.create({
      collection: 'donations',
      overrideAccess: true,
      data: {
        amount: eurosFromCents(input.amountCents),
        frequency: input.frequency,
        targetType: input.targetType,
        targetName: input.targetName,
        program,
        child,
        stripeId: input.stripeId,
        paidAt: input.paidAt.toISOString(),
      },
    })
  } catch (error) {
    const again = await payload.find({
      collection: 'donations',
      overrideAccess: true,
      depth: 0,
      limit: 1,
      where: { stripeId: { equals: input.stripeId } },
    })
    if (again.docs.length) return
    throw error
  }
}
