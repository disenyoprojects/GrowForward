/**
 * Reading PayMongo's webhook envelope.
 *
 * Kept apart from the route so it can be tested without a database, and so the
 * route stays about delivery, signatures and idempotency rather than shapes.
 */

export interface PaymongoEvent {
  readonly id: string
  readonly type: string
  readonly orderId?: string
  readonly referenceNumber?: string
  readonly paymentId?: string
}

interface PaymongoResource {
  readonly id?: unknown
  readonly type?: unknown
  readonly attributes?: Record<string, unknown>
}

/**
 * Finds the payment id, which PayMongo nests differently per event.
 *
 * `payment.paid` delivers the payment itself, so the resource id is the one we
 * want. `checkout_session.payment.paid` delivers the session instead — its id
 * is already stored as `paymongoCheckoutSessionId`, and the payment sits in the
 * session's `payments` array. Falling back to the resource id there would file
 * a session id under the payment, which matches nothing in PayMongo when a
 * refund or a payout has to be traced back to an order.
 */
function extractPaymentId(
  resource: PaymongoResource,
  resourceAttributes: Record<string, unknown>,
): string | undefined {
  const payments = resourceAttributes.payments

  if (Array.isArray(payments)) {
    const first = payments[0] as { id?: unknown } | undefined
    return typeof first?.id === 'string' ? first.id : undefined
  }

  // No payments array on a session: nothing usable here. Undefined is better
  // than a confidently wrong id.
  if (resource.type === 'checkout_session') return undefined

  return typeof resource.id === 'string' ? resource.id : undefined
}

/** Pulls the fields we need out of PayMongo's nested event envelope. */
export function parseEvent(payload: unknown): PaymongoEvent | null {
  const data = (payload as { data?: Record<string, unknown> })?.data

  if (!data || typeof data !== 'object') return null

  const id = (data as { id?: unknown }).id
  const attributes = (data as { attributes?: Record<string, unknown> })
    .attributes
  const type = attributes?.type

  if (typeof id !== 'string' || typeof type !== 'string') return null

  const resource = (attributes?.data ?? {}) as PaymongoResource
  const resourceAttributes = resource.attributes ?? {}
  const metadata = (resourceAttributes.metadata ?? {}) as Record<string, unknown>
  const referenceNumber = resourceAttributes.reference_number

  return {
    id,
    type,
    orderId: typeof metadata.orderId === 'string' ? metadata.orderId : undefined,
    referenceNumber:
      typeof referenceNumber === 'string' ? referenceNumber : undefined,
    paymentId: extractPaymentId(resource, resourceAttributes),
  }
}
