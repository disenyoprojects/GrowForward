import { DraftNotice } from '@/components/site/DraftNotice'
import { getFaqs } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const { status, hero, groups } = getFaqs()

export const metadata = pageMetadata(
  status,
  'Questions — GrowForward',
  'How the baskets work, what arrives, and what to do once it does.',
)

export default function FaqPage() {
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
        <div className="container faq-groups">
          {groups.map((group) => (
            <article className="faq-group" key={group.heading}>
              <h2>{group.heading}</h2>
              <dl className="faq-list">
                {group.faqs.map((faq) => (
                  <div className="faq-item" key={faq.question}>
                    <dt>{faq.question}</dt>
                    <dd>{faq.answer}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
