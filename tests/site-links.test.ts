import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { getAffiliate, getCorporate, getHomepage, getSite } from '@/lib/content'

/**
 * Every internal link on the site must have a page behind it.
 *
 * This is not hypothetical: the header, the footer, and both homepage "Shop
 * Collection" buttons all pointed at `/collections`, which did not exist. The
 * main call to action on the site led to a 404. Nothing caught it, because a
 * link is just a string until someone clicks it.
 *
 * The routes are read off the filesystem rather than hard-coded, so deleting a
 * page fails this test just as surely as adding a bad link.
 */

const APP_DIR = join(process.cwd(), 'app')

/** Route-group folders like `(site)` organise files without changing the URL. */
function isRouteGroup(segment: string): boolean {
  return segment.startsWith('(') && segment.endsWith(')')
}

function collectRoutes(dir: string, segments: readonly string[]): string[] {
  const entries = readdirSync(dir, { withFileTypes: true })

  const here = entries.some((entry) => entry.name === 'page.tsx')
    ? [`/${segments.join('/')}`.replace(/\/+$/, '') || '/']
    : []

  const nested = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))
    .flatMap((entry) =>
      collectRoutes(
        join(dir, entry.name),
        isRouteGroup(entry.name) ? segments : [...segments, entry.name],
      ),
    )

  return [...here, ...nested]
}

const routes = collectRoutes(APP_DIR, [])

/** `/collections/[slug]` should match `/collections/chefs-garden`. */
function matches(route: string, path: string): boolean {
  const pattern = route
    .split('/')
    .map((segment) =>
      segment.startsWith('[') && segment.endsWith(']') ? '[^/]+' : segment,
    )
    .join('/')

  return new RegExp(`^${pattern}$`).test(path)
}

function exists(href: string): boolean {
  // A link may carry a hash for an on-page section; only the path is routed.
  const path = href.split('#')[0] || '/'

  return routes.some((route) => matches(route, path))
}

function internalLinks(): readonly { label: string; href: string }[] {
  const site = getSite()
  const home = getHomepage()

  const { invite } = getAffiliate()

  return [
    ...site.navLinks,
    site.navCta,
    ...site.footerColumns.flatMap((column) => column.links),
    home.hero.primaryCta,
    home.hero.secondaryCta,
    home.ctaBand.cta,
    getCorporate().cta.link,
    // Lives on the order confirmation page, which this test cannot reach — the
    // page needs a real order. Checking the href it renders is the next best
    // thing, and the reason the href sits in content at all.
    { label: invite.linkLabel, href: invite.href },
  ].filter((link) => link.href.startsWith('/'))
}

describe('site routes', () => {
  it('finds the pages that do exist', () => {
    expect(routes).toContain('/')
    expect(routes).toContain('/collections')
    expect(routes).toContain('/collections/[slug]')
  })

  it('ignores the route-group folder in the URL', () => {
    expect(routes.some((route) => route.includes('(site)'))).toBe(false)
  })
})

describe('every internal link resolves', () => {
  for (const link of internalLinks()) {
    it(`${link.href} — "${link.label}"`, () => {
      expect(exists(link.href)).toBe(true)
    })
  }

  it('is actually checking something', () => {
    expect(internalLinks().length).toBeGreaterThan(8)
  })

  // Proves the check can fail — otherwise a broken `exists` would pass silently.
  it('rejects a path with no page behind it', () => {
    expect(exists('/definitely-not-a-page')).toBe(false)
  })
})
