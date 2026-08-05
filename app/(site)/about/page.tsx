import { DraftNotice } from '@/components/site/DraftNotice'
import { getAbout } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const { status, hero, sections, closing } = getAbout()

export const metadata = pageMetadata(
  status,
  'About GrowForward',
  'Why GrowForward exists, who is behind it, and the growers who supply every basket.',
)

export default function AboutPage() {
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
        <div className="container page-prose">
          {sections.map((section) => (
            <article className="page-section" key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </article>
          ))}

          <p className="page-closing">{closing}</p>
        </div>
      </section>
    </>
  )
}
