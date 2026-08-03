import type { HomepageContent } from '@/lib/content'

export function Features({ content }: { content: HomepageContent['features'] }) {
  return (
    <section className="features">
      <div className="container">
        <div className="section-head">
          <span className="eyebrow">{content.eyebrow}</span>
          <h2>{content.heading}</h2>
        </div>
        <div className="feature-grid">
          {content.cards.map((card) => (
            <div className="feature-card" key={card.title}>
              <div className="feature-icon" aria-hidden="true">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
