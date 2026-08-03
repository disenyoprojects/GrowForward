import os

FOREST = "#2C3B2A"
FOREST_DEEP = "#1F2B1E"
SAGE = "#A9B79C"
SAGE_LIGHT = "#E4E9DC"
BEIGE = "#EFE8D8"
LINEN = "#F7F3E9"
OFFWHITE = "#FBFAF6"
EARTH_BROWN = "#6B4E3A"
BAMBOO = "#C7A97B"
WOOD = "#8A6244"
TEXT_DARK = "#26301F"
TEXT_MUTED = "#5A6552"

SERIF = "Georgia, 'Times New Roman', Times, serif"
SANS = "Arial, Helvetica, sans-serif"

OUT_DIR = "emails"
IMG_DIR = os.path.join(OUT_DIR, "assets", "images")
os.makedirs(IMG_DIR, exist_ok=True)

def head(title, preheader):
    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>{title}</title>
<!--[if mso]>
<noscript>
<xml>
<o:OfficeDocumentSettings>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml>
</noscript>
<![endif]-->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body, table, td, a {{ -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }}
  table, td {{ mso-table-lspace:0pt; mso-table-rspace:0pt; }}
  img {{ -ms-interpolation-mode:bicubic; border:0; outline:none; text-decoration:none; }}
  body {{ margin:0; padding:0; width:100% !important; background-color:{LINEN}; }}
  a {{ color:{WOOD}; }}
  @media screen and (max-width:600px) {{
    .gf-container {{ width:100% !important; }}
    .gf-pad {{ padding-left:24px !important; padding-right:24px !important; }}
    .gf-hero {{ height:auto !important; }}
    .gf-h1 {{ font-size:26px !important; line-height:1.25 !important; }}
    .gf-stack {{ display:block !important; width:100% !important; }}
  }}
</style>
</head>
<body style="margin:0; padding:0; background-color:{LINEN};">
<div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:{LINEN};">
  {preheader}&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;&#8203;
</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{LINEN};">
<tr>
<td align="center" style="padding:40px 16px;">
<table role="presentation" class="gf-container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:{OFFWHITE}; border-radius:16px; overflow:hidden;">
"""

def header_block():
    return f"""<tr>
<td class="gf-pad" align="center" style="padding:32px 40px 24px 40px; border-bottom:1px solid {SAGE_LIGHT};">
  <span style="font-family:{SERIF}; font-size:22px; font-weight:600; letter-spacing:0.04em; color:{FOREST};">GROW<span style="font-style:italic; font-weight:500;">forward</span></span>
</td>
</tr>
"""

def hero_block(img_src, alt):
    return f"""<tr>
<td style="line-height:0; font-size:0;">
  <img src="{img_src}" alt="{alt}" width="600" class="gf-hero" style="width:100%; max-width:600px; height:280px; object-fit:cover; display:block;">
</td>
</tr>
"""

def eyebrow_headline(eyebrow, headline):
    return f"""<tr>
<td class="gf-pad" align="center" style="padding:40px 48px 0 48px;">
  <span style="font-family:{SANS}; font-size:12px; letter-spacing:0.16em; text-transform:uppercase; color:{WOOD};">{eyebrow}</span>
  <h1 class="gf-h1" style="font-family:{SERIF}; font-size:32px; font-weight:600; line-height:1.2; color:{FOREST}; margin:14px 0 0 0;">{headline}</h1>
</td>
</tr>
"""

def body_paragraphs(paragraphs):
    rows = ""
    for i, p in enumerate(paragraphs):
        top = "20px" if i == 0 else "16px"
        rows += f"""<tr>
<td class="gf-pad" align="center" style="padding:{top} 48px 0 48px;">
  <p style="font-family:{SANS}; font-size:15px; line-height:1.7; color:{TEXT_MUTED}; margin:0; text-align:center;">{p}</p>
</td>
</tr>
"""
    return rows

def button(text, link):
    return f"""<tr>
