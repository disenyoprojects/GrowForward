import { NextResponse } from 'next/server'
import { verifyUnsubscribeToken } from '@/lib/email/optout'
import { optOut } from '@/lib/email/optout-store'

export const runtime = 'nodejs'

/**
 * Records an unsubscribe.
 *
 * A POST rather than a GET on purpose: mail security scanners open every link
 * in an email before the recipient sees it, so an unsubscribe that happened on
 * a plain visit would fire for people who never asked.
 *
 * Always redirects back to the page rather than returning JSON — this is
 * submitted by a browser form, and the person needs to see confirmation.
 */
export async function POST(request: Request) {
  const form = await request.formData().catch(() => null)

  const email = String(form?.get('email') ?? '')
  const token = String(form?.get('token') ?? '')

  const target = new URL('/unsubscribe', request.url)
  target.searchParams.set('email', email)
  target.searchParams.set('token', token)

  if (!verifyUnsubscribeToken(email, token)) {
    // No `done`, so the page shows the invalid-link message.
    return NextResponse.redirect(target, { status: 303 })
  }

  try {
    await optOut(email)
  } catch (error) {
    console.error('Could not record an unsubscribe:', error)

    return NextResponse.redirect(target, { status: 303 })
  }

  target.searchParams.set('done', '1')

  return NextResponse.redirect(target, { status: 303 })
}
