import type { AboutContent } from '@/lib/content/types'

/**
 * About page copy.
 *
 * ⚠️ `status: 'draft'` — parts of this page are placeholders.
 *
 * The opening two paragraphs and the closing line are the approved brand story
 * already used on the homepage, so they are final. Everything wrapped in
 * [SQUARE BRACKETS] is a gap only the business can fill: the people involved,
 * the partnership terms, and the growers themselves.
 *
 * What still needs a human:
 *
 *   - TEAM     Who runs GrowForward, and what to say about Destinevents.
 *   - GROWERS  Which farms and communities, and what the arrangement is.
 *              These are real people — never invent them.
 *   - DATES    When this started, and what has happened since.
 *
 * Flip `status` to `'published'` once the brackets are gone. That removes the
 * unfinished notice and lets search engines index the page.
 */
export const about: AboutContent = {
  status: 'draft',

  hero: {
    eyebrow: 'Our Story',
    heading: 'More than a gift.',
    body: 'GrowForward turns gifting into something that keeps going after the celebration ends.',
  },

  sections: [
    {
      heading: 'Why we started',
      paragraphs: [
        // Approved copy, already live on the homepage. Do not reword.
        'GrowForward was created by Destinevents, in partnership with Session Groceries, to transform gifting into a meaningful experience.',
        'Inspired by the challenges faced by local growers and our belief that every home can grow something, each GrowForward collection encourages families to reconnect with food through simple kitchen gardening, fresh cooking, and sustainable living.',
      ],
    },
    {
      heading: 'Who we are',
      paragraphs: [
        '[Who runs GrowForward — names and roles. To be supplied.]',
        '[What Destinevents does outside GrowForward, and how this initiative fits. To be supplied.]',
      ],
    },
    {
      heading: 'Our growers',
      paragraphs: [
        '[Which farms and growing communities supply the plants, where they are, and what the partnership means for them. To be supplied — these are real people and real farms, and nothing here should be written for them.]',
      ],
    },
    {
      heading: 'How we work',
      paragraphs: [
        'Every basket is assembled to order. The plants are living when they leave us, the packaging is made from locally sourced materials and meant to be kept, and every basket carries a QR code that opens a guide written for what is growing inside it.',
        '[Where baskets are assembled, and how quickly after an order. To be supplied.]',
      ],
    },
  ],

  closing: "More than a gift, it's an invitation to grow together.",
}
