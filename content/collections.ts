import type { Collection } from '@/lib/content/types'

/**
 * Gift collections.
 *
 * `priceCentavos` is the amount charged through PayMongo — ₱1.00 is 100
 * centavos. PRICE NOT YET CONFIRMED by the business; the value below is a
 * placeholder and must be signed off before live keys are switched on.
 */
export const collections: readonly Collection[] = [
  {
    slug: 'chefs-garden',
    name: "The Chef's Garden",
    eyebrow: 'Featured Collection',
    description:
      'A handcrafted collection built for the home cook — living herbs, premium pantry staples, and everything needed to bring a fresh meal to the table.',
    status: 'live',
    priceCentavos: 249_500,
    image: {
      src: '/images/growforward-chefs-garden.png',
      alt: "GrowForward Chef's Garden baskets with basil, thyme, tomato and rosemary",
    },
    includes: [
      'Living Basil',
      'Rosemary',
      'Thyme',
      'Cherry Tomatoes',
      'Oregano',
      'Premium Pasta',
      'Extra Virgin Olive Oil',
      'Luxury Recipe Card',
      'GrowForward Guide QR Card',
      'Luxury Packaging',
    ],
    plants: [],
  },
  {
    slug: 'filipino-kitchen-garden',
    name: 'Filipino Kitchen Garden',
    eyebrow: 'Coming Soon',
    description:
      'A collection rooted in home — the herbs and aromatics found in every Filipino kitchen, grown fresh at your own table.',
    status: 'coming_soon',
    priceCentavos: 0,
    image: {
      src: '/images/growforward-hero-branding.png',
      alt: 'GrowForward woven baskets with living herbs and aromatics',
    },
    includes: [],
    plants: [
      'Siling Labuyo',
      'Lemongrass',
      'Pandan',
      'Green Onion',
      'Oregano',
    ],
  },
]
