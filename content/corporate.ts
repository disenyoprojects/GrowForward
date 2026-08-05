import type { CorporateContent } from '@/lib/content/types'

/**
 * Corporate gifting page copy.
 *
 * ⚠️ `status: 'draft'` — this page is almost entirely placeholder.
 *
 * Corporate gifting is a commercial offer the business has not defined yet.
 * Minimum order, bulk pricing, lead time, branding options and delivery
 * coverage are all money and capacity questions. Every one of them is left in
 * [SQUARE BRACKETS] rather than guessed, because a number on this page is a
 * quote a client will hold you to.
 *
 * What still needs a human:
 *
 *   - MINIMUM     Smallest corporate order you will take.
 *   - PRICING     Bulk rates, or a decision to quote per enquiry.
 *   - LEAD TIME   How far ahead a client must order. Living plants and finite
 *                 grower capacity make this a real constraint.
 *   - BRANDING    Whether logos, custom cards or custom packaging are offered,
 *                 and at what cost.
 *   - COVERAGE    Where bulk delivery is possible.
 *
 * Flip `status` to `'published'` once the brackets are gone.
 */
export const corporate: CorporateContent = {
  status: 'draft',

  hero: {
    eyebrow: 'Corporate Gifting',
    heading: 'Gifts your team will still have in a month',
    body: 'Client thank-yous, employee milestones, and event giveaways that keep growing on a desk or a kitchen counter instead of being eaten and forgotten.',
  },

  offerings: [
    {
      title: 'Volume orders',
      body: '[Minimum order quantity and bulk pricing to be confirmed. Enquiries are answered individually in the meantime.]',
    },
    {
      title: 'Your branding',
      body: '[Whether custom cards, printed logos or custom packaging are available, and at what cost, to be confirmed.]',
    },
    {
      title: 'Delivered where you need it',
      body: '[Bulk delivery coverage and whether split delivery to individual recipients is possible, to be confirmed.]',
    },
    {
      title: 'A guide with every basket',
      body: 'Every basket carries its own QR code, so each recipient gets plant care, recipes and grower stories written for what they were given. This part is built and works today.',
    },
  ],

  sections: [
    {
      heading: 'How a corporate order works',
      paragraphs: [
        '[The process from enquiry to delivery, including how far ahead an order must be placed. Living plants and limited grower capacity make lead time a real constraint, so this needs a truthful answer rather than an optimistic one.]',
      ],
    },
    {
      heading: 'What it costs',
      paragraphs: [
        '[Bulk pricing to be confirmed. Until it is, no figure should appear on this page — a published price is a commitment.]',
      ],
    },
  ],

  cta: {
    heading: 'Talk to us about a corporate order',
    body: 'Tell us how many baskets, roughly when, and who they are for. We answer every enquiry personally.',
    link: { label: 'Get in touch', href: '/contact' },
  },
}
