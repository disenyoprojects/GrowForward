'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import {
  clearSessionCookie,
  login,
  requireAdminSession,
  setSessionCookie,
} from '@/lib/admin/auth'
import { transitionOrder } from '@/lib/admin/orders'
import { OrderStatusError } from '@/lib/admin/order-status'

export interface ActionState {
  readonly error?: string
}

const credentialsSchema = z.object({
  email: z.string().trim().min(1).email(),
  password: z.string().min(1),
})

/**
 * Signs a staff member in.
 *
 * Every failure returns the same sentence. Telling the visitor whether it was
 * the email or the password that was wrong would let anyone enumerate which
 * addresses have accounts.
 */
export async function signIn(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = credentialsSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    return { error: 'Enter your email address and password.' }
  }

  const token = await login(parsed.data.email, parsed.data.password)

  if (!token) {
    return { error: 'That email and password do not match an account.' }
  }

  await setSessionCookie(token)
  redirect('/admin')
}

export async function logout(): Promise<void> {
  await clearSessionCookie()
  redirect('/admin/login')
}

const updateSchema = z.object({
  orderId: z.string().min(1),
  to: z.enum(['PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
  courierName: z.string().trim().optional(),
  trackingNumber: z.string().trim().optional(),
})

/**
 * Moves an order along. Guarded on its own — a server action is reachable
 * without rendering the layout that would otherwise have blocked it.
 */
export async function updateOrderStatus(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const session = await requireAdminSession()

  const parsed = updateSchema.safeParse({
    orderId: formData.get('orderId'),
    to: formData.get('to'),
    courierName: formData.get('courierName') || undefined,
    trackingNumber: formData.get('trackingNumber') || undefined,
  })

  if (!parsed.success) {
    return { error: 'That status change was not something we could read.' }
  }

  try {
    await transitionOrder(parsed.data, session.userId)
  } catch (error) {
    if (error instanceof OrderStatusError) {
      return { error: error.message }
    }

    if (error instanceof z.ZodError) {
      return {
        error:
          error.issues[0]?.message ?? 'That status change was missing something.',
      }
    }

    console.error(`Could not update order ${parsed.data.orderId}:`, error)
    return { error: 'Something went wrong saving that change.' }
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/orders/${parsed.data.orderId}`)

  return {}
}
