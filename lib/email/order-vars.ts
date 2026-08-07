import { getCollectionBySlug } from '@/lib/content'
import type { Order } from '@/lib/generated/prisma/client'
import type { MergeVars } from './render'

const COMPANY_NAME = 'GrowForward'

/**
 * Shown on the gift card when the buyer left the message blank.
 *
 * The card is signed with the sender's name, so this has to read as a card
 * sentiment rather than words put in their mouth — and it cannot be empty,
 * because a missing merge tag renders as nothing and would leave the card
 * signed by someone who apparently said nothing at all.
 */
const DEFAULT_GIFT_CARD_MESSAGE = 'Something living, chosen just for you.'

function formatDate(date: Date | null): string | undefined {
  if (!date) return undefined

  return new Intl.DateTimeFormat('en-PH', {
    dateStyle: 'long',
    timeZone: 'Asia/Manila',
  }).format(date)
}

/**
 * Maps an order onto the `{{merge_tags}}` the email templates expect.
 *
 * The tag names come from emails/README.md — keep them in sync when templates
 * gain new fields.
 */
export function buildOrderMergeVars(order: Order, siteUrl: string): MergeVars {
  const base = siteUrl.replace(/\/$/, '')
  const collection = getCollectionBySlug(order.collectionSlug)

  return {
    company_name: COMPANY_NAME,
    customer_name: order.buyerName,
    recipient_name: order.recipientName,
    sender_name: order.senderName,
    order_number: order.orderNumber,
    collection_name: collection?.name ?? order.collectionSlug,
    gift_message: order.giftMessage ?? undefined,
    gift_card_message: order.giftMessage ?? DEFAULT_GIFT_CARD_MESSAGE,
    delivery_address: order.deliveryAddress,
    delivery_date: formatDate(order.deliveredAt ?? order.deliveryDateWanted),
    estimated_ship_date: formatDate(order.deliveryDateWanted),
    tracking_number: order.trackingNumber ?? undefined,
    courier_name: order.courierName ?? undefined,

    order_link: `${base}/order/${order.guideToken}/confirmed`,
    guide_link: `${base}/guide/${order.guideToken}`,
    tracking_link: `${base}/order/${order.guideToken}/confirmed`,
    review_link: `${base}/review/${order.guideToken}`,
    shop_link: `${base}/collections`,
    cart_link: `${base}/collections`,
    about_link: `${base}/about`,
    consultation_link: `${base}/corporate`,
    affiliate_link: `${base}/affiliate`,
    unsubscribe_link: `${base}/unsubscribe`,
    instagram_link: 'https://instagram.com/growforward',
    facebook_link: 'https://facebook.com/growforward',
  }
}
