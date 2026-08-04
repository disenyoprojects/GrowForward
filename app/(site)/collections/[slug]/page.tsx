import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PersonalizeForm } from '@/components/order/PersonalizeForm'
import { getCollectionBySlug, getCollections } from '@/lib/content'
import { formatPeso } from '@/lib/orders/identifiers'

interface PageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getCollections().map((collection) => ({ slug: collection.slug }))
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)

  if (!collection) {
    return { title: 'Collection not found — GrowForward' }
  }

  return {
    title: `${collection.name} — GrowForward`,
    description: collection.description,
  }
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params
  const collection = getCollectionBySlug(slug)

  if (!collection) {
    notFound()
  }

  return (
    <section className="collection">
      <div className="container collection-grid">
        <div className="collection-media">
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            priority
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="collection-copy">
          <span className="eyebrow">{collection.eyebrow}</span>
          <h2>{collection.name}</h2>
          <p className="desc">{collection.description}</p>

          {collection.status === 'live' ? (
            <>
              <p className="price">{formatPeso(collection.priceCentavos)}</p>
              <div className="includes-list">
                {collection.includes.map((item) => (
                  <div key={item}>{item}</div>
                ))}
              </div>
              <PersonalizeForm
                collectionSlug={collection.slug}
                unitPriceCentavos={collection.priceCentavos}
              />
            </>
          ) : (
            <>
              <div className="plant-tags">
                {collection.plants.map((plant) => (
                  <div className="plant-tag" key={plant}>
                    {plant}
                  </div>
                ))}
              </div>
              <p className="desc" style={{ marginTop: 32 }}>
                This collection is not available yet. Follow @growforward to
                hear when it launches.
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
