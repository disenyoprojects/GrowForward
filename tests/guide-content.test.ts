import { describe, expect, it } from 'vitest'
import { guides } from '@/content/guide'
import { getGuideByCollection, getPublishedGuide } from '@/lib/content'

describe('getGuideByCollection', () => {
  it('finds a guide by its collection slug', () => {
    expect(getGuideByCollection('chefs-garden')?.collectionSlug).toBe(
      'chefs-garden',
    )
  })

  it('returns null for a collection with no guide written yet', () => {
    expect(getGuideByCollection('filipino-kitchen-garden')).toBeNull()
    expect(getGuideByCollection('nonsense')).toBeNull()
  })
})

describe('getPublishedGuide', () => {
  // The whole point of the draft gate: a recipient holding a real basket must
  // never read "[GROWER NAME]" off the QR they were just given.
  it('hides a draft guide from recipients', () => {
    expect(getPublishedGuide('chefs-garden')).toBeNull()
  })

  it('shows a draft guide under preview, so staff can sign it off', () => {
    expect(getPublishedGuide('chefs-garden', true)?.collectionSlug).toBe(
      'chefs-garden',
    )
  })

  it('returns null for an unknown collection, preview or not', () => {
    expect(getPublishedGuide('nonsense')).toBeNull()
    expect(getPublishedGuide('nonsense', true)).toBeNull()
  })
})

describe('guide content', () => {
  it('names real plants rather than placeholders', () => {
    const plants = guides[0].plants.map((plant) => plant.name)

    expect(plants).toEqual([
      'Basil',
      'Rosemary',
      'Thyme',
      'Cherry Tomatoes',
      'Oregano',
    ])
  })

  // If someone flips a guide to published, this fails until the placeholders
  // are gone — which is exactly the moment it should.
  it('has no bracketed placeholders left in any published guide', () => {
    const published = guides.filter((guide) => guide.status === 'published')

    for (const guide of published) {
      expect(JSON.stringify(guide)).not.toMatch(/\[[A-Z][^\]]*\]/)
    }
  })
})
