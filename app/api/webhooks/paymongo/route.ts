import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { markOrderPaid } from '@/lib/orders/payment'
import { resolveMode, verifyWebhookSignature } from '@/lib/paymongo/signature'

export const runtime = 'nodejs'
/** Payment state must never be read from a cache. */
export const dynamic = 'force-dynamic'

const PAID_EVENTS = new Set([
  'checkout_session.payment.paid',
  'payment.paid',
])

interface PaymongoEvent {
  readonly id: string
  readonly type: string
  readonly orderId?: string
  readonly referenceNumber?: string
  readonly paymentId?: string
}

/** Pulls the fields we need out of PayMongo's nested event envelope. */
function parseEvent(payload: unknown): PaymongoEvent | null {
  const data = (payload as { data?: Record<string, unknown> })?.data

  if (!data || typeof data !== 'object') return null

  const id = (data as { id?: unknown }).id
  const attributes = (data as { attributes?: Record<string, unknown> })
    .attributes
  const type = attributes?.type

  if (typeof id !== 'string' || typeof type !== 'string') return null

  const resource = (attributes?.data ?? {}) as {
    id?: unknown
    attributes?: Record<string, unknown>
  }
  const resourceAttributes = resource.attributes ?? {}
  const metadata = (resourceAttributes.metadata ?? {}) as Record<string, unknown>
  const referenceNumber = resourceAttributes.reference_number

  return {
    id,
    type,
    orderId: typeof metadata.orderId === 'string' ? metadata.orderId : undefined,
    referenceNumber:
      typeof referenceNumber === 'string' ? referenceNumber : undefined,
    paymentId: typeof resource.id === 'string' ? resource.id : undefined,
  }
}

async function resolveOrderId(event: PaymongoEvent): Promise<string | null> {
  if (event.orderId) return event.orderId

  if (event.referenceNumber) {
    const order = await db.order.findUnique({
      where: { orderNumber: event.referenceNumber },
      select: { id: true },
    })
    return order?.id ?? null
  }

  return null
}

export async function POST(request: Request) {
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET

  if (!secret) {
    console.error('PAYMONGO_WEBHOOK_SECRET is not configured')
    return NextResponse.json({ received: false }, { status: 500 })
  }

  // Must read the raw bytes: the signature is computed over the exact payload,
  // so parsing and re-serializing first would always fail verification.
  const rawBody = await request.text()

  const isValid = verifyWebhookSignature({
    rawBody,
    signatureHeader: request.headers.get('paymongo-signature'),
    secret,
    mode: resolveMode(process.env.PAYMONGO_SECRET_KEY),
  })

  if (!isValid) {
    console.warn('Rejected PayMongo webhook with an invalid signature')
    return NextResponse.json({ received: false }, { status: 401 })
  }

  let payload: unknown

  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ received: false }, { status: 400 })
  }

  const event = parseEvent(payload)

  if (!event) {
    console.warn('Could not parse PayMongo webhook payload')
    return NextResponse.json({ received: true, ignored: true })
  }

  // Idempotency guard. An event we have already finished is acknowledged and
  // dropped; one that was recorded but never completed (a crash, a failed
  // email) is picked up again, which is the whole point of PayMongo retrying.
  const recorded = await db.webhookEvent.findUnique({
    where: { externalId: event.id },
  })

  if (recorded?.processedAt) {
    return NextResponse.json({ received: true, duplicate: true })
  }

  if (!recorded) {
    try {
      await db.webhookEvent.create({
        data: {
          externalId: event.id,
          eventType: event.type,
          raw: payload as object,
        },
      })
    } catch (error) {
      // A concurrent delivery won the insert. Processing continues because
      // markOrderPaid and the email log are both safe to run twice.
      console.warn(`Concurrent delivery of webhook ${event.id}:`, error)
    }
  }

  if (!PAID_EVENTS.has(event.type)) {
    await db.webhookEvent.update({
      where: { externalId: event.id },
      data: { processedAt: new Date() },
    })
    return NextResponse.json({ received: true, ignored: true })
  }

  try {
    const orderId = await resolveOrderId(event)

    if (!orderId) {
      const message = `No order matched webhook ${event.id}`
      console.error(message)
      await db.webhookEvent.update({
        where: { externalId: event.id },
        data: { processedAt: new Date(), error: message },
      })
      // Acknowledged deliberately: retrying will not conjure a matching order,
      // and the recorded error is what surfaces it for manual reconciliation.
      return NextResponse.json({ received: true, unmatched: true })
    }

    await markOrderPaid({ orderId, paymongoPaymentId: event.paymentId })

    await db.webhookEvent.update({
      where: { externalId: event.id },
      data: { processedAt: new Date() },
    })

    return NextResponse.json({ received: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error(`Failed to process PayMongo webhook ${event.id}:`, error)

    await db.webhookEvent.update({
      where: { externalId: event.id },
      data: { error: message },
    })

    // 500 so PayMongo retries. The event row stays unprocessed, so the retry
    // runs the handler again rather than being dismissed as a duplicate.
    return NextResponse.json({ received: false }, { status: 500 })
  }
}
