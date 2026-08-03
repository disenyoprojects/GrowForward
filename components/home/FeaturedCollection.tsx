import Image from 'next/image'
import Link from 'next/link'
import type { Collection } from '@/lib/content'

export function FeaturedCollection({ collection }: { collection: Collection }) {
  return (
    <section className="collection">
      <div className="container collection-grid">
        <div className="collection-media">
          <Image
            src={collection.image.src}
            alt={collection.image.alt}
            fill
            sizes="(max-width: 900px) 100vw, 50vw"
          />
        </div>
        <div className="collection-copy">
          <span className="eyebrow">{collection.eyebrow}</span>
          <h2>{collection.name}</h2>
          <p className="desc">{collection.description}</p>
          <div className="includes-list">
            {collection.includes.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
          <Link
            href={`/collections/${collection.slug}`}
            className="btn btn-primary"
          >
            Reserve Collection
          </Link>
        </div>
      </div>
    </section>
  )
}
