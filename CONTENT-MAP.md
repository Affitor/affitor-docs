# Affitor CONTENT-MAP — Complete Content Build Plan

Compiled 2026-07-05. This is the execution plan for the content build-out. Another agent team
executes this verbatim. Every artifact spec below is grounded in the fact files at
`.content-factory/FACTS-*.md` and the rules in `CONTENT-STANDARD.md`. Do not invent facts —
if a claim is not in a FACTS file, it does not go in a draft.

**Inventory: 24 content artifacts + 1 infrastructure task. 11 P0 · 11 P1 · 3 P2.**

| Type | Count | IDs |
|---|---|---|
| docs-guide | 10 | D1–D6, R1, R2, R3, R6 |
| docs-reference | 1 | R4 |
| changelog | 1 | R5 (batch of 5 entries) |
| blog-comparison | 6 | B1–B6 |
| blog-guide | 3 | G1–G3 |
| blog-vision | 2 | V1, V2 |
| about-page | 1 | A1 |
| infrastructure | 1 | INFRA-1 |

---

## 0. Global guardrails (binding for every artifact)

1. **Templates:** docs guides follow CONTENT-STANDARD §2 (PageMeta → flow-at-a-glance → verb
   steps → "Verify it worked" via `<VerifySuccess>` → Next steps). Reference pages §3. Blog §4.
   Changelog §5. Media rules §6.
2. **Pricing numbers expire.** Re-verify every competitor dollar figure against the live pricing
   page before publish; hard stop after ~2026-08-05 (FACTS-competitors, writer guardrails).
3. **Attribution claims:** never call Dub "click-anchored/last-click cookie" — Dub is
   signup/lead-anchored. Never assert PartnerStack or Post Affiliate Pro attribution mechanics.
   "No official MCP found as of June 2026" is the only allowed MCP-absence phrasing
   (FACTS-competitors guardrails; FACTS-agent-commerce §6).
