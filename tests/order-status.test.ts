import { describe, expect, it } from 'vitest'
import {
  OrderStatusError,
  assertTransition,
  canTransition,
  nextStatuses,
  requiresTracking,
} from '@/lib/admin/order-status'

describe('canTransition', () => {
  it.each([
    ['PAID', 'PREPARING'],
    ['PREPARING', 'SHIPPED'],
    ['SHIPPED', 'DELIVERED'],
    ['PENDING_PAYMENT', 'CANCELLED'],
    ['PAID', 'CANCELLED'],
    ['PREPARING', 'CANCELLED'],
  ] as const)('allows %s → %s', (from, to) => {
    expect(canTransition(from, to)).toBe(true)
  })

  // Marking an order paid is the payment webhook's job. If staff could do it by
  // hand, an unpaid basket could ship.
  it('never lets staff move an order into PAID', () => {
    expect(canTransition('PENDING_PAYMENT', 'PAID')).toBe(false)
  })

  it.each([
    ['DELIVERED', 'SHIPPED'],
    ['SHIPPED', 'PREPARING'],
    ['PREPARING', 'PAID'],
  ] as const)('refuses to walk %s back to %s', (from, to) => {
    expect(canTransition(from, to)).toBe(false)
  })

  it.each(['DELIVERED', 'CANCELLED'] as const)('treats %s as terminal', (from) => {
    expect(nextStatuses(from)).toEqual([])
  })

  it('refuses a no-op transition', () => {
    expect(canTransition('PAID', 'PAID')).toBe(false)
  })

  it('does not let an order skip fulfilment steps', () => {
    expect(canTransition('PAID', 'SHIPPED')).toBe(false)
    expect(canTransition('PAID', 'DELIVERED')).toBe(false)
  })
})

describe('nextStatuses', () => {
  it('offers only what staff may actually pick', () => {
    expect(nextStatuses('PAID')).toEqual(['PREPARING', 'CANCELLED'])
    expect(nextStatuses('SHIPPED')).toEqual(['DELIVERED'])
  })

  // A shipped order is on a courier's van. "Cancelled" is no longer something a
  // click can make true.
  it('stops offering cancellation once the basket has shipped', () => {
    expect(nextStatuses('SHIPPED')).not.toContain('CANCELLED')
  })
})

describe('requiresTracking', () => {
  it('demands courier details when shipping', () => {
    expect(requiresTracking('SHIPPED')).toBe(true)
  })

  it('does not demand them for any other status', () => {
    expect(requiresTracking('PREPARING')).toBe(false)
    expect(requiresTracking('DELIVERED')).toBe(false)
    expect(requiresTracking('CANCELLED')).toBe(false)
  })
})

describe('assertTransition', () => {
  it('passes a legal move', () => {
    expect(() => assertTransition('PAID', 'PREPARING')).not.toThrow()
  })

  it('names both ends of an illegal move, so the log is readable', () => {
    expect(() => assertTransition('DELIVERED', 'PREPARING')).toThrow(
      OrderStatusError,
    )
    expect(() => assertTransition('DELIVERED', 'PREPARING')).toThrow(
      /DELIVERED.*PREPARING/,
    )
  })
})