<td align="center" style="padding:32px 48px 8px 48px;">
  <!--[if mso]>
  <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" href="{link}" style="height:48px;v-text-anchor:middle;width:220px;" arcsize="50%" stroke="f" fillcolor="{BAMBOO}">
  <w:anchorlock/>
  <center style="color:{FOREST_DEEP};font-family:{SANS};font-size:14px;font-weight:bold;">{text}</center>
  </v:roundrect>
  <![endif]-->
  <!--[if !mso]><!-->
  <a href="{link}" target="_blank" style="background-color:{BAMBOO}; color:{FOREST_DEEP}; font-family:{SANS}; font-size:14px; font-weight:600; letter-spacing:0.02em; text-decoration:none; padding:15px 36px; border-radius:100px; display:inline-block;">{text}</a>
  <!--<![endif]-->
</td>
</tr>
"""

def divider():
    return f"""<tr>
<td class="gf-pad" style="padding:32px 48px 0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="border-top:1px solid {SAGE_LIGHT}; font-size:1px; line-height:1px;">&nbsp;</td>
  </tr></table>
</td>
</tr>
"""

def detail_table(rows, title=None):
    title_html = ""
    if title:
        title_html = f"""<tr><td class="gf-pad" align="center" style="padding:0 48px 12px 48px;">
        <span style="font-family:{SANS}; font-size:12px; letter-spacing:0.1em; text-transform:uppercase; color:{WOOD}; font-weight:600;">{title}</span>
        </td></tr>"""
    row_html = ""
    for label, value in rows:
        row_html += f"""<tr>
<td style="padding:10px 24px; font-family:{SANS}; font-size:13px; color:{TEXT_MUTED};">{label}</td>
<td align="right" style="padding:10px 24px; font-family:{SANS}; font-size:13px; color:{TEXT_DARK}; font-weight:600;">{value}</td>
</tr>
"""
    return f"""{title_html}
<tr>
<td class="gf-pad" style="padding:8px 48px 0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{LINEN}; border-radius:12px;">
    {row_html}
  </table>
</td>
</tr>
"""

def quote_block(text):
    return f"""<tr>
<td class="gf-pad" align="center" style="padding:32px 48px 0 48px;">
  <p style="font-family:{SERIF}; font-style:italic; font-size:19px; color:{WOOD}; margin:0; line-height:1.5;">&ldquo;{text}&rdquo;</p>
</td>
</tr>
"""

def three_step_block(steps):
    # steps: list of (icon, label)
    cells = ""
    for icon, label in steps:
        cells += f"""<td class="gf-stack" align="center" width="33%" style="padding:0 8px;">
  <div style="font-size:22px; margin-bottom:8px;">{icon}</div>
  <div style="font-family:{SANS}; font-size:12px; color:{TEXT_DARK}; font-weight:600;">{label}</div>
</td>
"""
    return f"""<tr>
<td class="gf-pad" style="padding:28px 40px 0 40px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{cells}</tr></table>
</td>
</tr>
"""

def social_row():
    return f"""<tr>
<td align="center" style="padding:28px 48px 0 48px;">
  <span style="font-family:{SANS}; font-size:13px; color:{TEXT_MUTED};">
    <a href="{{{{instagram_link}}}}" style="color:{WOOD}; text-decoration:none; font-weight:600;">Instagram</a>
    &nbsp;&middot;&nbsp;
    <a href="{{{{facebook_link}}}}" style="color:{WOOD}; text-decoration:none; font-weight:600;">Facebook</a>
    &nbsp;&middot;&nbsp;
    <span style="color:{TEXT_DARK}; font-weight:600;">#GrowForwardPH</span>
  </span>
</td>
</tr>
"""

def footer_block(support_note=None):
    support_html = ""
    if support_note:
        support_html = f"""<p style="font-family:{SANS}; font-size:12px; color:{SAGE_LIGHT}; margin:0 0 16px 0;">{support_note}</p>"""
    return f"""<tr>
