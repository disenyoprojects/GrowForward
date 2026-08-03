import type { GuideTeaserContent } from '@/lib/content'

export function GuideTeaser({ content }: { content: GuideTeaserContent }) {
  return (
    <section className="guide" id="guide">
      <div className="container">
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.heading}</h2>
        <p className="desc">{content.description}</p>
        <div className="guide-grid">
          {content.cards.map((card) => (
            <div className="guide-card" key={card.title}>
              <span className="icon" aria-hidden="true">
                {card.icon}
              </span>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
