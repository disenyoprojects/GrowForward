import type { CollectionGuide } from '@/lib/content/types'

/**
 * The full Guide — what a recipient reads after scanning the basket.
 *
 * Mobile-first: this is read one-handed, standing in a kitchen, next to the
 * basket it came with. Sections stack in the order someone actually needs them —
 * how to keep the plant alive first, what to cook second, everything else after.
 */
export function GuideContent({ guide }: { guide: CollectionGuide }) {
  return (
    <>
      <p className="guide-intro">{guide.intro}</p>

      <section className="guide-section" aria-labelledby="care">
        <h3 id="care">Looking after your plants</h3>
        <div className="guide-plants">
          {guide.plants.map((plant) => (
            <article className="guide-plant" key={plant.name}>
              <h4>{plant.name}</h4>
              <dl>
                <dt>Light</dt>
                <dd>{plant.light}</dd>
                <dt>Water</dt>
                <dd>{plant.water}</dd>
                <dt>Feed</dt>
                <dd>{plant.feed}</dd>
              </dl>
              {plant.note ? <p className="guide-note">{plant.note}</p> : null}
            </article>
          ))}
        </div>
      </section>

      {guide.recipes.length > 0 ? (
        <section className="guide-section" aria-labelledby="recipes">
          <h3 id="recipes">What to cook</h3>
          {guide.recipes.map((recipe) => (
            <article className="guide-recipe" key={recipe.title}>
              <h4>{recipe.title}</h4>
              <p className="guide-uses">Uses {recipe.uses.join(' and ')}</p>

              <h5>You will need</h5>
              <ul>
                {recipe.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h5>Method</h5>
              <ol>
                {recipe.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </section>
      ) : null}

      {guide.growers.length > 0 ? (
        <section className="guide-section" aria-labelledby="growers">
          <h3 id="growers">The people who grew this</h3>
          {guide.growers.map((grower) => (
            <article className="guide-grower" key={grower.name}>
              <h4>{grower.name}</h4>
              <p className="guide-farm">
                {grower.farm} · {grower.location}
              </p>
              <p>{grower.story}</p>
            </article>
          ))}
        </section>
      ) : null}

      {guide.tips.length > 0 ? (
        <section className="guide-section" aria-labelledby="tips">
          <h3 id="tips">Keeping it going</h3>
          <div className="guide-tips">
            {guide.tips.map((tip) => (
              <article className="guide-tip" key={tip.title}>
                <h4>{tip.title}</h4>
                <p>{tip.body}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section className="guide-share" aria-labelledby="share">
        <h3 id="share">{guide.share.heading}</h3>
        <p>{guide.share.body}</p>
        <p className="guide-hashtag">{guide.share.hashtag}</p>
      </section>
    </>
  )
}
