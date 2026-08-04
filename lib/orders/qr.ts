import QRCode from 'qrcode'
import { z } from 'zod'
import { GUIDE_TOKEN_ALPHABET, GUIDE_TOKEN_LENGTH } from './identifiers'

export class GuideQrError extends Error {}

/**
 * Forest Deep on Natural Linen, from the approved palette.
 *
 * Scanners care about contrast, not hue, and this pair sits around 15:1 — far
 * past the threshold — so the brand colours cost nothing in reliability.
 */
const DARK = '#1F2B1E'
const LIGHT = '#F7F3E9'

/**
 * A basket tag is printed once and then lives in someone's kitchen. `Q` recovers
 * 25% of a damaged code, which is what buys tolerance for a scuff or a splash.
 */
const ERROR_CORRECTION = 'Q'

/** Below roughly this, a printed code turns muddy at basket-tag size. */
const PRINT_WIDTH = 900

/** The quiet zone. Trimming it is the most common reason a printed QR fails. */
const MARGIN = 4

const guideTokenSchema = z
  .string()
  .length(GUIDE_TOKEN_LENGTH)
  .regex(new RegExp(`^[${GUIDE_TOKEN_ALPHABET}]+$`))

export interface GuideQrOptions {
  /** Overrides `NEXT_PUBLIC_SITE_URL`, e.g. to render against a staging host. */
  readonly siteUrl?: string
  /** Pixel width of the rendered code. Defaults to a print-safe size. */
  readonly width?: number
}

function resolveSiteUrl(explicit?: string): string {
  const url = explicit ?? process.env.NEXT_PUBLIC_SITE_URL

  if (!url) {
    throw new GuideQrError(
      'Cannot build a guide URL: NEXT_PUBLIC_SITE_URL is not configured.',
    )
  }

  return url.replace(/\/$/, '')
}

/**
 * Builds the URL a basket's QR code points at.
 *
 * The token is validated rather than trusted. A printed code is permanent, so a
 * malformed token would mean shipping a basket whose tag leads nowhere — and a
 * token carrying `?` or `../` would point somewhere else entirely.
 */
export function buildGuideUrl(token: string, siteUrl?: string): string {
  const parsed = guideTokenSchema.safeParse(token)

  if (!parsed.success) {
    throw new GuideQrError(
      `Refusing to build a guide URL for a malformed token (expected ${GUIDE_TOKEN_LENGTH} characters from the guide alphabet).`,
    )
  }

  return `${resolveSiteUrl(siteUrl)}/guide/${parsed.data}`
}

/** Renders the guide QR code as an SVG — the right choice for print. */
export async function renderGuideQrSvg(
  token: string,
  options: GuideQrOptions = {},
): Promise<string> {
  const url = buildGuideUrl(token, options.siteUrl)

  try {
    return await QRCode.toString(url, {
      type: 'svg',
      errorCorrectionLevel: ERROR_CORRECTION,
      margin: MARGIN,
      width: options.width ?? PRINT_WIDTH,
      color: { dark: DARK, light: LIGHT },
    })
  } catch (error) {
    throw new GuideQrError(`Could not render the guide QR code: ${error}`)
  }
}

/** Renders the guide QR code as a PNG, for tools that cannot place an SVG. */
export async function renderGuideQrPng(
  token: string,
  options: GuideQrOptions = {},
): Promise<Buffer> {
  const url = buildGuideUrl(token, options.siteUrl)

  try {
    return await QRCode.toBuffer(url, {
      type: 'png',
      errorCorrectionLevel: ERROR_CORRECTION,
      margin: MARGIN,
      width: options.width ?? PRINT_WIDTH,
      color: { dark: DARK, light: LIGHT },
    })
  } catch (error) {
    throw new GuideQrError(`Could not render the guide QR code: ${error}`)
  }
}
