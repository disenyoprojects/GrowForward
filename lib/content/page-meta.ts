import type { Metadata } from 'next'
import type { PageStatus } from './types'

/**
 * Page metadata, with search engines held off while a page is still a draft.
 *
 * A draft page has to render — the header and footer link to it, and a dead link
 * is worse for a visitor than an honest unfinished page. But unfinished copy is
 * not what should come up when someone searches for the brand, and a page
 * indexed today keeps showing its old text for weeks after it is fixed.
 *
 * `follow: true` still lets crawlers walk through to the finished pages beyond
 * it, so a draft page does not cut off the rest of the site.
 */
export function pageMetadata(
  status: PageStatus,
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    ...(status === 'draft'
      ? { robots: { index: false, follow: true } }
      : {}),
  }
}
