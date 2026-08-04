import type { OrderStatus } from '@/lib/generated/prisma/client'

export class OrderStatusError extends Error {}

/**
 * What staff are allowed to do to an order, and in what order.
 *
 * Deliberately not a free-for-all dropdown. Two rules are load-bearing:
 *
 * - Nothing leads into `PAID`. Only the PayMongo webhook may mark an order
 *   paid; if a click could do it, an unpaid basket could ship.
 * - Nothing leads backwards. The order history is an audit trail, and a basket
 *   that has been delivered cannot become un-delivered by a mis-click.
 *
 * Cancellation stops being offered once the basket has shipped — at that point
 * it is on a courier's van, and no click makes "cancelled" true.
 */
const TRANSITIONS: Readonly<Record<OrderStatus, readonly OrderStatus[]>> = {
  PENDING_PAYMENT: ['CANCELLED'],
  PAID: ['PREPARING', 'CANCELLED'],
  PREPARING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

/** The statuses staff may move an order to from where it is now. */
export function nextStatuses(from: OrderStatus): readonly OrderStatus[] {
  return TRANSITIONS[from] ?? []
}

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return nextStatuses(from).includes(to)
}

/** Shipping without a courier and tracking number is not shipping. */
export function requiresTracking(to: OrderStatus): boolean {
  return to === 'SHIPPED'
}

/** Throws unless the move is legal. Names both ends so the failure is readable. */
export function assertTransition(from: OrderStatus, to: OrderStatus): void {
  if (!canTransition(from, to)) {
    throw new OrderStatusError(
      `An order cannot move from ${from} to ${to}.` +
        (nextStatuses(from).length > 0
          ? ` Allowed from ${from}: ${nextStatuses(from).join(', ')}.`
          : ` ${from} is final.`),
    )
  }
}
