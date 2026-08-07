import { db } from '@/lib/db'
import { buildOrderMergeVars } from '@/lib/email/order-vars'
import { sendOrderEmail } from '@/lib/email/send'
import type { Order } from '@/lib/generated/prisma/client'

/**
 * Marks an order paid and sends the two automatic emails.
 *
 * Safe to call more than once: an order that is already past PENDING_PAYMENT is
 * left alone, and the email log's unique constraint stops duplicate sends even
 * if two webhook deliveries race.
 */
export async function markOrderPaid({
  orderId,
  paymongoPaymentId,
}: {
  orderId: string
  paymongoPaymentId?: string
}): Promise<{ order: Order; alreadyPaid: boolean }> {
  const existing = await db.order.findUnique({ where: { id: orderId } })

  if (!existing) {
    throw new Error(`Order ${orderId} not found`)
  }

  if (existing.status !== 'PENDING_PAYMENT') {
    return { order: existing, alreadyPaid: true }
  }

  const order = await db.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        ...(paymongoPaymentId ? { paymongoPaymentId } : {}),
      },
    })

    await tx.orderEvent.create({
      data: {
        orderId,
        type: 'payment.paid',
        actor: 'system',
        payload: { paymongoPaymentId: paymongoPaymentId ?? null },
      },
    })

    return updated
  })

  await sendPaidOrderEmails(order)

  return { order, alreadyPaid: false }
}

/**
 * The three emails a paid order sends.
 *
 * All three go to the buyer, including the gift card — the personalize form
 * promises "your order confirmation and gift card are sent here", and no
 * recipient email address is ever collected. The card is written to be
 * forwarded or printed by the buyer, who decides when the surprise lands.
 *
 * Failures are logged but never thrown: the payment already succeeded, and
 * making the webhook fail would only make PayMongo retry a payment we have
 * already recorded. Undelivered mail is visible in `email_log`.
 */
async function sendPaidOrderEmails(order: Order): Promise<void> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? ''
  const vars = buildOrderMergeVars(order, siteUrl)

  for (const template of [
    'order-confirmation',
    'payment-confirmation',
    'gift-card',
  ] as const) {
    const result = await sendOrderEmail({
      orderId: order.id,
      template,
      to: order.buyerEmail,
      vars,
    })

    if (result.status === 'failed') {
      console.error(
        `Order ${order.orderNumber}: ${template} email failed — ${result.error}`,
      )
    }
  }
}
