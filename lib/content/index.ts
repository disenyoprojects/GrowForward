/**
 * The single entry point for all site content.
 *
 * Pages and components must import from here and never from `content/*`
 * directly. When a CMS replaces the local modules, only this file changes.
 */

import { collections } from '@/content/collections'
import { homepage } from '@/content/homepage'
import { site } from '@/content/site'
import type { Collection, HomepageContent, SiteContent } from './types'

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

export * from './types'