4. **VSAL is a draft spec, not a product.** Label VISION items as vision, always
   (FACTS-agent-commerce rule #1).
5. **Fee mechanics precision:** Affitor's fee is a STEP at $10K cumulative per program — the
   crossing sale is still free; the next sale is the first charged (code-verified,
   FACTS-wishes §4). Safe public phrasing everywhere: **"$0 until $10K affiliate revenue, then
   3.5% on affiliate-driven sales only."** Do not spell out step-vs-bracket mechanics until the
   pricing-page copy fix ships (Open Question 3b).
6. **No invented social proof.** Affitor has zero customer testimonials on file
   (FACTS-wishes §8). No fabricated logos, GMV, partner counts.
7. **Intent trap:** every blog piece is written for the program OWNER (SaaS founder), never the
   affiliate earner. "Affiliate program(s)" without "software/tool/platform" = earner intent —
   avoid it in titles (FACTS-seo-queries, critical intent trap).
8. **Freshness:** bake "2026" into comparison/listicle titles; plan annual re-dating
   (FACTS-seo-queries implication #3).
9. **Bylines:** docs = anonymous/evergreen. Blog + changelog = named human author with exact
   role (`authors: [son]` — "Son Piaz, Founder"), per CONTENT-STANDARD §1.6.
10. **Voice:** second person, imperative, present tense, zero marketing adjectives. No em-dashes
    in founder-voiced pieces (FACTS-wishes §6 guardrail).

---

## INFRA-1 — Blog infrastructure: `content/blog` collection in affitor-docs

- **Type:** infrastructure · **Priority:** P0 (blocks B1–B6, G1–G3, V1–V2)
- **What to build:**
  - New fumadocs collection `content/blog/*.mdx` in this repo. Frontmatter: `title`,
    `description` (one-line dek, doubles as machine summary), `date`, `category`,
    `authors` (name + exact role + avatar), `og` (1200×630 cover, 1.90:1 — Dub card ratio).
  - **Recommended routing (default unless Son objects):** serve at `affitor.com/blog/*` with the
    blog app reading this repo's collection; slugs below assume that.
  - **Styling = the 10-rule pixel spec in FACTS-aesthetics** (final section). Non-negotiables:
    canvas `#FAFAFA`, article surface `#FFF`; ink `#0A2540` headings / `#425466` body /
    `#737373` meta; article measure **640px** (breakout 760px for tables/images); body 17/28;
    tracking negative only ≥28px; index = Dub card anatomy (1.90:1 cover, 8px radius, 1px
    `#E5E7EB` border, flat, hover bg tint); `#155dfc` ONLY for links, category eyebrows, one CTA
    per page; Inter + one mono, heading weight cap 600; max one shadow moment per page
    (featured card only).
  - **Chrome:** no TOC, no related-posts, no share buttons at launch (Vercel radical omission,
    CONTENT-STANDARD §4).
  - **Machine publishing:** per-page markdown route (`<url>.md`) for blog AND docs + extend
    `public/llms.txt` with blog entries. Per-page `.md` is the one llms-plumbing gap still open
    (FACTS-docs-coverage §2 site-level). Fix the stale "we currently don't ship llms.txt" line
    at `CONTENT-STANDARD.md:390` while in there.
  - Comparison-post components: bold `Competitor` / `Affitor` label pair, summary-table block,
    FAQ block with schema.org markup (for G3/B6 snippets).
- **Media plan:** none (this is plumbing). OG-image template (1200×630) styled per spec is part
  of this task.

---

## 1. Docs — missing pages (from FACTS-docs-coverage §3)

### D1 — Organize partners into groups
- **Type:** docs-guide · **Priority:** P0 · **Persona:** Advertiser
- **URL:** `docs.affitor.com/brand/groups`
- **Purpose / target query:** The Groups tab has zero docs, yet the whole commission model is
  per-group — a core concept with no home (FACTS-docs-coverage §3). Queries: in-product help,
  "affitor partner groups", "set different commission rates for different affiliates".
- **Outline (H2):**
  1. The flow at a glance (create group → set policy → move partners)
  2. Step 1: Create a partner group
  3. Step 2: Set the group's commission policy (rate, hold period, approval mode)
  4. Step 3: Move partners into the group
  5. Optional: Schedule a policy change (versioned policies, effective dates)
  6. Verify it worked (`<VerifySuccess>`: new commission from a group partner shows the group rate)
  7. Next steps (`<FeatureCards>`: define-commission, commission-approval-cash-flow, inviting-partners)
- **Key facts:** per-group default commission/hold/approval; policies versioned with
  effective_from/to + previous_policy chain; `ChangePartnerGroupModal` exists in product
  (FACTS-features §1 "Partner groups + versioned commission policies").
- **Media:** 2 rig screenshots (Groups tab list; move-partner modal), 1600w, 8px radius + 1px border.

### D2 — Manage program settings and your API key
- **Type:** docs-guide · **Priority:** P0 · **Persona:** Advertiser / agent-dev
- **URL:** `docs.affitor.com/brand/settings`
- **Purpose / target query:** Settings has no page; the API key location today is four scattered
  one-sentence pointers (FACTS-docs-coverage §3). Every integration starts here. Queries:
  "affitor api key", "change commission after launch".
- **Outline (H2):**
  1. What lives in Settings (tabs: business details, approval mode, commission, branding, integrations)
  2. Step 1: Edit program terms after launch
  3. Step 2: Find your API key
  4. Step 3: Regenerate the key (warn Callout: one-time reveal; old key invalidated immediately)
  5. Verify it worked (curl `/tracking/status` with the new key → 200; `<VerifySuccess>`)
  6. Next steps (api-reference/overview, tracking quickstart, agent onboarding page)
- **Key facts:** per-program secret token hashed at rest, masked display, one-time reveal on
  regenerate, dedicated `ApiKeyTab` (FACTS-features §4 "Program API key management"); settings
  tabs list (FACTS-features §1 "Program creation + settings").
- **Media:** 1 rig screenshot (ApiKeyTab, masked key) + 1 labeled curl block.

### D3 — Understand and pay your monthly invoice
- **Type:** docs-guide · **Priority:** P1 · **Persona:** Advertiser
- **URL:** `docs.affitor.com/brand/billing`
- **Purpose:** Only the overdue path is documented; the normal-path Billing tab (invoice list,
  statuses, PDF, payment) has no page (FACTS-docs-coverage §3).
- **Outline (H2):**
  1. How platform fees accrue (safe phrasing per guardrail 5; first $10K free)
  2. Step 1: Review your invoice list and statuses
  3. Step 2: Download the invoice PDF
  4. Step 3: Pay with Stripe Checkout
  5. What happens if an invoice goes overdue (short + link to overdue-policy page)
  6. Verify it worked (invoice status flips to paid)
  7. Next steps (pricing-performance-model, overdue-policy)
- **Key facts:** tiered per-sale fee, monthly invoices with PDF route + checkout-session route,
  overdue pause config (FACTS-features §1 "Platform billing"); fee STEP mechanics caveat
  (FACTS-wishes §4 — coordinate with Open Question 3b before spelling out mechanics).
- **Media:** 1 rig screenshot (Billing tab invoice list).

### D4 — See the customers your partners referred
- **Type:** docs-guide · **Priority:** P1 · **Persona:** Advertiser
- **URL:** `docs.affitor.com/brand/customers`
- **Purpose:** Customer (referrals) tab has zero docs (FACTS-docs-coverage §3). Also the natural
  home for privacy/compliance answers currently missing from the FAQ.
- **Outline (H2):**
  1. What the Customers tab shows (per-customer attribution, first/last purchase, totals)
  2. How a customer gets linked to a partner (recap + link to attribution reference)
  3. Why emails are masked (PII hygiene: hashed + masked storage)
  4. Verify it worked (a test-mode sale creates a masked customer row)
  5. Next steps (commission-approval-cash-flow, attribution reference)
- **Key facts:** email_hash / email_masked fields, per-partner customer relations, privacy-helpers
  hashing used by the webhook distributor (FACTS-features §1 "Customer tracking with PII hygiene").
- **Media:** 1 rig screenshot (Customers list with masked emails — the masking IS the point).

### D5 — Set up your partner profile and payout details
- **Type:** docs-guide · **Priority:** P1 · **Persona:** Partner
- **URL:** `docs.affitor.com/partners/profile-settings`
- **Purpose:** Announced in changelog 2026-04-10 (Account + Security tabs) but never documented;
  partner dashboard tour skips it (FACTS-docs-coverage §3).
- **Outline (H2):**
  1. Step 1: Complete your profile (website + YouTube, X, Instagram, TikTok, LinkedIn handles)
  2. Step 2: Secure your account (password, Security tab)
  3. Step 3: Add your payout method (bank transfer, PayPal, Stripe, Wise)
  4. Verify it worked (payout method shows on the Payout tab; withdraw button active above threshold)
  5. Next steps (partners/payouts, partners/dashboard)
- **Key facts:** social-handle fields on the partner schema (FACTS-features §2 "Partner
  profile"); payout method enum exactly [bank_transfer, paypal, stripe, wise] + program payout
  threshold (FACTS-features §2 "Earnings + withdrawals").
- **Media:** 1 rig screenshot (profile Settings page).

### D6 — Message the brands you work with
- **Type:** docs-guide · **Priority:** P2 · **Persona:** Partner (advertiser section included)
- **URL:** `docs.affitor.com/partners/messages` (sibling stub `brand/messages` for the
  advertiser side ships in the same PR — one artifact, two thin pages)
- **Purpose:** Messaging exists on both sides of the product with zero docs
  (FACTS-docs-coverage §3).
- **Outline (H2):**
  1. How message requests work (request → accept; brands can block or mute)
  2. Step 1: Start a conversation from a program page
  3. Step 2: Attach files
  4. Where notifications appear (unread counts, in-app notifications)
  5. Verify it worked (message shows as delivered after brand accepts)
  6. Next steps (find-and-join-programs, partners/faq)
- **Key facts:** request-based model, accept/block/mute, file upload, unread counts, system
  messages (FACTS-features §1 "Partner messaging", §2 "Message brands").
- **Media:** 1 rig screenshot (partner messages view).

---

## 2. Docs — standard-compliance rewrites (from FACTS-docs-coverage §2)

### R1 — Rewrite: Create your advertiser account
- **Type:** docs-guide (rewrite) · **Priority:** P0 · **Persona:** Advertiser
- **URL:** `docs.affitor.com/brand/quickstart/create-account` (unchanged)
- **Purpose:** Worst standards offender and often the first page a new advertiser reads: real
  duplicate "Step 3" headings (lines 44 + 50), raw `> **Note**:` blockquotes, zero standard
  components, in-page FAQ H2, "What You'll Learn" filler (FACTS-docs-coverage §2).
- **Outline (H2, target):**
  1. The flow at a glance
  2. Step 1: Open the portal and choose the Advertiser role
  3. Step 2: Verify your email
  4. Step 3: Complete the setup wizard (fix the duplicate numbering)
  5. Verify it worked (`<VerifySuccess>`: dashboard loads with the Getting Started checklist)
  6. Next steps (`<NextStep>` → setup-program)
- **Key facts:** registration flow portal → role → email → wizard (FACTS-docs-coverage §1);
  FAQ content moves to `/faq`, not deleted.
- **Media:** max 2 rig screenshots (role picker, wizard); everything else = numbered text steps
  with **bolded UI labels** (CONTENT-STANDARD §6).

### R2 — Rewrite batch: brand quickstart compliance (4 pages)
- **Type:** docs-guide (rewrite) · **Priority:** P1 · **Persona:** Advertiser
- **URLs (unchanged):** `brand/quickstart/define-commission`, `brand/quickstart/view-performance`,
  `brand/quickstart/partner-approval-quality-control`, `brand/quickstart/inviting-partners`
- **Purpose / work per page (FACTS-docs-coverage §2):**
  - **define-commission** → retitle "Set commission rates and hold periods". Remove both
    "Coming Soon" sections (CPC/CPL/CPS, Group Rewards — roadmap belongs in changelog), remove
    "Best Practices" filler. Add PageMeta + Verify (commission preview shows the configured
    rate) + NextStep. Link to D1 for group mechanics.
  - **view-performance** → retitle "Track your program's performance". Kill "Best Practices" +
    "About Data Access" filler; reshape noun sections into task flow; add Verify (test event
    appears in Action Center) + NextStep.
  - **partner-approval-quality-control** → retitle "Review and approve partner applications"
    (noun title violates principle 2). Replace the closing "Coming Soon" with Verify + Next steps.
  - **inviting-partners** → keep title; end with Verify (invite shows pending → accepted) +
    NextStep instead of "Tips". Note invite actions are send/resend/**cancel** (not "expire" —
    expiry is lazy via invite_expires_at; FACTS-features §1 corrected claim).
- **Key facts:** commission lifecycle with holds/audit, versioned policies, invite flow
  (FACTS-features §1); compliant models to copy: `payouts.mdx`, `commission-approval-cash-flow.mdx`
  (FACTS-docs-coverage §2 last bullet).
- **Media:** reuse existing; add a screenshot only where a UI state must be confirmed mid-step.

### R3 — Rewrite batch: tracking suite task-titles + components (5 pages)
- **Type:** docs-guide (rewrite) · **Priority:** P1 · **Persona:** Advertiser / agent-dev
- **URLs (unchanged, titles change):**
  - `tracking/tracking-overview` → "Understand how Affitor tracking fits together"
  - `tracking/click-tracking` → "Track clicks from your site"
  - `tracking/lead-tracking-signup` → "Track signups as leads"
  - `tracking/payment-tracking-stripe` → "Track payments from Stripe"
  - `tracking/testing-integration` → "Test your integration end to end"
- **Purpose:** All five titles are feature nouns (principle 2 violation). Content is strong
  (options, verify sections, failure modes) but rendered as plain H2s — convert to
  `<VerifySuccess>` / `<CommonMistakes>` components; `payment-tracking-stripe` must not end on
  "Troubleshooting → 401" (ending-handoff rule). Add `<FeatureCards>`/`<NextStep>` closings
  everywhere (FACTS-docs-coverage §2).
- **Key facts:** v1 track endpoints, test/verification endpoints, `affitor_click_id` cookie
  (FACTS-features §4); recipes registry shared by CLI/MCP/docs (FACTS-agent-commerce §1.2).
- **Media:** no new images; every code block gets a filename/endpoint label (standard §2 rules).

### R4 — Consistency batch: API reference pages
- **Type:** docs-reference (rewrite) · **Priority:** P2 · **Persona:** agent-dev
- **URLs (unchanged):** `api-reference/track-click`, `status`, `events`, `performance`
  (+ heading-case sweep across all reference pages)
- **Purpose / work (FACTS-docs-coverage §2):** track-click: "## Auth" → "## Authentication",
  "## Next steps" → flat "## Related" list. status: add the missing copy-paste example request.
  status/events/performance: add "## Related". Normalize heading case ("Request fields",
  "Path parameters"). Bring `<ResponseTabs>` to all four track endpoints (only track-sale has it).
- **Key facts:** `track-sale.mdx` is the house model (CONTENT-STANDARD §3).
- **Media:** none — reference pages carry zero images by rule.

### R5 — Compliance batch: all 5 changelog entries
- **Type:** changelog (rewrite) · **Priority:** P0 · **Persona:** all
- **URLs (unchanged):** the 5 entries in `content/changelog/`
- **Purpose / work (FACTS-docs-coverage §2 vs standard §5):**
  - Add `authors: [son]` to all 5 (none has it).
  - `2026-07-05-invite-partners`: trim 164 → ≤130 words; move the "shipped alongside" bullet
    list into docs.
  - `affiliate-skills-v2`: add ONE runnable code block (`npx skills add Affitor/affiliate-skills`).
  - `partner-profile-settings`: add exactly one 1600w rig screenshot (Settings page).
  - `faster-docs-search`: add one visual (⌘K search screenshot).
  - Add imperative closing CTA links to the 4 entries missing one.
- **Key facts:** 65–130 word budget, one visual OR one code block, CTA always
  (CONTENT-STANDARD §5); 52 skills current count if the skills entry text is touched
  (FACTS-agent-commerce §1.5 — entry said 47, registry now has 52; keep the historical entry
  accurate to its date or footnote it).
- **Media:** 2 rig screenshots + 1 code block, per above.

### R6 — Rewrite: CLI quickstart
- **Type:** docs-guide (rewrite) · **Priority:** P2 · **Persona:** Advertiser / agent-dev
- **URL:** `docs.affitor.com/brand/cli/quickstart` (unchanged)
- **Purpose:** "Why CLI?" throat-clearing H2; no PageMeta, no components, no handoff
  (FACTS-docs-coverage §2).
- **Outline (H2, target):** flow at a glance → Step 1: `npx affitor login` → Step 2: `affitor init`
  → Step 3: `affitor onboard` → Verify it worked (`affitor status` output + readiness verdict)
  → Next steps (cli/commands, tracking/testing-integration).
- **Key facts:** 3-command setup, `--json`/`--no-interactive` agent flags, onboard =
  detect → install → inject → verify (FACTS-features §5; FACTS-agent-commerce §1.1).
- **Media:** labeled terminal code blocks only.

---

## 3. Blog — comparison / alternatives (FACTS-seo-queries + FACTS-competitors)

All six: L-band (1,800–3,000 words), Dub comparison template — bold `Competitor` / `Affitor`
label pairs inside every criterion H2, concede competitor strengths honestly BEFORE positioning
Affitor, summary table as the LAST section, dual CTA close (CONTENT-STANDARD §4). Byline:
Son Piaz, Founder. Re-verify all prices at publish (guardrail 2).

### B1 — The best Rewardful alternatives for SaaS in 2026
- **Type:** blog-comparison · **Priority:** P0 · **Persona:** Buyer (SaaS founder on Stripe)
- **URL:** `affitor.com/blog/rewardful-alternatives`
- **Target query:** "rewardful alternative(s)" — hottest SERP in the set; six competitors
  already fight for it, Rewardful defends it itself (FACTS-seo-queries #1, P0).
- **Outline (H2):**
  1. Why teams outgrow Rewardful (concede first: simplest Stripe setup, true 0% fee, API on all
     tiers — then verified gaps: revenue-capped tiers force upgrades, cookie-based attribution,
     no multi-tier commissions, limited email functionality, basic fraud protection, no postbacks)
  2. What to evaluate in a replacement (pricing model, attribution durability, API/agent surface)
  3. Affitor — pay nothing until it pays you ($0/mo, 3.5% after $10K; signup-anchored
     attribution; the only platform an agent can integrate AND verify)
  4. FirstPromoter — more billing providers, API costs extra
  5. Tolt — modern, unlimited affiliates, 2% auto-payout fee
  6. Dub Partners — developer-first, double toll (subscription + payout fee)
  7. PartnerStack — enterprise PRM, from $1,000/mo annual
  8. Summary table (last section)
  9. What's next (dual CTA: product + docs)
- **Key facts:** Rewardful $49/$99/$149+ tiers capped at $7.5K/$15K/mo revenue, 0% fee, 60-day
  default cookie window (FACTS-competitors §1); gap list ONLY per firstpromoter compare page —
  banned phrasings: "manual payouts" (wrong), "no built-in email automation" (overstated; use
  "limited email functionality") (FACTS-seo-queries Unverified); cross-cutting takeaways 1–4
  (FACTS-competitors).
- **Media:** 1 summary table (table, never graphic) + optionally 1 rig screenshot of the Affitor
  dashboard; max 2 visuals total.

### B2 — PartnerStack alternatives when you don't need a $12,000/year commitment
- **Type:** blog-comparison · **Priority:** P0 · **Persona:** Buyer (early/mid SaaS priced out)
- **URL:** `affitor.com/blog/partnerstack-alternatives`
- **Target query:** "partnerstack alternative" (FACTS-seo-queries #2, P0). Price-led angle.
- **Outline (H2):**
  1. What PartnerStack actually is (concede: full PRM — marketplace, deal registration, LMS;
     115,000+ partner marketplace per its homepage)
  2. The cost math (Launch from $1,000/mo paid annually = ~$12K/yr minimum; Growth from
     $1,520/mo; demo-led, no self-serve)
  3. When PartnerStack is right (genuinely — multi-type partner programs at scale)
  4. What early-stage SaaS needs instead (self-serve, performance pricing, Stripe-native)
  5. The alternatives (Affitor, Rewardful, FirstPromoter, Tolt, Dub Partners — one H2 block each
     or grouped, with verified pricing)
  6. Summary table
  7. What's next
- **Key facts:** PartnerStack published pricing as of 2026-07-05 — new since June, cite the live
  page (FACTS-competitors §2 + change log); do NOT assert the old "3–15% commission cut" reports
  (unverified) or attribution mechanics (guardrail 3); marketplace count: homepage says 115K+,
  FAQ says 131K+ — cite one with its source (FACTS-seo-queries #10).
- **Media:** 1 summary table; zero screenshots acceptable (Vercel pattern).

### B3 — FirstPromoter alternatives for SaaS in 2026
- **Type:** blog-comparison · **Priority:** P1 (SERP evidence is P0 — promote if capacity)
- **URL:** `affitor.com/blog/firstpromoter-alternatives`
- **Target query:** "firstpromoter alternative" (FACTS-seo-queries #3).
- **Outline (H2):** Why teams look past FirstPromoter (concede: MRR-based commissions, tax
  forms, 5 billing providers — then: $49 tier has NO API, lowest revenue cap in the peer set at
  $5K/mo, custom domain + unlimited affiliates gated to $99) → what to evaluate → alternatives
  (Affitor, Rewardful, Tolt, Dub) → summary table → what's next.
- **Key facts:** FACTS-competitors §3; the tolt.com "no Paddle integration" claim is DISPUTED
  (FirstPromoter's own site lists Paddle) — do not use (FACTS-seo-queries facts block);
  `_fprom_*` cookie-window front-end (FACTS-competitors §3 gap 3).
- **Media:** 1 summary table.

### B4 — Rewardful vs FirstPromoter: an honest comparison for SaaS (2026)
- **Type:** blog-comparison · **Priority:** P0 · **Persona:** Buyer at shortlist stage
- **URL:** `affitor.com/blog/rewardful-vs-firstpromoter`
- **Target query:** "rewardful vs firstpromoter" — both vendors fight for it with their own
  compare pages; Affitor is "the option both pages won't mention" (FACTS-seo-queries #7, P0).
- **Outline (H2, bold label pairs inside each):**
  1. Pricing (both $49 floors; caps $7.5K vs $5K/mo; Rewardful 0% fee stated, FirstPromoter fee
     not stated on page)
  2. Attribution and tracking (both cookie-window models, 60-day defaults)
  3. API and integrations (Rewardful: API all tiers, Stripe+Paddle only; FirstPromoter: API at
     $99+, 5 billing providers)
  4. Payouts and tax handling
  5. Who should pick which (honest verdicts)
  6. The option neither compare page mentions (Affitor: $0 until $10K, signup-anchored,
     agent-verifiable)
  7. Summary table
  8. What's next
- **Key facts:** FACTS-competitors §1 + §3 rows verbatim; guardrail 2 (re-verify) applies twice
  here since both vendors' numbers appear.
- **Media:** 1 summary table.

### B5 — Rewardful vs Tolt: pricing, payouts, and attribution compared (2026)
- **Type:** blog-comparison · **Priority:** P1 · **Persona:** Buyer at shortlist stage
- **URL:** `affitor.com/blog/rewardful-vs-tolt`
- **Target query:** "rewardful vs tolt" (FACTS-seo-queries #8, P0 SERP; P1 here on capacity).
- **Outline (H2):** Pricing ($49 vs $69 floors; caps $7.5K vs $10K) → Payout rails (Tolt: PayPal/
  Wise/bank/crypto/wire, auto payouts from Growth with 2% processing fee, Basic = manual only;
  Rewardful: 0% fee, 1-click PayPal on Enterprise) → Attribution (both cookie-based) →
  Integrations (both Stripe/Paddle; Tolt adds Chargebee) → Who should pick which → the third
  option (Affitor) → Summary table → What's next.
- **Key facts:** FACTS-competitors §1/§4; Tolt aggregator prices are stale ($49 Basic is wrong —
  cite the live page); the 2% fee is confirmed for Growth per source — don't over-generalize
  (FACTS-seo-queries Unverified additions).
- **Media:** 1 summary table.

### B6 — The best affiliate software for SaaS in 2026, by stage
- **Type:** blog-comparison · **Priority:** P1 · **Persona:** Buyer building a shortlist
- **URL:** `affitor.com/blog/best-affiliate-software-for-saas`
- **Target query:** "best affiliate software for saas 2026" — one of two mid-funnel must-wins
  (FACTS-seo-queries #14, P0 SERP). CRITICAL: write for program owners; SERP mixes earner
  intent (guardrail 7).
- **Outline (H2):**
  1. How we judged (pricing model, Stripe fit, attribution durability, agent-readiness — and the
     conflict-of-interest disclosure: we make Affitor)
  2. If you're pre-$500K ARR (Affitor, Tolt, Rewardful)
  3. If you're $500K–$5M ARR (Rewardful, FirstPromoter, Dub Partners, Affitor)
  4. If you're mid-market+ (PartnerStack, impact.com, Post Affiliate Pro)
  5. Every tool at a glance (7-row comparison table)
  6. FAQ (with schema markup: "what commission should I pay?" → 20% typical / 23.3% average,
     feeds the featured snippet)
  7. What's next
- **Key facts:** all seven vendor sections of FACTS-competitors incl. impact.com ($30 tier is
  ecommerce-plugin-only — NOT for SaaS; 2.5% transaction fee) and Post Affiliate Pro ($89 list
  with 33% promo until Jan 1 2027 — cite list, note promo); ARR-stage segmentation is the
  ranking pattern (refgrow, FACTS-seo-queries #14); commission benchmarks from #23 verified set.
- **Media:** 1 comparison table + max 1 other visual.

---

## 4. Blog — guides (FACTS-seo-queries how-to lane)

### G1 — How to start an affiliate program for your SaaS
- **Type:** blog-guide · **Priority:** P0 · **Persona:** SaaS founder, pre-purchase
- **URL:** `affitor.com/blog/how-to-start-saas-affiliate-program`
- **Target query:** "how to start an affiliate program for saas" — the pillar; internal-links to
  every comparison page (FACTS-seo-queries #20, P0).
- **Outline (H2):** L-band.
  1. Decide what you'll pay (verified benchmarks: 20% typical SaaS rate, 23.3% average, 20–25%
     most common band across 96 real campaigns; mature programs settle at 15–25%; keep commission
     within 30–40% of gross margin; in renewal-paying programs 70% of commission events are
     renewals — recurring beats one-time)
  2. Choose your software (criteria + links to B1–B6; one honest paragraph on Affitor's model)
  3. Set up tracking (click → signup → sale chain; server-side vs cookie durability)
  4. Recruit your first partners (marketplace, invites, outreach, communities — 8-channel
     structure ranks per FACTS-seo-queries #22)
  5. Set payout terms (hold periods, thresholds, refund clawbacks)
  6. Launch and measure (what good looks like in month 1–3)
  7. What's next (dual CTA)
- **Key facts:** benchmark set (FACTS-seo-queries #23 facts block — do NOT use the retracted
  "30% median / 2,600 programs" figure); invite/hold/marketplace mechanics (FACTS-features §1).
- **Media:** 1 Mermaid-style lifecycle diagram (click → commission → payout) + max 1 more visual.

### G2 — How to add an affiliate program to your Stripe SaaS
- **Type:** blog-guide · **Priority:** P0 · **Persona:** SaaS founder / agent-dev on Stripe
- **URL:** `affitor.com/blog/stripe-affiliate-program`
- **Target query:** "stripe affiliate program (how to create)" (FACTS-seo-queries #21, P0).
  Must resolve the ambiguity in sentence one: **Stripe has no native affiliate feature — you
  need third-party software** (confirmed across refgrow/tolt/referralrocket).
- **Outline (H2):**
  1. What Stripe gives you (metadata, webhooks, Connect — and what it doesn't: affiliate tracking)
  2. The metadata-native approach (attribution riding `affitor_click_id` / `affitor_customer_key`
     on the Checkout Session; identity chain that survives cookie loss)
  3. Your software options (short honest table of Stripe-compatible tools)
  4. Set it up in minutes (`npx affitor onboard`: detect → install → inject → verify)
  5. Prove it works (synthetic click→lead→sale chain → `integration_verified: true`)
  6. What's next (dual CTA: signup + tracking docs)
- **Key facts:** Affitor reference frame — Stripe-metadata tracking, signup-anchored identity
  chain (FACTS-competitors header); CLI onboard + self-verify loop (FACTS-agent-commerce
  §1.1, §1.4); integer cents / idempotency / same customer_key rules if code is shown
  (FACTS-agent-commerce §6).
- **Media:** 2 labeled code blocks (Stripe metadata snippet; CLI onboard output). Zero
  screenshots — code is the proof (Vercel/Stripe pattern).
- **Note for Son:** FACTS-seo-queries #15 also calls for a `/integrations/stripe` PRODUCT
  landing page (routes to signup, not reading). That's a site page, out of this map's scope —
  logged here so it isn't lost.

### G3 — What commission rate should your SaaS affiliate program pay?
- **Type:** blog-guide · **Priority:** P1 · **Persona:** SaaS founder designing a program
- **URL:** `affitor.com/blog/saas-affiliate-commission-rates`
- **Target query:** "saas affiliate commission rates" (FACTS-seo-queries #23); FAQ schema also
  answers #28 for the featured snippet.
- **Outline (H2):** The benchmark numbers (20% typical / 23.3% avg / 20–25% band, 96 campaigns;
  15–25% mature, 5–30% overall) → Recurring vs one-time (70%-of-events-are-renewals stat) →
  The margin constraint (30–40% of gross margin) → How to set yours (worked example) → How to
  implement rates per partner group (link D1) → FAQ (schema) → What's next.
- **Key facts:** ONLY the verified benchmark set (FACTS-seo-queries facts block); retracted
  figures in its Unverified list are banned.
- **Media:** 1 simple rate-band table.

---

## 5. Blog — vision

### V1 — The agent commerce stack is missing its attribution layer
- **Type:** blog-vision · **Priority:** P0 · **Persona:** agent-dev / founders / industry readers
- **URL:** `affitor.com/blog/agent-commerce-attribution`
- **Purpose:** Own the "agentic commerce + affiliate attribution" conversation. Thesis line
  (approved candidate): *"Agentic commerce standards decide how an agent pays. Affitor decides
  who earned the commission — and lets the agent prove it."* (FACTS-agent-commerce §4).
- **Outline (H2):** M/L-band. Every section labeled SHIPPED / BETA / VISION — the honest split
  IS the marketing (FACTS-agent-commerce §6).
  1. A payments stack materialized in twelve months (ACP — OpenAI+Stripe, Sep 29 2025; AP2 —
     Google, Sep 16 2025, donated to FIDO Apr 28 2026; UCP — Jan 11 2026, Google/Shopify/Etsy/
     Target/Walmart; "designed to stack, not to replace one another")
  2. The funnel collapsed to a single interaction (attribution-collapse: agents bypass browser
     tracking; server-side called "the only reliable solution"; $20.57B / 1.5% of US retail
     ecommerce 2026 per eMarketer; McKinsey $3–5T by 2030 — re-verify at publish)
  3. The affiliate loop has five verbs (discover → join → promote → attribute → settle, with
     per-verb SHIPPED/PARTIAL/VISION status from §4 of the facts file)
  4. What an agent can do today (SHIPPED: openaffiliate.dev API, 7 MCP tools, synthetic
     click→lead→sale verification returning `integration_verified: true`, 52 skills)
  5. What proof-of-attribution looks like (VISION: VSAL — signed claims, deterministic winner,
     Certificate-Transparency-style operators; DRAFT spec, say so)
  6. Trust is one-shot with agents (closing beat; dual CTA: docs/skill.md + MCP docs)
- **Key facts:** FACTS-agent-commerce §1–§5 exclusively; banned phrasings in §7 (no
  "non-negotiable" quote, no "add-to-cart" formulation); Dub honesty rule (§6).
- **Media:** 1 five-verb loop diagram (Mermaid or styled figure, full-sentence caption) +
  1 code block (readiness API response). No screenshots.

### V2 — What Affitor means
- **Type:** blog-vision · **Priority:** P1 — **BLOCKED on Open Question 1 (name origin)**
- **URL:** `affitor.com/blog/what-affitor-means`
- **Purpose:** The brand piece — name, origin, and what the company stands for. Feeds the About
  page and every "why Affitor" link.
- **Outline (H2):**
  1. The name (SOURCE REQUIRED: no file in the workspace explains it — FACTS-wishes §1. Must
     come from a Son interview; any "affiliate + -tor" etymology is inference and may not ship)
  2. Built from the founder's own pain (over a decade in affiliate; "Affitor là sản phẩm Sơn tự
     mình xây dựng – xuất phát từ chính nỗi đau khi làm affiliate", 2025-06-08)
  3. What it stands for (canonical one-liner; performance pricing philosophy — "We make money
     when affiliates make you money"; north star: the affiliate layer an AI agent reaches for
     by default and can prove works)
  4. Where it's going (VSAL direction, labeled vision; "affiliate data should be public
     infrastructure" — OpenAffiliate rationale quote, 2026-04-18)
- **Key facts:** FACTS-wishes §1 (the gap), §2 (positioning lines), §4 (pricing manifesto —
  drafted 2026-06-09 "for owner review"; verify it shipped before quoting as live copy);
  FACTS-founder-fb §2, §6.
- **Media:** zero images or one product screenshot; keep it text-led (Vercel pattern).

---

## 6. About page

### A1 — About Affitor (founder story)
- **Type:** about-page · **Priority:** P1 · **Persona:** buyers, partners, press
- **URL:** `affitor.com/about`
- **Purpose:** Trust page. Standard §1.6: sign what you ship — this page is where the human
  shows up. Uses ONLY verified founder facts; every number carries its date.
- **Outline (H2):**
  1. What Affitor is (canonical one-liner + the two repeatable facts: "$0 until $10K revenue,
     then 3.5%" / "the only affiliate platform an agent can integrate AND verify end-to-end")
  2. Why it exists (founder pain: over a decade in affiliate — safe phrasing per timeline-drift
     note; started online alone, no capital, 12m² rented room, later supported family + 2
     siblings; spoke on affiliate crypto at events 2019–2021; organized "Make Affiliate Great"
     events in Thailand + Vietnam ~2023)
  3. Who builds it (Son Piaz / Nguyễn Tùng Sơn; rebuilding solo in San Francisco; studying CS
     at Foothill College while running the company; team across 4 timezones — SF, Chicago,
     Vietnam, London)
  4. We build in public (receipts with dates: affiliate-skills open-sourced — 123 stars/56 forks
     in first 3 days, grown to 52 skills; OpenAffiliate — 450 programs at launch 2026-04-18,
     ~750 by 2026-04-20, free + open source; Cơm AI Lò community — 100,000 members in under a
     year, self-reported 2026-03-23; the honest 17%-AEO-visibility audit post, 2026-04-03)
  5. How we price (the fair-pricing stance; manifesto language pending Open Question 2 approval)
  6. Talk to us (support/contact links; founder's public channels)
- **VERIFIED facts pool:** FACTS-founder-fb §1–§3 (each with post date + quote),
  FACTS-founder-profile §1/§4/§5, FACTS-agent-commerce §1.5 (52 skills).
- **CLAIMED NUMBERS THAT LACK SOURCES — flagged, do NOT publish without Son (task requirement):**
  - **"$1M personal milestone"** — only ever implied (2025-09-14 post), never stated directly.
  - **"12 years in affiliate"** — timeline drift across posts (10 → 11 → 12 in 10 months);
    publish "over a decade" only.
  - **82k Facebook followers** — recorded 2026-03-16, stale; re-verify live before use.
  - **"~500K followers across 11 channels"** — historical self-claim ("hồi xưa"), no
    platform split, no date.
  - **Alumni outcomes ("thousands, even millions of dollars")** — unaudited self-claim; the only
    sourced student number is $1,019 (chị Giang, 2025-09-19).
  - **"Reduces CAC 5–10x"** — pitch-deck claim (2025-10-28), not a measured result.
  - **"$200K–500K/yr ops savings"** — self-estimate, "60% tested" (2026-01-28).
  - **Kyma signup counts** — carry Son's own bot caveat (2026-05-07); prefer token/sale stats.
  - **Affitor headcount / funding / GMV** — never disclosed anywhere; do not imply any.
  - **Any customer testimonial** — none exist (FACTS-wishes §8); do not invent.
  - Do-not-claim list also applies: no large-team management, no fundraising/VC, no ML research,
    no enterprise sales (FACTS-founder-profile §6).
- **Media:** 1–2 real photos (speaking at the GitHub developer event / AWS AI Hack Day — Son
  must supply; the capture rig cannot produce these) + optionally 1 product screenshot. No stock.

---

## 7. Build order

**Wave 1 — plumbing + credibility (cheap, unblocking):**
INFRA-1 → R5 (changelog batch) → R1 (create-account)

**Wave 2 — P0 docs + P0 blog (parallel lanes):**
Docs lane: D1, D2. Blog lane: B1, B2, B4, G1, G2 (all gated on INFRA-1), then V1
(gated on Open Question 3a).

**Wave 3 — P1:**
D3, D4, D5 · R2, R3 · B3, B5, B6, G3 · A1 (gated on Open Question 2) · V2 (gated on
Open Question 1).

**Wave 4 — P2:** D6, R4, R6.

Publish-time checklist for every blog artifact: re-verify competitor prices (guardrail 2),
re-verify external stats (V1), confirm authors/role/avatar present, per-page `.md` renders,
llms.txt updated.

---

## 8. Open questions for Son

1. **The name.** No file anywhere explains what "Affitor" means or where it came from
   (FACTS-wishes §1 — exhaustive search, zero hits). V2 is blocked until you tell the story;
   15 minutes of voice notes is enough. Without it, any etymology we write is fiction.
2. **About-page numbers.** Which flagged claims may ship, if any: the implied $1M milestone,
   "12 years" (vs "over a decade"), 82k FB followers (stale), ~500K/11-channels (historical),
   alumni "millions" outcomes? Also: is the 2026-06-09 pricing manifesto draft approved to
   reuse verbatim in A1/V2/pricing copy? And please supply 2–3 real photos (speaking events)
   for the About page.
3. **Two publishing gates.** (a) The 90-day plan's standing GATE says agent-native claims are
   "actively harmful" until plumbing is verified (stale package names, dead readiness route,
   "3 meanings of verified"). skill.md + llms.txt are now confirmed live — is the rest of the
   GATE closed so V1/G2 can ship? (b) Has the pricing-page step-vs-bracket copy fix shipped,
   so D3/B-series can state exact fee mechanics?

---

## 9. Tracking — weekly AI-visibility measurement

Spec: `.content-factory/AI-RANK-redesign.md` Part D. Three lanes, reviewed together weekly:
Brand Radar SOV = outcome · crawler/referral data = pipeline · probe file = diagnosis.

1. **Self-hosted crawler tracking (shipped):** `src/middleware.ts` matches AI-crawler
   user-agents (GPTBot, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended, Bytespider,
   CCBot, anthropic-ai, OAI-SearchBot) and fires a server-side PostHog `ai_crawler_hit`
   event (props: `bot`, `path`). Key from `NEXT_PUBLIC_POSTHOG_KEY`; no-op when unset;
   fire-and-forget with a 1s timeout — never blocks a response. Insight: weekly trend by
   `bot` and by `path` (which posts are in the answer pool).
2. **Monday manual probe ritual:** `scripts/ai-probe.md` — re-run the 8 buyer queries
   (base / "2026" / "reddit" variants), record ranks, citations, and quoted sentences into
   `.content-factory/tracking/probe-YYYY-MM-DD.md`.
3. **Ahrefs Brand Radar (D1):** entities Affitor, Rewardful, FirstPromoter, Tolt,
   PartnerStack, Dub (Partners). Prompts to track (the same 8 queries as the probe ritual):
   1. "how to set up a Stripe affiliate program"
   2. "Tolt vs Rewardful which is better"
   3. "affiliate tracking software pricing comparison"
   4. "best affiliate software for SaaS"
   5. "best Rewardful alternatives"
   6. "PartnerStack alternatives"
   7. "how to start an affiliate program for my SaaS"
   8. "Rewardful vs FirstPromoter"

   Weekly export: share-of-voice per entity per AI surface (AI Overviews / ChatGPT /
   Perplexity) + cited URLs, logged to `.content-factory/tracking/brand-radar-YYYY-WW.md`.
