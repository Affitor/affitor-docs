# Affitor Integration Skill

> A self-contained runbook for an AI coding agent. If a founder told you:
> *"Follow https://docs.affitor.com/skill.md to integrate Affitor. Program `<id>` on `<api_base>`. Key in `AFFITOR_API_KEY`."*
> — you are in the right place. Execute the steps below **in order**. Do not re-read Affitor source; everything you need is here.
>
> Source of truth for fields/endpoints is the OpenAPI spec at `<api_base>/openapi.yaml` (mirror: https://docs.affitor.com/openapi.yaml). Never invent fields not in this file or that spec.

Affitor tracks affiliate **click → lead (signup) → sale** and attributes revenue to the partner who referred each customer. Your job: wire those three events into this brand's app, then prove the loop closes via the readiness endpoint.

---

## 0. Inputs (from the trigger line)

| Input | Where it comes from | Example |
|---|---|---|
| `PROGRAM_ID` | the trigger line | `42` |
| `API_BASE` | the trigger line (per-env — do **not** hardcode prod) | `https://api.affitor.com` |
| API key | the env var `AFFITOR_API_KEY` (already set by the founder) | *(never print it)* |

- `API_BASE` is **per environment**. Production is `https://api.affitor.com`, but uat/staging differ. Always use the value from the trigger line. If it was not given, ask — do not assume prod.
- The API key authenticates **server-side** calls (lead/sale/refund) as `Authorization: Bearer $AFFITOR_API_KEY`. **Never** print it, inline it into a file, paste it into a client bundle, or commit it. Read it from the environment only.

---

## 1. Prerequisites — verify before writing code

1. Confirm `AFFITOR_API_KEY` is present in the environment (`test -n "$AFFITOR_API_KEY"`). **Do not echo its value.** If missing, stop and tell the founder to set it.
2. Note `PROGRAM_ID` and `API_BASE` from the trigger line. Keep `PROGRAM_ID` as a non-secret config value (a public env var like `NEXT_PUBLIC_AFFITOR_PROGRAM_ID` is fine — it is not a secret).
3. Detect the stack: package manager (`npm` / `pnpm` / `yarn` / `bun` from the lockfile), framework (Next.js App Router vs Pages Router, Vite/React, plain HTML), and payment provider (Stripe vs other).

---

## 2. Identifier contract — the #1 attribution breaker

Attribution only works if **one stable internal user ID** is identical across every surface. Pick the brand's canonical user id (e.g. `user.id`) and use the **same value** everywhere:

| Surface | Field on the wire | SDK argument |
|---|---|---|
| Browser signup helper | `customer_key` | `signup(customerKey, email)` — 1st arg |
| Lead API (server) | `customer_key` | `trackLead({ customerExternalId })` |
| Sale API (server) | `customer_key` | `trackSale({ customerExternalId })` |
| Stripe metadata | `affitor_customer_key` | (set on the Checkout Session) |
| Stripe click linkage | `affitor_click_id` | (set on the Checkout Session) |

If signup uses `user.id` but checkout uses `user.email`, sales will not attribute. **Same id, every time.**

---

## 3. Install the SDKs

Use the **detected** package manager. Two real packages:

- **`@affitor/sdk`** — browser/click + signup (`init`, `signup`, `getClickId`). SSR-safe (no-ops on the server).
- **`@affitor/sdk/server`** — server-side lead/sale/refund, Bearer-authenticated.

```bash
# browser tracking (any framework that bundles JS)
npm i @affitor/sdk
# server tracking (Node backend / API routes / webhooks)
npm i @affitor/sdk
```

**Non-Node sites** (plain HTML, Rails, PHP, Django, etc.): skip `@affitor/sdk` and use the script tag (§4c). Use raw HTTP `POST` (§6c) for server events instead of `@affitor/sdk/server`.

---

## 4. Click tracking (browser)

Load the tracker on **every page** so `?aff=<code>` visits are captured into the `affitor_click_id` first-party cookie. **Always pass `API_BASE`** when it is not prod.

### 4a. Next.js — App Router

```tsx
// app/affitor-init.tsx — client component
'use client';
import { useEffect } from 'react';
import { init } from '@affitor/sdk';

export function AffitorInit() {
  useEffect(() => {
    init({
      programId: process.env.NEXT_PUBLIC_AFFITOR_PROGRAM_ID, // = PROGRAM_ID
      apiBase: process.env.NEXT_PUBLIC_AFFITOR_API_BASE,     // = API_BASE (omit for prod)
    });
  }, []);
  return null;
}
```

```tsx
// app/layout.tsx — render once, inside <body>
import { AffitorInit } from './affitor-init';
// ...
<body>
  <AffitorInit />
  {children}
</body>
```

### 4b. Next.js — Pages Router / Vite / plain React

```tsx
// pages/_app.tsx (Pages Router) or src/main.tsx (Vite) — runs client-side
import { useEffect } from 'react';
import { init } from '@affitor/sdk';

useEffect(() => {
  init({
    programId: import.meta.env.VITE_AFFITOR_PROGRAM_ID ?? process.env.NEXT_PUBLIC_AFFITOR_PROGRAM_ID,
    apiBase: import.meta.env.VITE_AFFITOR_API_BASE ?? process.env.NEXT_PUBLIC_AFFITOR_API_BASE,
  });
}, []);
```

### 4c. Plain HTML — script tag (no bundler)

Add to `<head>` on every page. `data-affitor-api-base` is **only needed for non-prod** (uat/staging):

```html
<script src="https://api.affitor.com/js/affitor-tracker.js"
  data-affitor-program-id="PROGRAM_ID"
  data-affitor-api-base="API_BASE"></script>
```

For production you may drop `data-affitor-api-base` (defaults to `https://api.affitor.com`). The script exposes `window.affitor.init(...)` and `window.affitor.signup(...)`. The tracker `src` host should match `API_BASE` (e.g. `API_BASE/js/affitor-tracker.js`).

---

## 5. Lead tracking (signup)

Fire **once** when a user account is created, with the canonical `customerKey` (§2).

### 5a. Browser (after the tracker script / `init` has run)

```javascript
import { signup } from '@affitor/sdk';
// in your post-registration success handler:
await signup(user.id, user.email); // customerKey = user.id (same id used at sale)
// script-tag equivalent:  await window.affitor.signup(user.id, user.email);
```

The browser call needs no API key — the click cookie proves attribution.

### 5b. Server (recommended — survives ad-blockers / SSR auth)

```ts
import { Affitor } from '@affitor/sdk/server';
const affitor = new Affitor({
  apiKey: process.env.AFFITOR_API_KEY!,
  apiUrl: process.env.AFFITOR_API_BASE, // = API_BASE; omit for prod
});

// in your signup handler — read the affitor_click_id cookie if you have it
await affitor.trackLead({
  customerExternalId: user.id, // → customer_key on the wire
  email: user.email,
  clickId: req.cookies['affitor_click_id'], // optional but improves binding
});
```

> Some programs are configured `lead_auth: server_required`. On those, a **browser-only** lead is recorded as *provisional* and only settles when your **server** sends the lead (5b) or the first verified payment lands. When in doubt, do **both** 5a and 5b — they are idempotent on the customer.

---

## 6. Sale tracking — 3 modes, in priority order

Pick the **first** mode that fits the brand's stack. Do not double-report the same sale across modes.

### 6a. Stripe (recommended) — metadata + webhook autocapture

If the brand uses Stripe Checkout, you do **not** call a sale API. Inject two metadata fields when creating the Checkout Session; Affitor's Stripe webhook reads them and creates the sale + commission automatically.

```ts
import { getClickId } from '@affitor/sdk'; // client: read the cookie click id
// pass clickId to your server when starting checkout, OR read the
// affitor_click_id cookie server-side.

const session = await stripe.checkout.sessions.create({
  // ...your normal params...
  metadata: {
    affitor_click_id: clickId,        // from the affitor_click_id cookie
    affitor_customer_key: user.id,    // SAME id as the lead (§2)
    program_id: 'PROGRAM_ID',
  },
  // For subscriptions, DUPLICATE the same metadata onto the subscription:
  subscription_data: {
    metadata: {
      affitor_click_id: clickId,
      affitor_customer_key: user.id,
      program_id: 'PROGRAM_ID',
    },
  },
});
```

Missing `subscription_data.metadata` is the most common subscription-attribution bug — renewals lose the click id without it.

### 6b. `@affitor/sdk/server` at your payment webhook (Stripe-but-custom, or non-Checkout)

```ts
// in your payment-success / invoice-paid webhook handler:
await affitor.trackSale({
  customerExternalId: user.id, // → customer_key
  amount: 4900,                // integer CENTS ($49.00 = 4900)
  invoiceId: invoice.id,       // → transaction_id (unique idempotency key)
  currency: 'USD',
  saleType: 'subscription',    // optional; 'payment' (default) | 'subscription'
  isRecurring: true,           // optional, for renewals
});
```

### 6c. Raw `POST /api/v1/track/sale` — non-Stripe / pure S2S (no client tag)

Many brands have **no browser tag at all** and track entirely server-side. This branch is fully supported: bind the customer at lead time (§5b), then report sales by `customer_key` alone. Authenticated with the Bearer key.

```bash
curl -X POST "$AFFITOR_API_BASE/api/v1/track/sale" \
  -H "Authorization: Bearer $AFFITOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "txn_unique_per_sale",
    "customer_key": "user_123",
    "amount_cents": 4900,
    "currency": "USD"
  }'
```

- Required: `transaction_id` (unique — a duplicate returns **HTTP 409**, treat as already-recorded, not a retry) and `amount_cents` (positive integer cents), plus **one of** `customer_key` or `click_id`.
- Do **not** send a partner code or a pre-computed commission — Affitor resolves the partner and computes commission from the customer's attribution.
- If the customer's attribution window expired, you get `200` with `attributed: false` and nothing is created (the sale is organic). That is expected, not an error.

---

## 7. Refund / chargeback

Reverse the commission when a sale is refunded. Keyed by the **original sale's** `transaction_id` (not the refund event's id). Stripe webhook tracking handles `charge.refunded` automatically — only call this for non-Stripe / S2S.

