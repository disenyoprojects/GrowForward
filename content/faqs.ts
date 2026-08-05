import type { FaqContent } from '@/lib/content/types'

/**
 * Frequently asked questions.
 *
 * ⚠️ `status: 'draft'` — mixed. Answers about how the product works are real,
 * because that part is built and can be described honestly. Answers about
 * delivery, payment methods and refunds are [BRACKETED], because they are
 * operational promises nobody has made yet.
 *
 * A wrong answer here is worse than no answer: this is the page a customer
 * reads before deciding to buy, and quoting a delivery time or a refund policy
 * the business has not agreed to creates an obligation.
 *
 * What still needs a human:
 *
 *   - DELIVERY  Areas covered, lead time, courier, and what happens to a
 *               living plant in transit.
 *   - PAYMENT   Which methods PayMongo is configured to accept.
 *   - REFUNDS   The actual policy. PayMongo generally requires a published
 *               refund and cancellation policy on the merchant site, so this
 *               also blocks going live with real keys.
 *   - PRICE     Confirmed before live payments are switched on.
 *
 * Flip `status` to `'published'` once the brackets are gone.
 */
export const faqs: FaqContent = {
  status: 'draft',

  hero: {
    eyebrow: 'Questions',
    heading: 'Everything worth asking',
    body: 'How the baskets work, what arrives, and what to do once it does.',
  },

  groups: [
    {
      heading: 'The baskets',
      faqs: [
        {
          question: 'What is actually in a GrowForward basket?',
          answer:
            'Living plants, pantry essentials chosen to cook with them, a printed recipe card, and a QR card that opens your GrowForward Guide — all in packaging meant to be kept. Each collection page lists exactly what that collection includes.',
        },
        {
          question: 'Are the plants really alive?',
          answer:
            'Yes. They are growing plants, not cuttings or seeds, and they arrive ready to keep growing on a windowsill or a kitchen counter.',
        },
        {
          question: 'Do I need to know how to garden?',
          answer:
            'No. The plants were chosen because they are hard to kill, and the Guide gives you watering, light and feeding instructions for each one.',
        },
        {
          question: 'How much does a basket cost?',
          answer:
            'The price is shown on each collection page. Collections marked "coming soon" are not on sale yet.',
        },
      ],
    },
    {
      heading: 'Ordering and personalizing',
      faqs: [
        {
          question: 'Can I write a message to the person receiving it?',
          answer:
            'Yes. When you order you can add the recipient\'s name, a gift message, your own name as the sender, and any delivery notes. All of it travels with the basket.',
        },
        {
          question: 'Can I choose the delivery date?',
          answer:
            'You can tell us the date you are hoping for when you order. [Whether a specific date can be guaranteed, and how far ahead it must be requested, to be confirmed.]',
        },
        {
          question: 'Can I order more than one?',
          answer:
            'Yes, you can order several of the same collection at once. For larger volumes, see our corporate gifting page.',
        },
        {
          question: 'Can I change or cancel my order?',
          answer:
            '[Cancellation and amendment policy to be confirmed. Because the plants are assembled to order, there is a point after which a basket cannot be changed — that cut-off needs deciding.]',
        },
      ],
    },
    {
      heading: 'Delivery',
      faqs: [
        {
          question: 'Where do you deliver?',
          answer:
            '[Delivery coverage to be confirmed.]',
        },
        {
          question: 'How long does delivery take?',
          answer:
            '[Lead time to be confirmed. Living plants and finite grower capacity make this a real constraint, so the answer should be one you can keep in a busy week.]',
        },
        {
          question: 'How do the plants survive the trip?',
          answer:
            '[How baskets are packed for transit, and what happens if a plant arrives damaged, to be confirmed.]',
        },
        {
          question: 'Will I know when it has been sent?',
          answer:
            'Yes. We email you when your order is confirmed, when it is being prepared, when it ships — with the courier and tracking number — and when it is delivered.',
        },
      ],
    },
    {
      heading: 'The GrowForward Guide',
      faqs: [
        {
          question: 'What is the QR code in the basket?',
          answer:
            'It opens the GrowForward Guide for that specific basket: care instructions for the plants inside it, recipes using them, and the story of the growers who supplied them.',
        },
        {
          question: 'Do I need an app?',
          answer:
            'No. Point your phone camera at the code and it opens in your browser. There is nothing to download and nothing to sign up for.',
        },
        {
          question: 'Does the Guide expire?',
          answer:
            'No. The code keeps working, so you can come back to the care instructions and recipes whenever you need them.',
        },
      ],
    },
    {
      heading: 'Payment',
      faqs: [
        {
          question: 'How do I pay?',
          answer:
            'Payments are handled by PayMongo, a Philippine payment provider. We never see or store your card details. [Which payment methods are enabled — cards, GCash, GrabPay, bank transfer — to be confirmed.]',
        },
        {
          question: 'Can I get a refund?',
          answer:
            '[Refund policy to be confirmed. This one also blocks launch: a published refund and cancellation policy is generally required before live payments can be switched on.]',
        },
        {
          question: 'Do I get a receipt?',
          answer:
            'Yes. A confirmation email is sent as soon as your payment goes through.',
        },
      ],
    },
  ],
}
