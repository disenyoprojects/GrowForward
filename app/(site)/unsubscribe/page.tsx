import type { Metadata } from 'next'
import { verifyUnsubscribeToken } from '@/lib/email/optout'
import { hasOptedOut } from '@/lib/email/optout-store'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unsubscribe — GrowForward',
  description: 'Stop receiving GrowForward marketing email.',
  robots: { index: false, follow: false },
}

interface PageProps {
  readonly searchParams: Promise<Record<string, string | string[] | undefined>>
}

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] ?? ''
  return value ?? ''
}

export default async function UnsubscribePage({ searchParams }: PageProps) {
  const params = await searchParams
  const email = first(params.email)
  const token = first(params.token)
  const done = first(params.done) === '1'

  const valid = verifyUnsubscribeToken(email, token)
  const already = valid && !done ? await hasOptedOut(email) : false

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Email</span>
          <h1>{done || already ? 'You are unsubscribed' : 'Unsubscribe'}</h1>
          <p className="desc">
            {done || already
              ? 'We have removed you from GrowForward marketing email.'
              : valid
                ? 'Confirm below and we will stop sending you marketing email.'
                : 'We could not check this link.'}
          </p>
        </div>
      </section>

      <section className="page-body">
        <div className="container policy-body">
          {done || already ? (
            <article className="policy-section">
              <p>
                <strong>{email}</strong> will no longer receive our newsletters
                or promotional email.
              </p>
              <p>
                You will still receive emails about orders you place — order
                confirmations, receipts, and delivery updates. Those are not
                marketing, and withholding them would leave you paying for
                something with no record of it.
              </p>
              <p>
                Changed your mind, or unsubscribed by accident? Email{' '}
                <a href="mailto:marketing@destinevents.biz">
                  marketing@destinevents.biz
                </a>{' '}
                and we will put you back on.
              </p>
            </article>
          ) : valid ? (
            <article className="policy-section">
              <p>
                We will stop sending marketing email to{' '}
                <strong>{email}</strong>.
              </p>
              <p>
                You will still receive emails about orders you place — order
                confirmations, receipts, and delivery updates.
              </p>

              {/* A plain form, submitted by the person rather than followed
                  automatically. Mail security scanners open every link in an
                  email; if one click unsubscribed you, they would do it for you
                  before you ever saw the message. */}
              <form
                method="post"
                action="/api/unsubscribe"
                className="unsubscribe-form"
              >
                <input type="hidden" name="email" value={email} />
                <input type="hidden" name="token" value={token} />
                <button type="submit" className="btn btn-primary">
                  Unsubscribe me
                </button>
              </form>
            </article>
          ) : (
            <article className="policy-section">
              <p>
                This link is not valid. It may have been cut short by your email
                app, or it may be from an older email.
              </p>
              <p>
                Email{' '}
                <a href="mailto:marketing@destinevents.biz">
                  marketing@destinevents.biz
                </a>{' '}
                and we will unsubscribe you by hand.
              </p>
            </article>
          )}
        </div>
      </section>
    </>
  )
}