```ts
await affitor.trackRefund({
  invoiceId: invoice.id,          // → transaction_id of the ORIGINAL sale
  refundAmountCents: 5000,        // omit for a full refund
  refundReason: 'customer_request',
});
```

Raw HTTP equivalent:

```bash
curl -X POST "$AFFITOR_API_BASE/api/v1/track/refund" \
  -H "Authorization: Bearer $AFFITOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "transaction_id": "txn_unique_per_sale", "refund_reason": "customer_request" }'
```

---

## 8. VERIFY — close the loop (do this LAST, after deploying the tracker)

Affitor can prove the integration works end-to-end without a real customer or real money.

### 8a. Fire a synthetic click → lead → sale chain

```bash
curl -X POST "$AFFITOR_API_BASE/api/v1/cli/test-event" \
  -H "Authorization: Bearer $AFFITOR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "type": "chain" }'
```

Response shape:

```json
{
  "data": {
    "type": "chain",
    "short_code": "afftest42",
    "customer_key": "aff_test_ck_42_...",
    "verdict": { "click": "attributed", "lead": "attributed", "sale": "attributed" },
    "attributed": true
  }
}
```

Every step should read `attributed`. If `sale` is `unattributed`, the program has no active sale-commission policy yet (economics gate) — see §8c. `HTTP 429` means too many chains (max 10/program/hour); respect `Retry-After`.

