import type { SiteContent } from '@/lib/content/types'

/** Nav, footer, and brand strings shared by every page. */
export const site: SiteContent = {
  brandPrefix: 'GROW',
  brandSuffix: 'forward',
  tagline: 'Growing Gifts. Growing Families.',
  partnershipLine:
    'A Destinevents Initiative · In Partnership with Session Groceries',
  copyright:
    '© 2026 GrowForward™. Destinevents Events Management Services.',
  navLinks: [
    { label: 'Home', href: '/' },
    { label: 'Collections', href: '/collections' },
    { label: 'Corporate Gifting', href: '/corporate' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Guide', href: '/#guide' },
    { label: 'About', href: '/about' },
  ],
  navCta: { label: 'Shop Collection', href: '/collections' },
  footerTagline:
    'Growing Gifts. Growing Families. Made with purpose in the Philippines.',
  footerColumns: [
    {
      heading: 'Explore',
      links: [
        { label: 'Collections', href: '/collections' },
        { label: 'Corporate Gifting', href: '/corporate' },
        { label: 'GrowForward Guide', href: '/#guide' },
        { label: 'Shop', href: '/collections' },
      ],
    },
    {
      heading: 'Company',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
      ],
    },
    {
      heading: 'Connect',
      links: [
        { label: '@growforward', href: 'https://instagram.com/growforward' },
        {
          label: 'marketing@destinevents.biz',
          href: 'mailto:marketing@destinevents.biz',
        },
      ],
    },
  ],
}
