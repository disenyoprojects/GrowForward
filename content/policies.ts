import type { PolicyContent } from '@/lib/content/types'

/**
 * The three standing legal pages.
 *
 * Everything describing how the system actually behaves is written out properly
 * — what the site collects, who processes it, where it runs. Those are facts
 * about the build, not decisions, and stating them accurately is the point of a
 * privacy policy.
 *
 * Everything that is a business or legal commitment — refund windows, delivery
 * coverage, retention periods, VAT treatment — is left in square brackets. None
 * of it may be guessed: a policy is what the business can be held to. All three
 * pages stay `draft` until someone with the authority to make those promises has
 * read them.
 */

const BUSINESS_EMAIL = 'marketing@destinevents.biz'

export const privacy: PolicyContent = {
  status: 'draft',
  lastUpdated: null,
  hero: {
    eyebrow: 'Privacy',
    heading: 'What we collect, and why',
    body: 'GrowForward is run by Destinevents Events Management Services. This page explains what happens to the details you give us when you send a gift.',
  },
  sections: [
    {
      heading: 'What you give us',
      paragraphs: [
        'When you order a basket we ask for your name, email address, and optionally your mobile number. We also ask for the details of the gift itself: the recipient’s name, the name to sign it with, your gift message, the delivery address, any delivery notes, and a preferred delivery date.',
        'We ask for a mobile number only so we can reach you if something goes wrong with a delivery. Leaving it blank does not affect your order.',
        'We do not ask for the recipient’s email address and we never email them directly. The gift card is sent to you, to pass on however you choose.',
      ],
    },
    {
      heading: 'What we do with it',
      paragraphs: [
        'We use these details to prepare and deliver your basket, to email you about your order, and to answer you if you get in touch. That is all.',
        'Your gift message is printed on the card that goes in the basket and appears on the digital gift card we email you. Please keep that in mind when writing it.',
        'We do not sell your details, and we do not use them for advertising.',
      ],
    },
    {
      heading: 'Who else handles your details',
      paragraphs: [
        'Payments are handled entirely by PayMongo. We never see or store your card number — you enter it on PayMongo’s own page. PayMongo receives your name, email address, phone number if you gave one, and the amount.',
        'Our emails are sent through Resend, which processes the email address and the contents of the message in order to deliver it.',
        'Delivery is carried out by Session Groceries, who receive the recipient’s name, the delivery address, and any delivery notes.',
        'Our website and database run on servers operated by Vercel and Railway, which are located outside the Philippines. [Confirm the hosting regions before publishing.]',
      ],
    },
    {
      heading: 'Cookies and tracking',
      paragraphs: [
        'This site sets no advertising or analytics cookies. We do not use Google Analytics or any similar service, and nothing here tracks you across other websites.',
        'The only cookie we set is for staff signing in to the order screen. If you are a customer, you will never receive it.',
      ],
    },
    {
      heading: 'The guide page and QR codes',
      paragraphs: [
        'Every basket carries a QR code with a unique, randomly generated address. Scanning it opens the care guide for that basket.',
        'We record how many times that address has been opened and when it was first opened, so we can tell whether a basket reached its recipient. That count is not linked to any name, device, or location.',
      ],
    },
    {
      heading: 'How long we keep it',
      paragraphs: [
        'We keep order records for as long as we need them to run the business and meet our record-keeping obligations. [Retention period to be confirmed.]',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        'Under the Data Privacy Act of 2012 (Republic Act No. 10173) you have the right to be told what personal information we hold about you, to have mistakes corrected, to object to how we use it, and to ask us to delete it where the law allows.',
        `To make any of these requests, email us at ${BUSINESS_EMAIL} with your order number.`,
        '[Name and contact details of the Data Protection Officer to be confirmed.]',
        '[Registered business address to be confirmed.]',
      ],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If we change how we handle your details we will update this page. Where the change is significant, we will say so at the top.',
      ],
    },
  ],
}

