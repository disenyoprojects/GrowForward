import Image from 'next/image'
import type { StoryContent } from '@/lib/content'

export function Story({ content }: { content: StoryContent }) {
  return (
    <section className="story">
      <div className="story-media">
        <Image
          src={content.image.src}
          alt={content.image.alt}
          fill
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
      <div className="story-copy">
        <span className="eyebrow">{content.eyebrow}</span>
        <h2>{content.heading}</h2>
        {content.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
        <p className="accent-line">{content.accentLine}</p>
      </div>
    </section>
  )
}
