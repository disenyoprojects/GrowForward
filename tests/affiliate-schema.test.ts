import { describe, expect, it } from 'vitest'
import { affiliateApplicationSchema } from '@/lib/orders/schema'

const valid = {
  name: 'Maria Santos',
  email: 'Maria@Example.COM',
  phone: '09171234567',
  instagram: '@mariagrows',
  facebook: '',
  audience: '12k followers, mostly home cooks in Metro Manila',
  message: 'I have been buying GrowForward baskets for a year.',
}

describe('affiliateApplicationSchema', () => {
  it('accepts a filled-in application', () => {
    expect(affiliateApplicationSchema.parse(valid).name).toBe('Maria Santos')
  })

  it('lowercases the email, so duplicates are recognisable later', () => {
    expect(affiliateApplicationSchema.parse(valid).email).toBe(
      'maria@example.com',
    )
  })

  // Browsers submit untouched inputs as empty strings. Storing those would make
  // "left blank" indistinguishable from a real answer.
  it('turns untouched optional fields into undefined, not empty strings', () => {
    expect(affiliateApplicationSchema.parse(valid).facebook).toBeUndefined()
  })

  it('accepts an application with only the required fields', () => {
    const parsed = affiliateApplicationSchema.parse({
      name: 'Jo',
      email: 'jo@example.com',
      phone: '',
      instagram: '',
      facebook: '',
      audience: '',
      message: '',
    })

    expect(parsed.email).toBe('jo@example.com')
    expect(parsed.message).toBeUndefined()
  })

  it.each([
    ['a missing name', { ...valid, name: '' }],
    ['a one-character name', { ...valid, name: 'M' }],
    ['a malformed email', { ...valid, email: 'not-an-email' }],
    ['a missing email', { ...valid, email: '' }],
  ])('rejects %s', (_label, input) => {
    expect(affiliateApplicationSchema.safeParse(input).success).toBe(false)
  })

  it('caps the free-text message, so one applicant cannot paste an essay', () => {
    const result = affiliateApplicationSchema.safeParse({
      ...valid,
      message: 'x'.repeat(1001),
    })

    expect(result.success).toBe(false)
  })

  it('trims surrounding whitespace from the name', () => {
    expect(
      affiliateApplicationSchema.parse({ ...valid, name: '  Maria Santos  ' })
        .name,
    ).toBe('Maria Santos')
  })
})
