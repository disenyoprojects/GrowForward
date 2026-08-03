import type { HomepageContent } from '@/lib/content/types'

/** Homepage copy. Mirrors the approved mockup section for section. */
export const homepage: HomepageContent = {
  hero: {
    eyebrow: 'A Destinevents Initiative · In Partnership with Session Groceries',
    headingLine1: 'Growing gifts.',
    headingLine2: 'Growing families.',
    subheading:
      'Premium living gift collections designed to inspire fresh meals, meaningful moments, and sustainable living — with a GrowForward Guide that keeps the experience growing long after the gift is opened.',
    primaryCta: { label: 'Shop Collection', href: '/collections' },
    secondaryCta: { label: 'Learn More', href: '/about' },
    image: {
      src: '/images/growforward-hero-branding.png',
      alt: 'GrowForward woven baskets with living herbs, chili and tomato plants',
    },
    badgeTitle: "The Chef's Garden Collection",
    badgeSubtitle: 'Living herbs · Curated pantry · GrowForward Guide',
  },
  features: {
    eyebrow: 'Why GrowForward',
    heading: 'More than a gift box',
    cards: [
      {
        icon: '🌿',
        title: 'Living kitchen garden',
        body: 'Fresh herbs and edible plants selected for everyday cooking.',
      },
      {
        icon: '🍝',
        title: 'Curated pantry essentials',
        body: 'Premium ingredients carefully chosen to complete the experience.',
      },
      {
        icon: '📱',
        title: 'GrowForward Guide',
        body: 'Scan your QR code to unlock plant care guides, recipes, and grower stories.',
      },
      {
        icon: '♻',
        title: 'Sustainably crafted',
        body: 'Beautifully designed using locally sourced materials and reusable packaging.',
      },
    ],
  },
  story: {
    eyebrow: 'Our Story',
    heading: 'More than a gift.',
    paragraphs: [
      'GrowForward was created by Destinevents, in partnership with Session Groceries, to transform gifting into a meaningful experience.',
      'Inspired by the challenges faced by local growers and our belief that every home can grow something, each GrowForward collection encourages families to reconnect with food through simple kitchen gardening, fresh cooking, and sustainable living.',
    ],
    accentLine: "More than a gift, it's an invitation to grow together.",
    // TODO: replace with final GrowForward photography (see emails/README.md).
    image: {
      src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=1000&auto=format&fit=crop',
      alt: 'Fresh herbs and vegetables on a wooden dining table',
    },
  },
  howItWorks: {
    eyebrow: 'How It Works',
    heading: 'Every gift continues to grow',
    steps: [
      'Choose your GrowForward collection',
      'Personalize your gift',
      'Complete your purchase',
      'We deliver your living gift',
      'Scan the GrowForward Guide',
      'Grow, cook & enjoy',
    ],
  },
  guideTeaser: {
    eyebrow: 'The GrowForward Guide',
    heading: 'Scan to continue your growing journey',
    description:
      'Every GrowForward basket includes a beautifully designed QR code. Simply scan it with your phone to discover:',
    cards: [
      {
        icon: '🌿',
        title: 'Easy plant care guides',
        body: 'Simple instructions to help your herbs and vegetables thrive.',
      },
      {
        icon: '🍝',
        title: 'Curated recipes',
        body: 'Fresh meal ideas inspired by the ingredients growing in your basket.',
      },
      {
        icon: '👨‍🌾',
        title: 'Meet our growers',
        body: 'Learn about the local growers and community partners behind every collection.',
      },
      {
        icon: '🌱',
        title: 'Growing tips',
        body: 'Helpful seasonal advice for beginners and experienced home gardeners alike.',
      },
      {
        icon: '📷',
        title: 'Share your garden',
        body: 'Show us your growing journey using #GrowForwardPH.',
      },
    ],
  },
  ctaBand: {
    heading: 'Every celebration ends.',
    accentLine: 'The growing begins.',
    cta: { label: 'Shop Collection', href: '/collections' },
  },
}