<td style="background-color:{FOREST_DEEP}; padding:40px 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
  <tr><td align="center">
    <span style="font-family:{SERIF}; font-size:18px; font-weight:600; letter-spacing:0.04em; color:{OFFWHITE};">GROW<span style="font-style:italic; font-weight:500;">forward</span></span>
    <p style="font-family:{SANS}; font-size:12px; color:{SAGE}; margin:10px 0 20px 0;">Growing Gifts. Growing Families.</p>
    {support_html}
    <p style="font-family:{SANS}; font-size:11px; color:{SAGE}; line-height:1.7; margin:0 0 4px 0;">A Destinevents Initiative &middot; In Partnership with Session Groceries</p>
    <p style="font-family:{SANS}; font-size:11px; color:{SAGE}; line-height:1.7; margin:0 0 20px 0;">Made with purpose in the Philippines.</p>
    <p style="font-family:{SANS}; font-size:11px; color:{SAGE}; margin:0;">
      <a href="mailto:marketing@destinevents.biz" style="color:{SAGE_LIGHT}; text-decoration:none;">marketing@destinevents.biz</a>
    </p>
    <p style="font-family:{SANS}; font-size:10px; color:#6B7A65; margin:20px 0 0 0;">
      {{{{company_name}}}} &middot; <a href="{{{{unsubscribe_link}}}}" style="color:#8B9985; text-decoration:underline;">Unsubscribe</a>
    </p>
  </td></tr>
  </table>
</td>
</tr>
"""

def close():
    return """</table>
