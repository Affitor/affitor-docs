# FACTS: Visual design of top-tier content surfaces

Studied 2026-07-05 via headless Chromium (gstack browse): full-page screenshots + `getComputedStyle`
extraction on live DOM. Viewport 1440x900 (dub, stripe) / 1280 (vercel, mercury, linear).
Pages: dub.co/blog, dub.co/blog/dub-mcp-server, stripe.com/blog,
stripe.com/blog/what-link-data-tells-us-about-ai-spending, vercel.com/blog,
vercel.com/blog/introducing-vercel-connect, mercury.com, linear.app/blog (301 → linear.app/now).
All px values below are computed values read from the DOM, except items marked *(visual)* which
come from screenshot inspection only.

---

## 1. Dub (dub.co/blog + post)

### Index page
- Canvas `#FAFAFA`; body Inter 16/24 `#0A0A0A`; display font **Satoshi** for headings.
- Page H1 "Blog": Satoshi 48/55.2, weight 500, `#171717`.
- Post grid: 3 equal columns of ~359px, **zero gap** — cells separated by 1px hairline borders
  (Tailwind `border-r` / `nth-child` rules). Cards are **flat**: radius 0, shadow none,
  transparent bg, `hover:bg-neutral-50` as the only affordance. 54 cards on one page.
- Card anatomy top→bottom: OG image `aspect-[1200/630]` (1.90:1) object-cover → title Satoshi
  18/28 weight 700 `#171717`, 2-line clamp → excerpt → author avatar row + `<time>` 14/20 `#737373`.
- Category tabs above the grid (Overview / Company News / Education / Engineering / Customer
  Stories / Changelog) *(visual)*.

### Post page
- Article column: **623px text width** (container 719px incl. 40px/48px padding). Right sidebar:
  "Written by" authors, "On this page" TOC, one promo card *(visual)*.
- Header stack: category chip + date → H1 Satoshi 36/45 weight 500 → gray subtitle *(visual)*.
- H2: Satoshi 24/32 weight 700 `#171717`. Body paragraphs: Inter **16/28** `#404040`,
  20px margin between paragraphs.
- Inline links: `#737373` (neutral-500), underlined, weight 500 — links are quieter than body ink.
- **In-article images: border-radius 8px + 1px solid `#E5E7EB`, box-shadow none.** No fake browser
  chrome. Hero/OG art = product screenshot floating on a soft pastel gradient tile *(visual)*.
- Inline code: Geist Mono 13px on `#F5F5F5`, radius 5px. Callouts: light green tinted rounded box *(visual)*.

## 2. Stripe (stripe.com/blog + post)

### Index page
- Canvas `#FFFFFF`; font `sohne-var`; body weight **300** (light); title ink `rgb(10,37,64)` =
  **`#0A2540`** — identical to Affitor's ink token.
- Featured post = white card, radius 8px, giant layered shadow:
  `rgba(50,50,93,.25) 0 50px 100px -20px, rgba(0,0,0,.3) 0 30px 60px -30px`, floating over a
  diagonal-cut gradient band *(visual for the band)*. NOT the only shadow: every list-row post
  image figure (`.BlogImageCard`) carries a smaller card shadow
  `rgba(50,50,93,.25) 0 30px 60px -12px, rgba(0,0,0,.3) 0 18px 36px -18px` (~29 on the page) —
  Stripe shadows all post art; the featured card just gets the hero-scale version.
- List rows: title 38/48 weight 500, letter-spacing -0.2px, `#0A2540`; category link in blurple
  `#635BFF`, weight 425, no underline; date 15/24 weight 300 `#425466`.
- Post art = abstract branded gradient illustration or data-viz, not raw screenshots *(visual)*.

### Post page
- Title `#0A2540` with author block in a **left rail**: 48px circular avatar with 1px `#E6ECF2`
  border, name + role, date 15/24 separated by hairline column rules *(visual for rail layout)*.
- Section headings (`BlogBodyTitle`): 26/36 weight 425 `#0A2540`.
- Body: **18/28 weight 300 `#425466`**, measured text width 810px (visually ~750px).
- Links in body: blurple `#635BFF`, no underline. Charts sit on light `#F6F9FC`-style tinted
  panels slightly wider than the text column *(visual)*; subscribe band same tint.

