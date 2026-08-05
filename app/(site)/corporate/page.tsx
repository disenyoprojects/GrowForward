import Link from 'next/link'
import { DraftNotice } from '@/components/site/DraftNotice'
import { getCorporate } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const { status, hero, offerings, sections, cta } = getCorporate()

export const metadata = pageMetadata(
  status,
  'Corporate Gifting — GrowForward',
  'Living gift baskets for client thank-yous, employee milestones and events.',
)

export default function CorporatePage() {
  return (
    <>
      <DraftNotice status={status} />

      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.heading}</h1>
          <p className="desc">{hero.body}</p>
        </div>
      </section>

      <section className="page-body page-body-alt">
        <div className="container">
          <h2 className="page-heading">What we offer</h2>
          <div className="page-card-grid">
            {offerings.map((offering) => (
              <article className="page-card" key={offering.title}>
                <h3>{offering.title}</h3>
                <p>{offering.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="page-body">
        <div className="container page-prose">
          {sections.map((section) => (
            <article className="page-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>

      <section className="page-cta">
        <div className="container">
          <h2>{cta.heading}</h2>
          <p>{cta.body}</p>
          <Link href={cta.link.href} className="btn btn-primary">
            {cta.link.label}
          </Link>
        </div>
      </section>
    </>
  )
}