</td>
</tr>
</table>
</body>
</html>
"""

def build_email(filename, title, preheader, hero_src, hero_alt, eyebrow, headline,
                 paragraphs, cta_text, cta_link, extra="", support_note=None,
                 include_social=False):
    html = head(title, preheader)
    html += header_block()
    if hero_src:
        html += hero_block(hero_src, hero_alt)
    html += eyebrow_headline(eyebrow, headline)
    html += body_paragraphs(paragraphs)
    html += extra
    html += button(cta_text, cta_link)
    if include_social:
        html += social_row()
    html += divider()
    html += footer_block(support_note)
    html += close()
    with open(os.path.join(OUT_DIR, filename), "w") as f:
        f.write(html)
    print(f"wrote {filename}")

HERO_1 = "assets/images/growforward-hero-branding.png"
HERO_2 = "assets/images/growforward-chefs-garden.png"

# 1. MASTER TEMPLATE (documented skeleton with placeholder content)
master_extra = detail_table([
    ("Label", "{{merge_tag}}"),
    ("Label", "{{merge_tag}}"),
], title="Optional Detail Block")
build_email(
    "master-template.html",
    "GrowForward Email — Master Template",
    "This is the reusable master layout. Replace every section below to build a new email.",
    HERO_1, "Hero image placeholder — swap for a lifestyle photo relevant to this email",
    "Eyebrow Label",
    "Headline goes here",
    [
        "This is the master GrowForward email template. Every email in this system is built from this exact structure: logo header, hero image, eyebrow + headline, body copy, an optional detail block, a CTA button, an optional social row, a divider, and the branded footer.",
        "Duplicate this file to start a new email, then replace the hero image, eyebrow, headline, body copy, detail block, and CTA to match the message you're sending."
    ],
    "CTA Button Text",
    "{{cta_link}}",
    extra=master_extra,
    support_note="Delete this note in real sends — it's a placeholder for documentation only.",
    include_social=True,
)

# 2. WELCOME EMAIL
build_email(
    "welcome.html",
    "Welcome to GrowForward",
    "Growing Gifts. Growing Families. — welcome to the GrowForward family.",
    HERO_1, "GrowForward woven baskets with living herbs",
    "Welcome",
    "Welcome to GrowForward, {{customer_name}}.",
    [
        "GrowForward was created by Destinevents, in partnership with Session Groceries, to transform gifting into a meaningful experience.",
        "Every collection combines living herbs, curated pantry essentials, and a beautifully designed GrowForward Guide — so the gift keeps growing long after the occasion ends."
    ],
    "Explore Collections",
    "{{shop_link}}",
    extra=quote_block("Every celebration ends. The growing begins."),
)

# 3. ORDER CONFIRMATION
order_details = detail_table([
    ("Order Number", "{{order_number}}"),
    ("Collection", "{{collection_name}}"),
    ("Recipient", "{{recipient_name}}"),
    ("Gift Message", "{{gift_message}}"),
    ("Delivery Address", "{{delivery_address}}"),
    ("Estimated Delivery", "{{delivery_date}}"),
], title="Order Details")
build_email(
    "order-confirmation.html",
    "We've received your GrowForward order",
    "Order {{order_number}} confirmed — thank you for choosing GrowForward.",
    None, "",
    "Order Confirmed",
    "Thank you for your order, {{customer_name}}.",
    ["We've received your order and we're getting ready to prepare your living gift with care."],
    "View Order",
    "{{order_link}}",
    extra=order_details,
    support_note="Questions about your order? Reach us at marketing@destinevents.biz",
)

# 4. PAYMENT CONFIRMATION
build_email(
    "payment-confirmation.html",
    "Your payment has been confirmed",
    "Payment received for order {{order_number}} — your basket is being prepared.",
    None, "",
    "Payment Confirmed",
    "Your payment has been confirmed.",
    [
        "We've received your payment for order {{order_number}}. Your handcrafted GrowForward basket is now being prepared."
    ],
    "View Order Status",
    "{{order_link}}",
)

# 5. PREPARING YOUR GIFT
prep_steps = three_step_block([
    ("📦", "Packaging"),
    ("✋", "Hand Preparation"),
    ("✔️", "Quality Checking"),
])
build_email(
    "preparing-order.html",
    "We're carefully preparing your GrowForward gift",
    "Your basket is being hand-prepared with care — estimated to ship {{estimated_ship_date}}.",
    HERO_2, "GrowForward baskets being hand prepared",
    "In Progress",
    "We're preparing your gift, {{customer_name}}.",
    [
        "Every GrowForward basket is packaged and quality-checked by hand before it leaves us. Your order is currently in progress.",
        "Estimated shipping date: {{estimated_ship_date}}."
    ],
    "Learn More About GrowForward",
    "{{about_link}}",
    extra=prep_steps,
)

# 6. SHIPPING NOTIFICATION
shipping_details = detail_table([
    ("Courier", "{{courier_name}}"),
    ("Tracking Number", "{{tracking_number}}"),
    ("Estimated Arrival", "{{delivery_date}}"),
], title="Shipping Details")
build_email(
    "shipping.html",
    "Your GrowForward gift is on its way",
    "Track order {{order_number}} — your living gift is on its way.",
    None, "",
    "On Its Way",
    "Your gift is on its way, {{customer_name}}.",
    ["Your GrowForward basket has shipped and is headed to {{recipient_name}}."],
    "Track Delivery",
    "{{tracking_link}}",
    extra=shipping_details,
)

# 7. GIFT DELIVERED
build_email(
    "delivered.html",
    "Your GrowForward gift has arrived",
    "The growing begins — scan your GrowForward Guide to get started.",
    HERO_1, "GrowForward baskets with living herbs and tomato plants",
    "Delivered",
    "Your living gift has arrived.",
    [
        "Your GrowForward basket has arrived. Scan the QR code on your basket to open the GrowForward Guide — plant care, recipes, grower stories and more, all in one place.",
        "This is where the growing begins."
    ],
    "Continue Your Growing Journey",
    "{{guide_link}}",
)

# 8. ABANDONED CART
build_email(
    "abandoned-cart.html",
    "Your living gift is waiting",
    "Living herbs, beautiful packaging, meaningful gifting — still waiting for you.",
    HERO_2, "GrowForward baskets with basil, thyme, tomato and rosemary",
    "Still Waiting",
    "Your living gift is waiting, {{customer_name}}.",
    [
        "You left {{collection_name}} in your cart. It's still there — living herbs, beautifully packaged, ready to become a gift someone won't forget."
    ],
    "Complete Your Order",
    "{{cart_link}}",
)

# 9. REVIEW REQUEST
build_email(
    "review-request.html",
    "How was your GrowForward experience?",
    "We'd love to hear how your GrowForward gift is growing.",
    None, "",
    "Share Your Experience",
    "How was your GrowForward experience?",
    [
        "We'd love to hear what you thought — a quick review, a photo of your garden, or any feedback helps us keep growing."
    ],
    "Leave a Review",
    "{{review_link}}",
)

# 10. SHARE YOUR GARDEN
build_email(
    "share-your-garden.html",
    "Show us what's growing",
    "Tag #GrowForwardPH and show us your growing journey.",
    HERO_2, "Fresh basil, thyme and cherry tomatoes from a GrowForward basket",
    "Share Your Garden",
    "Show us what's growing.",
    [
        "Your basket, your plants, your meals, your harvest — we'd love to see it. Share a photo on Instagram or Facebook and tag #GrowForwardPH."
    ],
    "Share Your Garden",
    "{{instagram_link}}",
    include_social=True,
)

# 11. AFFILIATE INVITATION
build_email(
    "affiliate-invitation.html",
    "Love GrowForward? Grow with us.",
    "Become a GrowForward partner and earn commissions helping families discover living gifts.",
    None, "",
    "Become a Partner",
    "Grow with us, {{customer_name}}.",
    [
        "Love GrowForward? Become a GrowForward Partner. Earn commissions and help more families discover living gifts that keep growing long after they're given."
    ],
    "Become an Affiliate",
    "{{affiliate_link}}",
)

# 12. CORPORATE FOLLOW-UP
build_email(
    "corporate-followup.html",
    "Thank you for your corporate gifting inquiry",
    "Corporate collections, customization, and bulk orders — let's talk.",
    HERO_1, "GrowForward corporate gifting collections",
    "Corporate Gifting",
    "Thank you for reaching out, {{customer_name}}.",
    [
        "Thank you for your interest in GrowForward corporate gifting. We offer curated corporate collections, custom branding, and bulk order options for employee appreciation, client gifts, and corporate events.",
        "Let's find the right fit for your team."
    ],
    "Book a Consultation",
    "{{consultation_link}}",
)

# 13. SEASONAL CAMPAIGN TEMPLATE (reusable, clearly marked editable fields)
seasonal_extra = f"""<tr>
<td class="gf-pad" align="center" style="padding:20px 48px 0 48px;">
  <p style="font-family:{SANS}; font-size:12px; color:{TEXT_MUTED}; margin:0; font-style:italic;">
    Editable for any occasion — Christmas, Mother's Day, Father's Day, Valentine's Day, Teacher's Day, Housewarming, Weddings, Birthdays.
  </p>