## 3. Vercel (vercel.com/blog + post)

### Index page
- Canvas `#FAFAFA`; Geist Sans; page H1 "Blog" 48/56 weight 450, letter-spacing **-2.88px (-6%)**.
- **No thumbnails at all.** Featured row = 3 flat light-gray panels (date + category micro-label,
  large title, 3-line 14/20 `#4D4D4D` excerpt, avatar stack + names) *(visual)*. Below: pure-text
  3-column grid, no borders, no shadows, no images.
- Filter pills top (selected = solid black pill, white text) *(visual)*. Eyebrow style: Geist Mono
  12/16 uppercase, +0.6px tracking, `#8F8F8F`.

### Post page
- **Single column 604px.** H1 48/56 weight 450, -6% tracking, `#171717`.
- H2: 32/35.2 weight **400**, -1.28px, and notably `#4D4D4D` (lighter than body ink).
- Body: **18/28 weight 400 `#171717`**. Links: black, underlined.
- Images/diagrams: 12px inner padding (`p-3`) on the image, caption Geist Sans 14/20 `#4D4D4D`
  centered below; separate light/dark image variants shipped (light img gets
  `[.dark-theme_&]:hidden`).

## 4. Mercury (mercury.com — brand feel)

- Two custom families: `arcadia` (body 16/24) + `arcadiaDisplay` (display serif, weight **480**).
- H1 45/49.6, H2 42/48.3 with slight **positive** tracking (+1%); hero text `#EDEDF3` over
  full-bleed surreal landscape photography ("Radically different banking") *(visual for photo)*.
- Buttons are pills: radius 32–40px; primary `#5266EB` bg + white text; secondary = frosted
  `rgba(156,180,232,0.2)` on dark. Feel: editorial serif + photography + muted slate/indigo;
  zero cartoon illustration.

## 5. Linear (linear.app/blog → /now)

- Redirects to a dark "Now" hub: bg `#08090A`, Inter Variable, weight **510** for all headings.
- H1 48/48 -1.06px; section H2 40/44 -0.88px; card title 20/26.6 -0.24px.
- 3-col card grid: 16:9 dark abstract/noir artwork thumb, title, 2-line gray excerpt, byline +
  date *(visual)*. Archive = plain text rows, date right-aligned. Fully monochrome; color budget ~0.

---

## Cross-site patterns (the actual consensus)

1. Article body converges on **18/28** (Stripe, Vercel) or 16/28 (Dub) — line-height ≈ 1.55–1.75,
   never default 1.5 at 16px.
2. Text measure ~**600–650px** (Dub 623, Vercel 604); Stripe is the wide outlier (~750–810).
3. Negative letter-spacing **only at display sizes** (Vercel -6%, Linear -2.2%, Stripe -0.2px);
   body text always tracking-normal.
4. Canvas is near-white neutral (`#FAFAFA` ×2, `#FFF`); color lives only in links, labels, art.
5. Cards are **flat** at Dub (hairline dividers) and Vercel (nothing) — hover = background tint,
   not shadow-lift. Stripe is the shadow outlier: all post-art figures carry card shadows, with
   one hero-scale shadow reserved for the featured card.
6. In-article image framing consensus: **8px radius + 1px neutral border, no drop shadow, no
   browser chrome** (Dub), or 12px-padded image + small gray centered caption (Vercel).
7. Meta text = 14–15px in ~`#737373`/`#425466` gray; authors shown as small avatar stacks
   (24px index, 48px post).
8. Display weights are **mid** (425–510), not 700; hierarchy comes from size + ink shift, not bold.
9. Heading ink can be *lighter* than body ink to recede (Vercel H2 `#4D4D4D`) — hierarchy ≠ darker.
10. One display voice + one utilitarian body: Satoshi+Inter, söhne alone, arcadiaDisplay+arcadia,
    Inter alone. Never two competing display fonts.

---

## Affitor blog/about — 10-rule pixel spec

Fits the existing light theme: `#155dfc` blue, `#0A2540` ink, Inter (globals.css already defines
`--aff-info-solid: #155dfc; --aff-info-bg: #eff6ff`).

