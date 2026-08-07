import type { OrderStatus } from '@/lib/generated/prisma/client'

/**
 * Whether the order confirmation page invites this buyer to become an affiliate.
 *
 * An allowlist rather than "anything but pending", because two different states
 * are wrong to ask in, for two different reasons:
 *
 * - `PENDING_PAYMENT` — they are still being asked to trust us with money. Ask
 *   them to sell for us in the same breath and we look like we want the referral
 *   more than we want to deliver the basket.
 * - `CANCELLED` — the gift is not happening. "Earn on every basket they send"
 *   under a cancelled order reads as though nobody noticed.
 *
 * New statuses therefore have to opt in here deliberately, which is the point.
 */
const INVITED: readonly OrderStatus[] = ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED']

export function showsAffiliateInvite(status: OrderStatus): boolean {
  return INVITED.includes(status)
}
