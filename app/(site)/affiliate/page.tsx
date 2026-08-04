import type { Metadata } from 'next'
import { AffiliateForm } from '@/components/affiliate/AffiliateForm'
import { getAffiliate } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Partner with GrowForward',
  description:
    'Earn from every living gift you send our way. Apply to the GrowForward partner programme.',
}

/** A tier with no signed-off rate says so, rather than showing a made-up number. */
function rate(percent: number | null): string {
  return percent === null ? 'To be confirmed' : `${percent}%`
}

export default function AffiliatePage() {
  const { hero, benefits, commission, faqs, form } = getAffiliate()

  return (
    <>
      <section className="affiliate-hero">
        <div className="container">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.heading}</h1>
          <p className="desc">{hero.body}</p>
        </div>
      </section>

      <section className="affiliate-benefits">
        <div className="container">
          <h2>Why partner with us</h2>
          <div className="affiliate-benefit-grid">
            {benefits.map((benefit) => (
              <article className="affiliate-benefit" key={benefit.title}>
                <h3>{benefit.title}</h3>
                <p>{benefit.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="affiliate-commission">
        <div className="container">
          <h2>Commission</h2>
          <div className="affiliate-tiers">
            {commission.tiers.map((tier) => (
              <article className="affiliate-tier" key={tier.name}>
                <h3>{tier.name}</h3>
                <p className="affiliate-rate">{rate(tier.ratePercent)}</p>
                <p className="affiliate-requirement">{tier.requirement}</p>
              </article>
            ))}
          </div>
          <p className="affiliate-note">{commission.note}</p>
        </div>
      </section>

      <section className="affiliate-faqs">
        <div className="container">
          <h2>Questions</h2>
          <dl className="affiliate-faq-list">
            {faqs.map((faq) => (
              <div className="affiliate-faq" key={faq.question}>
                <dt>{faq.question}</dt>
                <dd>{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="affiliate-apply" id="apply">
        <div className="container">
          <h2>{form.heading}</h2>
          <p className="desc">{form.body}</p>
          <AffiliateForm copy={form} />
        </div>
      </section>
    </>
  )
}