</td>
</tr>
"""
build_email(
    "seasonal-template.html",
    "{{seasonal_subject}}",
    "{{seasonal_preheader}}",
    HERO_1, "GrowForward seasonal gift collection",
    "{{seasonal_eyebrow}}",
    "{{seasonal_headline}}",
    ["{{seasonal_body_1}}", "{{seasonal_body_2}}"],
    "{{seasonal_cta_text}}",
    "{{seasonal_cta_link}}",
    extra=seasonal_extra,
)

def label(text):
    return f"""<tr>
<td class="gf-pad" style="padding:24px 48px 8px 48px;">
  <span style="font-family:{SANS}; font-size:11px; letter-spacing:0.1em; text-transform:uppercase; color:{SAGE}; background-color:{FOREST}; padding:4px 10px; border-radius:100px;">{text}</span>
</td>
</tr>
"""

def image_block(img_src, alt, caption):
    return f"""<tr>
<td class="gf-pad" style="padding:0 48px;">
  <div style="line-height:0; font-size:0; border-radius:12px; overflow:hidden;">
    <img src="{img_src}" alt="{alt}" width="504" style="width:100%; height:200px; object-fit:cover; display:block;">
  </div>
  <p style="font-family:{SANS}; font-size:12px; color:{TEXT_MUTED}; margin:10px 0 0 0; text-align:center;">{caption}</p>
</td>
</tr>
"""

def product_card(img_src, name, desc, cta_text, cta_link):
    return f"""<tr>
