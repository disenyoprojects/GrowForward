'use server'

import { db } from '@/lib/db'
import { notifyNewAffiliateApplication } from '@/lib/email/notify'
import { affiliateApplicationSchema } from '@/lib/orders/schema'

export interface AffiliateFormState {
  readonly status: 'idle' | 'success' | 'error'
  readonly error?: string
  readonly fieldErrors?: Readonly<Record<string, string>>
}

/**
 * Records an affiliate application.
 *
 * V1 is a frontend programme: this writes a row a human reads. There is no
 * tracking, no referral link, and no payout — that is the separate affiliate
 * platform, and it integrates against this table later.
 */
export async function applyToAffiliate(
  _state: AffiliateFormState,
  formData: FormData,
): Promise<AffiliateFormState> {
  const parsed = affiliateApplicationSchema.safeParse({
    name: formData.get('name') ?? '',
    email: formData.get('email') ?? '',
    phone: formData.get('phone') ?? '',
    instagram: formData.get('instagram') ?? '',
    facebook: formData.get('facebook') ?? '',
    audience: formData.get('audience') ?? '',
    message: formData.get('message') ?? '',
  })

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}

    for (const issue of parsed.error.issues) {
      const field = issue.path[0]

      if (typeof field === 'string' && !fieldErrors[field]) {
        fieldErrors[field] = issue.message
      }
    }

    return { status: 'error', fieldErrors }
  }

  try {
    await db.affiliateApplication.create({ data: parsed.data })
  } catch (error) {
    console.error('Could not record an affiliate application:', error)

    return {
      status: 'error',
      error:
        'We could not save your application just now. Please try again in a moment.',
    }
  }

  // After the row is safely written, and deliberately not awaited into the
  // result: the application is recorded either way, and a mail failure must not
  // tell someone their application did not go through.
  const notified = await notifyNewAffiliateApplication(parsed.data)

  if (notified.status === 'failed') {
    console.error(
      `Affiliate application from ${parsed.data.email} was saved but nobody was told: ${notified.error}`,
    )
  }

  return { status: 'success' }
}
