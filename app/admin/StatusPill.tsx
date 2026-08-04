import type { OrderStatus } from '@/lib/generated/prisma/client'

/**
 * Status as a shape as well as a word, so an order needing attention reads at a
 * glance rather than on close inspection.
 */
export function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`admin-pill admin-pill-${status.toLowerCase()}`}>
      {status.replace('_', ' ').toLowerCase()}
    </span>
  )
}
