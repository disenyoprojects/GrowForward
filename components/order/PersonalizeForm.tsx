'use client'

import { useState } from 'react'
import { formatPeso } from '@/lib/orders/identifiers'

type FieldErrors = Readonly<Record<string, readonly string[] | undefined>>

const EMPTY_FORM = {
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  recipientName: '',
  senderName: '',
  giftMessage: '',
  deliveryAddress: '',
  deliveryNotes: '',
  deliveryDateWanted: '',
  quantity: '1',
} as const

type FormState = { [K in keyof typeof EMPTY_FORM]: string }

export function PersonalizeForm({
  collectionSlug,
  unitPriceCentavos,
}: {
  collectionSlug: string
  unitPriceCentavos: number
}) {
  const [form, setForm] = useState<FormState>({ ...EMPTY_FORM })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const quantity = Number(form.quantity) || 1
  const total = unitPriceCentavos * quantity

  const update = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    setFieldErrors({})

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, collectionSlug }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        setFieldErrors(result.fieldErrors ?? {})
        setFormError(result.error ?? 'Something went wrong. Please try again.')
        return
      }

      // Hand off to PayMongo. The order already exists, so closing this tab
      // mid-payment does not lose it.
      window.location.href = result.data.checkoutUrl
    } catch (error) {
      console.error('Could not start checkout:', error)
      setFormError(
        'We could not reach the server. Please check your connection and try again.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const errorFor = (field: keyof FormState) => fieldErrors[field]?.[0]

  return (
    <form className="gf-form" onSubmit={handleSubmit} noValidate>
      <fieldset disabled={isSubmitting}>
        <legend>Your details</legend>

        <Field
          label="Your name"
          name="buyerName"
          value={form.buyerName}
          error={errorFor('buyerName')}
          onChange={update}
          required
        />
        <Field
          label="Email address"
          name="buyerEmail"
          type="email"
          value={form.buyerEmail}
          error={errorFor('buyerEmail')}
          onChange={update}
          required
          hint="Your order confirmation and gift card are sent here."
        />
        <Field
          label="Mobile number"
          name="buyerPhone"
          type="tel"
          value={form.buyerPhone}
          error={errorFor('buyerPhone')}
          onChange={update}
          hint="Optional. Used only if there is a delivery problem."
        />

        <legend>The gift</legend>

        <Field
          label="Recipient's name"
          name="recipientName"
          value={form.recipientName}
          error={errorFor('recipientName')}
          onChange={update}
          required
        />
        <Field
          label="Sign the gift as"
          name="senderName"
          value={form.senderName}
          error={errorFor('senderName')}
          onChange={update}
          required
        />
        <Field
          label="Gift message"
          name="giftMessage"
          value={form.giftMessage}
          error={errorFor('giftMessage')}
          onChange={update}
          multiline
          maxLength={500}
          hint={`Printed on the gift card. ${500 - form.giftMessage.length} characters left.`}
        />

        <legend>Delivery</legend>

        <Field
          label="Delivery address"
          name="deliveryAddress"
          value={form.deliveryAddress}
          error={errorFor('deliveryAddress')}
          onChange={update}
          multiline
          required
        />
        <Field
          label="Preferred delivery date"
          name="deliveryDateWanted"
          type="date"
          value={form.deliveryDateWanted}
          error={errorFor('deliveryDateWanted')}
          onChange={update}
          hint="We will do our best — living plants ship when they are ready."
        />
        <Field
          label="Delivery notes"
          name="deliveryNotes"
          value={form.deliveryNotes}
          error={errorFor('deliveryNotes')}
          onChange={update}
          multiline
          hint="Landmarks, gate codes, or a best time to arrive."
        />
        <Field
          label="Number of baskets"
          name="quantity"
          type="number"
          value={form.quantity}
          error={errorFor('quantity')}
          onChange={update}
          min={1}
          max={10}
        />

        <p className="gf-total">
          Total <strong>{formatPeso(total)}</strong>
        </p>

        {formError ? (
          <p className="gf-form-error" role="alert">
            {formError}
          </p>
        ) : null}

        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Taking you to payment…' : 'Continue to payment'}
        </button>

        <p className="gf-secure-note">
          Payment is handled by PayMongo. GrowForward never sees your card
          details.
        </p>
      </fieldset>
    </form>
  )
}

interface FieldProps {
  label: string
  name: keyof FormState
  value: string
  error?: string
  onChange: (field: keyof FormState, value: string) => void
  type?: string
  required?: boolean
  multiline?: boolean
  hint?: string
  maxLength?: number
  min?: number
  max?: number
}

function Field({
  label,
  name,
  value,
  error,
  onChange,
  type = 'text',
  required = false,
  multiline = false,
  hint,
  maxLength,
  min,
  max,
}: FieldProps) {
  const errorId = error ? `${name}-error` : undefined
  const hintId = hint ? `${name}-hint` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  return (
    <div className="gf-field">
      <label htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>

      {multiline ? (
        <textarea
          id={name}
          name={name}
          value={value}
          rows={3}
          maxLength={maxLength}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(name, event.target.value)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          maxLength={maxLength}
          min={min}
          max={max}
          required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          onChange={(event) => onChange(name, event.target.value)}
        />
      )}

      {hint ? (
        <span className="gf-hint" id={hintId}>
          {hint}
        </span>
      ) : null}
      {error ? (
        <span className="gf-error" id={errorId} role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
