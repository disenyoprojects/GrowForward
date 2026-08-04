'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import type { OrderStatus } from '@/lib/generated/prisma/client'
import { type ActionState, updateOrderStatus } from '../../actions'

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className="admin-button" disabled={pending}>
      {pending ? 'Saving…' : label}
    </button>
  )
}

export function StatusForm({
  orderId,
  allowed,
}: {
  orderId: string
  allowed: readonly OrderStatus[]
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateOrderStatus,
    {},
  )
  const [to, setTo] = useState<OrderStatus>(allowed[0])

  return (
    <form action={formAction} className="admin-form">
      <input type="hidden" name="orderId" value={orderId} />

      <label htmlFor="to">New status</label>
      <select
        id="to"
        name="to"
        value={to}
        onChange={(event) => setTo(event.target.value as OrderStatus)}
      >
        {allowed.map((status) => (
          <option key={status} value={status}>
            {status.replace('_', ' ').toLowerCase()}
          </option>
        ))}
      </select>

      {/* Courier details are required to ship and meaningless otherwise. */}
      {to === 'SHIPPED' ? (
        <>
          <label htmlFor="courierName">Courier</label>
          <input id="courierName" name="courierName" required />

          <label htmlFor="trackingNumber">Tracking number</label>
          <input id="trackingNumber" name="trackingNumber" required />
        </>
      ) : null}

      {state.error ? (
        <p className="admin-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton label="Save status" />
    </form>
  )
}
