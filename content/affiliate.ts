import type { AffiliateContent } from '@/lib/content/types'

/**
 * Affiliate programme content.
 *
 * ⚠️ COMMISSION FIGURES ARE NOT CONFIRMED.
 *
 * Every rate below is `null`, and the page renders "To be confirmed" wherever a
 * rate is missing rather than printing a number nobody has agreed to. A
 * commission rate is a promise about money — inventing one to fill a layout
 * would be a promise the business never made.
 *
 * Fill in `ratePercent` for each tier once the business signs off. Nothing else
 * needs changing.
 *
 * V1 is frontend only: applications land in the `affiliate_applications` table
 * and are read by a human. There is no tracking, no referral links, no payout
 * engine — that is the separate affiliate platform, and it integrates later.
 */
export const affiliate: AffiliateContent = {
  hero: {
    eyebrow: 'GrowForward Partners',
    heading: 'Share something worth growing',
    body: 'If your people care about food, home, and where things come from, our baskets already belong in your world. Partner with us and earn from every gift you send our way.',
  },

  benefits: [
    {
      title: 'Earn on every order',
      body: 'A commission on each basket bought through your link, paid out monthly.',
    },
    {
      title: 'Something worth recommending',
      body: 'Living plants from local growers, in packaging people keep. Not another discount code.',
    },
    {
      title: 'Assets ready to post',
      body: 'Photography, copy, and launch dates, so you are never starting from a blank screen.',
    },
    {
      title: 'A real person to talk to',
      body: 'You will have a direct contact at Destinevents, not a support queue.',
    },
  ],

  commission: {
    /**
     * Tiers are the intended shape. The rates themselves are unconfirmed —
     * `null` renders as "To be confirmed" rather than a made-up number.
     */
    tiers: [
      {
        name: 'Partner',
        requirement: 'Anyone accepted into the programme',
        ratePercent: null,
      },
      {
        name: 'Established',
        requirement: '[Threshold to be confirmed]',
        ratePercent: null,
      },
      {
        name: 'Signature',
        requirement: '[Threshold to be confirmed]',
        ratePercent: null,
      },
    ],
    note: 'Commission structure is being finalised. Apply now and we will confirm your rate before you post anything.',
  },

  faqs: [
    {
      question: 'What does it cost to join?',
      answer: 'Nothing. There is no fee and no minimum spend.',
    },
    {
      question: 'How do I get paid?',
      answer:
        '[Payout method and schedule to be confirmed — bank transfer, GCash, and timing all need sign-off.]',
    },
    {
      question: 'Do I need a big following?',
      answer:
        'No. We care more about whether your audience trusts you than how many of them there are.',
    },
    {
      question: 'When does it start?',
      answer:
        'The programme opens alongside our public launch. Applying now puts you in the first group.',
    },
    {
      question: 'Can I review a basket first?',
      answer:
        '[To be confirmed — whether partners receive a sample basket is a cost decision.]',
    },
  ],

  form: {
    heading: 'Apply to partner with us',
    body: 'Tell us where you post and who reads it. We reply to every application.',
    successHeading: 'Thank you — we have your application',
    successBody:
      'We read every one. Expect to hear from us before the programme opens.',
  },

  /**
   * The invitation on the order confirmation page.
   *
   * Deliberately vague about money: the commission rates above are still
   * unconfirmed, so this promises a programme, not a percentage. Once the rates
   * are signed off this line can name one.
   */
  invite: {
    heading: 'Know someone else who would love one?',
    body: 'Share GrowForward with your people and earn on every basket they send.',
    linkLabel: 'Become an affiliate',
  },
}
