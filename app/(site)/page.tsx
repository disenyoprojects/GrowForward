import { ComingSoon } from '@/components/home/ComingSoon'
import { CtaBand } from '@/components/home/CtaBand'
import { FeaturedCollection } from '@/components/home/FeaturedCollection'
import { Features } from '@/components/home/Features'
import { GuideTeaser } from '@/components/home/GuideTeaser'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Story } from '@/components/home/Story'
import {
  getComingSoonCollections,
  getFeaturedCollection,
  getHomepage,
} from '@/lib/content'

export default function HomePage() {
  const homepage = getHomepage()
  const featured = getFeaturedCollection()
  const comingSoon = getComingSoonCollections()

  return (
    <>
      <Hero content={homepage.hero} />
      <Features content={homepage.features} />
      <Story content={homepage.story} />
      {featured ? <FeaturedCollection collection={featured} /> : null}
      {comingSoon.map((collection) => (
        <ComingSoon key={collection.slug} collection={collection} />
      ))}
      <HowItWorks content={homepage.howItWorks} />
      <GuideTeaser content={homepage.guideTeaser} />
      <CtaBand content={homepage.ctaBand} />
    </>
  )
}
