import Link from 'next/link'
import { requireAdminSession } from '@/lib/admin/auth'
import { countsByStatus, listOrders } from '@/lib/admin/orders'
import { formatPeso } from '@/lib/orders/identifiers'
import type { OrderStatus } from '@/lib/generated/prisma/client'
import { StatusPill } from './StatusPill'

export const dynamic = 'force-dynamic'

const FILTERS: readonly OrderStatus[] = [
  'PENDING_PAYMENT',
  'PAID',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
]

const DATE_FORMAT = new Intl.DateTimeFormat('en-PH', {
  day: 'numeric',
  month: 'short',
  hour: 'numeric',
  minute: '2-digit',
})

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>
}) {
  await requireAdminSession()

  const { status } = await searchParams
  const active = FILTERS.find((value) => value === status)
  const [orders, counts] = await Promise.all([
    listOrders(active),
    countsByStatus(),
  ])

  return (
    <>
      <div className="admin-head">
        <h1>Orders</h1>
        <p className="admin-muted">
          {active
            ? `${orders.length} ${active.toLowerCase().replace('_', ' ')}`
            : `${orders.length} most recent`}
        </p>
      </div>

      <nav className="admin-filters" aria-label="Filter by status">
        <Link
          href="/admin"
          className={active ? 'admin-chip' : 'admin-chip is-active'}
        >
          All
        </Link>
        {FILTERS.map((value) => (
          <Link
            key={value}
            href={`/admin?status=${value}`}
            className={active === value ? 'admin-chip is-active' : 'admin-chip'}
          >
            {value.replace('_', ' ').toLowerCase()}
            <span className="admin-count">{counts[value] ?? 0}</span>
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="admin-empty">
          No orders here yet. They appear the moment a customer reaches
          checkout — before payment, so nothing is ever lost.
        </p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th scope="col">Order</th>
                <th scope="col">Status</th>
                <th scope="col">Buyer</th>
                <th scope="col">Recipient</th>
                <th scope="col">Total</th>
                <th scope="col">Placed</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <th scope="row">
                    <Link href={`/admin/orders/${order.id}`}>
                      {order.orderNumber}
                    </Link>
                  </th>
                  <td>
                    <StatusPill status={order.status} />
                  </td>
                  <td>{order.buyerName}</td>
                  <td>{order.recipientName}</td>
                  <td className="admin-numeric">
                    {formatPeso(order.totalCentavos)}
                  </td>
                  <td>{DATE_FORMAT.format(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
