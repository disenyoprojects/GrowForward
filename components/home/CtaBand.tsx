import Link from 'next/link'
import type { CtaBandContent } from '@/lib/content'

export function CtaBand({ content }: { content: CtaBandContent }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>{content.heading}</h2>
        <span className="accent-line">{content.accentLine}</span>
        <Link href={content.cta.href} className="btn btn-primary">
          {content.cta.label}
        </Link>
      </div>
    </section>
  )
}
