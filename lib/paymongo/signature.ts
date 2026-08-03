import { createHmac, timingSafeEqual } from 'node:crypto'

/** How old a webhook may be before we treat it as a replay, in seconds. */
const MAX_SIGNATURE_AGE_SECONDS = 300

export type PaymongoMode = 'test' | 'live'

interface ParsedSignature {
  readonly timestamp: number
  readonly testSignature?: string
  readonly liveSignature?: string
}

/**
 * PayMongo sends `Paymongo-Signature: t=<unix>,te=<test hmac>,li=<live hmac>`.
 */
export function parseSignatureHeader(header: string): ParsedSignature | null {
  const parts = header.split(',').map((part) => part.trim())
  const values = new Map<string, string>()

  for (const part of parts) {
    const separator = part.indexOf('=')
    if (separator > 0) {
      values.set(part.slice(0, separator), part.slice(separator + 1))
    }
  }

  const timestamp = Number(values.get('t'))

  if (!Number.isFinite(timestamp) || timestamp <= 0) {
    return null
  }

  return {
    timestamp,
    testSignature: values.get('te'),
    liveSignature: values.get('li'),
  }
}

function safeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, 'utf8')
  const bufferB = Buffer.from(b, 'utf8')

  // timingSafeEqual throws on length mismatch, which itself leaks length —
  // compare lengths first and always run the constant-time check on equal sizes.
  if (bufferA.length !== bufferB.length) {
    return false
  }

  return timingSafeEqual(bufferA, bufferB)
}

/**
 * Verifies a PayMongo webhook.
 *
 * `rawBody` must be the exact bytes PayMongo sent — the signature is computed
 * over the raw payload, so parsing and re-serializing the JSON first will
 * always fail verification.
 */
export function verifyWebhookSignature({
  rawBody,
  signatureHeader,
  secret,
  mode,
  nowSeconds = Math.floor(Date.now() / 1000),
}: {
  rawBody: string
  signatureHeader: string | null
  secret: string
  mode: PaymongoMode
  nowSeconds?: number
}): boolean {
  if (!signatureHeader || !secret) {
    return false
  }

  const parsed = parseSignatureHeader(signatureHeader)

  if (!parsed) {
    return false
  }

  // Reject stale signatures so a captured request cannot be replayed later.
  if (Math.abs(nowSeconds - parsed.timestamp) > MAX_SIGNATURE_AGE_SECONDS) {
    return false
  }

  const provided =
    mode === 'live' ? parsed.liveSignature : parsed.testSignature

  if (!provided) {
    return false
  }

  const expected = createHmac('sha256', secret)
    .update(`${parsed.timestamp}.${rawBody}`)
    .digest('hex')

  return safeEquals(expected, provided)
}

/** Test keys are prefixed `sk_test_`; anything else is treated as live. */
export function resolveMode(secretKey: string | undefined): PaymongoMode {
  return secretKey?.startsWith('sk_test_') ? 'test' : 'live'
}
