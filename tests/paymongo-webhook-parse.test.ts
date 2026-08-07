import { describe, expect, it } from 'vitest'
import { parseEvent } from '@/lib/paymongo/event'

/**
 * PayMongo wraps the thing that changed inside `data.attributes.data`, and what
 * sits there differs per event. These tests pin which id ends up on the order,
 * because storing a checkout session id under the payment field looks correct
 * until someone tries to trace a refund and finds nothing.
 */

function checkoutSessionPaid({
  payments,
}: {
  payments?: readonly { id: string }[]
}) {
  return {
    data: {
      id: 'evt_abc',
      type: 'event',
      attributes: {
        type: 'checkout_session.payment.paid',
        data: {
          id: 'cs_session123',
          type: 'checkout_session',
          attributes: {
            reference_number: 'GF-2026-0002',
            metadata: { orderId: 'order_1' },
            ...(payments ? { payments } : {}),
          },
        },
      },
    },
  }
}

describe('parseEvent', () => {
  it('takes the payment id from the session payments array', () => {
    const event = parseEvent(checkoutSessionPaid({ payments: [{ id: 'pay_real1' }] }))

    expect(event?.paymentId).toBe('pay_real1')
  })

  it('never mistakes the checkout session id for a payment id', () => {
    const event = parseEvent(checkoutSessionPaid({ payments: [{ id: 'pay_real1' }] }))

    expect(event?.paymentId).not.toBe('cs_session123')
  })

  it('returns no payment id when the session carries no payments', () => {
    const event = parseEvent(checkoutSessionPaid({}))

    expect(event?.paymentId).toBeUndefined()
  })

  it('uses the resource id when the event delivers the payment itself', () => {
    const event = parseEvent({
      data: {
        id: 'evt_def',
        type: 'event',
        attributes: {
          type: 'payment.paid',
          data: {
            id: 'pay_direct1',
            type: 'payment',
            attributes: { metadata: { orderId: 'order_1' } },
          },
        },
      },
    })

    expect(event?.paymentId).toBe('pay_direct1')
  })

  it('still reads the order reference alongside the payment id', () => {
    const event = parseEvent(checkoutSessionPaid({ payments: [{ id: 'pay_real1' }] }))

    expect(event?.orderId).toBe('order_1')
    expect(event?.referenceNumber).toBe('GF-2026-0002')
    expect(event?.type).toBe('checkout_session.payment.paid')
  })

  it('rejects a payload with no event id or type', () => {
    expect(parseEvent({ data: { attributes: {} } })).toBeNull()
    expect(parseEvent({})).toBeNull()
    expect(parseEvent(null)).toBeNull()
  })
})
