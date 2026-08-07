import { DraftNotice } from '@/components/site/DraftNotice'
import type { PolicyContent } from '@/lib/content'

/**
 * The shared layout for privacy, terms and refunds.
 *
 * All three are the same shape — hero, then headed prose — so they share one
 * renderer. That also means a fix to how legal pages read only has to be made
 * once.
 */
export function PolicyPage({ policy }: { readonly policy: PolicyContent }) {
  const { status, hero, lastUpdated, sections } = policy

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

      <section className="page-body">
        <div className="container policy-body">
          {/* Only shown once the wording is signed off. An unapproved page
              carrying a confident date invites people to rely on it. */}
          {lastUpdated ? (
            <p className="policy-updated">Last updated {lastUpdated}</p>
          ) : null}

          {sections.map((section) => (
            <article className="policy-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
