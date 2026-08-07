/**
 * Unsubscribe links and what they do and do not stop.
 *
 * Deliberately free of any database import: the token functions are pure, and
 * pulling in a Prisma client here would mean a `DATABASE_URL` is needed just to
 * check a signature.
 */

import { createHmac, timingSafeEqual } from 'node:crypto'
import type { TemplateName } from './templates'

export class UnsubscribeError extends Error {}

/**
 * Emails that are sent regardless of whether someone has unsubscribed.
 *
 * These are transactional: they are about a specific order the person chose to
 * place, and withholding one would mean taking someone's money and refusing to
 * confirm it. Unsubscribing is about marketing, and the page says so plainly so
 * nobody is surprised when a receipt still arrives.
 *
 * Anything not listed here is treated as marketing and suppressed.
 */
const TRANSACTIONAL: ReadonlySet<string> = new Set<TemplateName>([
  'order-confirmation',
  'payment-confirmation',
  'gift-card',
  'preparing-order',
  'shipping',
  'delivered',
])

export function isTransactional(template: TemplateName): boolean {
  return TRANSACTIONAL.has(template)
}

/**
 * Addresses are compared lowercased, so `Ana@x.com` and `ana@x.com` are one
 * person — otherwise unsubscribing would silently fail to stop the mail.
 */
export function normaliseEmail(email: string): string {
  return email.trim().toLowerCase()
}

/**
 * The unsubscribe link has to be signed.
 *
 * Without a signature the link is just an address in a query string, and anyone
 * could unsubscribe anyone else by editing it.
 *
 * The key is derived from `ADMIN_SESSION_SECRET` with a domain separator rather
 * than using it raw, so an unsubscribe token can never be mistaken for — or
 * replayed as — a session token. Rotating that secret invalidates links in
 * already-sent email; the page handles that by pointing people at support
 * rather than failing silently.
 */
function signingKey(explicit?: string): string {
  const secret = explicit ?? process.env.ADMIN_SESSION_SECRET

  if (!secret) {
    throw new UnsubscribeError('ADMIN_SESSION_SECRET is not configured.')
  }

  return `unsubscribe:${secret}`
}

export function unsubscribeToken(email: string, secret?: string): string {
  return createHmac('sha256', signingKey(secret))
    .update(normaliseEmail(email))
    .digest('base64url')
}

export function verifyUnsubscribeToken(
  email: string,
  token: string,
  secret?: string,
): boolean {
  if (!email || !token) return false

  let expected: string

  try {
    expected = unsubscribeToken(email, secret)
  } catch {
    return false
  }

  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(token, 'utf8')

  // timingSafeEqual throws on a length mismatch, which itself leaks length.
  if (a.length !== b.length) return false

  return timingSafeEqual(a, b)
}

/**
 * The link that goes in every email footer.
 *
 * Falls back to the bare page if the secret is missing rather than throwing.
 * This runs while rendering a receipt: a missing signing key must never be the
 * reason someone pays and gets no confirmation. The unsigned link still reaches
 * a real page, which asks them to email us instead of failing silently.
 */
export function unsubscribeLink(
  email: string,
  siteUrl: string,
  secret?: string,
): string {
  const base = siteUrl.replace(/\/$/, '')
  const address = normaliseEmail(email)

  let token: string

  try {
    token = unsubscribeToken(address, secret)
  } catch (error) {
    console.error('Could not sign an unsubscribe link:', error)

    return `${base}/unsubscribe`
  }

  return `${base}/unsubscribe?email=${encodeURIComponent(address)}&token=${token}`
}

