import { z } from 'zod'
import { db } from '@/lib/db'
import type { Order, OrderStatus, Prisma } from '@/lib/generated/prisma/client'
import { buildOrderMergeVars } from '@/lib/email/order-vars'
import { sendOrderEmail } from '@/lib/email/send'
import type { TemplateName } from '@/lib/email/templates'
import { assertTransition, requiresTracking } from './order-status'

/** Which status change tells the customer what. Cancellation is handled by a person. */
const STATUS_EMAILS: Partial<Record<OrderStatus, TemplateName>> = {
  PREPARING: 'preparing-order',
  SHIPPED: 'shipping',
  DELIVERED: 'delivered',
}

export const transitionSchema = z
  .object({
    orderId: z.string().min(1),
    to: z.enum([
      'PENDING_PAYMENT',
      'PAID',
      'PREPARING',
      'SHIPPED',
      'DELIVERED',
      'CANCELLED',
    ]),
    courierName: z.string().trim().min(1).max(80).optional(),
    trackingNumber: z.string().trim().min(1).max(80).optional(),
  })
  .refine(
    (value) =>
      !requiresTracking(value.to) ||
      (value.courierName !== undefined && value.trackingNumber !== undefined),
    {
      message: 'A courier and tracking number are required to mark an order shipped.',
      path: ['trackingNumber'],
    },
  )

export type TransitionInput = z.infer<typeof transitionSchema>

/** Timestamps that belong to a status, so the order carries its own history. */
function timestampsFor(to: OrderStatus): Prisma.OrderUpdateInput {
  if (to === 'SHIPPED') return { shippedAt: new Date() }
  if (to === 'DELIVERED') return { deliveredAt: new Date() }
  return {}
}

/**
 * Moves an order to a new status, records who did it, and tells the customer.
 *
 * The status change and its audit row are written in one transaction: an order
 * whose status moved without a matching event would be a hole in the trail.
 *
 * The email is sent *after* the transaction commits, and its failure is
 * swallowed. A courier's tracking number is worth more than a notification —
 * losing the email is recoverable, losing the status change is not. Failures are
 * recorded in `email_log` either way, so nothing goes missing silently.
 */
export async function transitionOrder(
  input: TransitionInput,
  actor: string,
): Promise<Order> {
  const { orderId, to, courierName, trackingNumber } = transitionSchema.parse(input)

  const order = await db.order.findUnique({ where: { id: orderId } })

  if (!order) {
    throw new Error(`No order with id ${orderId}.`)
  }

  assertTransition(order.status, to)

  const updated = await db.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status: to,
        ...timestampsFor(to),
        ...(courierName ? { courierName } : {}),
        ...(trackingNumber ? { trackingNumber } : {}),
      },
    })

    await tx.orderEvent.create({
      data: {
        orderId,
        type: `status.${to.toLowerCase()}`,
        actor,
        payload: { from: order.status, to, courierName, trackingNumber },
      },
    })

    return next
  })

  const template = STATUS_EMAILS[to]

  if (template) {
    try {
      await sendOrderEmail({
        orderId,
        template,
        to: updated.buyerEmail,
        vars: buildOrderMergeVars(updated, process.env.NEXT_PUBLIC_SITE_URL ?? ''),
      })
    } catch (error) {
      console.error(`Could not send ${template} for order ${orderId}:`, error)
    }
  }

  return updated
}

/** Orders for the admin list, newest first. */
export async function listOrders(status?: OrderStatus) {
  return db.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: {
      id: true,
      orderNumber: true,
      status: true,
      buyerName: true,
      recipientName: true,
      collectionSlug: true,
      totalCentavos: true,
      trackingNumber: true,
      createdAt: true,
    },
  })
}

/** One order with its audit trail, for the detail screen. */
export async function getOrder(id: string) {
  return db.order.findUnique({
    where: { id },
    include: {
      events: { orderBy: { createdAt: 'desc' } },
      emailLogs: { orderBy: { createdAt: 'desc' } },
    },
  })
}

/** Counts per status, for the filter bar. */
export async function countsByStatus(): Promise<Record<string, number>> {
  const rows = await db.order.groupBy({ by: ['status'], _count: { _all: true } })

  return Object.fromEntries(rows.map((row) => [row.status, row._count._all]))
}
