import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { GuideQrError, renderGuideQrPng, renderGuideQrSvg } from '@/lib/orders/qr'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * The printable QR code for an order's basket tag.
 *
 * `?format=png` for tools that cannot place an SVG; SVG is the default because
 * the code gets printed.
 *
 * The order is looked up before rendering so a typo cannot produce a
 * legitimate-looking code that leads nowhere — a printed tag is permanent. No
 * extra access check is needed: the code encodes the guide URL, and anyone
 * holding the token can already open the guide itself.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params
  const format = new URL(request.url).searchParams.get('format') ?? 'svg'

  if (format !== 'svg' && format !== 'png') {
    return NextResponse.json(
      { success: false, error: 'Unsupported format. Use svg or png.' },
      { status: 400 },
    )
  }

  const order = await db.order.findUnique({
    where: { guideToken: token },
    select: { orderNumber: true },
  })

  if (!order) {
    return NextResponse.json(
      { success: false, error: 'Order not found.' },
      { status: 404 },
    )
  }

  try {
    const filename = `growforward-${order.orderNumber}-guide.${format}`
    const body =
      format === 'png'
        ? new Uint8Array(await renderGuideQrPng(token))
        : await renderGuideQrSvg(token)

    return new NextResponse(body, {
      headers: {
        'Content-Type': format === 'png' ? 'image/png' : 'image/svg+xml',
        'Content-Disposition': `inline; filename="${filename}"`,
        // The token is secret, so this must never land in a shared cache.
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch (error) {
    if (error instanceof GuideQrError) {
      console.error(`Could not render QR for order ${order.orderNumber}:`, error)

      return NextResponse.json(
        { success: false, error: 'Could not render the QR code.' },
        { status: 500 },
      )
    }

    throw error
  }
}
