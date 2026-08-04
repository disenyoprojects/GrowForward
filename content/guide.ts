import type { CollectionGuide } from '@/lib/content/types'

/**
 * Guide content — what the recipient sees after scanning the basket QR.
 *
 * ⚠️ EVERY GUIDE BELOW IS `status: 'draft'`.
 *
 * Draft guides are never shown to a recipient. The Guide page falls back to the
 * teaser instead, so a real basket can ship today without anyone reading
 * half-finished text. Add `?preview=1` to any guide URL to read the draft.
 *
 * Flip a guide to `status: 'published'` once its content is signed off. That is
 * the only switch — nothing else needs changing.
 *
 * What still needs a human:
 *
 *   - CARE  The plant names are real (from the collection's `includes`), and the
 *           care text is a sensible first draft. It still needs sign-off from
 *           someone who actually grows these — wrong advice kills the gift.
 *   - RECIPES  Placeholders. Must match the printed Luxury Recipe Card.
 *   - GROWERS  Placeholders, and the one section that must never be invented.
 *              These are real farms and real people or they are nothing.
 */
export const guides: readonly CollectionGuide[] = [
  {
    collectionSlug: 'chefs-garden',
    status: 'draft',
    intro:
      'Everything in your basket is alive and wants to keep growing. Here is how to look after it, and what to cook when it does.',
    plants: [
      {
        name: 'Basil',
        light: 'Six hours of bright light. A sunny windowsill is ideal.',
        water:
          'Water when the top inch of soil is dry — usually every two days indoors.',
        feed: 'A light feed once a month through the growing season.',
        note: 'Pinch the top leaves often. It keeps the plant bushy instead of tall and woody.',
      },
      {
        name: 'Rosemary',
        light: 'Full sun. It tolerates heat far better than shade.',
        water:
          'Let the soil dry out between waterings. More rosemary is lost to overwatering than to neglect.',
        feed: 'Rarely needed. It prefers poor soil to rich soil.',
        note: 'Woody stems are normal, not a sign of trouble.',
      },
      {
        name: 'Thyme',
        light: 'Full sun, and good airflow around the plant.',
        water: 'Sparingly. Let it dry between drinks.',
        feed: 'Not usually needed in its first season.',
        note: 'Trim after it flowers to keep new growth coming.',
      },
      {
        name: 'Cherry Tomatoes',
        light: 'As much direct sun as you can give — eight hours if possible.',
        water:
          'Deeply and consistently. Irregular watering is what splits the fruit.',
        feed: 'Every two weeks once the first flowers appear.',
        note: 'Support the stem as it grows. The fruit gets heavier than the plant expects.',
      },
      {
        name: 'Oregano',
        light: 'Full sun.',
        water: 'Light and infrequent. It dislikes wet feet.',
        feed: 'Seldom needed.',
        note: 'Flavour is strongest just before it flowers.',
      },
    ],
    recipes: [
      {
        title: '[RECIPE 1 — must match the printed recipe card]',
        uses: ['Basil', 'Cherry Tomatoes'],
        ingredients: ['[ingredient]', '[ingredient]', '[ingredient]'],
        steps: ['[step]', '[step]', '[step]'],
      },
      {
        title: '[RECIPE 2 — must match the printed recipe card]',
        uses: ['Rosemary', 'Thyme'],
        ingredients: ['[ingredient]', '[ingredient]'],
        steps: ['[step]', '[step]'],
      },
    ],
    growers: [
      {
        name: '[GROWER NAME]',
        farm: '[FARM NAME]',
        location: '[TOWN, PROVINCE]',
        story:
          '[Their story — how long they have farmed, what they grow, why it matters. Do not invent this. It must be a real person who agreed to appear here.]',
      },
    ],
    tips: [
      {
        title: 'Harvest often',
        body: 'Herbs grow faster the more you pick them. Taking a little every few days does more good than leaving them alone.',
      },
      {
        title: 'When something wilts',
        body: '[Reviving advice — needs sign-off from a grower.]',
      },
      {
        title: 'Growing more from what you have',
        body: '[Propagation advice — needs sign-off from a grower.]',
      },
    ],
    share: {
      heading: 'Show us how it grows',
      body: 'Tag your garden with #GrowForwardPH. We share our favourites.',
      hashtag: '#GrowForwardPH',
    },
  },
]
