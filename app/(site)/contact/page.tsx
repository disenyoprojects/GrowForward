import { DraftNotice } from '@/components/site/DraftNotice'
import { getContact } from '@/lib/content'
import { pageMetadata } from '@/lib/content/page-meta'

const { status, hero, channels, responseNote } = getContact()

export const metadata = pageMetadata(
  status,
  'Contact GrowForward',
  'How to reach us about an order, a corporate enquiry, or anything else.',
)

export default function ContactPage() {
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
        <div className="container">
          <dl className="contact-channels">
            {channels.map((channel) => (
              <div className="contact-channel" key={channel.label}>
                <dt>{channel.label}</dt>
                <dd>
                  {/* An unconfirmed value has no href, so it renders as plain
                      text rather than a link that goes nowhere. */}
                  {channel.href ? (
                    <a href={channel.href}>{channel.value}</a>
                  ) : (
                    channel.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <p className="page-closing">{responseNote}</p>
        </div>
      </section>
    </>
  )
}
