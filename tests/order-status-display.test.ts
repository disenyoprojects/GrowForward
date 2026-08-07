import { describe, expect, it } from 'vitest'
import { showsAffiliateInvite } from '@/lib/orders/status-display'

describe('showsAffiliateInvite', () => {
  it.each(['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'] as const)(
    'invites a buyer whose payment has landed (%s)',
    (status) => {
      expect(showsAffiliateInvite(status)).toBe(true)
    },
  )

  // The two that are wrong to ask in, and why — see the note on INVITED.
  it('never asks while the payment is still pending', () => {
    expect(showsAffiliateInvite('PENDING_PAYMENT')).toBe(false)
  })

  it('never asks on a cancelled order', () => {
    expect(showsAffiliateInvite('CANCELLED')).toBe(false)
  })
})
