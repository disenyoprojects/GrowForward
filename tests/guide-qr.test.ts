import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import {
  GuideQrError,
  buildGuideUrl,
  renderGuideQrPng,
  renderGuideQrSvg,
} from '@/lib/orders/qr'

const TOKEN = 'BCDFGHJKLMNPQRSTVWXZ23'

describe('buildGuideUrl', () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://growforward.ph'
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SITE_URL = original
  })

  it('builds the guide URL from the configured site URL', () => {
    expect(buildGuideUrl(TOKEN)).toBe(`https://growforward.ph/guide/${TOKEN}`)
  })

  it('tolerates a trailing slash on the site URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://growforward.ph/'

    expect(buildGuideUrl(TOKEN)).toBe(`https://growforward.ph/guide/${TOKEN}`)
  })

  it('accepts an explicit site URL, which wins over the environment', () => {
    expect(buildGuideUrl(TOKEN, 'https://staging.growforward.ph')).toBe(
      `https://staging.growforward.ph/guide/${TOKEN}`,
    )
  })

  it('refuses to build a URL when the site URL is not configured', () => {
    delete process.env.NEXT_PUBLIC_SITE_URL

    expect(() => buildGuideUrl(TOKEN)).toThrow(GuideQrError)
  })

  // A printed QR code is permanent. Encoding a token that was never a real
  // token — or one carrying path characters — would ship a dead or wrong
  // basket tag, so the guard is here rather than at the call site.
  it.each([
    ['empty', ''],
    ['too short', 'BCDF'],
    ['ambiguous characters', 'BCDFGHJKLMNPQRSTVWXZ01'],
    ['lowercase', 'bcdfghjklmnpqrstvwxz23'],
    ['path traversal', '../../admin/orders123456'],
    ['query injection', 'BCDFGHJKLMNPQRSTVWXZ2?'],
  ])('rejects a %s token', (_label, token) => {
    expect(() => buildGuideUrl(token)).toThrow(GuideQrError)
  })
})

describe('renderGuideQrSvg', () => {
  it('returns a standalone SVG encoding the guide URL', async () => {
    const svg = await renderGuideQrSvg(TOKEN, {
      siteUrl: 'https://growforward.ph',
    })

    expect(svg).toContain('<svg')
    expect(svg).toContain('</svg>')
    expect(svg).not.toContain('<script')
  })

  it('renders in the brand colours, not plain black', async () => {
    const svg = await renderGuideQrSvg(TOKEN, {
      siteUrl: 'https://growforward.ph',
    })

    // Forest Deep on Natural Linen — ~15:1 contrast, well past what a scanner
    // needs, so the brand palette costs nothing in reliability.
    expect(svg.toLowerCase()).toContain('#1f2b1e')
    expect(svg.toLowerCase()).toContain('#f7f3e9')
  })

  it('propagates an invalid token as a GuideQrError', async () => {
    await expect(
      renderGuideQrSvg('nope', { siteUrl: 'https://growforward.ph' }),
    ).rejects.toThrow(GuideQrError)
  })
})

describe('renderGuideQrPng', () => {
  it('returns a PNG buffer', async () => {
    const png = await renderGuideQrPng(TOKEN, {
      siteUrl: 'https://growforward.ph',
    })

    // PNG magic number — proves we produced a real image, not a data URL string.
    expect(png.subarray(0, 8)).toEqual(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    )
  })

  it('renders large enough to survive print', async () => {
    const png = await renderGuideQrPng(TOKEN, {
      siteUrl: 'https://growforward.ph',
    })

    // IHDR width lives at bytes 16-20. Anything under ~600px prints muddy on a
    // basket tag.
    expect(png.readUInt32BE(16)).toBeGreaterThanOrEqual(600)
  })
})
