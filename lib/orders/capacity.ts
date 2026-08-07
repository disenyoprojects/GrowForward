import { getFulfilment } from '@/lib/content'
import type { OrderStatus, Prisma } from '@/lib/generated/prisma/client'

/**
 * The client is always passed in rather than imported.
 *
 * Callers already hold one — usually a transaction — and importing the shared
 * client here would mean a `DATABASE_URL` was needed to work out whether twenty
 * is more than fifteen.
 */
type OrderClient = Pick<Prisma.TransactionClient, 'order'>

/** A rolling week, not a calendar one — capacity is about throughput. */
export const CAPACITY_WINDOW_DAYS = 7

/**
 * Orders that represent a basket someone has to physically pack.
 *
 * `PENDING_PAYMENT` is left out: most of those are abandoned checkouts, and
 * counting them would turn customers away to protect baskets nobody bought. The
 * tradeoff is a small oversell if several people pay in the same moment while
 * already at the limit — at this volume that is a phone call, whereas turning
 * away real orders every day is lost revenue.
 *
 * `CANCELLED` is left out because the basket is not being made.
 */
const COMMITTED: readonly OrderStatus[] = [
  'PAID',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
]

export function windowStart(now: Date = new Date()): Date {
  return new Date(now.getTime() - CAPACITY_WINDOW_DAYS * 24 * 60 * 60 * 1000)
}

/**
 * How many baskets are already committed in the current rolling week.
 *
 * Sums `quantity` rather than counting rows: one order for six baskets is six
 * baskets to pack.
 */
export async function basketsCommitted(
  client: OrderClient,
  now: Date = new Date(),
): Promise<number> {
  const result = await client.order.aggregate({
    _sum: { quantity: true },
    where: {
      status: { in: [...COMMITTED] },
      createdAt: { gte: windowStart(now) },
    },
  })

  return result._sum.quantity ?? 0
}

export interface CapacityCheck {
  readonly withinCapacity: boolean
  readonly capacity: number | null
  readonly committed: number
  readonly remaining: number | null
}

/**
 * Whether this order fits in what is left of the week.
 *
 * A `null` capacity means the business has not given a number yet, and nothing
 * is enforced — see content/fulfilment.ts.
 */
export async function checkCapacity(
  quantity: number,
  client: OrderClient,
  now: Date = new Date(),
): Promise<CapacityCheck> {
  const { weeklyBasketCapacity: capacity } = getFulfilment()

  if (capacity === null) {
    return {
      withinCapacity: true,
      capacity: null,
      committed: 0,
      remaining: null,
    }
  }

  const committed = await basketsCommitted(client, now)
  const remaining = Math.max(0, capacity - committed)

  return {
    withinCapacity: quantity <= remaining,
    capacity,
    committed,
    remaining,
  }
}
