import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PaymentPending } from '@/components/order/PaymentPending'
import { getCollectionBySlug } from '@/lib/content'
import { db } from '@/lib/db'
import { formatPeso } from '@/lib/orders/identifiers'

export const dynamic = 'force-dynamic'

/** Contains order details — must never be indexed or cached. */
export const metadata: Metadata = {
  title: 'Your GrowForward order',
  robots: { index: false, follow: false },
}

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  const order = await db.order.findUnique({ where: { guideToken: token } })

  if (!order) {
    notFound()
  }

  const collection = getCollectionBySlug(order.collectionSlug)
  const isPending = order.status === 'PENDING_PAYMENT'

  return (
    <section className="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">
            {isPending ? 'Almost there' : 'Order confirmed'}
          </span>
          <h2>
            {isPending
              ? 'We are confirming your payment'
              : 'Thank you, your gift is on its way'}
          </h2>
        </div>

        <div className="feature-card" style={{ maxWidth: 620, margin: '0 auto' }}>
          <h3>Order {order.orderNumber}</h3>
          <dl className="gf-summary">
            <dt>Collection</dt>
            <dd>{collection?.name ?? order.collectionSlug}</dd>

            <dt>For</dt>
            <dd>{order.recipientName}</dd>

            <dt>From</dt>
            <dd>{order.senderName}</dd>

            <dt>Baskets</dt>
            <dd>{order.quantity}</dd>

            <dt>Total</dt>
            <dd>{formatPeso(order.totalCentavos)}</dd>

            <dt>Delivering to</dt>
            <dd>{order.deliveryAddress}</dd>
          </dl>

          {isPending ? (
            <PaymentPending token={token} />
          ) : (
            <p className="gf-hint">
              A confirmation email is on its way to {order.buyerEmail}. Keep it
              — it has everything you need to follow this order.
            </p>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 40 }}>
          <Link href="/" className="btn btn-primary">
            Back to GrowForward
          </Link>
        </p>
      </div>
    </section>
  )
}
