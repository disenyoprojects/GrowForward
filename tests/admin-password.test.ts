import { describe, expect, it } from 'vitest'
import {
  MIN_PASSWORD_LENGTH,
  hashPassword,
  verifyPassword,
} from '@/lib/admin/password'

describe('hashPassword', () => {
  it('produces a verifiable hash', async () => {
    const hash = await hashPassword('correct horse battery staple')

    await expect(
      verifyPassword('correct horse battery staple', hash),
    ).resolves.toBe(true)
  })

  it('never stores the password itself', async () => {
    const hash = await hashPassword('correct horse battery staple')

    expect(hash).not.toContain('correct horse battery staple')
  })

  it('salts, so the same password hashes differently every time', async () => {
    const [a, b] = await Promise.all([
      hashPassword('same password'),
      hashPassword('same password'),
    ])

    expect(a).not.toBe(b)
    await expect(verifyPassword('same password', a)).resolves.toBe(true)
    await expect(verifyPassword('same password', b)).resolves.toBe(true)
  })

  it('rejects a password shorter than the minimum', async () => {
    await expect(hashPassword('a'.repeat(MIN_PASSWORD_LENGTH - 1))).rejects.toThrow()
  })

  it('accepts a password exactly at the minimum', async () => {
    const hash = await hashPassword('a'.repeat(MIN_PASSWORD_LENGTH))

    await expect(
      verifyPassword('a'.repeat(MIN_PASSWORD_LENGTH), hash),
    ).resolves.toBe(true)
  })
})

describe('verifyPassword', () => {
  it('rejects the wrong password', async () => {
    const hash = await hashPassword('correct horse battery staple')

    await expect(verifyPassword('wrong password entirely', hash)).resolves.toBe(
      false,
    )
  })

  // A staff account is the keys to every customer's name, address and phone
  // number. A malformed stored hash must read as "no", never as "yes" and never
  // as a crash that a caller might treat as authenticated.
  it.each([
    ['empty', ''],
    ['not our format', 'plaintext'],
    ['wrong field count', 'scrypt$1$2'],
    ['non-hex salt', 'scrypt$16384$8$1$zzzz$aabb'],
    ['truncated', 'scrypt$16384$8$1$aabb'],
  ])('returns false for a %s stored hash', async (_label, stored) => {
    await expect(verifyPassword('any password here', stored)).resolves.toBe(
      false,
    )
  })
})
