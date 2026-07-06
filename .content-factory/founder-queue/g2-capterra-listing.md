# G2 + Capterra Listing Copy — Affitor

> Founder-queue draft. Son executes in minutes: create the two vendor accounts, paste the
> fields below, upload screenshots. Everything here traces to FACTS files; nothing invented.
>
> Sources: `FACTS-features.md` (code-verified 2026-07-05, 2 passes), `FACTS-competitors.md`
> (Affitor reference frame), `content/docs/getting-started/pricing-performance-model.mdx`
> (fee terms), `GROWTH-STRATEGY.md` §4 + §6 (approved fee phrasing, gate notes).
>
> **Fee phrasing rule:** the only approved fee soundbite until gate 3b closes is
> "$0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only." Used verbatim
> below wherever the fee is summarized.
>
> **Gate 3a note (agent-native claims):** every agent claim below is limited to code-verified
> shipped surface (CLI commands, 7 MCP tools, skill.md paste line, self-verify loop). No
> "agents run your whole program" language.

---

## 0. Execution checklist (Son, ~30 min total)

1. G2: my.g2.com → "Add your product" → claim **Affitor** (requires work email + company verification).
2. Capterra: vendors.capterra.com → "Get listed" → same fields.
3. Paste fields from §1–§4. Fill the three FOUNDER-FILL fields (year founded, HQ, company size) — not on file, do not let anyone guess them.
4. Upload 5–6 screenshots per §5 (agents can capture them on request; app.affitor.com views listed).
5. Skip paid upgrade prompts on both platforms — free listing is enough for the aggregator-citation goal (AI-RANK-anatomy factor 6).

---

## 1. Shared identity fields (both platforms)

| Field | Value |
|---|---|
| Product name | Affitor |
| Website | https://affitor.com |
| Product URL (app) | https://app.affitor.com |
| Documentation | https://docs.affitor.com |
| GitHub | https://github.com/Affitor |
| Founder | Son Piaz |
| LinkedIn | https://linkedin.com/in/sonpiaz |
| Year founded | FOUNDER FILL — not on file |
| Headquarters | FOUNDER FILL — not on file |
| Company size | FOUNDER FILL — not on file |
| Support email | FOUNDER CONFIRM — not on file |

---

## 2. G2 listing

### Product name
Affitor

### Short description (G2 limit ~160 chars)
Affiliate platform for SaaS where AI coding agents do the integration. $0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only.

(140 chars.)

### Long description
Affitor is an affiliate marketing platform for SaaS built so an AI coding agent can complete the entire integration end to end, not just assist with it.

Pricing is performance-only: $0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only. No monthly subscription, no setup fee, no revenue-capped tiers.

For integration, you hand your coding agent one paste line, or run `npx affitor onboard`. The CLI detects your stack, installs browser tracking, injects the sale-tracking call into your Stripe webhook handler, then proves the chain works with synthetic click, lead, and sale test events against a readiness endpoint. An MCP server exposes 7 tools (readiness, click/lead/sale/refund tracking, integration plan, end-to-end verification) so agents in Claude, Cursor, and other MCP clients can integrate and verify without a human in the loop. A REST tracking API (`POST /v1/track/click | lead | sale | refund`) covers server-side setups directly.

For brands: create a program with commission structures, cookie and attribution windows, and hold periods; review partner applications or auto-accept; group partners under versioned commission policies; every commission state change is audited. Stripe-native: connect Stripe once, and incoming webhook events are automatically analyzed and routed to sale, refund, and dispute commission handling. Monthly invoices with PDF and Stripe checkout payment.

For partners: a public marketplace to discover and join programs, referral links with sub-IDs and short links, per-program click/lead/conversion/revenue stats, and payouts via bank transfer, PayPal, Stripe, or Wise.

### Category picks (G2)
- **Primary: Affiliate Marketing Software** — the money category; unblocks the "best overall alternative is X, 4.x stars" aggregator sentence in AI answers.
- Secondary (only if G2 allows a second): Partner Management Software — partner groups, applications, messaging, payouts justify it. Do not stretch further (no PRM/LMS claims).

### G2 feature checklist (Affiliate Marketing category)
Check only these:
- Affiliate tracking (click → signup → sale; server-side v1 API + browser snippet)
- Commission management (structures, holds, auto-approve, rejection reasons, full audit trail)
- Affiliate/partner portal (partner dashboard, per-program stats, referral links)
- Payout management (bank transfer, PayPal, Stripe, Wise; thresholds; audit log)
- Affiliate recruitment (public marketplace, program detail pages, apply flow, share link)
- Reporting and analytics (per-program tracking status, events, performance endpoints)
- API / developer tools (REST v1 API, per-program API keys, CLI, MCP server)
- Third-party integrations (Stripe Connect, Stripe webhook auto-distribution)

