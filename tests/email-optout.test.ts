import { describe, expect, it } from 'vitest'
import {
  isTransactional,
  normaliseEmail,
  unsubscribeLink,
  unsubscribeToken,
  verifyUnsubscribeToken,
} from '@/lib/email/optout'

const SECRET = 'a-test-secret-that-is-long-enough-to-sign-with'
const SITE = 'https://growforward.ph'

describe('unsubscribe tokens', () => {
  it('accepts the token it generated', () => {
    const token = unsubscribeToken('ana@example.com', SECRET)

    expect(verifyUnsubscribeToken('ana@example.com', token, SECRET)).toBe(true)
  })

  /**
   * The whole point of signing. Without it the link is an address in a query
   * string and anyone could unsubscribe anyone else by editing it.
   */
  it('refuses a token minted for a different address', () => {
    const token = unsubscribeToken('ana@example.com', SECRET)

    expect(verifyUnsubscribeToken('someone@else.com', token, SECRET)).toBe(false)
  })

  it('refuses a tampered token', () => {
    const token = unsubscribeToken('ana@example.com', SECRET)

    expect(
      verifyUnsubscribeToken('ana@example.com', `${token}x`, SECRET),
    ).toBe(false)
    expect(verifyUnsubscribeToken('ana@example.com', '', SECRET)).toBe(false)
  })

  it('refuses a token signed with a different secret', () => {
    const token = unsubscribeToken('ana@example.com', SECRET)

    expect(
      verifyUnsubscribeToken('ana@example.com', token, `${SECRET}-other`),
    ).toBe(false)
  })

  it('treats an address as the same person whatever the casing', () => {
    const token = unsubscribeToken('Ana@Example.com', SECRET)

    expect(verifyUnsubscribeToken('ana@example.com', token, SECRET)).toBe(true)
    expect(normaliseEmail('  Ana@Example.COM ')).toBe('ana@example.com')
  })
})

describe('the unsubscribe link', () => {
  it('points at a real page and carries a verifiable token', () => {
    const link = unsubscribeLink('ana@example.com', SITE, SECRET)
    const url = new URL(link)

    expect(url.pathname).toBe('/unsubscribe')

    const email = url.searchParams.get('email') ?? ''
    const token = url.searchParams.get('token') ?? ''

    expect(email).toBe('ana@example.com')
    expect(verifyUnsubscribeToken(email, token, SECRET)).toBe(true)
  })

  it('does not double up the slash after the site URL', () => {
    expect(unsubscribeLink('ana@example.com', `${SITE}/`, SECRET)).toContain(
      `${SITE}/unsubscribe`,
    )
    expect(unsubscribeLink('ana@example.com', `${SITE}/`, SECRET)).not.toContain(
      '.ph//',
    )
  })

  /**
   * This runs while rendering a receipt. A missing signing key must never be
   * the reason someone pays and gets no confirmation.
   */
  it('still produces a usable link when no secret is configured', () => {
    const previous = process.env.ADMIN_SESSION_SECRET
    delete process.env.ADMIN_SESSION_SECRET

    try {
      expect(() => unsubscribeLink('ana@example.com', SITE)).not.toThrow()
      expect(unsubscribeLink('ana@example.com', SITE)).toBe(
        `${SITE}/unsubscribe`,
      )
    } finally {
      if (previous !== undefined) process.env.ADMIN_SESSION_SECRET = previous
    }
  })

  it('escapes an address containing a plus', () => {
    const link = unsubscribeLink('ana+gifts@example.com', SITE, SECRET)

    expect(link).toContain('ana%2Bgifts%40example.com')
    expect(new URL(link).searchParams.get('email')).toBe(
      'ana+gifts@example.com',
    )
  })
})

describe('what unsubscribing actually stops', () => {
  /**
   * Withholding a receipt would mean taking someone's money and refusing to
   * confirm it. Unsubscribe is about marketing, and these must survive it.
   */
  it.each([
    'order-confirmation',
    'payment-confirmation',
    'gift-card',
    'preparing-order',
    'shipping',
    'delivered',
  ] as const)('still sends %s', (template) => {
    expect(isTransactional(template)).toBe(true)
  })

  it.each([
    'welcome',
    'abandoned-cart',
    'review-request',
    'share-your-garden',
    'affiliate-invitation',
    'corporate-followup',
    'seasonal-template',
  ] as const)('suppresses %s', (template) => {
    expect(isTransactional(template)).toBe(false)
  })
})