### 8b. Poll readiness until verified

```bash
curl "$AFFITOR_API_BASE/api/v1/programs/me/readiness" \
  -H "Authorization: Bearer $AFFITOR_API_KEY"
```

Poll every `poll.retry_after_seconds` (default 5s) until `integration_verified: true`. Response (abridged):

```json
{
  "program_id": 42,
  "state": "integration_verified",
  "integration_verified": true,
  "blocker": null,
  "gates": {
    "profile":   { "status": "pass" },
    "economics": { "status": "pass" },
    "payout":    { "status": "pass", "mode": "stripe" },
    "tracking":  { "status": "pass", "detail": "receiving_events" },
    "live":      { "status": "pass", "test_chain": { "click": "attributed", "lead": "attributed", "sale": "attributed" } }
  },
  "last_event_at": { "click": null, "lead": null, "sale": null },
  "counts_24h": { "clicks": 0, "leads": 0, "sales": 0 },
  "poll": { "retry_after_seconds": 5 }
}
```

### 8c. Self-correct from the gates

`blocker` names the first failing gate; each failing gate carries a `next_action` string. Map it to an action:

| Gate / `next_action` | What it means | What to do |
|---|---|---|
| `profile` / `complete_program_profile` | Program profile incomplete (name, logo, webpage, category, descriptions) | Tell the founder to finish the program profile in the dashboard |
| `economics` / `set_commission_policy` | No active sale-commission policy → synthetic sale can't resolve | Founder sets a commission policy (CPS) in the dashboard |
| `payout` / `surface_stripe_connect_url` | Stripe Connect not live | Founder connects Stripe (gate `endpoint` points to the connect URL) |
| `tracking` / `install_tracker_or_send_events` | No tracker tag found AND no real/S2S events yet | Re-check §4 (client) or that your server is hitting `/api/v1/track/*` |
| `live` / `run_synthetic_sale_chain` | No real event and no attributed synthetic chain | Run §8a |

