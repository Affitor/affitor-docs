# Competitor Fact Sheet — for comparison articles

**Verified: 2026-07-05** (live fetch of each vendor's own pricing page unless noted).
Baseline research: `_overnight-2026-06-12/_meta/competitor-data.md` (2026-06-13) — re-verified today; drift flagged inline.
Affitor's own facts: `_overnight-2026-06-12/_meta/affitor-self-facts.md` (code-confirmed 2026-06-13).

## Affitor reference frame (for the "gaps" sections)

- **Subscription-free performance model** — $0/mo, $0 setup, 3.5% platform fee on partner-generated revenue only; first $10K affiliate-driven revenue fee-free (enforced in code, `affiliate-fee.ts`).
- **Agent/CLI-native** — `skill.md` runbook an agent completes end-to-end; npm packages `affitor` (CLI), `affitor-sdk` (browser), `affitor-node` (server); self-verify loop: synthetic click→lead→sale chain + `GET /readiness` → `integration_verified: true`.
- **Stripe-native tracking** — attribution rides Stripe metadata (`affitor_click_id`, `affitor_customer_key` on Checkout Session + subscription); signup-anchored identity chain (click_id → email_hash → stripe_customer_id) that survives cookie loss.

## Writer guardrails (carried from 2026-06-13 audit, still binding)

- Dub is signup/lead-anchored — NEVER describe it as "click-anchored cookie tracking."
- Do not assert PartnerStack's or Post Affiliate Pro's attribution mechanics — unverified.
- "No official MCP server" claims were verified 2026-06-13, not re-audited today — phrase as "no official MCP found as of June 2026."
- VSAL (verifiable attribution ledger) is design-stage, not GA — describe as direction, never shipped.
- Re-check every dollar figure against the live page before publishing anything after ~2026-08-05.

---

## 1. Rewardful

**Pricing** — https://www.rewardful.com/pricing (fetched 2026-07-05, unchanged since 2026-06-13):
- Starter **$49/mo** — up to $7,500/mo affiliate revenue, 1 campaign, up to 2 team members
- Growth **$99/mo** — up to $15,000/mo, unlimited campaigns/team, branded portal
- Enterprise **$149+/mo** — over $15,000/mo, phone support, 1-click PayPal payouts
- 0% transaction fee on all tiers. 14-day free trial (the pricing page does NOT state whether a card is required — do not write "no card" for Rewardful). 2 months free on annual. No free tier. REST API on all tiers.

**Target segment:** SaaS on Stripe/Paddle, indie hacker → mid-market. The default "cheap and simple" pick.

**Strengths:**
1. Simplest setup in the category for Stripe SaaS; strongest brand recognition among indie hackers.
2. Genuine 0% transaction fee — the flat subscription is all you pay.
3. REST API included on every tier, even the $49 plan.

**Gaps vs Affitor:**
1. $49/mo floor from day one and revenue-capped tiers force upgrades as you grow — vs $0/mo and free until $10K attributed revenue.
2. Cookie-based attribution (first/last-touch selectable, default 60-day window) — breaks on cookie loss; no signup-anchored identity chain.
3. Human-oriented dashboard onboarding: no agent runbook, no official MCP found (June 2026), no self-verify loop.

## 2. PartnerStack

**Pricing** — https://www.partnerstack.com/pricing (fetched 2026-07-05):
- Launch **from $1,000/mo, paid annually** — affiliate link tracking OR lead/deal registration, marketplace access, partner payments
- Growth **from $1,520/mo, paid annually** — adds advanced integrations, LMS, partner challenges, MDF management
- Enterprise **custom** — all tracking options, designated CSM, custom workflows
- Demo-led sales; no free trial stated.
- *CHANGE since 2026-06-13: prices are now published — was fully sales-gated. Older third-party "3–15% commission cut" reports remain unverified; do not assert.*

**Target segment:** B2B SaaS mid-market/enterprise running multi-type partner programs (affiliates + resellers + referral partners).

**Strengths:**
1. Full PRM suite — partner marketplace, lead/deal registration, MDF, training/LMS — far beyond link tracking.
2. Marketplace distribution: B2B partners already on the network can discover and join your program.
3. Enterprise-scale partner payments, compliance, and CRM integrations.

**Gaps vs Affitor:**
1. ~$12,000+/year minimum commitment on annual billing — unviable for pre-revenue or early SaaS; vs $0/mo performance-only.
2. Sales-led onboarding (demo → contract) — no self-serve signup; nothing an agent can complete autonomously.
3. Attribution mechanics not publicly verifiable (unverified — phrase carefully); no Stripe-metadata-native tracking path.

## 3. FirstPromoter

**Pricing** — https://firstpromoter.com/pricing (fetched 2026-07-05, unchanged since 2026-06-13):
- Starter **$49/mo** — up to $5,000/mo affiliate revenue, 3 campaigns, 1,000 affiliates, **no API**
- Business **$99/mo** — up to $15,000/mo, unlimited campaigns/affiliates, API + webhooks, tax forms
- Enterprise **starting at $149/mo** — above $15,000/mo
- 14-day trial, no card. No free tier. No transaction fee stated on the pricing page.

**Target segment:** SaaS with subscription billing (Stripe, Paddle, Chargebee, etc.), SMB → mid-market.

**Strengths:**
1. Mature SaaS feature set: MRR-based commissions, tax form handling, fraud detection, auto payouts (Enterprise).
2. Broad billing-provider coverage beyond Stripe.
3. Personalized affiliate dashboards and custom domain on the Business tier.

**Gaps vs Affitor:**
1. $49/mo floor with the lowest revenue cap in the peer set ($5K/mo) — upgrade pressure hits earliest.
2. API and webhooks are paywalled to the $99+ tier — the entry plan is dashboard-only; no agent runbook or MCP found (June 2026).
3. Front-end is cookie-window tracking (`_fprom_*` cookies, default 60-day); conversion is recorded at signup, but identity does not ride Stripe metadata natively the way Affitor's does.

## 4. Tolt

**Pricing** — https://tolt.com/pricing (fetched 2026-07-05, unchanged since 2026-06-13):
- Basic **$69/mo** — up to $10,000/mo affiliate revenue, 2 programs, **manual payouts only**
- Growth **$99/mo** — up to $20,000/mo, 5 programs, auto payouts with **2% processing fee**
- Pro **$199/mo** — up to $50,000/mo, unlimited programs, dedicated Slack channel
- Enterprise **custom** — $50,001+/mo
- 14-day trial, no card; 30-day refund. No free tier. Unlimited affiliates/referrals on all tiers.
- *Aggregators (Capterra etc.) still show a stale $49 Basic — always cite the live page.*

**Target segment:** SaaS startups; positioned as the modern Rewardful alternative, strong in the Stripe ecosystem.

**Strengths:**
1. Clean, modern product with unlimited affiliates and referrals on every tier.
2. Global payout rails — PayPal, Wise, local bank, crypto, wire — with auto payouts from Growth up.
3. More revenue headroom per dollar than Rewardful/FirstPromoter at the $99 tier ($20K cap vs $15K).

**Gaps vs Affitor:**
1. $69/mo floor, and the "0% transaction fees" marketing has a nuance: auto payouts carry a 2% processing fee (Basic avoids it only by making payouts manual).
2. Cookie-based click attribution (configurable window) — same cookie-loss fragility as the rest of the cookie cohort.
3. No API surfaced on the pricing page; no agent runbook, no official MCP found (June 2026).

## 5. Dub Partners

**Pricing** — https://dub.co/pricing (fetched 2026-07-05):
- Business **$90/mo** — 10K new links/mo, 250K tracked events, $2,500/mo partner payouts at **5% payout fee**, 10 users
- Advanced **$300/mo** — 50K links, 1M events, $15,000/mo payouts at **5% payout fee**, 20 users
- Enterprise **custom, annual** — unlimited, payouts at **3% fee**, SSO/SAML
- 14-day trial on paid plans. Partners requires a paid plan — no free affiliate tier.
- *DRIFT since 2026-06-13: Business $75→$90, Advanced $250→$300, Advanced payout fee 3%→5%. Cite today's numbers.*

**Target segment:** Developer-first startups already using Dub for link infrastructure; API-centric teams.

**Strengths:**
1. Best-in-class developer experience: SDKs in 5 languages, real-time webhooks, agent-friendly docs (llms.txt in ecosystem).
2. Attribution is lead/signup-anchored (click captured server-side; the durable record is the signup lead) — architecturally the closest to Affitor in this set. Say this honestly.
3. Link infrastructure + analytics + partner payouts in one platform.

**Gaps vs Affitor:**
1. Double toll: $90/mo subscription floor PLUS a 5% payout fee (3% only at custom Enterprise) — vs $0/mo + 3.5% after a free $10K.
2. Payout caps by tier ($2,500/mo on Business, $15,000/mo on Advanced) meter your program's growth.
3. Attribution lives inside Dub's closed network — no third-party-verifiable record; the only MCP found is community/unofficial and static-key (June 2026); no agent self-verify loop.

## 6. impact.com

**Pricing** — https://impact.com/plans-b2b/ (fetched 2026-07-05):
- Starter **"priced from $30/mo"** — small ecommerce only; requires a Shopify/BigCommerce/WooCommerce/Adobe Commerce/Squarespace integration; direct signup (not demo-gated)
- Essentials **"priced from $500/mo"** — marketplace access to ~90,000 partners; demo-gated
- Pro **"priced from $2,500/mo"** — cross-device tracking, API-based tracking, Data Lab, SAML; demo-gated
- Enterprise **contact sales** — fraud scoring, offline/call conversions, forecasting
- Plus a **2.5% transaction fee on partner-driven transactions**. "Priced from" = floors, not quotes.

**Target segment:** Ecommerce and enterprise brands running large-scale partnership programs (affiliates, influencers, publishers). The incumbent enterprise network.

**Strengths:**
1. Massive marketplace: ~90,000 partners discoverable in-network.
2. Enterprise-grade capability depth: cross-device tracking, fraud scoring, offline/call conversions, custom reporting via Data Lab.
3. Full partnership-lifecycle automation (contracts, workflows, discovery) that point tools do not attempt.

**Gaps vs Affitor:**
1. Hybrid toll: subscription floor AND a 2.5% transaction fee. The SaaS-usable tiers start at $500–$2,500/mo and are demo-gated; the $30 Starter is ecommerce-plugin-only, not for SaaS.
2. Sales-led, weeks-long onboarding — not self-serve; nothing agent-completable.
3. Built around ecommerce order feeds, not Stripe-subscription SaaS: no Stripe-metadata-native tracking, no MCP/agent surface found (June 2026).

## 7. Post Affiliate Pro

**Pricing** — https://www.postaffiliatepro.com/pricing/ (fetched 2026-07-05):
- Starter **$89/mo list** — 10,000 tracking requests/mo, unlimited affiliates, setup/integration service included (max 2 hours)
- Pro **$139/mo list** — 1M tracking requests/mo, 220+ integrations
- Ultimate **$269/mo list** — 6M requests, performance rewards, multiple admins, lifetime referrals manager
- Network **$649/mo list** — 20M requests, multi-merchant accounts
- A promo currently shows 33% off ($60/$93/$180/$435) "until January 1st, 2027" — cite list price, note the promo. Annual billing slightly cheaper. 30-day free trial. 24/7/365 support on all plans.

**Target segment:** Long-tail merchants of every kind (ecommerce, services, even affiliate networks) wanting a self-managed, kitchen-sink affiliate system; in market since 2004.

**Strengths:**
1. Deepest feature checklist in the set: 220+ integrations, multi-tier and lifetime commissions, performance rewards, multi-merchant network mode.
2. Unlimited affiliates on every plan; usage metered by tracking requests rather than revenue caps.
3. 24/7/365 "lifetime support" plus a hands-on setup service — rare at this price point.

**Gaps vs Affitor:**
1. $89/mo floor regardless of results, metered by tracking requests — you pay for traffic volume, not outcomes; vs Affitor charging only on attributed revenue.
2. Legacy, breadth-first product — configuration-heavy setup vs a one-trigger-line agent integration; no agent runbook, no MCP found (June 2026).
3. Generic pixel/postback tracking for every platform — no Stripe-native metadata path, no signup-anchored identity chain (attribution internals unverified — do not over-specify).

---

## Cross-cutting takeaways (safe to reuse in drafts)

1. **Nobody else is subscription-free.** Monthly floors as of 2026-07-05: Rewardful $49, FirstPromoter $49, Tolt $69, Post Affiliate Pro $89 list ($60 effective under the 33% promo running until Jan 1, 2027 — cite list, note promo), Dub Partners $90, impact.com $500 (first SaaS-usable tier; $30 tier is ecommerce-plugin-only), PartnerStack $1,000 (annual). Affitor: $0/mo, 3.5% only after $10K attributed revenue.
2. **Several charge twice.** Dub Partners (subscription + 5%/3% payout fee), impact.com (subscription + 2.5% transaction fee), Tolt (subscription + 2% auto-payout processing fee). Rewardful, FirstPromoter, Post Affiliate Pro, PartnerStack: subscription-only per their official pages.
3. **Attribution contrast targets:** Rewardful, Tolt, FirstPromoter are verified cookie/click-window models — legitimate targets for a "signup-anchored vs cookie" contrast. **Dub is signup/lead-anchored — exclude it from that contrast.** PartnerStack, impact.com, and Post Affiliate Pro internals are unverified — do not claim.
4. **The agent-readiness lane is open.** As of the June 2026 audit, none of the seven ships an official MCP server or an agent-completable integration runbook with a self-verify loop. APIs exist (Rewardful all tiers; Dub strongest; FirstPromoter $99+; impact.com Pro+), but they are human-developer surfaces. Affitor's synthetic click→lead→sale chain returning `integration_verified: true` remains the concrete "no one else has this" claim.
5. **Pricing drifts fast.** Two material changes in three weeks: Dub raised prices and its Advanced payout fee (3%→5%); PartnerStack published pricing after years of opacity. Re-verify every number against the live page before each publish.

## Unverified (do not use in drafts without re-sourcing)

- **Rewardful "no card required" for the 14-day trial** — the live pricing page (2026-07-05) says "14-day free trial" but never mentions credit cards either way. FirstPromoter and Tolt DO state "no credit card required" on their pages; Rewardful does not. Claim removed from §1.
- **impact.com Starter "first 30 days no minimum fees"** — not found anywhere on https://impact.com/plans-b2b/ (2026-07-05). Claim removed from §6. The page does confirm the 2.5% partner-driven transaction fee and Starter's ecommerce-plugin requirement.
- (Carried from guardrails) PartnerStack and Post Affiliate Pro attribution mechanics; third-party "3–15% commission cut" reports for PartnerStack.

## Change log

- 2026-07-05 — Initial sheet. Live-verified all 7 vendors. Captured Dub drift (Business $75→$90, Advanced $250→$300, Advanced payout fee 3%→5%) and PartnerStack's newly published pricing ($1,000 / $1,520 annual). Added impact.com and Post Affiliate Pro (not in June baseline).
- 2026-07-05 (later, independent re-verification) — Re-fetched all 7 vendor pricing pages plus Rewardful's attribution page (rewardful.com/first-or-last-touch-attribution). All pricing tiers, caps, fees (Rewardful 0%, Tolt 2% auto-payout, Dub 5%/3%, impact.com 2.5%), API gating (Rewardful all tiers, FirstPromoter $99+), PartnerStack annual pricing, PAP promo, and the Rewardful 60-day-default cookie claim confirmed against live sources. Dub drift "was" values ($75/$250/3%) and FirstPromoter `_fprom_*` cookie detail confirmed against `_overnight-2026-06-12/_meta/competitor-data.md`; Affitor 3.5%/$10K facts confirmed against `_meta/affitor-self-facts.md`. One fix: takeaway 1 now notes PAP's $60 effective promo price alongside the $89 list floor. No claims failed verification; nothing moved to Unverified.
- 2026-07-05 (third pass, spot-verification of the 6 most consequential claims) — Re-fetched Rewardful, PartnerStack, FirstPromoter, Tolt, Dub, and impact.com pricing pages; cross-checked Dub and PartnerStack against raw page HTML (not just summarized fetches). Confirmed: Rewardful $49/$99/$149+ with 0% fee and REST API on all tiers (Starter = 1 campaign, up to 2 team members); PartnerStack Launch $1,000 / Growth $1,520 per month paid annually, published on-page (co-sell variants $1,250/$1,720 exist — "from" phrasing stays accurate); FirstPromoter $49 ($5K cap, no API) / $99 (API+webhooks) / $149+; Tolt $69/$99/$199 with 2% auto-payout processing fee and manual-only payouts on Basic; Dub Business $90 / Advanced $300 with 5%/5%/3% payout fees and $2.5K/$15K/unlimited payout caps (drift values confirmed in page source); impact.com $30/$500/$2,500 tiers, 2.5% partner-driven transaction fee, Essentials+ demo-gated, ~90K marketplace partners. Affitor 0%-to-$10K-then-3.5% confirmed directly in code (`affiliate-cms/src/api/affiliate-fee/services/affiliate-fee.ts`, `DEFAULT_PLATFORM_FEE_TIERS`). Two claims failed sourcing and moved to Unverified: Rewardful trial "no card" (page silent on card requirement) and impact.com Starter "first 30 days no minimum fees" (not on page).
