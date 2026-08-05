import { describe, expect, it } from 'vitest'
import {
  LOCK_DURATION_MS,
  MAX_FAILED_ATTEMPTS,
  clearedState,
  isLocked,
  minutesRemaining,
  registerFailure,
} from '@/lib/admin/lockout'

const NOW = new Date('2026-08-05T10:00:00Z')

describe('isLocked', () => {
  it('is not locked when nothing was ever set', () => {
    expect(isLocked(null, NOW)).toBe(false)
  })

  it('is locked while the moment is still ahead', () => {
    expect(isLocked(new Date(NOW.getTime() + 60_000), NOW)).toBe(true)
  })

  it('unlocks itself once the moment passes — no cleanup job needed', () => {
    expect(isLocked(new Date(NOW.getTime() - 1), NOW)).toBe(false)
  })
})

describe('registerFailure', () => {
  it('counts a wrong password without locking, early on', () => {
    expect(registerFailure(0, NOW)).toEqual({
      failedAttempts: 1,
      lockedUntil: null,
    })
  })

  it('does not lock on the attempt before the limit', () => {
    const state = registerFailure(MAX_FAILED_ATTEMPTS - 2, NOW)

    expect(state.lockedUntil).toBeNull()
    expect(state.failedAttempts).toBe(MAX_FAILED_ATTEMPTS - 1)
  })

  it('locks on the attempt that reaches the limit', () => {
    const state = registerFailure(MAX_FAILED_ATTEMPTS - 1, NOW)

    expect(state.lockedUntil).toEqual(new Date(NOW.getTime() + LOCK_DURATION_MS))
  })

  // Otherwise the first mistake after a lock expires would lock them straight
  // back out, which would feel broken to someone who simply forgot their password.
  it('resets the counter when it locks, so the next window starts fresh', () => {
    expect(registerFailure(MAX_FAILED_ATTEMPTS - 1, NOW).failedAttempts).toBe(0)
  })
})

describe('minutesRemaining', () => {
  it('is zero when not locked', () => {
    expect(minutesRemaining(null, NOW)).toBe(0)
    expect(minutesRemaining(new Date(NOW.getTime() - 1), NOW)).toBe(0)
  })

  it('rounds up, so nobody is told to wait zero minutes', () => {
    expect(minutesRemaining(new Date(NOW.getTime() + 1_000), NOW)).toBe(1)
    expect(minutesRemaining(new Date(NOW.getTime() + 61_000), NOW)).toBe(2)
  })

  it('reports the full window straight after a lock', () => {
    const { lockedUntil } = registerFailure(MAX_FAILED_ATTEMPTS - 1, NOW)

    expect(minutesRemaining(lockedUntil, NOW)).toBe(15)
  })
})

describe('clearedState', () => {
  it('wipes both the counter and the lock', () => {
    expect(clearedState()).toEqual({ failedAttempts: 0, lockedUntil: null })
  })
})

describe('the guessing budget this creates', () => {
  // The point of the whole feature, stated as a number.
  it('caps an attacker at 5 guesses per 15 minutes, not thousands per second', () => {
    const perDay = (24 * 60) / (LOCK_DURATION_MS / 60_000) * MAX_FAILED_ATTEMPTS

    expect(perDay).toBe(480)
  })
})
