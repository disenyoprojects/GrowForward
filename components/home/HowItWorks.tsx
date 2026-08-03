import type { HomepageContent } from '@/lib/content'

export function HowItWorks({
  content,
}: {
  content: HomepageContent['howItWorks']
}) {
  return (
    <section className="how" id="how-it-works">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2>{content.heading}</h2>
        </div>
        <div className="how-steps">
          {content.steps.map((step, index) => (
            <div className="how-step" key={step}>
              <div className="num">{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
