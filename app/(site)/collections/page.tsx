import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { type Collection, getCollections, getCollectionsIndex } from '@/lib/content'
import { formatPeso } from '@/lib/orders/identifiers'

export const metadata: Metadata = {
  title: 'Collections — GrowForward',
  description:
    'Living gift collections pairing plants from local growers with pantry essentials and a GrowForward Guide.',
}

/**
 * A coming-soon collection still gets a card and a link. Its own page explains
 * that it is not on sale and shows what will be in it — which is worth more than
 * hiding it, and is why the card is a link rather than dead weight.
 */
function CollectionCard({ collection }: { readonly collection: Collection }) {
  const isLive = collection.status === 'live'

  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="collection-card"
      key={collection.slug}
    >
      <div className="collection-card-media">
        <Image
          src={collection.image.src}
          alt={collection.image.alt}
          fill
          sizes="(max-width: 860px) 100vw, 50vw"
        />
      </div>
      <div className="collection-card-body">
        <span className="eyebrow">{collection.eyebrow}</span>
        <h2>{collection.name}</h2>
        <p>{collection.description}</p>
        <p className="collection-card-price">
          {isLive ? formatPeso(collection.priceCentavos) : 'Coming soon'}
        </p>
        <span className="collection-card-cta">
          {isLive ? 'Personalize this gift' : 'See what is inside'}
        </span>
      </div>
    </Link>
  )
}

export default function CollectionsPage() {
  const hero = getCollectionsIndex()
  const collections = getCollections()

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">{hero.eyebrow}</span>
          <h1>{hero.heading}</h1>
          <p className="desc">{hero.body}</p>
        </div>
      </section>

      <section className="collection-index">
        <div className="container">
          <div className="collection-index-grid">
            {collections.map((collection) => (
              <CollectionCard collection={collection} key={collection.slug} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
