import type { Collection } from '@/lib/content'

export function ComingSoon({ collection }: { collection: Collection }) {
  return (
    <section className="coming-soon">
      <div className="container">
        <span className="eyebrow">{collection.eyebrow}</span>
        <h2>{collection.name}</h2>
        <p className="desc">{collection.description}</p>
        <div className="plant-tags">
          {collection.plants.map((plant) => (
            <div className="plant-tag" key={plant}>
              {plant}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
