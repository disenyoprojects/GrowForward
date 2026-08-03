import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Payment status for the confirmation page to poll while it waits for
 * PayMongo's webhook to land.
 *
 * Returns only the status — the token is unguessable, but this endpoint is
 * still public, so it exposes nothing personal.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params

  const order = await db.order.findUnique({
    where: { guideToken: token },
    select: { status: true, orderNumber: true },
  })

  if (!order) {
    return NextResponse.json(
      { success: false, error: 'Order not found.' },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    data: { status: order.status, orderNumber: order.orderNumber },
  })
}