1. **Canvas & ink.** Page bg `#FAFAFA`, article surface `#FFFFFF`. Headings `#0A2540`; body
   `#425466` (Stripe's exact pairing with this ink); meta/captions `#737373`. Never pure black.
2. **Type scale (size/line-height, weight, tracking).** H1 40/48 600 -1%; H2 28/36 600 -0.5%;
   H3 20/28 600 0; body 17/28 400 0; meta 14/20 400 0; mono eyebrow/caption 12/16 500 +4%
   uppercase. Tracking is negative only ≥28px.
3. **Measure.** Article text column **max-width 640px**, centered. Images, tables, and charts may
   break out to 760px; nothing else does. Index container 1080–1152px.
4. **Rhythm.** 20px between paragraphs; H2 = 48px above / 16px below; H3 = 32px/12px; hero-to-body
   gap 40px; index sections padded 96px vertical. All other spacing in 4px steps.
5. **Index card anatomy (Dub recipe).** Cover 1200×630 (1.90:1) with 8px radius + 1px `#E5E7EB`
   border → 16px gap → title Inter 18/26 600 `#0A2540` 2-line clamp → excerpt 14/20 `#425466`
   2-line clamp → 24px avatar(s) + date 14/20 `#737373`. Grid: 3 cols, 32px gap OR Dub-style
   hairline-divided cells; hover = bg `#F8FAFC`, never shadow-lift.
6. **Image framing (in articles).** `border-radius: 8px; border: 1px solid #E5E7EB;
   box-shadow: none`. No browser chrome, no drop shadows. Product screenshots that need air sit on
   an `#eff6ff`→white gradient tile with 24–32px padding. Caption: 13/20 `#737373`, centered.
7. **Color budget.** `#155dfc` appears ONLY as: inline links (weight 500, underline on hover),
   category eyebrow labels, and one primary CTA per page. Tinted surfaces only from `#eff6ff`.
   Headings and body never blue. No gradients in text.
8. **Meta system.** Post header order: eyebrow category 13/16 600 `#155dfc` uppercase +4% → H1 →
   one-line dek 20/30 400 `#425466` → author row (24px avatar, 1px `#E5E7EB` ring, name 14/20 500
   `#0A2540`, date 14/20 `#737373`). Avatars stack with -8px overlap.
9. **Buttons.** Primary: `#155dfc` bg, white 15/20 500 text, height 40px, padding 0 20px,
   radius 8px (or full pill site-wide — pick one, never mix). Secondary: white bg, 1px `#E5E7EB`,
   `#0A2540` text. Hover = darken bg ~8%, no shadow, no translate.
10. **Restraint.** Inter + one mono (code/captions/eyebrows) only — no second display font.
    Exactly one shadow moment allowed per page (featured card, Stripe recipe:
    `rgba(50,50,93,.25) 0 50px 100px -20px, rgba(0,0,0,.3) 0 30px 60px -30px`); everything else
    flat. Heading weights cap at 600. If a decoration doesn't carry information, delete it.

---

## Unverified

Original claims that could not be reproduced on the cited source
(re-checked 2026-07-05 against vercel.com/blog/introducing-vercel-connect):

- **Vercel: "hairline-bordered panel" around in-article images.** The cited post's only large
  image has 12px padding but `border: 0` on the img and every ancestor up 6 levels. No bordered
  panel exists on that page; may apply to other Vercel posts only.
- **Vercel: "caption in small gray mono".** Computed caption font is Geist Sans (not mono),
  14/20 `#4D4D4D`, centered.
- **Vercel: "hairline dividers between H2 sections."** Zero `hr` elements in the article; the only
  1px borders belong to code-block chrome. No section dividers found on the cited post.

---

*Session evidence: full-page screenshots (dub-index, dub-post, stripe-index, stripe-post,
vercel-index, vercel-post, mercury, linear-index .png) captured to the session scratchpad;
computed-style JSON extracted per page with a shared probe script. Re-run: `browse goto <url>`
then `browse eval extract.js`.*

*Re-verified 2026-07-05 (same day, fresh probes via gstack browse): 6 highest-impact claim
clusters re-checked against live DOM — Dub index grid/cards, Dub post measure + image framing,
Stripe index ink/weights/shadows, Stripe post body/links/avatar, Vercel post column/type scale,
Linear /now dark hub. All confirmed except the Stripe "only shadow" claim (corrected in place)
and the three Vercel items moved to Unverified above.*