<td class="gf-pad" style="padding:0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{LINEN}; border-radius:12px;">
    <tr>
      <td style="line-height:0; font-size:0;">
        <img src="{img_src}" alt="{name}" width="504" style="width:100%; height:180px; object-fit:cover; display:block; border-radius:12px 12px 0 0;">
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:20px 24px;">
        <p style="font-family:{SERIF}; font-size:19px; font-weight:600; color:{FOREST}; margin:0 0 6px 0;">{name}</p>
        <p style="font-family:{SANS}; font-size:13px; color:{TEXT_MUTED}; margin:0 0 14px 0; line-height:1.6;">{desc}</p>
        <a href="{cta_link}" style="font-family:{SANS}; font-size:13px; font-weight:600; color:{WOOD}; text-decoration:none;">{cta_text} &rarr;</a>
      </td>
    </tr>
  </table>
</td>
</tr>
"""

def two_column(img_src, alt, title, body):
    return f"""<tr>
<td class="gf-pad" style="padding:0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
    <td class="gf-stack" width="50%" valign="top" style="line-height:0; font-size:0; padding-right:12px;">
      <img src="{img_src}" alt="{alt}" width="240" style="width:100%; height:160px; object-fit:cover; display:block; border-radius:12px;">
    </td>
    <td class="gf-stack" width="50%" valign="top" style="padding-left:12px; padding-top:8px;">
      <p style="font-family:{SERIF}; font-size:17px; font-weight:600; color:{FOREST}; margin:0 0 8px 0;">{title}</p>
      <p style="font-family:{SANS}; font-size:13px; color:{TEXT_MUTED}; margin:0; line-height:1.7;">{body}</p>
    </td>
  </tr></table>
</td>
</tr>
"""

def grower_story_card(img_src, name, story):
    return f"""<tr>
<td class="gf-pad" style="padding:0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:{FOREST}; border-radius:12px;"><tr>
    <td width="88" valign="top" style="padding:20px 0 20px 20px; line-height:0; font-size:0;">
      <img src="{img_src}" alt="{name}" width="64" style="width:64px; height:64px; object-fit:cover; border-radius:50%; display:block;">
    </td>
    <td valign="top" style="padding:20px 20px 20px 16px;">
      <p style="font-family:{SANS}; font-size:13px; font-weight:600; color:{OFFWHITE}; margin:0 0 6px 0;">{name}</p>
      <p style="font-family:{SERIF}; font-style:italic; font-size:14px; color:{SAGE_LIGHT}; margin:0; line-height:1.6;">&ldquo;{story}&rdquo;</p>
    </td>
  </tr></table>
</td>
</tr>
"""

def recipe_card(img_src, name, desc, link):
    return f"""<tr>
<td class="gf-pad" style="padding:0 48px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid {SAGE_LIGHT}; border-radius:12px;"><tr>
    <td width="120" style="line-height:0; font-size:0;">
      <img src="{img_src}" alt="{name}" width="120" style="width:120px; height:120px; object-fit:cover; display:block; border-radius:12px 0 0 12px;">
    </td>
    <td valign="top" style="padding:16px 20px;">
      <p style="font-family:{SERIF}; font-size:16px; font-weight:600; color:{FOREST}; margin:0 0 6px 0;">{name}</p>
      <p style="font-family:{SANS}; font-size:12px; color:{TEXT_MUTED}; margin:0 0 10px 0; line-height:1.6;">{desc}</p>
      <a href="{link}" style="font-family:{SANS}; font-size:12px; font-weight:600; color:{WOOD}; text-decoration:none;">View Recipe &rarr;</a>
    </td>
  </tr></table>