Leave UNCHECKED (not on file, do not claim): fraud detection, multi-level marketing, coupon/promo-code tracking, banner/creative management, email campaign tools, multi-currency.

### G2 pricing answers
- **Pricing plan (one plan):** name it **Performance** — **$0/month**.
  Plan description: "$0 monthly, $0 setup. Your first $10,000 in affiliate-driven revenue is fee-free, then a 3.5% platform fee on affiliate-driven sales only. Billed by monthly invoice, payable via Stripe checkout."
- **Free version:** Yes ($0/month is the only plan; fees start only after $10K affiliate-driven revenue).
- **Free trial:** No — answer "No trial needed; the product is free until your first $10,000 in affiliate-driven revenue."
- **Entry-level price:** $0.

---

## 3. Capterra listing

### Product name
Affitor

### Tagline / one-liner
AI-native affiliate marketing platform for SaaS. Your coding agent integrates it and verifies the tracking chain end to end. $0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only.

### Description
Affitor is an affiliate marketing platform for SaaS companies on Stripe, designed so an AI coding agent can do the full integration. Run `npx affitor onboard` or paste one line into Claude or Cursor: the tooling detects your stack, installs tracking, injects the sale-tracking call into your Stripe webhook handler, then verifies the whole chain with synthetic click, lead, and sale events until the readiness check passes. Brands get program creation with commission structures and attribution windows, partner applications with auto-accept, partner groups with versioned commission policies, commission holds with a full audit trail, and Stripe webhook auto-routing for sales, refunds, and disputes. Partners get a public marketplace, referral links with sub-IDs and short links, per-program stats, and payouts via bank transfer, PayPal, Stripe, or Wise. Pricing is performance-only: $0 monthly, $0 setup, first $10,000 in affiliate-driven revenue fee-free, then 3.5% of affiliate-driven sales.

### Category picks (Capterra)
- **Primary: Affiliate Software**
- Secondary (optional): Referral Software — the refer-a-brand program and partner referral links justify it, but Affiliate Software alone is fine if one category keeps the listing cleaner.

### Capterra structured answers
| Capterra field | Answer |
|---|---|
| Starting price | $0.00 |
| Pricing model | Usage-based (3.5% of affiliate-driven sales after the first $10,000, which is fee-free) |
| Free version | Yes |
| Free trial | No (not needed; free until $10K affiliate-driven revenue) |
| Deployment | Cloud / SaaS / Web-based |
| Typical customers | SaaS companies on Stripe; indie founders to mid-market |
| Training | Documentation (docs.affitor.com); agent-readable skill.md |
| Support options | Knowledge base (docs.affitor.com); FOUNDER CONFIRM email/chat before checking those boxes |

### Capterra feature checklist
Check: Affiliate Management, Commission Management, Affiliate Tracking, Payout Management (if offered as an option), Referral Tracking, Third-Party Integrations, API, Real-Time Analytics/Reporting, Campaign/Link Management (referral links with sub-IDs).

Leave unchecked (not on file): Banner Management, Coupon Management, Email/Newsletter Communication, Fraud Detection, Multi-Level Marketing, Social Promotion.

---

## 4. Screenshots to upload (5–6, both platforms)

1. Brand dashboard (program overview: partners, commissions, revenue)
2. Getting-started / integration status page (the readiness checklist — the differentiator shot)
3. Agent onboarding page with the one-line paste for a coding agent
4. Terminal: `npx affitor onboard` run ending in verification success
5. Partner marketplace (program discovery)
6. Commission detail with hold/audit trail

Agents can capture 1–3 and 5–6 from app.affitor.com on request; 4 is a clean terminal recording frame.

---

## 5. Guardrails (do not let listing wizards bait these claims)

- No fraud detection, no MLM, no multi-currency, no enterprise/SLA claims — not on file.
- Non-Stripe providers (Polar, Lemon Squeezy, Paddle): detection only, injection is Stripe-only. Say "Stripe-native" and stop there.
- Partner invites by email and lead-auth hardening are beta — leave out of listings.
- Never write a competitor's name into our own listing description (G2 removes it anyway).
- Fee phrasing stays verbatim per GROWTH-STRATEGY §4 until gate 3b closes.
- Review solicitation (10 design-partner emails) is a separate queue item — do not blast from the vendor consoles' built-in spam tools.
