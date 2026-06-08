# SDD — Affitor Framework Integration Guides

Status: **SHIPPED** (2026-06-08) · Author: docs · Grounded against runtime (affiliate-cli SDK, affiliate-cms tracking + webhook-distributor, existing docs).

**Decisions (locked + shipped):** naming standardized — *Sale API → Server-side tracking*, *Bill Flow (method) → Stripe integration*, *Bill Flow (commercial) → Invoice billing* (PR #36). IA = **Option C: "Integrations" group under API Reference** (§6). Scope = **Tier 1, 6 guides shipped** (PR #37): nextjs, nextjs-clerk, nextjs-supabase, nextjs-nextauth, stripe, node-express. Package-name + `<AffitorProvider>` corrections applied (§3). Terms below use the post-rename naming.

## 1. Goal

Ship copy-paste **integration guides per stack** so a developer (or their AI agent) can wire Affitor tracking into *their* app without reverse-engineering the primitives. Tracking docs today teach the *primitives* (click / lead / sale); guides answer *"where do these 3 calls go in MY stack?"* — the same thing Dub / Stripe / Clerk do.

Quality bar: **many guides, identical quality**. The mechanism for "đồng đều" is a **fixed anatomy** + a **single verified-ingredients sheet** every guide reuses verbatim, plus a per-guide verification pass.

## 2. Verified integration surface (the ingredients — reuse verbatim)

Every guide is assembled from exactly these three moves. Values are runtime-verified (file:line in the grounding run).

### 2.1 Capture the click
- **Browser SDK** (`affitor-sdk`): `init({ programId })` on app load (client-side; `init()` is a no-op / returns `null` on server, SSR-safe). Reads `?aff=` from the URL, sets first-party cookie `affitor_click_id` (60-day default).
  ```ts
  import { init } from 'affitor-sdk';
  init({ programId: YOUR_PROGRAM_ID }); // debug?, cookieDomain?, apiBase? also supported
  ```
- **Script tag** (no build step):
  ```html
  <script src="https://api.affitor.com/js/affitor-tracker.js" data-affitor-program-id="YOUR_PROGRAM_ID" defer></script>
  ```
  Exposes `window.affitor.{init,signup,trackClick,getClickId,getData}` + a pre-load queue `window.affitorQueue.push([...])`. Optional `data-affitor-debug`, `data-affitor-cookie-domain`, `data-affitor-api-base`.

### 2.2 Track the signup (lead)
- **Browser** (no Bearer token; uses the cookie): `await signup(customerKey, email?)` (SDK) or `await window.affitor.signup(customerKey, email)` (script tag). Fires `POST /api/v1/track/lead`.
- **Server** (`affitor-node`): `await affitor.trackLead({ customerExternalId, clickId?, email? })` with a Bearer program API key.
- **Raw API**: `POST /api/v1/track/lead` — `click_id` **OR** `customer_key` required; Bearer optional (server mode).

### 2.3 Track the sale (money path — must be exact)
Sale is **server-side only** (not exposed on `window.affitor`). Two paths:
- **Server-side tracking** (`affitor-node` or raw): `POST /api/v1/track/sale`, **Bearer REQUIRED**.
  ```ts
  await affitor.trackSale({
    customerExternalId: user.id,
    amount: 4999,            // integer cents, positive
    invoiceId: invoice.id,   // idempotency key — duplicate → HTTP 409
    currency: 'USD',         // optional
    saleType: 'subscription',// optional: 'payment' | 'subscription'
    isRecurring: true, subscriptionId: 'sub_xxx', subscriptionInterval: 'monthly', // optional
  });
  ```
  Raw fields: `transaction_id` (unique → 409), `amount_cents` (positive int), `customer_key` **OR** `click_id`, `currency='USD'`, `sale_type='payment'`.
- **Stripe integration** (no Affitor sale call — Stripe webhooks do it). Attach metadata to the Checkout Session you create in **your own** Stripe:
  ```ts
  metadata: {
    affitor_click_id: clickIdFromCookie,
    affitor_customer_key: user.id,
    program_id: 'YOUR_PROGRAM_ID',
  }
  // subscriptions: duplicate the SAME object into subscription_data.metadata
  ```
  Affitor consumes `checkout.session.completed` (first payment) and `invoice.payment_succeeded` (renewals). **Subscriptions that omit `subscription_data.metadata` lose renewal attribution** — the #1 mistake.

### 2.4 The consistency rule (state in every guide)
The same identifier value flows through all three contexts under three names:
| Context | Field |
|---|---|
| Browser helper arg | `customerKey` |
| Lead / Server-side tracking | `customer_key` |
| Stripe metadata | `affitor_customer_key` |

### 2.5 Test mode
`additional_data: { test_mode: true }` on any call → creates a test event, no commission, no effect on production metrics. (Sale still needs the Bearer token.)

## 3. CRITICAL — existing-docs corrections (do first, same PR series)

Grounding caught real inaccuracies in already-published docs (PR #32). These break copy-paste and must be fixed before/with the guides:

1. **Package names.** Docs say `@affitor/tracker` + `@affitor/node`. Published `package.json` names are **`affitor-sdk`** + **`affitor-node`**. `npm i @affitor/tracker` fails. Fix `api-reference/sdks.mdx`, `index.mdx`, `agent-integration.mdx`, and anywhere else.
2. **No React Provider.** There is no `<AffitorProvider>` / `useAffitor`. The SDK is a vanilla-JS singleton (`init()` + `signup()`); React usage = call `init()` in a top-level client component (`useEffect`). Any guide/example implying a provider is wrong.
3. **Script-tag URL.** Use `https://api.affitor.com/js/affitor-tracker.js` (CLI wizard + CMS serve this). Drop any `cdn.affitor.com/...` form.
4. **Stripe metadata canon.** Standardize on `affitor_click_id` + `affitor_customer_key` + `program_id` (what the webhook-distributor reads). Treat `partner_code` / `customer_code` / `customer_key` as legacy aliases only.

## 4. Guide anatomy (fixed — every guide, same shape)

This template is the quality-consistency contract. Each guide is short and identical in structure:

1. **Frontmatter** — `title`, `description` (one line: "Add Affitor tracking to a {stack} app").
2. **Lead** — 1–2 sentences: what this guide wires + the 3 moves.
3. **Prerequisites** — program ID, program API key (server), the stack assumed.
4. **Step 1 — Capture clicks** — exact install for this stack (where `init()`/script goes).
5. **Step 2 — Track signups** — exact place this stack fires signup (the auth hook), with `customerExternalId` = the stack's stable user ID.
6. **Step 3 — Track sales** — Stripe integration *or* Server-side tracking, with the same `customer_key`.
7. **Verify** — `<VerifySuccess>` (browser cookie / network / dashboard) + test_mode note.
8. **Common mistakes** — `<CommonMistakes>` (customer_key mismatch, missing `subscription_data.metadata`, calling init server-side).
9. **NextStep** — to the relevant API Reference page.

Shared conventions: Beta callout on SDK-based steps; `<Flow>` for the 3-move overview where useful; tables for field mapping; all code runnable.

## 5. Guide matrix (tiered)

Stacks split into **where click goes** (frontend), **where signup fires** (auth), **where sale fires** (payment/server). Most SaaS = one frontend + one auth + Stripe.

**Tier 1 — ship first (covers the majority):**
1. Next.js (App Router) — base: `init()` in a client component, signup after auth, sale via Stripe integration.
2. Next.js + **Clerk** — signup on Clerk `user.created` webhook / post-sign-up; `customerExternalId = clerkUserId`.
3. Next.js + **Supabase Auth** — signup on auth state / DB trigger; `customerExternalId = supabase user id`.
4. Next.js + **NextAuth / Auth.js** — signup in the `events.createUser` / `signIn` callback.
5. **Stripe integration** (framework-agnostic) — the canonical Checkout-metadata recipe (one-time + subscription).
6. **Node / Express** server — `affitor-node` for lead + sale, raw API fallback.

**Tier 2 — next:**
7. React SPA / Vite (script tag or SDK, no SSR).
8. Server-side tracking for non-Stripe providers (Paddle / LemonSqueezy).
9. Python / Django (raw API, no node SDK).
10. Plain HTML / script-tag-only (no build).

**Tier 3 — later:** Laravel/PHP, Ruby/Rails, Webflow/no-code, RudderStack/Segment-style.

## 6. IA placement (decision needed)

- **Option A — new top-level tab "Guides"** (recommended; matches Dub/Stripe "Guides"/"Integrations"). Sits between *For Advertisers* and *API Reference*. Own sidebar: Frameworks / Auth / Payments / Servers.
- **Option B — nested under For Advertisers** as a "Framework Guides" section after Tracking. Less discoverable, keeps tabs fewer.
- **Option C — under API Reference** as an "Integrations" group. Couples guides to the API ref.

Tab landing = an index guide ("Choose your stack") with `<FeatureCards>` to each guide.

## 7. Quality bar (per-guide acceptance checklist)

- [ ] Uses ONLY §2 verified ingredients; package names = `affitor-sdk` / `affitor-node`.
- [ ] Every code block is runnable and self-consistent (same `customer_key` value across moves).
- [ ] States the consistency rule (§2.4) and the subscription metadata trap.
- [ ] SDK steps carry a Beta callout; sale path is server-side.
- [ ] No invented APIs (no `<AffitorProvider>`, no browser sale call).
- [ ] Follows the §4 anatomy exactly (same headings, order, components).
- [ ] `npm run build` green; internal links resolve; callouts render.
- [ ] Passes a separate critic review (accuracy + consistency vs sibling guides).

## 8. Build plan (workflow)

1. **Fix pass** (§3) — correct existing SDK/index/agent docs (small, do first).
2. **Author pass** — one agent per Tier-1 guide, all fed the *same* §2 ingredients + §4 anatomy + a reference exemplar (write the Next.js base guide first by hand as the gold exemplar, then fan out the rest to match it).
3. **Verify pass** — critic per guide (accuracy vs runtime + consistency vs exemplar); fix flagged items.
4. **Ship** — build, screenshot landing + 2 guides, PR → main → prod-verify.
