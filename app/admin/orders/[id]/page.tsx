import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdminSession } from '@/lib/admin/auth'
import { getOrder } from '@/lib/admin/orders'
import { nextStatuses } from '@/lib/admin/order-status'
import { formatPeso } from '@/lib/orders/identifiers'
import { StatusPill } from '../../StatusPill'
import { StatusForm } from './StatusForm'

export const dynamic = 'force-dynamic'

const DATE_FORMAT = new Intl.DateTimeFormat('en-PH', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdminSession()

  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const allowed = nextStatuses(order.status)

  return (
    <>
      <p className="admin-back">
        <Link href="/admin">← All orders</Link>
      </p>

      <div className="admin-head">
        <h1>{order.orderNumber}</h1>
        <StatusPill status={order.status} />
      </div>

      <div className="admin-columns">
        <section className="admin-card">
          <h2>Gift</h2>
          <dl className="admin-details">
            <dt>Recipient</dt>
            <dd>{order.recipientName}</dd>
            <dt>From</dt>
            <dd>{order.senderName}</dd>
            <dt>Message</dt>
            <dd>{order.giftMessage || <em>None</em>}</dd>
            <dt>Collection</dt>
            <dd>{order.collectionSlug}</dd>
            <dt>Total</dt>
            <dd className="admin-numeric">{formatPeso(order.totalCentavos)}</dd>
          </dl>
        </section>

        <section className="admin-card">
          <h2>Delivery</h2>
          <dl className="admin-details">
            <dt>Buyer</dt>
            <dd>{order.buyerName}</dd>
            <dt>Email</dt>
            <dd>{order.buyerEmail}</dd>
            <dt>Phone</dt>
            <dd>{order.buyerPhone || <em>Not given</em>}</dd>
            <dt>Address</dt>
            <dd>{order.deliveryAddress}</dd>
            <dt>Notes</dt>
            <dd>{order.deliveryNotes || <em>None</em>}</dd>
            {order.trackingNumber ? (
              <>
                <dt>Tracking</dt>
                <dd>
                  {order.courierName} — {order.trackingNumber}
                </dd>
              </>
            ) : null}
          </dl>
        </section>

        <section className="admin-card">
          <h2>Basket QR</h2>
          <p className="admin-muted">
            The code the recipient scans. It opens their personalised guide.
          </p>
          <p className="admin-actions">
            <a
              href={`/api/orders/${order.guideToken}/qr`}
              target="_blank"
              rel="noreferrer"
              className="admin-button admin-button-quiet"
            >
              View SVG
            </a>
            <a
              href={`/api/orders/${order.guideToken}/qr?format=png`}
              target="_blank"
              rel="noreferrer"
              className="admin-button admin-button-quiet"
            >
              Download PNG
            </a>
          </p>
          <p className="admin-muted">
            Scanned {order.guideScanCount}{' '}
            {order.guideScanCount === 1 ? 'time' : 'times'}
            {order.guideFirstScannedAt
              ? `, first on ${DATE_FORMAT.format(order.guideFirstScannedAt)}`
              : ''}
            .
          </p>
        </section>

        <section className="admin-card">
          <h2>Move this order along</h2>
          {allowed.length === 0 ? (
            <p className="admin-muted">
              {order.status === 'DELIVERED'
                ? 'Delivered. Nothing further to do.'
                : 'This order was cancelled.'}
            </p>
          ) : (
            <StatusForm orderId={order.id} allowed={allowed} />
          )}
        </section>
      </div>

      <section className="admin-card">
        <h2>History</h2>
        <ol className="admin-timeline">
          {order.events.map((event) => (
            <li key={event.id}>
              <span className="admin-event-type">{event.type}</span>
              <span className="admin-muted">
                {DATE_FORMAT.format(event.createdAt)} · {event.actor}
              </span>
            </li>
          ))}
        </ol>

        <h2>Emails</h2>
        {order.emailLogs.length === 0 ? (
          <p className="admin-muted">Nothing sent yet.</p>
        ) : (
          <ol className="admin-timeline">
            {order.emailLogs.map((log) => (
              <li key={log.id}>
                <span className="admin-event-type">{log.template}</span>
                <span className="admin-muted">
                  {log.sentAt
                    ? `sent ${DATE_FORMAT.format(log.sentAt)}`
                    : `failed — ${log.error ?? 'unknown error'}`}
                </span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  )
}
