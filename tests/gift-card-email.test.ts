import { describe, expect, it } from 'vitest'
import { buildOrderMergeVars } from '@/lib/email/order-vars'
import { renderTemplate } from '@/lib/email/render'
import type { Order } from '@/lib/generated/prisma/client'

const SITE_URL = 'https://growforward.ph'

function order(overrides: Partial<Order> = {}): Order {
  return {
    id: 'order_1',
    orderNumber: 'GF-2026-0001',
    status: 'PAID',
    buyerName: 'Ana Reyes',
    buyerEmail: 'ana@example.com',
    buyerPhone: null,
    recipientName: 'Maria Santos',
    senderName: 'Ana',
    giftMessage: 'Happy birthday, Tita.',
    deliveryNotes: null,
    deliveryAddress: '12 Mabini Street, Quezon City',
    deliveryDateWanted: null,
    collectionSlug: 'chefs-garden',
    quantity: 1,
    totalCentavos: 249_500,
    currency: 'PHP',
    paymongoCheckoutSessionId: null,
    paymongoPaymentId: null,
    paidAt: null,
    courierName: null,
    trackingNumber: null,
    shippedAt: null,
    deliveredAt: null,
    guideToken: 'TOKEN123',
    guideFirstScannedAt: null,
    guideScanCount: 0,
    createdAt: new Date('2026-08-07'),
    updatedAt: new Date('2026-08-07'),
    ...overrides,
  } as Order
}

function render(source: Order) {
  return renderTemplate('gift-card', buildOrderMergeVars(source, SITE_URL), {
    siteUrl: SITE_URL,
  })
}

describe('the gift card email', () => {
  it('carries the recipient, the sender and the buyer’s own message', () => {
    const { html } = render(order())

    expect(html).toContain('Maria Santos')
    expect(html).toContain('Ana')
    expect(html).toContain('Happy birthday, Tita.')
  })

  /**
   * A blank merge tag renders as nothing, which would leave the card signed by
   * someone who apparently wrote nothing at all.
   */
  it('falls back to a card sentiment when no message was written', () => {
    const { html, missingTags } = render(order({ giftMessage: null }))

    expect(html).toContain('Something living, chosen just for you.')
    expect(missingTags).not.toContain('gift_card_message')
  })

  it('never leaves a literal merge tag in the card', () => {
    const { html, subject } = render(order({ giftMessage: null }))

    expect(html).not.toMatch(/\{\{\s*[a-z0-9_]+\s*\}\}/i)
    expect(subject).not.toMatch(/\{\{/)
  })

  /**
   * The buyer is told to forward this email, so anything on it reaches the
   * recipient. The delivery address and the buyer's email are not theirs to see.
   */
  it('leaks nothing about the buyer that a recipient should not read', () => {
    const { html } = render(order())

    expect(html).not.toContain('12 Mabini Street')
    expect(html).not.toContain('ana@example.com')
    expect(html).not.toContain('TOKEN123')
  })

  it('escapes a gift message containing markup', () => {
    const { html } = render(
      order({ giftMessage: '<img src=x onerror=alert(1)>' }),
    )

    expect(html).not.toContain('onerror=alert(1)>')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('names the collection being sent', () => {
    const { html } = render(order())

    expect(html).toContain("The Chef's Garden".replace(/'/g, '&#39;'))
  })
})