</td>
</tr>
"""

def spacer(h=24):
    return f"""<tr><td style="height:{h}px; line-height:{h}px; font-size:1px;">&nbsp;</td></tr>"""

# COMPONENT LIBRARY REFERENCE PAGE
components_html = head("GrowForward Email — Component Library", "Reference sheet of every reusable email component.")
components_html += header_block()
components_html += eyebrow_headline("Component Library", "Reusable blocks for every GrowForward email")
components_html += body_paragraphs(["Each block below is copy-paste ready. Combine them inside the master template structure to build a new email without redesigning anything."])

components_html += label("Button")
components_html += button("Button Label", "{{cta_link}}")

components_html += label("Hero Banner")
components_html += hero_block(HERO_1, "Hero banner — full-width lifestyle image")

components_html += label("Image Block")
components_html += image_block(HERO_2, "Image block with caption", "Caption text sits below the image")

components_html += label("Product Card")
components_html += product_card(HERO_2, "The Chef's Garden", "Living herbs, curated pantry staples, and everything needed for a fresh meal.", "Reserve Collection", "{{shop_link}}")

components_html += label("Two Column Layout")
components_html += two_column(HERO_1, "Two column image", "Section title", "Body copy sits beside the image. Stacks vertically on mobile automatically.")

components_html += label("Quote Block")
components_html += quote_block("Every celebration ends. The growing begins.")

components_html += label("Grower Story Card")
components_html += grower_story_card(HERO_2, "Aling Nena, Batangas", "Growing herbs for GrowForward has let me share what I love with more families.")

components_html += label("Recipe Card")
components_html += recipe_card(HERO_2, "Fresh Tomato Basil Pasta", "A simple recipe using the basil and cherry tomatoes from your basket.", "{{shop_link}}")

components_html += label("Detail Table")
components_html += detail_table([("Order Number", "{{order_number}}"), ("Collection", "{{collection_name}}")], title="Order Details")

components_html += label("Three-Step Block")
components_html += three_step_block([("📦", "Packaging"), ("✋", "Hand Preparation"), ("✔️", "Quality Checking")])

components_html += label("Social Row")
components_html += social_row()

components_html += divider()
components_html += footer_block()
components_html += close()

with open(os.path.join(OUT_DIR, "assets", "components.html"), "w") as f:
    f.write(components_html)
print("wrote assets/components.html")

# email.css — design token / reference stylesheet (documentation; emails use inline styles for client compatibility)
email_css = f"""/*
GrowForward Email Design Tokens
--------------------------------
Reference stylesheet only. Email clients (especially Outlook desktop)
do not reliably support external or <style>-block CSS, so every email
in this system uses INLINE styles built from these same values.
Treat this file as the single source of truth for colors, type, and
spacing when hand-editing or extending a template.
*/

:root {{
  /* Color palette */
  --forest: {FOREST};
  --forest-deep: {FOREST_DEEP};
  --sage: {SAGE};
  --sage-light: {SAGE_LIGHT};
  --beige: {BEIGE};
  --linen: {LINEN};
  --off-white: {OFFWHITE};
  --earth-brown: {EARTH_BROWN};
  --bamboo: {BAMBOO};
  --wood: {WOOD};
  --text-dark: {TEXT_DARK};
  --text-muted: {TEXT_MUTED};

  /* Typography */
  --font-serif: {SERIF};
  --font-sans: {SANS};

  /* Layout */
  --container-width: 600px;
  --radius-card: 12px;
  --radius-container: 16px;
  --radius-button: 100px;
}}

/*
Component reference (see assets/components.html for rendered examples):
  .gf-container   — 600px centered table, off-white background, 16px radius
  .gf-pad         — standard horizontal padding (48px desktop / 24px mobile)
  .gf-hero        — full-width hero image, 280px height desktop
  .gf-h1          — serif headline, 32px desktop / 26px mobile
  button          — bamboo fill, forest-deep text, 100px radius, mso fallback via VML
  detail-table    — linen background, 12px radius, label/value rows
  quote-block     — italic serif pull-quote in wood color
  grower-card     — forest background card with circular photo + italic quote
  recipe-card     — bordered card, square image left, content right
  product-card    — linen card, image top, name/desc/CTA below
  footer          — forest-deep background, logo, tagline, partnership line, contact, unsubscribe
*/
"""
with open(os.path.join(OUT_DIR, "assets", "email.css"), "w") as f:
    f.write(email_css)
print("wrote assets/email.css")

print("done")
