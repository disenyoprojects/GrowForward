import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

const sent: { from?: string; to?: string; subject?: string; html?: string; replyTo?: string }[] = []
let resendError: { message: string } | null = null

vi.mock('resend', () => ({
  Resend: class {
    emails = {
      send: async (payload: Record<string, string>) => {
        sent.push(payload)

        return resendError
          ? { data: null, error: resendError }
          : { data: { id: 'resend_1' }, error: null }
      },
    }
  },
}))

vi.mock('@/lib/db', () => ({
  db: {
    emailLog: {
      create: async () => ({ id: 'log_1' }),
      update: async () => ({}),
    },
  },
}))

const { notifyNewAffiliateApplication } = await import('@/lib/email/notify')

const application = {
  name: 'Ana Reyes',
  email: 'ana@example.com',
  phone: '09171234567',
  instagram: '@anagrows',
  facebook: null,
  audience: '4,000 followers',
  message: 'I run a plant page.',
}

describe('telling the business about a new affiliate', () => {
  beforeEach(() => {
    sent.length = 0
    resendError = null
    process.env.RESEND_API_KEY = 're_test'
    process.env.EMAIL_FROM = 'GrowForward <hello@example.com>'
    process.env.AFFILIATE_NOTIFY_EMAIL = 'partners@example.com'
  })

  afterEach(() => {
    delete process.env.AFFILIATE_NOTIFY_EMAIL
  })

  it('emails the configured address with the applicant’s details', async () => {
    const result = await notifyNewAffiliateApplication(application)

    expect(result.status).toBe('sent')
    expect(sent).toHaveLength(1)
    expect(sent[0].to).toBe('partners@example.com')
    expect(sent[0].subject).toContain('Ana Reyes')
    expect(sent[0].html).toContain('ana@example.com')
    expect(sent[0].html).toContain('4,000 followers')
  })

  /** Replying to the notification should reach the applicant, not the system. */
  it('sets reply-to so hitting reply reaches the applicant', async () => {
    await notifyNewAffiliateApplication(application)

    expect(sent[0].replyTo).toBe('ana@example.com')
  })

  it('leaves out fields the applicant did not fill in', async () => {
    await notifyNewAffiliateApplication({ ...application, facebook: null })

    expect(sent[0].html).not.toContain('Facebook')
  })

  it('escapes markup in anything the applicant typed', async () => {
    await notifyNewAffiliateApplication({
      ...application,
      message: '<img src=x onerror=alert(1)>',
    })

    expect(sent[0].html).not.toContain('onerror=alert(1)>')
    expect(sent[0].html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  /**
   * The state the project is in today: nobody has said who should hear about
   * applications. That must not look like a failure, and must not send anywhere.
   */
  it('skips quietly when no address has been configured', async () => {
    delete process.env.AFFILIATE_NOTIFY_EMAIL

    const result = await notifyNewAffiliateApplication(application)

    expect(result.status).toBe('skipped')
    expect(sent).toHaveLength(0)
  })

  /**
   * The applicant has already been told their application was received. An
   * internal mail failure must be reported, not thrown, or a real partner is
   * lost over a mail problem.
   */
  it('reports a send failure instead of throwing', async () => {
    resendError = { message: 'API key is invalid' }

    const result = await notifyNewAffiliateApplication(application)

    expect(result.status).toBe('failed')
    expect(result).toHaveProperty('error', 'API key is invalid')
  })
})
