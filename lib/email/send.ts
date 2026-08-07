import { Resend } from 'resend'
import { db } from '@/lib/db'
import { isTransactional } from './optout'
import { hasOptedOut } from './optout-store'
import { renderTemplate, type MergeVars } from './render'
import type { TemplateName } from './templates'

export type SendResult =
  | { readonly status: 'sent'; readonly resendId: string }
  | { readonly status: 'skipped'; readonly reason: string }
  | { readonly status: 'failed'; readonly error: string }

/** Prisma's unique-constraint violation. */
function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: unknown }).code === 'P2002'
  )
}

function resendClient(): Resend {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured')
  }

  return new Resend(apiKey)
}

/**
 * Sends one transactional email for an order, at most once.
 *
 * Every send is recorded in `email_log` before dispatch, and the unique
 * (orderId, template) constraint is what makes that safe: a webhook PayMongo
 * delivers twice cannot produce two confirmation emails. A previous attempt
 * that failed leaves a row without `sentAt`, so it can still be retried.
 */
export async function sendOrderEmail({
  orderId,
  template,
  to,
  vars,
}: {
  orderId: string
  template: TemplateName
  to: string
  vars: MergeVars
}): Promise<SendResult> {
  // Checked before the log row is written, so a suppressed marketing send does
  // not occupy the (orderId, template) slot that a later retry would need.
  if (!isTransactional(template) && (await hasOptedOut(to))) {
    return { status: 'skipped', reason: 'Recipient has unsubscribed.' }
  }

  let logId: string

  try {
    const created = await db.emailLog.create({
      data: { orderId, template, recipient: to },
    })
    logId = created.id
  } catch (error) {
    if (!isUniqueViolation(error)) {
      console.error(`Could not record email log for order ${orderId}:`, error)
      return { status: 'failed', error: 'Could not record the email send.' }
    }

    const existing = await db.emailLog.findUnique({
      where: { orderId_template: { orderId, template } },
    })

    if (!existing) {
      return { status: 'failed', error: 'Email log conflict could not resolve.' }
    }

    if (existing.sentAt) {
      return { status: 'skipped', reason: 'Already sent.' }
    }

    logId = existing.id
  }

  const rendered = renderTemplate(template, vars)

  if (rendered.missingTags.length > 0) {
    console.warn(
      `Template ${template} for order ${orderId} is missing values for: ${rendered.missingTags.join(', ')}`,
    )
  }

  try {
    const { data, error } = await resendClient().emails.send({
      from: process.env.EMAIL_FROM ?? '',
      replyTo: process.env.EMAIL_REPLY_TO,
      to,
      subject: rendered.subject,
      html: rendered.html,
    })

    if (error || !data) {
      const message = error?.message ?? 'Resend returned no message id.'
      await db.emailLog.update({
        where: { id: logId },
        data: { error: message },
      })
      console.error(`Resend rejected ${template} for order ${orderId}:`, message)
      return { status: 'failed', error: message }
    }

    await db.emailLog.update({
      where: { id: logId },
      data: { resendId: data.id, sentAt: new Date(), error: null },
    })

    return { status: 'sent', resendId: data.id }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown email failure.'

    await db.emailLog.update({
      where: { id: logId },
      data: { error: message },
    })

    console.error(`Failed to send ${template} for order ${orderId}:`, error)
    return { status: 'failed', error: message }
  }
}
