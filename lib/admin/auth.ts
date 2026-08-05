import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import {
  clearedState,
  isLocked,
  minutesRemaining,
  registerFailure,
} from './lockout'
import { verifyPassword } from './password'
import {
  type AdminSession,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  verifySessionToken,
} from './session'

/**
 * Checks staff credentials and mints a session.
 *
 * Returns `null` for both "no such account" and "wrong password", and verifies a
 * dummy hash when the account is missing so the two take the same time. A login
 * form that answers faster for unknown emails tells an attacker which addresses
 * are real.
 */
const DUMMY_HASH =
  'scrypt$16384$8$1$00000000000000000000000000000000$' + '0'.repeat(128)

export type LoginResult =
  | { readonly status: 'ok'; readonly token: string }
  | { readonly status: 'invalid' }
  | { readonly status: 'locked'; readonly minutes: number }

export async function login(
  email: string,
  password: string,
): Promise<LoginResult> {
  const user = await db.adminUser.findUnique({
    where: { email: email.trim().toLowerCase() },
  })

  if (!user) {
    await verifyPassword(password, DUMMY_HASH)
    return { status: 'invalid' }
  }

  // Checked before the password, so a locked account cannot be probed by
  // watching how long the answer takes.
  if (isLocked(user.lockedUntil)) {
    return { status: 'locked', minutes: minutesRemaining(user.lockedUntil) }
  }

  if (!(await verifyPassword(password, user.passwordHash))) {
    const next = registerFailure(user.failedAttempts)

    await db.adminUser.update({ where: { id: user.id }, data: next })

    return next.lockedUntil
      ? { status: 'locked', minutes: minutesRemaining(next.lockedUntil) }
      : { status: 'invalid' }
  }

  await db.adminUser.update({
    where: { id: user.id },
    data: { ...clearedState(), lastLoginAt: new Date() },
  })

  return {
    status: 'ok',
    token: createSessionToken({ userId: user.id, role: user.role }),
  }
}

/** Writes the session cookie. `httpOnly` keeps it away from any script on the page. */
export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies()

  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/** The current staff session, or `null` if there isn't a valid one. */
export async function getAdminSession(): Promise<AdminSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value

  return token ? verifySessionToken(token) : null
}

/**
 * The current staff session, or a redirect to the login page.
 *
 * Every admin page and every admin action calls this. The layout guard alone is
 * not enough — a server action is reachable without rendering the layout that
 * would have blocked it.
 */
export async function requireAdminSession(): Promise<AdminSession> {
  const session = await getAdminSession()

  if (!session) {
    redirect('/admin/login')
  }

  return session
}
