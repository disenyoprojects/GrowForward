import { db } from '@/lib/db'
import { normaliseEmail } from './optout'

/**
 * Reading and writing opt-outs.
 *
 * Kept apart from `optout.ts` so that verifying a link signature does not drag
 * a database client in with it.
 */

export async function hasOptedOut(email: string): Promise<boolean> {
  const record = await db.emailOptOut.findUnique({
    where: { email: normaliseEmail(email) },
  })

  return record !== null
}

/**
 * Records an opt-out. Safe to call twice — someone clicking the link a second
 * time should see the same confirmation, not an error.
 */
export async function optOut(email: string): Promise<void> {
  const address = normaliseEmail(email)

  await db.emailOptOut.upsert({
    where: { email: address },
    update: {},
    create: { email: address },
  })
}
