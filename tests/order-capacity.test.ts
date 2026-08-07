import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { CAPACITY_WINDOW_DAYS, windowStart } from '@/lib/orders/capacity'

const contentModule = '@/lib/content'

/**
 * `checkCapacity` reads the configured number and asks the database for what is
 * already committed. Both are stubbed here so the rules can be tested without a
 * live database — what matters is the arithmetic and the null case.
 */
async function checkWith({
  capacity,
  committed,
  quantity,
}: {
  capacity: number | null
  committed: number
  quantity: number
}) {
  vi.doMock(contentModule, () => ({
    getFulfilment: () => ({
      weeklyBasketCapacity: capacity,
      atCapacityMessage: 'full',
    }),
  }))

  const { checkCapacity } = await import('@/lib/orders/capacity')

  const client = {
    order: {
      aggregate: async () => ({ _sum: { quantity: committed } }),
    },
  }

  return checkCapacity(quantity, client as never)
}

describe('the weekly basket limit', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    vi.doUnmock(contentModule)
  })

  /**
   * The state the project is actually in: nobody has said how many baskets can
   * be packed. A guessed cap would either turn away real customers or fail to
   * stop an oversell, so nothing is enforced until a real number arrives.
   */
  it('enforces nothing while no number has been confirmed', async () => {
    const result = await checkWith({
      capacity: null,
      committed: 9_999,
      quantity: 10,
    })

    expect(result.withinCapacity).toBe(true)
    expect(result.capacity).toBeNull()
    expect(result.remaining).toBeNull()
  })

  it('allows an order that fits in what is left', async () => {
    const result = await checkWith({ capacity: 20, committed: 15, quantity: 5 })

    expect(result.withinCapacity).toBe(true)
    expect(result.remaining).toBe(5)
  })

  it('refuses an order that would go one basket over', async () => {
    const result = await checkWith({ capacity: 20, committed: 15, quantity: 6 })

    expect(result.withinCapacity).toBe(false)
    expect(result.remaining).toBe(5)
  })

  it('refuses everything once the week is full', async () => {
    const result = await checkWith({ capacity: 20, committed: 20, quantity: 1 })

    expect(result.withinCapacity).toBe(false)
    expect(result.remaining).toBe(0)
  })

  /** An oversell already on the books must not report negative headroom. */
  it('never reports a negative amount remaining', async () => {
    const result = await checkWith({ capacity: 20, committed: 25, quantity: 1 })

    expect(result.remaining).toBe(0)
    expect(result.withinCapacity).toBe(false)
  })
})

describe('the capacity window', () => {
  it('looks back exactly a week', () => {
    const now = new Date('2026-08-07T12:00:00.000Z')

    expect(windowStart(now).toISOString()).toBe('2026-07-31T12:00:00.000Z')
    expect(CAPACITY_WINDOW_DAYS).toBe(7)
  })
})
