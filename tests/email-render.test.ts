import { describe, expect, it } from 'vitest'
import { escapeHtml, renderTemplate } from '@/lib/email/render'
import { templates } from '@/lib/email/templates'

const SITE_URL = 'https://growforward.ph'

describe('escapeHtml', () => {
  it('neutralises markup in customer-supplied text', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe(
      '&lt;script&gt;alert(1)&lt;/script&gt;',
    )
    expect(escapeHtml(`Tom & Jerry's "gift"`)).toBe(
      'Tom &amp; Jerry&#39;s &quot;gift&quot;',
    )
  })
})

describe('renderTemplate', () => {
  it('substitutes merge tags', () => {
    const { html } = renderTemplate(
      'order-confirmation',
      { customer_name: 'Maria Santos', order_number: 'GF-2026-0001' },
      { siteUrl: SITE_URL },
    )

    expect(html).toContain('Maria Santos')
    expect(html).toContain('GF-2026-0001')
  })

  it('never leaves a literal merge tag in the sent email', () => {
    const { html, subject } = renderTemplate(
      'order-confirmation',
      {},
      { siteUrl: SITE_URL },
    )

    expect(html).not.toMatch(/\{\{\s*[a-z0-9_]+\s*\}\}/i)
    expect(subject).not.toMatch(/\{\{/)
  })

  it('reports the tags it could not fill', () => {
    const { missingTags } = renderTemplate(
      'order-confirmation',
      { customer_name: 'Maria' },
      { siteUrl: SITE_URL },
    )

    expect(missingTags).toContain('order_number')
    expect(missingTags).not.toContain('customer_name')
  })

  it('escapes a gift message that contains markup', () => {
    const { html } = renderTemplate(
      'order-confirmation',
      { gift_message: '<img src=x onerror=alert(1)>' },
      { siteUrl: SITE_URL },
    )

    expect(html).not.toContain('onerror=alert(1)>')
    expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;')
  })

  it('rewrites relative image paths to absolute URLs', () => {
    const { html } = renderTemplate('welcome', {}, { siteUrl: SITE_URL })

    expect(html).not.toContain('src="assets/images/')
    expect(html).toContain(`src="${SITE_URL}/email/images/`)
  })

  it('drops a trailing slash on the site URL', () => {
    const { html } = renderTemplate(
      'welcome',
      {},
      { siteUrl: 'https://growforward.ph/' },
    )

    expect(html).not.toContain('growforward.ph//email')
  })

  it('throws on an unknown template rather than sending an empty email', () => {
    expect(() =>
      // @ts-expect-error deliberately invalid template name
      renderTemplate('does-not-exist', {}, { siteUrl: SITE_URL }),
    ).toThrow(/Unknown email template/)
  })
})

describe('compiled templates', () => {
  it('includes every transactional email the order flow sends', () => {
    for (const name of [
      'order-confirmation',
      'payment-confirmation',
      'gift-card',
      'preparing-order',
      'shipping',
      'delivered',
    ]) {
      expect(templates).toHaveProperty(name)
    }
  })

  it('gives every template a subject line', () => {
    for (const [name, template] of Object.entries(templates)) {
      expect(template.subject, `${name} has no subject`).toBeTruthy()
    }
  })
})
