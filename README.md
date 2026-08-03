# GrowForward V1

Premium living gift collections — a Destinevents initiative, in partnership with
Session Groceries.

Next.js on Vercel, Postgres on Railway, payments through PayMongo, email through
Resend. Build plan and scope: [docs/GrowForward-V1-IT-Handover.md](docs/GrowForward-V1-IT-Handover.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:migrate           # needs a reachable DATABASE_URL
npm run dev
```

Open http://localhost:3000.

### No database yet?

You do not need Railway to develop locally. Prisma ships a local Postgres:

```bash
npx prisma dev --name growforward
```

It prints a `DATABASE_URL` and a `SHADOW_DATABASE_URL` — put both in `.env`
(the Prisma CLI reads that file) and in `.env.local` (Next.js reads that one),
then run `npm run db:migrate`.

Checkout and email need real PayMongo and Resend keys. Without them the order is
still created and recorded — the checkout call fails and is logged as a
`checkout.failed` event, which is exactly what you would see in production if
PayMongo were down.

## How the code is organised

| Path | What lives there |
|---|---|
| `app/` | Routes. Pages are server components; only forms are client components. |
| `components/` | UI, grouped by area (`site/`, `home/`, `order/`). |
| `content/` | All site copy, as typed modules. **V1 has no CMS** — this is where recipes, stories, and homepage text are edited. |
| `lib/content/` | The only module pages import content through. Swapping in a CMS later means changing this file and nothing else. |
| `lib/orders/` | Validation, order creation, payment state. |
| `lib/paymongo/` | Checkout sessions and webhook signature verification. |
| `lib/email/` | Template rendering and sending. |
| `emails/` | Source HTML for the 12 branded emails — the designers' copy, and the single source of truth. |
| `prisma/` | Database schema. Orders only; content is not in the database. |
| `docs/` | Handover doc and the approved homepage mockup. |

### Two rules worth knowing

**Content is edited in `content/`, not in components.** Pages read through
`lib/content/index.ts` so that a CMS can replace the modules in V2 without
touching a single page.

**Emails are edited in `emails/`, not in `lib/email/templates/`.** The latter is
generated — run `npm run build:emails` after changing a template. It runs
automatically as part of `npm run build`.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Compiles emails, then builds the site |
| `npm test` | Unit tests |
| `npm run test:coverage` | Tests with coverage thresholds |
| `npm run build:emails` | Regenerates email template modules from `emails/` |
| `npm run db:migrate` | Creates and applies a migration (development) |
| `npm run db:deploy` | Applies existing migrations (production) |
| `npm run db:studio` | Browses the database |

## How a purchase works

1. The personalize form posts to `POST /api/orders`.
2. The order is written to Postgres as `PENDING_PAYMENT`, with a generated order
   number and a random guide token.
3. A PayMongo checkout session is created and the customer is redirected to it.
4. PayMongo calls `POST /api/webhooks/paymongo`. The signature is verified
   against the raw request body, the event is recorded, and the order is marked
   `PAID`. Confirmation emails go out.
5. The customer lands on `/order/[token]/confirmed`, which polls if the webhook
   has not arrived yet.

The order exists **before** the customer reaches PayMongo, on purpose: a closed
tab or a dropped connection can never lose a paid order. Nothing about a
purchase depends on the browser coming back.

## Deployment

- **Vercel** hosts the site. Functions run in Singapore (`vercel.json`) — the
  default US region would put the Pacific between every request and the database.
- **Railway** hosts Postgres. Vercel must reach it over the **public TCP
  proxy** (`railway tcp-proxy create --port 5432 --service Postgres`) — the two
  platforms cannot share a private network, so `postgres.railway.internal` does
  not resolve from Vercel.
- The `DATABASE_URL` needs `uselibpqcompat=true&sslmode=require&connection_limit=1`.
  Without `uselibpqcompat=true` the `pg` driver treats `require` as
  `verify-full` and rejects Railway's self-signed proxy certificate; without
  `connection_limit=1` each serverless instance opens its own pool and exhausts
  Postgres. See [.env.example](.env.example).
- Use a **separate Railway database for preview deploys** so branch builds never
  touch real orders.
- PayMongo cannot reach a preview URL that has deployment protection on. Use a
  stable staging alias with a protection bypass token for webhook testing.

## Still to build

Tracked in the build plan; nothing below is started.

- Admin screen: staff login, order list, status changes, tracking numbers
- Shipping / preparing / delivered emails (the send layer exists; the triggers do not)
- The full Guide content — plant care, recipes, grower stories, tips
- QR code generation (blocked: how tags get onto baskets is a Session Groceries decision)
- Affiliate landing page and registration form
- Legal pages: privacy, terms, refunds

## Known gaps

- **Prices are placeholders.** `content/collections.ts` carries an unconfirmed
  figure. Confirm before switching to live PayMongo keys.
- **No gift card email exists.** The customer journey calls for one; it is not
  among the 12 templates and needs to be written.
- **Product photography is placeholder.** See `emails/README.md`.
- **No stock control.** One SKU, living plants, finite capacity, nothing
  preventing overselling.
