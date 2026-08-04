'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { type ActionState, signIn } from '../actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button type="submit" className="admin-button" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
    </button>
  )
}

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(signIn, {})

  return (
    <form action={formAction} className="admin-form">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="username"
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      {state.error ? (
        <p className="admin-error" role="alert">
          {state.error}
        </p>
      ) : null}

      <SubmitButton />
    </form>
  )
}
