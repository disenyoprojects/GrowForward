# GrowForward Email Marketing System

Branded, responsive, production-ready HTML emails for GrowForward — matching the site's forest green / sage / bamboo palette and serif-plus-sans editorial style. Every email is table-based with inline styles, so it renders consistently in Gmail, Apple Mail, and Outlook.

## Folder structure

```
emails/
  master-template.html       reusable base layout, documented section by section
  welcome.html
  order-confirmation.html
  payment-confirmation.html
  preparing-order.html
  shipping.html
  delivered.html
  abandoned-cart.html
  review-request.html
  share-your-garden.html
  affiliate-invitation.html
  corporate-followup.html
  seasonal-template.html      reusable for any occasion — see notes below
  assets/
    components.html          every reusable block rendered in one reference page
    email.css                design tokens (colors, type, spacing) — documentation only
    images/
      growforward-hero-branding.png
      growforward-chefs-garden.png
```

## How the templates are built

Every email shares the same skeleton: logo header → hero image → eyebrow + headline → body copy → an optional content block (order details, tracking info, a product card, etc.) → CTA button → optional social row → divider → branded footer. `master-template.html` is that skeleton with placeholder content and comments — duplicate it to start a new email rather than building from scratch.

`assets/components.html` renders every individual block on its own (button, hero banner, image block, product card, two-column layout, quote block, grower story card, recipe card, detail table, three-step block, social row) so you can see and copy any single piece without opening a full email.

## Design notes

- Colors and type come straight from the website: deep forest green (`#2C3B2A`), sage, warm beige, linen, off-white, with a serif (Cormorant Garamond, falling back to Georgia) for headlines and Inter/Arial for body copy.
- Layout is a single 600px-wide table, centered, 16px corner radius, so it degrades gracefully on desktop Outlook (which ignores border-radius and web fonts but renders the fixed-width table correctly).
- The CTA button includes an Outlook-specific VML fallback (`<!--[if mso]>`) so the rounded bamboo button still renders correctly in Windows Outlook instead of falling back to a bare link.
- All styling is inlined directly on elements — this is deliberate. Outlook's rendering engine does not reliably read `<style>` blocks or linked stylesheets, so anything that must show up correctly everywhere is inline. `assets/email.css` exists purely as a design-token reference for anyone editing these files by hand.
- Mobile responsiveness comes from a small `<style>` block with a `max-width:600px` media query, which Gmail and Apple Mail both honor; Outlook simply ignores it and shows the fixed desktop width, which is an accepted, standard tradeoff for this style of template.

## Merge tags

These are plain `{{tag}}` placeholders — swap the syntax to match whichever platform sends the email (see below). Used across the system:

`{{customer_name}}` `{{recipient_name}}` `{{order_number}}` `{{collection_name}}` `{{delivery_date}}` `{{delivery_address}}` `{{tracking_number}}` `{{courier_name}}` `{{estimated_ship_date}}` `{{gift_message}}` `{{affiliate_link}}` `{{review_link}}` `{{shop_link}}` `{{order_link}}` `{{tracking_link}}` `{{guide_link}}` `{{cart_link}}` `{{consultation_link}}` `{{about_link}}` `{{instagram_link}}` `{{facebook_link}}` `{{unsubscribe_link}}` `{{company_name}}`

`seasonal-template.html` additionally uses `{{seasonal_subject}}`, `{{seasonal_preheader}}`, `{{seasonal_eyebrow}}`, `{{seasonal_headline}}`, `{{seasonal_body_1}}`, `{{seasonal_body_2}}`, `{{seasonal_cta_text}}`, `{{seasonal_cta_link}}` — fill these in per campaign (Christmas, Mother's Day, Father's Day, Valentine's Day, Teacher's Day, housewarming, weddings, birthdays) rather than duplicating the file for every occasion.

## Connecting to a sending platform

No vendor-specific code is embedded — these are plain HTML files. To go live with any provider:

- **Resend / Supabase Edge Functions** — read the file as a string, replace `{{tag}}` with real values (simple string replace or a template engine), send as the HTML body.
- **Brevo, Mailchimp, MailerLite** — import the HTML directly into their template editor. Each platform has its own merge tag syntax (`*|TAG|*` for Mailchimp, `{{ params.TAG }}` for Brevo, `{$tag}` for MailerLite) — find-and-replace `{{tag}}` with the platform's format on import.
- **n8n / Zapier** — use an HTTP or email node, run the same find-and-replace step on the raw HTML before sending.

Keep a single source of truth (this folder) and treat platform-specific merge syntax as a build step, not something hand-edited into the templates themselves — that's what keeps this system portable if you switch providers later.

## What still needs real assets before sending

- Replace the two placeholder photos in `assets/images/` with final product photography as it's shot (basil/tomato hero shots, delivery/packaging shots, grower portraits) — the templates reference them by filename, so swapping the file is enough.
- Hosted image URLs: once these emails go through an actual sending platform, images need to live at a public HTTPS URL (most ESPs host uploaded images automatically) — local relative paths only work for preview.
- Real unsubscribe and legal footer requirements (physical mailing address, etc.) depend on the sending platform and applicable regulations — confirm with whoever manages compliance before launch.
