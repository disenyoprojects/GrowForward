/**
 * How many wrong passwords in a row before an account is locked.
 *
 * Five is enough that a real person mistyping is never affected, and few enough
 * that guessing becomes hopeless: an attacker gets five tries per lock window
 * instead of thousands per second.
 */
export const MAX_FAILED_ATTEMPTS = 5

/** How long the account stays locked. One number to change if it proves annoying. */
export const LOCK_DURATION_MS = 15 * 60 * 1000

export interface LockState {
  readonly failedAttempts: number
  readonly lockedUntil: Date | null
}

export function isLocked(
  lockedUntil: Date | null,
  now: Date = new Date(),
): boolean {
  return lockedUntil !== null && lockedUntil.getTime() > now.getTime()
}

/** Whole minutes left on a lock, rounded up — what a person is told to wait. */
export function minutesRemaining(
  lockedUntil: Date | null,
  now: Date = new Date(),
): number {
  if (!isLocked(lockedUntil, now)) {
    return 0
  }

  return Math.ceil((lockedUntil!.getTime() - now.getTime()) / 60_000)
}

/**
 * The account's new state after one wrong password.
 *
 * On reaching the limit the counter resets to zero as the lock is applied, so
 * once the lock expires the person gets a full set of attempts again rather than
 * being re-locked by their next single mistake.
 */
export function registerFailure(
  failedAttempts: number,
  now: Date = new Date(),
): LockState {
  const attempts = failedAttempts + 1

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    return {
      failedAttempts: 0,
      lockedUntil: new Date(now.getTime() + LOCK_DURATION_MS),
    }
  }

  return { failedAttempts: attempts, lockedUntil: null }
}

/** The state after a successful sign-in: a clean slate. */
export function clearedState(): LockState {
  return { failedAttempts: 0, lockedUntil: null }
}
