import { describe, expect, it } from 'vitest'
import { getPrivacy, getRefunds, getTerms } from '@/lib/content'
import type { PolicyContent } from '@/lib/content'

const POLICIES: readonly (readonly [string, PolicyContent])[] = [
  ['privacy', getPrivacy()],
  ['terms', getTerms()],
  ['refunds', getRefunds()],
]

/** `[Retention period to be confirmed.]` and friends. */
const PLACEHOLDER = /\[[^\]]+\]/

function allText(policy: PolicyContent): string {
  return policy.sections.flatMap((section) => section.paragraphs).join('\n')
}

describe('policy pages', () => {
  it.each(POLICIES)('%s says something', (_name, policy) => {
    expect(policy.sections.length).toBeGreaterThan(0)

    for (const section of policy.sections) {
      expect(section.heading).not.toBe('')
      expect(section.paragraphs.length).toBeGreaterThan(0)
    }
  })

  /**
   * The one that matters. A privacy policy or refund policy is what the business
   * can be held to, so a page still carrying "[to be confirmed]" must not be
   * presented as final — it stays `draft`, which shows the notice and keeps it
   * out of search results.
   */
  it.each(POLICIES)(
    '%s is not published while it still holds placeholders',
    (_name, policy) => {
      if (PLACEHOLDER.test(allText(policy))) {
        expect(policy.status).toBe('draft')
      }
    },
  )

  it.each(POLICIES)('%s shows no date until it is signed off', (_name, policy) => {
    if (policy.status === 'draft') {
      expect(policy.lastUpdated).toBeNull()
    }
  })

  /**
   * These are not decorative. A privacy policy that fails to name who else
   * receives the customer's details is materially wrong, and the list changes
   * whenever a provider is swapped.
   */
  it('privacy names every third party that receives customer data', () => {
    const text = allText(getPrivacy())

    for (const processor of ['PayMongo', 'Resend', 'Session Groceries']) {
      expect(text, `privacy policy does not mention ${processor}`).toContain(
        processor,
      )
    }
  })

  it('refunds explains how the money comes back', () => {
    expect(allText(getRefunds())).toContain('PayMongo')
  })
})
