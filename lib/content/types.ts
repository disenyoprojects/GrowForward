/**
 * Content type definitions.
 *
 * V1 keeps content in typed modules under `content/`. These types are the
 * contract between that content and the pages that render it — when a CMS
 * replaces the modules in V2, the types stay and only the loaders change.
 */

export type CollectionStatus = 'live' | 'coming_soon'

export interface CollectionImage {
  readonly src: string
  readonly alt: string
}

export interface Collection {
  readonly slug: string
  readonly name: string
  readonly eyebrow: string
  readonly description: string
  readonly status: CollectionStatus
  /** Price in centavos. PayMongo works in the smallest currency unit. */
  readonly priceCentavos: number
  readonly image: CollectionImage
  /** Bullet list rendered in the "what's included" grid. */
  readonly includes: readonly string[]
  /** Plant names shown as pills — used by coming-soon collections. */
  readonly plants: readonly string[]
}

export interface NavLink {
  readonly label: string
  readonly href: string
}

export interface FooterColumn {
  readonly heading: string
  readonly links: readonly NavLink[]
}

export interface SiteContent {
  readonly brandPrefix: string
  readonly brandSuffix: string
  readonly tagline: string
  readonly partnershipLine: string
  readonly copyright: string
  readonly navLinks: readonly NavLink[]
  readonly navCta: NavLink
  readonly footerTagline: string
  readonly footerColumns: readonly FooterColumn[]
}

export interface HeroContent {
  readonly eyebrow: string
  readonly headingLine1: string
  readonly headingLine2: string
  readonly subheading: string
  readonly primaryCta: NavLink
  readonly secondaryCta: NavLink
  readonly image: CollectionImage
  readonly badgeTitle: string
  readonly badgeSubtitle: string
}

export interface FeatureCard {
  readonly icon: string
  readonly title: string
  readonly body: string
}

export interface StoryContent {
  readonly eyebrow: string
  readonly heading: string
  readonly paragraphs: readonly string[]
  readonly accentLine: string
  readonly image: CollectionImage
}

export interface SectionHeading {
  readonly eyebrow: string
  readonly heading: string
}

export interface GuideTeaserCard {
  readonly icon: string
  readonly title: string
  readonly body: string
}

export interface GuideTeaserContent extends SectionHeading {
  readonly description: string
  readonly cards: readonly GuideTeaserCard[]
}

export interface CtaBandContent {
  readonly heading: string
  readonly accentLine: string
  readonly cta: NavLink
}

export interface HomepageContent {
  readonly hero: HeroContent
  readonly features: SectionHeading & { readonly cards: readonly FeatureCard[] }
  readonly story: StoryContent
  readonly howItWorks: SectionHeading & { readonly steps: readonly string[] }
  readonly guideTeaser: GuideTeaserContent
  readonly ctaBand: CtaBandContent
}
