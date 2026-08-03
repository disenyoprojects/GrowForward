import Image from 'next/image'
import Link from 'next/link'
import type { HeroContent } from '@/lib/content'

export function Hero({ content }: { content: HeroContent }) {
  return (
    <section className="hero">
      <div className="hero-bg">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-grid">
        <div className="hero-copy">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>
            {content.headingLine1}
            <br />
            <em>{content.headingLine2}</em>
          </h1>
          <p className="sub">{content.subheading}</p>
          <div className="btn-row">
            <Link href={content.primaryCta.href} className="btn btn-primary">
              {content.primaryCta.label}
            </Link>
            <Link href={content.secondaryCta.href} className="btn btn-outline">
              {content.secondaryCta.label}
            </Link>
          </div>
        </div>
      </div>
      <div className="hero-tag">
        <div className="dot" />
        <div>
          <p>{content.badgeTitle}</p>
          <span>{content.badgeSubtitle}</span>
        </div>
      </div>
    </section>
  )
}
