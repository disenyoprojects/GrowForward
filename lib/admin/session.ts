import { createHmac, timingSafeEqual } from 'node:crypto'
import { z } from 'zod'

export class SessionError extends Error {}

/** A staff session lasts a working day, then they log in again. */
export const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60

export const SESSION_COOKIE = 'gf_admin_session'

/** Short secrets make the HMAC guessable; refuse rather than sign weakly. */
const MIN_SECRET_LENGTH = 32

const sessionSchema = z.object({
  userId: z.string().min(1),
  role: z.enum(['ADMIN', 'STAFF']),
  iat: z.number().int().positive(),
})

export type AdminSession = z.infer<typeof sessionSchema>

function resolveSecret(explicit?: string): string {
  const secret = explicit ?? process.env.ADMIN_SESSION_SECRET

  if (!secret) {
    throw new SessionError('ADMIN_SESSION_SECRET is not configured.')
  }

  if (secret.length < MIN_SECRET_LENGTH) {
    throw new SessionError(
      `ADMIN_SESSION_SECRET must be at least ${MIN_SECRET_LENGTH} characters.`,
    )
  }

  return secret
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

/**
 * Mints a signed session token: `base64url(payload).hmac`.
 *
 * The payload is signed, not encrypted — anyone holding the cookie can read it,
 * which is fine because it holds only a user id and a role. What the signature
 * prevents is *editing* it, which is how a STAFF cookie would otherwise become
 * an ADMIN one.
 *
 * Stateless on purpose: there is no session table to keep, and for a team this
 * size the tradeoff — a token stays valid until it expires — is acceptable.
 * Rotating `ADMIN_SESSION_SECRET` revokes every session at once if needed.
 */
export function createSessionToken(
  session: Pick<AdminSession, 'userId' | 'role'>,
  secret?: string,
  issuedAt: number = Date.now(),
): string {
  const key = resolveSecret(secret)
  const payload = Buffer.from(
    JSON.stringify({ ...session, iat: issuedAt }),
  ).toString('base64url')

  return `${payload}.${sign(payload, key)}`
}

/**
 * Verifies a session token, returning `null` for anything untrustworthy.
 *
 * Every failure — bad signature, expired, malformed, unknown role — returns
 * `null` rather than throwing, so a caller cannot accidentally treat an error
 * as an authenticated session.
 */
export function verifySessionToken(
  token: string,
  secret?: string,
): AdminSession | null {
  const key = resolveSecret(secret)
  const parts = token.split('.')

  if (parts.length !== 2) {
    return null
  }

  const [payload, signature] = parts
  const expected = sign(payload, key)
  const given = Buffer.from(signature)
  const want = Buffer.from(expected)

  if (given.length !== want.length || !timingSafeEqual(given, want)) {
    return null
  }

  try {
    const parsed = sessionSchema.safeParse(
      JSON.parse(Buffer.from(payload, 'base64url').toString()),
    )

    if (!parsed.success) {
      return null
    }

    const age = (Date.now() - parsed.data.iat) / 1000

    return age >= 0 && age < SESSION_MAX_AGE_SECONDS ? parsed.data : null
  } catch {
    return null
  }
}
