'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  type AffiliateFormState,
  applyToAffiliate,
} from '@/app/(site)/affiliate/actions'
import type { AffiliateContent } from '@/lib/content/types'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className="btn btn-primary" disabled={pending}>
      {pending ? 'Sending…' : 'Apply to partner'}
    </button>
  )
}

/**
 * Uncontrolled, unlike the personalize form's `Field`.
 *
 * This form posts to a server action rather than holding state, so the browser
 * keeps the values and a failed submit does not empty the boxes. Class names are
 * shared with `.gf-field` so both forms have the same shape — the form itself
 * adds `gf-form--light`, because this page's band is off-white while the order
 * form's is dark forest.
 */
function Field({
  label,
  name,
  error,
  type = 'text',
  required = false,
  optional = false,
  placeholder,
  multiline = false,
  autoComplete,
}: {
  label: string
  name: string
  error?: string
  type?: string
  required?: boolean
  optional?: boolean
  placeholder?: string
  multiline?: boolean
  autoComplete?: string
}) {
  const errorId = error ? `${name}-error` : undefined
  const shared = {
    id: name,
    name,
    placeholder,
    required,
    autoComplete,
    'aria-invalid': Boolean(error),
    'aria-describedby': errorId,
  }

  return (
    <div className="gf-field">
      <label htmlFor={name}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {optional ? <span className="gf-optional"> optional</span> : null}
      </label>

      {multiline ? (
        <textarea {...shared} rows={4} />
      ) : (
        <input {...shared} type={type} />
      )}

      {error ? (
        <p className="gf-error" id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function AffiliateForm({ copy }: { copy: AffiliateContent['form'] }) {
  const [state, formAction] = useActionState<AffiliateFormState, FormData>(
    applyToAffiliate,
    { status: 'idle' },
  )

  if (state.status === 'success') {
    return (
      <div className="affiliate-success" role="status">
        <h3>{copy.successHeading}</h3>
        <p>{copy.successBody}</p>
      </div>
    )
  }

  const errors = state.fieldErrors ?? {}

  return (
    <form
      action={formAction}
      className="gf-form gf-form--light affiliate-form"
      noValidate
    >
      <Field
        label="Your name"
        name="name"
        required
        autoComplete="name"
        error={errors.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        required
        autoComplete="email"
        error={errors.email}
      />
      <Field
        label="Mobile"
        name="phone"
        optional
        autoComplete="tel"
        error={errors.phone}
      />

      <div className="affiliate-row">
        <Field
          label="Instagram"
          name="instagram"
          optional
          placeholder="@yourhandle"
          error={errors.instagram}
        />
        <Field
          label="Facebook"
          name="facebook"
          optional
          error={errors.facebook}
        />
      </div>

      <Field
        label="Who reads you?"
        name="audience"
        optional
        placeholder="e.g. 12k followers, mostly home cooks in Metro Manila"
        error={errors.audience}
      />
      <Field
        label="Anything else"
        name="message"
        optional
        multiline
        error={errors.message}
      />

      {state.error ? (
        <p className="gf-form-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
