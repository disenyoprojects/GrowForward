import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto'

interface ScryptParams {
  readonly N: number
  readonly r: number
  readonly p: number
  readonly maxmem: number
}

/**
 * `promisify(scrypt)` resolves to the no-options overload, which loses the cost
 * parameters, so the promise wrapper is written out by hand.
 */
function scryptAsync(
  password: string,
  salt: Buffer,
  keyLength: number,
  params: ScryptParams,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, params, (error, key) =>
      error ? reject(error) : resolve(key),
    )
  })
}

/**
 * scrypt from `node:crypto` rather than bcrypt or argon2.
 *
 * It is memory-hard, it ships with Node, and it needs no native build step —
 * which matters on Vercel, where a native module is one more thing that can
 * break a deploy. For a handful of staff accounts it is more than enough.
 */
const COST = 16_384
const BLOCK_SIZE = 8
const PARALLELISM = 1
const KEY_LENGTH = 64
const SALT_LENGTH = 16

/** Long enough that scrypt's work factor is doing the defending, not luck. */
const MIN_PASSWORD_LENGTH = 12

/** `scrypt$N$r$p$salt$key`, so the parameters travel with the hash and can be raised later. */
const FIELD_COUNT = 6

export class PasswordError extends Error {}

function derive(password: string, salt: Buffer): Promise<Buffer> {
  return scryptAsync(password.normalize('NFKC'), salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELISM,
    // scrypt's default memory ceiling is below what N=16384 needs.
    maxmem: 64 * 1024 * 1024,
  })
}

/** Hashes a staff password for storage in `AdminUser.passwordHash`. */
export async function hashPassword(password: string): Promise<string> {
  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new PasswordError(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    )
  }

  const salt = randomBytes(SALT_LENGTH)
  const key = await derive(password, salt)

  return [
    'scrypt',
    COST,
    BLOCK_SIZE,
    PARALLELISM,
    salt.toString('hex'),
    key.toString('hex'),
  ].join('$')
}

/**
 * Checks a password against a stored hash.
 *
 * Returns `false` for anything it cannot make sense of rather than throwing. A
 * corrupt row should read as a failed login, never as a crash that a caller
 * might mistake for success.
 */
export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split('$')

  if (parts.length !== FIELD_COUNT || parts[0] !== 'scrypt') {
    return false
  }

  const [, cost, blockSize, parallelism, saltHex, keyHex] = parts

  if (!/^[0-9a-f]+$/i.test(saltHex) || !/^[0-9a-f]+$/i.test(keyHex)) {
    return false
  }

  try {
    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(keyHex, 'hex')

    const actual = await scryptAsync(
      password.normalize('NFKC'),
      salt,
      expected.length,
      {
        N: Number(cost),
        r: Number(blockSize),
        p: Number(parallelism),
        maxmem: 64 * 1024 * 1024,
      },
    )

    // Constant-time: a length-dependent early return would leak key length.
    return actual.length === expected.length && timingSafeEqual(actual, expected)
  } catch {
    return false
  }
}
