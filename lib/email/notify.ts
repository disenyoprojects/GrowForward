import { Resend } from 'resend'
import { db } from '@/lib/db'
import { escapeHtml } from './render'

export type NotifyResult =
  | { readonly status: 'sent'; readonly resendId: string }
  | { readonly status: 'skipped'; readonly reason: string }
  | { readonly status: 'failed'; readonly error: string }

/** Recorded in `email_log` like any other send, but with no order attached. */
const TEMPLATE = 'affiliate-application'

export interface AffiliateApplicationSummary {
  readonly name: string
  readonly email: string
  readonly phone?: string | null
  readonly instagram?: string | null
  readonly facebook?: string | null
  readonly audience?: string | null
  readonly message?: string | null
}

function row(label: string, value: string | null | undefined): string {
  if (!value) return ''

  return `<tr><td style="padding:6px 12px 6px 0; color:#5A6552; vertical-align:top;">${escapeHtml(label)}</td><td style="padding:6px 0; color:#1F2B1E; font-weight:600;">${escapeHtml(value)}</td></tr>`
}

/**
 * Plain and internal on purpose.
 *
 * This goes to whoever runs the programme, not to a customer, so it skips the
 * branded templates and the unsubscribe machinery — nobody should be able to
 * unsubscribe the business from hearing about its own applicants.
 */
function body(application: AffiliateApplicationSummary): string {
  return [
    '<div style="font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:1.6; color:#1F2B1E;">',
    '<p>Someone has applied to the GrowForward affiliate programme.</p>',
    '<table cellpadding="0" cellspacing="0" border="0">',
    row('Name', application.name),
    row('Email', application.email),
    row('Phone', application.phone),
    row('Instagram', application.instagram),
    row('Facebook', application.facebook),
    row('Audience', application.audience),
    row('Message', application.message),
    '</table>',
    '<p style="color:#5A6552;">They are waiting to hear back. Nothing is sent to them automatically.</p>',
    '</div>',
  ].join('')
}

/**
 * Tells the business that someone applied.
 *
 * Never throws. The applicant has already been told their application was
 * received, and failing that submission because an internal email bounced would
 * lose a real partner over a mail problem. Failures land in `email_log` and the
 * server log instead.
 */
export async function notifyNewAffiliateApplication(
  application: AffiliateApplicationSummary,
): Promise<NotifyResult> {
  const to = process.env.AFFILIATE_NOTIFY_EMAIL
  const from = process.env.EMAIL_FROM
  const apiKey = process.env.RESEND_API_KEY

  if (!to) {
    // Not an error: the business has not yet said who should hear about these.
    console.warn(
      'AFFILIATE_NOTIFY_EMAIL is not set — nobody was told about a new affiliate application.',
    )

    return { status: 'skipped', reason: 'No notification address configured.' }
  }

  if (!apiKey || !from) {
    console.error('Cannot notify about an affiliate application: email is not configured.')

    return { status: 'skipped', reason: 'Email is not configured.' }
  }

  let logId: string | null = null

  try {
    const log = await db.emailLog.create({
      data: { template: TEMPLATE, recipient: to },
    })
    logId = log.id
  } catch (error) {
    // Worth sending anyway — a missing log row is better than a missing partner.
    console.error('Could not record the affiliate notification:', error)
  }

  try {
    const { data, error } = await new Resend(apiKey).emails.send({
      from,
      to,
      subject: `New affiliate application — ${application.name}`,
      replyTo: application.email,
      html: body(application),
    })

    if (error || !data) {
      const message = error?.message ?? 'Resend returned no message id.'

      if (logId) {
        await db.emailLog.update({ where: { id: logId }, data: { error: message } })
      }

      console.error('Resend rejected the affiliate notification:', message)

      return { status: 'failed', error: message }
    }

    if (logId) {
      await db.emailLog.update({
        where: { id: logId },
        data: { resendId: data.id, sentAt: new Date(), error: null },
      })
    }

    return { status: 'sent', resendId: data.id }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown failure.'

    if (logId) {
      await db.emailLog
        .update({ where: { id: logId }, data: { error: message } })
        .catch(() => {})
    }

    console.error('Failed to notify about an affiliate application:', error)

    return { status: 'failed', error: message }
  }
}