`integration_verified: true` is your **done** signal (the synthetic chain attributed and all gates pass). `state: live_verified` is even stronger — it appears once a **real** (non-test) event flows.

---

## 9. Guardrails (non-negotiable)

- **Diff, don't auto-commit.** Edits to checkout/signup/webhook code must be shown to the founder as a reviewable diff. Never auto-commit or push.
- **Never print, inline, or commit `AFFITOR_API_KEY`.** Read it from the environment. Add `.env*` to `.gitignore` if not already ignored. The key is server-side only — never ship it to a browser bundle.
- **Never hardcode the API base to prod.** Use `API_BASE` from the trigger line everywhere (client `apiBase` / `data-affitor-api-base`, server `apiUrl`).
- **Never invent fields or endpoints.** The wire contract is exactly what is in this file. The authoritative spec is `<API_BASE>/openapi.yaml`. If you need a field that is not documented, stop and ask.
- **Money is in cents.** `$49.00 = 4900`. `transaction_id` is unique per sale.

---

## 10. Anti-patterns (these silently break attribution)

- **Mismatched customer ids** — `user.id` at signup but `user.email` (or a Stripe customer id) at sale. Use the same id everywhere (§2).
- **Missing `affitor_click_id` in Stripe metadata** — the webhook can't link the payment to the click. Always set it on the Checkout Session.
- **Missing `subscription_data.metadata`** — one-time payment attributes but renewals don't, because the click id never reaches the subscription.
- **Firing the verify chain (§8) before the tracker is deployed** — readiness will report `tracking`/`live` failing and you'll chase a non-bug. Deploy first, verify last.
- **Hardcoding `https://api.affitor.com`** when the founder gave a uat/staging `API_BASE` — events land in the wrong environment.
- **Shipping the API key to the client** — `@affitor/sdk/server` and the Bearer key are server-only; the browser uses `@affitor/sdk` (no key).
- **Treating `409` (duplicate `transaction_id`) or `attributed: false` (window expired) as failures** — both are normal, expected outcomes.

---

## Endpoint quick reference

| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/v1/track/click` | POST | none (public) | Record a click (`?aff=` short code proves attribution). Usually the browser tracker, not you. |
| `/api/v1/track/lead` | POST | Bearer (server) or none (browser) | Tie `customer_key` to the click at signup |
| `/api/v1/track/sale` | POST | Bearer | Report revenue; Affitor creates the commission |
| `/api/v1/track/refund` | POST | Bearer | Reverse a commission on refund/chargeback |
| `/api/v1/cli/test-event` `{ "type": "chain" }` | POST | Bearer | Fire a synthetic click→lead→sale to verify the pipeline |
| `/api/v1/programs/me/readiness` | GET | Bearer | Poll the 5-gate verdict until `integration_verified: true` |

Full spec: `<API_BASE>/openapi.yaml`  ·  Docs: https://docs.affitor.com
