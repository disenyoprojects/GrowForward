import { describe, expect, it } from 'vitest'
import {
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from '@/lib/admin/session'

const SECRET = 'a-test-secret-that-is-long-enough-to-pass'
const OTHER_SECRET = 'a-different-secret-of-sufficient-length!!'
const SESSION = { userId: 'usr_123', role: 'ADMIN' } as const

describe('createSessionToken', () => {
  it('round-trips through verification', () => {
    const token = createSessionToken(SESSION, SECRET)

    expect(verifySessionToken(token, SECRET)).toMatchObject(SESSION)
  })

  it('does not leak the secret into the token', () => {
    expect(createSessionToken(SESSION, SECRET)).not.toContain(SECRET)
  })

  it('refuses a secret too weak to sign with', () => {
    expect(() => createSessionToken(SESSION, 'short')).toThrow()
  })
})

describe('verifySessionToken', () => {
  it('rejects a token signed with a different secret', () => {
    const token = createSessionToken(SESSION, SECRET)

    expect(verifySessionToken(token, OTHER_SECRET)).toBeNull()
  })

  // The payload is readable by anyone holding the cookie — that is fine, it
  // holds no secrets. What must not be possible is *editing* it, which is how a
  // STAFF cookie would become an ADMIN one.
  it('rejects a tampered payload', () => {
    const token = createSessionToken({ userId: 'usr_123', role: 'STAFF' }, SECRET)
    const [payload, signature] = token.split('.')
    const decoded = Buffer.from(payload, 'base64url').toString()
    const escalated = Buffer.from(
      decoded.replace('STAFF', 'ADMIN'),
    ).toString('base64url')

    expect(verifySessionToken(`${escalated}.${signature}`, SECRET)).toBeNull()
  })

  it('rejects an expired token', () => {
    const issuedAt = Date.now() - (SESSION_MAX_AGE_SECONDS + 60) * 1000
    const token = createSessionToken(SESSION, SECRET, issuedAt)

    expect(verifySessionToken(token, SECRET)).toBeNull()
  })

  it('accepts a token that has not expired yet', () => {
    const issuedAt = Date.now() - (SESSION_MAX_AGE_SECONDS - 60) * 1000
    const token = createSessionToken(SESSION, SECRET, issuedAt)

    expect(verifySessionToken(token, SECRET)).toMatchObject(SESSION)
  })

  it.each([
    ['empty', ''],
    ['no signature', 'abc'],
    ['too many parts', 'a.b.c'],
    ['unparseable payload', 'bm90LWpzb24.deadbeef'],
    ['unknown role', null],
  ])('returns null for a %s token', (label, token) => {
    const value =
      label === 'unknown role'
        ? (() => {
            const payload = Buffer.from(
              JSON.stringify({ userId: 'u', role: 'SUPERUSER', iat: Date.now() }),
            ).toString('base64url')
            return `${payload}.deadbeef`
          })()
        : (token as string)

    expect(verifySessionToken(value, SECRET)).toBeNull()
  })
})
