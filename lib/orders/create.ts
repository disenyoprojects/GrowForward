import { db } from '@/lib/db'
import { getCollectionBySlug, getFulfilment } from '@/lib/content'
import type { Order } from '@/lib/generated/prisma/client'
import { createCheckoutSession } from '@/lib/paymongo/client'
import { checkCapacity } from './capacity'
import { formatOrderNumber, generateGuideToken } from './identifiers'
import type { CreateOrderInput } from './schema'

export class OrderCreationError extends Error {}

function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL

  if (!url) {
    throw new Error('NEXT_PUBLIC_SITE_URL is not configured')
  }

  return url.replace(/\/$/, '')
}

/**
 * Creates a pending order and its PayMongo checkout session.
 *
 * The order row is written first, on purpose: if the customer closes the tab
 * mid-payment, the webhook can still find the order and complete it. Nothing
 * about the purchase depends on the browser making it back to our site.
 *
 * Prices come from the content modules, never from the request — a client that
 * posts its own amount cannot change what is charged.
 */
export async function createOrderWithCheckout(
  input: CreateOrderInput,
): Promise<{ order: Order; checkoutUrl: string }> {
  const collection = getCollectionBySlug(input.collectionSlug)

  if (!collection || collection.status !== 'live') {
    throw new OrderCreationError('That collection is not available to order.')
  }

  const totalCentavos = collection.priceCentavos * input.quantity
  const year = new Date().getFullYear()

  const order = await db.$transaction(async (tx) => {
    // Inside the transaction so two simultaneous orders cannot both read the
    // same count and both squeeze past the last free slot.
    const capacity = await checkCapacity(input.quantity, tx)

    if (!capacity.withinCapacity) {
      throw new OrderCreationError(getFulfilment().atCapacityMessage)
    }

    const placedThisYear = await tx.order.count({
      where: { createdAt: { gte: new Date(Date.UTC(year, 0, 1)) } },
    })

    const created = await tx.order.create({
      data: {
        orderNumber: formatOrderNumber(year, placedThisYear + 1),
        guideToken: generateGuideToken(),
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        recipientName: input.recipientName,
        senderName: input.senderName,
        giftMessage: input.giftMessage,
        deliveryAddress: input.deliveryAddress,
        deliveryNotes: input.deliveryNotes,
        deliveryDateWanted: input.deliveryDateWanted
          ? new Date(input.deliveryDateWanted)
          : null,
        collectionSlug: collection.slug,
        quantity: input.quantity,
        totalCentavos,
      },
    })

    await tx.orderEvent.create({
      data: {
        orderId: created.id,
        type: 'order.created',
        actor: 'system',
        payload: { collectionSlug: collection.slug, totalCentavos },
      },
    })

    return created
  })

  const base = siteUrl()

  try {
    const session = await createCheckoutSession({
      lineItems: [
        {
          name: collection.name,
          description: `GrowForward living gift for ${order.recipientName}`,
          amount: collection.priceCentavos,
          quantity: order.quantity,
        },
      ],
      referenceNumber: order.orderNumber,
      successUrl: `${base}/order/${order.guideToken}/confirmed`,
      cancelUrl: `${base}/collections/${collection.slug}?checkout=cancelled`,
      billingName: order.buyerName,
      billingEmail: order.buyerEmail,
      billingPhone: order.buyerPhone ?? undefined,
      metadata: { orderId: order.id, orderNumber: order.orderNumber },
    })

    const updated = await db.order.update({
      where: { id: order.id },
      data: { paymongoCheckoutSessionId: session.id },
    })

    return { order: updated, checkoutUrl: session.checkoutUrl }
  } catch (error) {
    console.error(
      `Checkout session failed for order ${order.orderNumber}:`,
      error,
    )

    await db.orderEvent.create({
      data: {
        orderId: order.id,
        type: 'checkout.failed',
        actor: 'system',
        payload: { message: error instanceof Error ? error.message : 'unknown' },
      },
    })

    throw new OrderCreationError(
      'We could not start the payment. Please try again in a moment.',
    )
  }
}
