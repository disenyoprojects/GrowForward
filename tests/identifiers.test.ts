import { describe, expect, it } from 'vitest'
import {
  formatOrderNumber,
  formatPeso,
  generateGuideToken,
} from '@/lib/orders/identifiers'

describe('generateGuideToken', () => {
  it('produces a token of the requested length', () => {
    expect(generateGuideToken()).toHaveLength(22)
    expect(generateGuideToken(8)).toHaveLength(8)
  })

  it('only uses the unambiguous alphabet', () => {
    // No vowels (avoids accidental words), no 0/O/1/I (misread when typed by hand).
    expect(generateGuideToken(200)).toMatch(/^[23456789BCDFGHJKLMNPQRSTVWXZ]+$/)
  })

  it('does not repeat across many draws', () => {
    const tokens = new Set(
      Array.from({ length: 2_000 }, () => generateGuideToken()),
    )

    expect(tokens.size).toBe(2_000)
  })

  it('is not sequential or guessable from a neighbouring token', () => {
    const first = generateGuideToken()
    const second = generateGuideToken()

    const sharedPrefix = [...first].findIndex(
      (character, index) => character !== second[index],
    )

    // Two tokens agreeing on a long prefix would mean the source is not random.
    expect(sharedPrefix).toBeLessThan(6)
  })
})

describe('formatOrderNumber', () => {
  it('pads the sequence to four digits', () => {
    expect(formatOrderNumber(2026, 1)).toBe('GF-2026-0001')
    expect(formatOrderNumber(2026, 42)).toBe('GF-2026-0042')
    expect(formatOrderNumber(2026, 1234)).toBe('GF-2026-1234')
  })

  it('keeps growing past four digits rather than truncating', () => {
    expect(formatOrderNumber(2026, 12_345)).toBe('GF-2026-12345')
  })

  it('rejects sequences that would produce a duplicate-looking number', () => {
    expect(() => formatOrderNumber(2026, 0)).toThrow()
    expect(() => formatOrderNumber(2026, -1)).toThrow()
    expect(() => formatOrderNumber(2026, 1.5)).toThrow()
  })
})

describe('formatPeso', () => {
  it('renders centavos as pesos', () => {
    expect(formatPeso(249_500)).toBe('₱2,495.00')
    expect(formatPeso(0)).toBe('₱0.00')
    expect(formatPeso(99)).toBe('₱0.99')
  })
})
