import type { FulfilmentContent } from '@/lib/content/types'

/**
 * What the kitchen and the growers can actually get out of the door.
 *
 * `weeklyBasketCapacity` is `null` until the business confirms a number, and
 * null means no limit is enforced. That is deliberate: a guessed cap would
 * either turn away real customers or fail to stop an oversell, and both are
 * worse than the honest state of not knowing yet.
 */
export const fulfilment: FulfilmentContent = {
  weeklyBasketCapacity: null,
  atCapacityMessage:
    'We are fully booked for this week. Please try again in a few days — these are living plants, and we only promise what we can actually grow and pack.',
}
