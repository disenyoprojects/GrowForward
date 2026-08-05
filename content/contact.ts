import type { ContactContent } from '@/lib/content/types'

/**
 * Contact page copy.
 *
 * ⚠️ `status: 'draft'` — the email address and Instagram handle are real (they
 * are the ones already published in the site footer). Everything else is a
 * placeholder.
 *
 * What still needs a human:
 *
 *   - PHONE    A number, or a decision not to publish one.
 *   - ADDRESS  A business address, or a decision not to publish one.
 *   - HOURS    When enquiries are actually answered.
 *   - REPLY    How quickly you genuinely reply. Do not promise faster than true.
 *
 * A channel with `href: null` renders as plain text instead of a link, so an
 * unconfirmed phone number can never become a broken `tel:` link.
 *
 * Flip `status` to `'published'` once the brackets are gone.
 */
export const contact: ContactContent = {
  status: 'draft',

  hero: {
    eyebrow: 'Contact',
    heading: 'Talk to us',
    body: 'Questions about an order, a corporate enquiry, or something you would like us to grow — all of it reaches a person.',
  },

  channels: [
    {
      label: 'Email',
      value: 'marketing@destinevents.biz',
      href: 'mailto:marketing@destinevents.biz',
    },
    {
      label: 'Instagram',
      value: '@growforward',
      href: 'https://instagram.com/growforward',
    },
    {
      label: 'Phone',
      value: '[To be confirmed]',
      href: null,
    },
    {
      label: 'Where we are',
      value: '[Business address to be confirmed]',
      href: null,
    },
    {
      label: 'When we reply',
      value: '[Days and hours to be confirmed]',
      href: null,
    },
  ],

  responseNote:
    '[How quickly you actually reply, to be confirmed. Whatever goes here becomes a promise, so it should be a time you can keep on a busy week.]',
}
