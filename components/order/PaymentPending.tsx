'use client'

import { useEffect, useState } from 'react'

const POLL_INTERVAL_MS = 3_000
const GIVE_UP_AFTER_MS = 90_000

/**
 * Shown when the customer lands back from PayMongo before its webhook has
 * reached us. The payment is already made — we are only waiting to hear about
 * it — so this polls rather than telling the customer anything is wrong.
 */
export function PaymentPending({ token }: { token: string }) {
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    let cancelled = false
    const startedAt = Date.now()

    const check = async () => {
      try {
        const response = await fetch(`/api/orders/${token}/status`, {
          cache: 'no-store',
        })
        const result = await response.json()

        if (cancelled) return

        if (result?.data?.status && result.data.status !== 'PENDING_PAYMENT') {
          window.location.reload()
          return
        }

        if (Date.now() - startedAt > GIVE_UP_AFTER_MS) {
          setTimedOut(true)
          return
        }

        window.setTimeout(check, POLL_INTERVAL_MS)
      } catch (error) {
        console.error('Could not check payment status:', error)
        if (!cancelled) window.setTimeout(check, POLL_INTERVAL_MS)
      }
    }

    const timer = window.setTimeout(check, POLL_INTERVAL_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [token])

  if (timedOut) {
    return (
      <p className="gf-hint" role="status">
        This is taking longer than usual. Your payment is safe — if you were
        charged, your confirmation email will still arrive. You can also email
        marketing@destinevents.biz with your order number.
      </p>
    )
  }

  return (
    <p className="gf-hint" role="status">
      Confirming your payment with PayMongo…
    </p>
  )
}
