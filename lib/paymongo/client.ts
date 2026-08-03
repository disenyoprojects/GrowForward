const PAYMONGO_API_BASE = 'https://api.paymongo.com/v1'

export interface CheckoutLineItem {
  readonly name: string
  readonly description: string
  /** Unit price in centavos. */
  readonly amount: number
  readonly quantity: number
}

export interface CreateCheckoutSessionParams {
  readonly lineItems: readonly CheckoutLineItem[]
  readonly referenceNumber: string
  readonly successUrl: string
  readonly cancelUrl: string
  readonly billingName: string
  readonly billingEmail: string
  readonly billingPhone?: string
  /** Travels with the payment and comes back on the webhook. */
  readonly metadata: Record<string, string>
}

export interface CheckoutSession {
  readonly id: string
  readonly checkoutUrl: string
}

function authorizationHeader(): string {
  const secretKey = process.env.PAYMONGO_SECRET_KEY

  if (!secretKey) {
    throw new Error('PAYMONGO_SECRET_KEY is not configured')
  }

  return `Basic ${Buffer.from(`${secretKey}:`).toString('base64')}`
}

/**
 * Creates a hosted PayMongo checkout session.
 *
 * A session is created per order rather than reusing a static payment link, so
 * the order reference and personalization travel with the transaction and come
 * back on the webhook. Without that, payments cannot be matched to orders
 * automatically.
 */
export async function createCheckoutSession(
  params: CreateCheckoutSessionParams,
): Promise<CheckoutSession> {
  const body = {
    data: {
      attributes: {
        line_items: params.lineItems.map((item) => ({
          name: item.name,
          description: item.description,
          amount: item.amount,
          currency: 'PHP',
          quantity: item.quantity,
        })),
        payment_method_types: ['gcash', 'card', 'paymaya', 'grab_pay'],
        reference_number: params.referenceNumber,
        success_url: params.successUrl,
        cancel_url: params.cancelUrl,
        billing: {
          name: params.billingName,
          email: params.billingEmail,
          ...(params.billingPhone ? { phone: params.billingPhone } : {}),
        },
        metadata: params.metadata,
        send_email_receipt: false,
        show_description: true,
        show_line_items: true,
      },
    },
  }

  let response: Response

  try {
    response = await fetch(`${PAYMONGO_API_BASE}/checkout_sessions`, {
      method: 'POST',
      headers: {
        Authorization: authorizationHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  } catch (error) {
    console.error('PayMongo checkout session request failed:', error)
    throw new Error('Could not reach the payment provider. Please try again.')
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    console.error('PayMongo rejected checkout session:', response.status, payload)
    throw new Error('The payment provider rejected this order.')
  }

  const id: unknown = payload?.data?.id
  const checkoutUrl: unknown = payload?.data?.attributes?.checkout_url

  if (typeof id !== 'string' || typeof checkoutUrl !== 'string') {
    console.error('Unexpected PayMongo checkout session response:', payload)
    throw new Error('The payment provider returned an unexpected response.')
  }

  return { id, checkoutUrl }
}
