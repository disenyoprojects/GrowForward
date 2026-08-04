import { randomBytes } from 'node:crypto'

/** Characters used for guide tokens: no vowels (avoids real words), no 0/O/1/I. */
export const GUIDE_TOKEN_ALPHABET = '23456789BCDFGHJKLMNPQRSTVWXZ'
export const GUIDE_TOKEN_LENGTH = 22

const TOKEN_ALPHABET = GUIDE_TOKEN_ALPHABET
const TOKEN_LENGTH = GUIDE_TOKEN_LENGTH

/**
 * Generates the token that becomes the Guide URL printed on the basket's QR
 * code.
 *
 * It must be unguessable: the page it opens shows the recipient's name and the
 * gift message. 22 characters from a 28-symbol alphabet is roughly 105 bits of
 * entropy — brute-forcing it is not a realistic attack.
 *
 * `randomBytes` is rejection-sampled rather than taken modulo the alphabet
 * length, which would otherwise make early characters slightly more likely.
 */
export function generateGuideToken(length: number = TOKEN_LENGTH): string {
  const alphabetSize = TOKEN_ALPHABET.length
  const maxUnbiased = 256 - (256 % alphabetSize)
  let token = ''

  while (token.length < length) {
    for (const byte of randomBytes(length)) {
      if (byte < maxUnbiased) {
        token += TOKEN_ALPHABET[byte % alphabetSize]
        if (token.length === length) break
      }
    }
  }

  return token
}

/**
 * Builds the human-facing order reference, e.g. `GF-2026-0042`.
 *
 * `sequence` is the count of orders already placed this year — the caller reads
 * it from the database inside the same transaction that creates the order, so
 * two simultaneous checkouts cannot claim the same number.
 */
export function formatOrderNumber(year: number, sequence: number): string {
  if (!Number.isInteger(sequence) || sequence < 1) {
    throw new Error(`Order sequence must be a positive integer, got ${sequence}`)
  }

  return `GF-${year}-${String(sequence).padStart(4, '0')}`
}

/** Formats centavos for display, e.g. 249500 → "₱2,495.00". */
export function formatPeso(centavos: number): string {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(centavos / 100)
}
