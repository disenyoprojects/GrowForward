import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { db } from '@/lib/db'
import { GuideContent } from '@/components/guide/GuideContent'
import { getHomepage, getPublishedGuide } from '@/lib/content'

export const dynamic = 'force-dynamic'

/**
 * The QR destination.
 *
 * Shows the recipient's name and the gift message, so it is deliberately
 * unlisted: the token is random, and search engines are told to stay out.
 */
export const metadata: Metadata = {
  title: 'Your GrowForward Guide',
  robots: { index: false, follow: false },
}

export default async function GuidePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ preview?: string }>
}) {
  const { token } = await params
  const { preview } = await searchParams

  const order = await db.order.findUnique({
    where: { guideToken: token },
    select: {
      id: true,
      recipientName: true,
      senderName: true,
      giftMessage: true,
      guideFirstScannedAt: true,
      collectionSlug: true,
    },
  })

  if (!order) {
    notFound()
  }

  // Record the scan. A failure here must never stop the recipient seeing their
  // guide, so it is logged and swallowed.
  try {
    await db.order.update({
      where: { id: order.id },
      data: {
        guideScanCount: { increment: 1 },
        ...(order.guideFirstScannedAt
          ? {}
          : { guideFirstScannedAt: new Date() }),
      },
    })
  } catch (error) {
    console.error(`Could not record guide scan for order ${order.id}:`, error)
  }

  const isPreview = preview === '1'
  const guide = getPublishedGuide(order.collectionSlug, isPreview)
  const { guideTeaser } = getHomepage()

  return (
    <section className="guide">
      <div className="container">
        {isPreview && guide?.status === 'draft' ? (
          <p className="guide-draft-banner" role="status">
            Draft preview — this content has not been signed off and is not shown
            to recipients.
          </p>
        ) : null}

        <span className="eyebrow">The GrowForward Guide</span>
        <h2>Hello, {order.recipientName}</h2>

        {order.giftMessage ? (
          <blockquote className="gf-gift-message">
            <p>{order.giftMessage}</p>
            <footer>— {order.senderName}</footer>
          </blockquote>
        ) : (
          <p className="desc">A living gift from {order.senderName}.</p>
        )}

        {guide ? (
          <GuideContent guide={guide} />
        ) : (
          <>
            {/* No finished guide for this collection yet — the teaser is what
                ships in the meantime, rather than half-written content. */}
            <p className="desc">{guideTeaser.description}</p>

            <div className="guide-grid">
              {guideTeaser.cards.map((card) => (
                <div className="guide-card" key={card.title}>
                  <span className="icon" aria-hidden="true">
                    {card.icon}
                  </span>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
