import { NextResponse } from 'next/server'
import { createOrderWithCheckout, OrderCreationError } from '@/lib/orders/create'
import { createOrderSchema } from '@/lib/orders/schema'

export const runtime = 'nodejs'

/**
 * Creates a pending order and returns the PayMongo checkout URL for the
 * browser to redirect to.
 */
export async function POST(request: Request) {
  let body: unknown

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Malformed request.' },
      { status: 400 },
    )
  }

  const parsed = createOrderSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: 'Please check the highlighted fields.',
        fieldErrors: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    )
  }

  try {
    const { order, checkoutUrl } = await createOrderWithCheckout(parsed.data)

    return NextResponse.json({
      success: true,
      data: { orderNumber: order.orderNumber, checkoutUrl },
    })
  } catch (error) {
    if (error instanceof OrderCreationError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      )
    }

    console.error('Unexpected error creating order:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Something went wrong on our end. Please try again.',
      },
      { status: 500 },
    )
  }
}
