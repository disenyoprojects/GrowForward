/**
 * The single entry point for all site content.
 *
 * Pages and components must import from here and never from `content/*`
 * directly. When a CMS replaces the local modules, only this file changes.
 */

import { collections } from '@/content/collections'
import { guides } from '@/content/guide'
import { homepage } from '@/content/homepage'
import { site } from '@/content/site'
import type {
  Collection,
  CollectionGuide,
  HomepageContent,
  SiteContent,
} from './types'

export function getSite(): SiteContent {
  return site
}

export function getHomepage(): HomepageContent {
  return homepage
}

export function getCollections(): readonly Collection[] {
  return collections
}

export function getLiveCollections(): readonly Collection[] {
  return collections.filter((collection) => collection.status === 'live')
}

export function getComingSoonCollections(): readonly Collection[] {
  return collections.filter((collection) => collection.status === 'coming_soon')
}

export function getCollectionBySlug(slug: string): Collection | null {
  return collections.find((collection) => collection.slug === slug) ?? null
}

/**
 * The collection shown in the homepage's featured band. Falls back to null so
 * the section can be skipped rather than crashing the page if nothing is live.
 */
export function getFeaturedCollection(): Collection | null {
  return getLiveCollections()[0] ?? null
}

export function getGuideByCollection(slug: string): CollectionGuide | null {
  return guides.find((guide) => guide.collectionSlug === slug) ?? null
}

/**
 * The guide to actually render for a recipient.
 *
 * Returns `null` while the guide is still a draft, so the page can fall back to
 * the teaser rather than showing someone `[GROWER NAME]` on the basket they were
 * just given. `preview` overrides that — it is how staff read a draft before
 * signing it off, and a recipient scanning a QR never has it set.
 */
export function getPublishedGuide(
  slug: string,
  preview = false,
): CollectionGuide | null {
  const guide = getGuideByCollection(slug)

  if (!guide) {
    return null
  }

  return guide.status === 'published' || preview ? guide : null
}

export * from './types'