export const terms: PolicyContent = {
  status: 'draft',
  lastUpdated: null,
  hero: {
    eyebrow: 'Terms',
    heading: 'Terms of service',
    body: 'The terms you agree to when you order a GrowForward basket.',
  },
  sections: [
    {
      heading: 'Who you are buying from',
      paragraphs: [
        'GrowForward is a brand operated by Destinevents Events Management Services, in partnership with Session Groceries.',
        '[Registered business name, address and registration number to be confirmed.]',
      ],
    },
    {
      heading: 'Placing an order',
      paragraphs: [
        'Choosing a collection and completing payment places an order. Your order is confirmed once payment has been received and we have emailed you to say so.',
        'We may decline an order — for example if we cannot deliver to your address, or if we cannot prepare the number of baskets requested. If we decline after you have paid, you will be refunded in full.',
      ],
    },
    {
      heading: 'Prices and payment',
      paragraphs: [
        'All prices are shown in Philippine pesos. [Confirm whether prices include VAT.]',
        'Payment is taken by PayMongo. We accept the payment methods shown at checkout.',
        'We may change prices at any time, but never after you have placed an order.',
      ],
    },
    {
      heading: 'Living plants',
      paragraphs: [
        'These baskets contain living plants. No two are identical: size, shape and colour vary naturally, and the photographs on this site show examples rather than the exact plant you will receive.',
        'Plants need care from the day they arrive. The guide that comes with every basket explains how to look after each one.',
      ],
    },
    {
      heading: 'Delivery',
      paragraphs: [
        'Delivery is carried out by Session Groceries.',
        '[Delivery coverage — which areas we deliver to — to be confirmed.]',
        '[Lead time from order to delivery to be confirmed.]',
        'You may tell us a preferred delivery date. We will do our best to meet it, but living plants ship when they are ready, so we cannot guarantee a specific date.',
      ],
    },
    {
      heading: 'Changing or cancelling an order',
      paragraphs: [
        'Baskets are assembled to order, so there is a point after which we can no longer change or cancel one.',
        '[Cancellation and amendment cut-off to be confirmed.]',
        'To ask for a change, email us at ' + BUSINESS_EMAIL + ' with your order number as early as you can.',
      ],
    },
    {
      heading: 'If something is wrong',
      paragraphs: [
        'If a plant arrives damaged, or the basket is not what you ordered, please tell us. How we put it right is set out on our refunds page.',
      ],
    },
    {
      heading: 'The guide page',
      paragraphs: [
        'The care guide that opens when a QR code is scanned is provided for general guidance. Plants respond to their own conditions, and we cannot guarantee that any particular plant will thrive.',
      ],
    },
    {
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of the Republic of the Philippines.',
        '[Dispute resolution and venue to be confirmed.]',
      ],
    },
  ],
}

export const refunds: PolicyContent = {
  status: 'draft',
  lastUpdated: null,
  hero: {
    eyebrow: 'Refunds',
    heading: 'Refunds and returns',
    body: 'What happens if a basket arrives damaged, late, or not as expected.',
  },
  sections: [
    {
      heading: 'Living plants are different',
      paragraphs: [
        'Plants are perishable, so a basket cannot simply be sent back the way a mug could. Instead we look at what went wrong and put it right — usually by replacing the basket or refunding it.',
      ],
    },
    {
      heading: 'If a plant arrives damaged or unhealthy',
      paragraphs: [
        'Tell us as soon as you can and send a photograph. That lets us see what happened and, where it points to a problem in packing or transit, fix it for everyone.',
        '[Time limit for reporting damage to be confirmed.]',
        '[Whether we replace, refund, or offer a choice — to be confirmed.]',
      ],
    },
    {
      heading: 'If the wrong basket arrives',
      paragraphs: [
        'If you receive something other than what you ordered, tell us and we will correct it at no cost to you.',
      ],
    },
    {
      heading: 'If you change your mind',
      paragraphs: [
        '[Whether a change-of-mind cancellation is possible, and up to what point, to be confirmed.]',
      ],
    },
    {
      heading: 'How to ask for a refund',
      paragraphs: [
        `Email ${BUSINESS_EMAIL} with your order number, what went wrong, and a photograph if a plant is damaged.`,
        '[Expected response time to be confirmed.]',
      ],
    },
    {
      heading: 'How refunds are paid',
      paragraphs: [
        'Refunds are returned through PayMongo to the payment method used for the order. We cannot refund to a different card or account.',
        '[How long PayMongo takes to return the money to be confirmed.]',
      ],
    },
  ],
}
