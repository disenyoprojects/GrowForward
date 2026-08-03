# GrowForward V1 — IT Handover

**Status:** Design approved, content finalized. Ready for engineering build.
**Scope:** Simplified V1 (no AI, no accounts, no dashboard — see exclusions below).
**Contact:** marketing@destinevents.biz

---

## 1. What this is

GrowForward is a premium living-gift brand — a Destinevents initiative, in partnership with Session Groceries. V1 is intentionally simple: a marketing/shop site with a real PayMongo purchase flow, a QR-linked "GrowForward Guide" that opens after delivery, and a branded email system. No AI, no user accounts, no dashboard — those are V2/V3.

---

## 2. What's already built (design + content — do not redesign)

| Deliverable | File | Notes |
|---|---|---|
| Homepage design | `growforward-homepage-mockup.html` | Approved. Single-file HTML/CSS reference — treat as the visual source of truth for colors, type, spacing, and section layout when building the real site. |
| Hero brand image | `growforward-hero-branding.png` | Official branding artwork, used as hero background |
| Product photo | `growforward-chefs-garden.png` | Chef's Garden collection close-up |
| Email system | `emails/` folder | 12 branded transactional/marketing emails + master template + component library + README. Production-ready HTML, inline-styled, Outlook/Gmail/Apple Mail compatible. |
| V1 scope brief | `GrowForward-V1-MVP-Brief.md` | Business-side scope, phased timeline, cost context |
| Trial plan | `GrowForward-Session-Groceries-Trial-Plan.md` | Physical product pilot plan with Session Groceries (not an engineering concern, included for context) |

**Do not alter the visual design.** Layout, typography, colors, and photography direction in `growforward-homepage-mockup.html` are approved and should be carried into the real build as-is.

---

## 3. Customer journey to build

1. Visitor browses living gift collections on the site.
2. Visitor selects a collection (currently one live SKU: **The Chef's Garden**).
3. Visitor personalizes the gift: recipient name, gift message, sender name, optional delivery notes.
4. Visitor proceeds to payment via **PayMongo** (IT already has the payment link).
5. On successful payment:
   - Show an order confirmation page.
   - Send the order confirmation email (`emails/order-confirmation.html`).
   - Send the digital gift card.
   - Generate a unique QR code linked to the purchased collection/order.
6. Physical basket is delivered by Session Groceries.
7. Recipient scans the QR code on the basket.
8. QR opens the **GrowForward Guide** — a mobile page with plant care info, recipes, grower stories, growing tips, and a social share prompt (#GrowForwardPH).

**No cart. No login.** Each "Reserve Collection" button should go straight to personalization → PayMongo payment link. Keep it that simple for V1.

---

## 4. Engineering checklist

### Site build
- [ ] Rebuild `growforward-homepage-mockup.html` as a real Next.js (or equivalent) site — same markup/CSS, wired to real data instead of static placeholders.
- [ ] Collection page(s): product photos, description, what's included, personalize form (recipient name, gift message, sender name, delivery notes), "Reserve Collection" button.
- [ ] Personalize form → PayMongo payment link handoff (pass order details through as needed by the PayMongo flow IT has already set up).
- [ ] Order confirmation page (post-payment redirect/webhook).
- [ ] QR code generation per order — unique code per purchase, linked to that order's collection and recipient.
- [ ] GrowForward Guide page (mobile-first) — the QR destination. Content sections: plant care guides, recipe cards, grower stories, growing tips, share prompt. See `growforward-homepage-mockup.html`'s "GrowForward Guide" section for the visual pattern (five-card grid on dark forest background) — the real Guide page should expand each of these into full content, not just a teaser grid.
- [ ] Affiliate page: static landing page, registration form, FAQ, benefits, commission overview, contact form. **Frontend only** — no live commission engine yet. Leave clear placeholders for future integration with the affiliate platform your team is building separately.

### CMS
Set up a CMS (Sanity, Contentful, or similar headless option) so non-engineers can manage:
- Collections
- Plant guides
- Recipes
- Grower stories
- Growing tips
- FAQs
- Announcements
- Corporate info
- Affiliate info
- Homepage content

### Email integration
- Everything needed is in `emails/README.md` — read that first.
- Templates use `{{merge_tag}}` placeholders (e.g. `{{customer_name}}`, `{{order_number}}`, `{{tracking_number}}`). Convert to whichever platform's syntax you land on (Resend, Brevo, Mailchimp, MailerLite, or a Supabase Edge Function / n8n / Zapier flow).
- Trigger points needed: order confirmation, payment confirmation, preparing-order, shipping, delivered. The rest (welcome, abandoned cart, review request, share-your-garden, affiliate invitation, corporate follow-up, seasonal) are marketing sends — wire up on your own schedule.

### Payments
- PayMongo payment link is already known to IT — confirm whether V1 uses a single static payment link per collection, or a generated link per order (needed if personalization data like recipient name/message must travel with the transaction). If PayMongo's static links can't carry that metadata, you'll need a lightweight backend step (order record created first, then a dynamic PayMongo checkout session) rather than a bare static link.

---

## 5. Explicitly out of scope for V1

Do not build these yet — they're V2/V3:

AI gardening chat · plant diagnosis (vision) · garden dashboard · user registration/accounts · harvest tracking · meal tracking · garden journal · watering notifications · impact dashboard · Claude API integration · Supabase authentication · any feature requiring complex backend logic beyond what's listed above.

A "Coming Soon" teaser section on the site can reference these (GrowForward Companion AI, plant health diagnosis, smart garden journal, watering reminders, recipe personalization, subscription refills, community challenges, corporate impact dashboard, farmer marketplace) — no functionality required, just a mention.

---

## 6. Brand reference (for exact parity with approved design)

```
Deep Forest Green   #2C3B2A
Forest Deep          #1F2B1E
Soft Sage            #A9B79C
Sage Light           #E4E9DC
Warm Beige           #EFE8D8
Natural Linen        #F7F3E9
Off White            #FBFAF6
Earth Brown          #6B4E3A
Bamboo               #C7A97B
Wood                 #8A6244
```

Headings: Cormorant Garamond (serif), fallback Georgia.
Body: Inter (sans), fallback Arial/Helvetica.
Buttons: fully rounded (100px radius), bamboo fill, forest-deep text.

Full token reference also lives in `emails/assets/email.css` (documentation only — actual emails use inline styles for client compatibility).

---

## 7. Open decisions for IT to confirm

- CMS choice (Sanity / Contentful / other headless option)
- Email sending platform (Resend / Brevo / Mailchimp / MailerLite / custom via Supabase Edge Functions)
- QR code generation method (library/service, and whether codes are generated at order time or pre-generated in a batch tied to physical tags)
- Hosting (Vercel assumed, per original tech direction — confirm)
- Whether PayMongo needs a dynamic checkout session vs. static payment link (see Payments note above)

---

## 8. Suggested build order

Matches the phased plan in `GrowForward-V1-MVP-Brief.md`:

1. **Content + commerce** — site wired to CMS, personalize form, PayMongo flow, order confirmation page/email, gift card email.
2. **QR Guide** — mobile QR landing experience, QR generation and attachment per order.
3. **Affiliate frontend** — landing page, registration form, FAQ, benefits, commission overview, contact form (no live engine).
4. **Polish + QA** — cross-device testing, copy pass, launch.

Realistic timeline for an in-house/intern team building part-time: **8–12 weeks** to launch.
