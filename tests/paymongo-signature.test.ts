import { createHmac } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import {
  parseSignatureHeader,
  resolveMode,
  verifyWebhookSignature,
} from '@/lib/paymongo/signature'

const SECRET = 'whsk_test_secret'
const RAW_BODY = '{"data":{"id":"evt_123","attributes":{"type":"payment.paid"}}}'

function signedHeader(
  timestamp: number,
  body = RAW_BODY,
  secret = SECRET,
): string {
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.${body}`)
    .digest('hex')

  return `t=${timestamp},te=${signature},li=${signature}`
}

describe('parseSignatureHeader', () => {
  it('reads the timestamp and both signatures', () => {
    const parsed = parseSignatureHeader('t=1700000000,te=aaa,li=bbb')

    expect(parsed).toEqual({
      timestamp: 1_700_000_000,
      testSignature: 'aaa',
      liveSignature: 'bbb',
    })
  })

  it('returns null when the timestamp is missing or junk', () => {
    expect(parseSignatureHeader('te=aaa,li=bbb')).toBeNull()
    expect(parseSignatureHeader('t=not-a-number,te=aaa')).toBeNull()
    expect(parseSignatureHeader('')).toBeNull()
  })
})

describe('verifyWebhookSignature', () => {
  const now = 1_700_000_000

  it('accepts a correctly signed payload', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: signedHeader(now),
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(true)
  })

  it('rejects a payload that was altered after signing', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY.replace('payment.paid', 'payment.failed'),
        signatureHeader: signedHeader(now),
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)
  })

  it('rejects a signature made with the wrong secret', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: signedHeader(now, RAW_BODY, 'someone-elses-secret'),
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)
  })

  it('rejects a replayed request from hours ago', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: signedHeader(now - 7_200),
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)
  })

  it('rejects a missing header or missing secret', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: null,
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)

    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: signedHeader(now),
        secret: '',
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)
  })

  it('rejects when the required mode signature is absent', () => {
    expect(
      verifyWebhookSignature({
        rawBody: RAW_BODY,
        signatureHeader: `t=${now},li=abc`,
        secret: SECRET,
        mode: 'test',
        nowSeconds: now,
      }),
    ).toBe(false)
  })
})

describe('resolveMode', () => {
  it('treats sk_test_ keys as test and everything else as live', () => {
    expect(resolveMode('sk_test_abc')).toBe('test')
    expect(resolveMode('sk_live_abc')).toBe('live')
    expect(resolveMode(undefined)).toBe('live')
  })
})
