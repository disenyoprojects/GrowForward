import { z } from 'zod'

/**
 * An optional free-text field.
 *
 * Browsers submit untouched inputs as empty strings, not as missing keys.
 * Normalising `''` to `undefined` here keeps blanks out of the database, where
 * they would otherwise be indistinguishable from a real answer.
 */
function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .transform((value) => (value === '' ? undefined : value))
    .optional()
}

/**
 * Optional text that must match a pattern when it is filled in.
 */
function optionalPattern(max: number, pattern: RegExp, message: string) {
  return optionalText(max).refine(
    (value) => value === undefined || pattern.test(value),
    { message },
  )
}

/**
 * Validation for the personalize form.
 *
 * Every field the customer types passes through here before it reaches the
 * database or PayMongo. Limits are deliberate: the gift message is printed on
 * a physical card, and the recipient name appears on the Guide page.
 */
export const createOrderSchema = z.object({
  collectionSlug: z
    .string()
    .min(1, 'Please choose a collection.')
    .max(80)
    .regex(/^[a-z0-9-]+$/, 'Unknown collection.'),

  buyerName: z.string().trim().min(2, 'Please enter your name.').max(120),
  buyerEmail: z
    .email('Please enter a valid email address.')
    .max(254)
    .transform((value) => value.toLowerCase()),
  buyerPhone: optionalPattern(
    32,
    /^(\+63|0)9\d{9}$/,
    'Enter a Philippine mobile number, e.g. 09171234567.',
  ),

  recipientName: z
    .string()
    .trim()
    .min(2, "Please enter the recipient's name.")
    .max(120),
  senderName: z
    .string()
    .trim()
    .min(2, 'Please enter the name to sign the gift with.')
    .max(120),
  giftMessage: z
    .string()
    .trim()
    .max(500, 'Gift messages are limited to 500 characters.')
    .transform((value) => (value === '' ? undefined : value))
    .optional(),

  deliveryAddress: z
    .string()
    .trim()
    .min(10, 'Please enter the full delivery address.')
    .max(500),
  deliveryNotes: optionalText(500),
  deliveryDateWanted: optionalPattern(
    10,
    /^\d{4}-\d{2}-\d{2}$/,
    'Use the date picker to choose a date.',
  ),

  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number.')
    .min(1, 'Order at least one basket.')
    .max(10, 'For more than 10 baskets, please contact us about corporate gifting.')
    .default(1),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>

export const affiliateApplicationSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(120),
  email: z
    .email('Please enter a valid email address.')
    .max(254)
    .transform((value) => value.toLowerCase()),
  phone: optionalText(32),
  instagram: optionalText(120),
  facebook: optionalText(120),
  audience: optionalText(200),
  message: optionalText(1000),
})

export type AffiliateApplicationInput = z.infer<
  typeof affiliateApplicationSchema
>
