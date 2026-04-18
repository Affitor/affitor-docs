# Workflow Sync Map

Use this map when canonical runtime behavior changes and you need to know which docs/workflows must be updated together.

---

## 1. Tracking API workflow

### If these change
- `POST /api/v1/track/click`
- `POST /api/v1/track/lead`
- `POST /api/v1/track/sale`
- request/response fields
- auth requirements
- test-mode behavior
- duplicate handling

### Sync these docs
- `content/docs/advertisers/tracking/quickstart-integration.mdx`
- `content/docs/advertisers/tracking/lead-tracking-signup.mdx`
- `content/docs/advertisers/tracking/payment-tracking-stripe.mdx`
- `content/docs/advertisers/tracking/testing-integration.mdx`
- `content/docs/advertisers/tracking/tracking-overview.mdx`
- `content/docs/advertisers/tracking/payment-flow.mdx`

### Also sync
- dashboard integration snippets in `affiliate-dashboard`
- `docs/docs-drift-checklist.md` if the review surface changes

---

## 2. Tracker / client-side integration workflow

### If these change
- tracker script install
- `AffitorProvider`
- `loadAffitor()`
- `signup(customerKey, email)` behavior
- cookie behavior
- debug mode behavior

### Sync these docs
- `content/docs/advertisers/tracking/pageview-tracker-click.mdx`
- `content/docs/advertisers/tracking/lead-tracking-signup.mdx`
- `content/docs/advertisers/tracking/testing-integration.mdx`
- `content/docs/advertisers/tracking/quickstart-integration.mdx`
- `content/docs/advertisers/quickstart/setup-program.mdx`

### Also sync
- dashboard code examples in `affiliate-dashboard`

---

## 3. Stripe metadata / webhook workflow

### If these change
- required Stripe metadata fields
- one-time vs subscription handling
- `subscription_data.metadata` requirements
- webhook event usage
- attribution lookup order
- Bill Flow wording

### Sync these docs
- `content/docs/advertisers/tracking/payment-tracking-stripe.mdx`
- `content/docs/advertisers/tracking/payment-flow.mdx`
- `content/docs/advertisers/tracking/quickstart-integration.mdx`
- `content/docs/advertisers/tracking/testing-integration.mdx`
- `content/docs/advertisers/tracking/tracking-overview.mdx`
- `content/docs/advertisers/quickstart/setup-program.mdx`
- `content/docs/faq/index.mdx`

### Also sync
- dashboard Stripe snippets in `affiliate-dashboard`
- top-level pricing/how-it-works wording if Bill Flow meaning changes

---

## 4. Pricing / billing / invoice workflow

### If these change
- platform fee wording
- invoice timing
- Bill Flow commercial model
- merchant-of-record wording
- advertiser billing responsibilities

### Sync these docs
- `content/docs/getting-started/pricing-performance-model.mdx`
- `content/docs/getting-started/what-is-affitor.mdx`
- `content/docs/getting-started/how-it-works.mdx`
- `content/docs/getting-started/glossary.mdx`
- `content/docs/faq/index.mdx`
- `content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`
- `content/docs/advertisers/tracking/payment-tracking-stripe.mdx`
- `content/docs/advertisers/tracking/payment-flow.mdx`

---

## 5. Commission / payout workflow

### If these change
- hold period wording
- approval/review flow
- withdrawable balance wording
- payout methods
- payout schedule
- refund handling

### Sync these docs
- `content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`
- `content/docs/advertisers/quickstart/payouts.mdx`
- `content/docs/getting-started/how-it-works.mdx`
- `content/docs/getting-started/glossary.mdx`
- `content/docs/faq/index.mdx`
- `content/docs/getting-started/pricing-performance-model.mdx`

---

## 6. Homepage / top-level product messaging workflow

### If these change
- supported product capabilities
- positioning of tracking/payment model
- major feature removal/reintroduction
- audience/best-fit claims

### Sync these docs
- `content/docs/index.mdx`
- `content/docs/getting-started/what-is-affitor.mdx`
- `content/docs/getting-started/how-it-works.mdx`
- `content/docs/getting-started/pricing-performance-model.mdx`
- `content/docs/getting-started/glossary.mdx`
- `content/docs/faq/index.mdx`

---

## 7. Quickstart onboarding workflow

### If these change
- setup wizard steps
- advertiser onboarding order
- integration sequencing
- required program setup inputs

### Sync these docs
- `content/docs/advertisers/quickstart/create-account.mdx`
- `content/docs/advertisers/quickstart/setup-program.mdx`
- `content/docs/advertisers/quickstart/define-commission.mdx`
- `content/docs/advertisers/quickstart/commission-approval-cash-flow.mdx`
- `content/docs/advertisers/quickstart/payouts.mdx`
- `content/docs/advertisers/quickstart/view-performance.mdx`

---

## 8. Dashboard snippet workflow

### If these change
- code examples shown inside dashboard
- integration labels/step names
- testing instructions in product UI

### Sync these code surfaces
- `affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/Details/IntegrationTracking.tsx`
- `affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/Settings/index.tsx`

### Also verify against
- `affiliate-cms/src/api/affiliate-tracking/controllers/v1-tracking.ts`
- `affiliate-cms/src/api/webhook-distributor/services/webhook-distributor.ts`
- public docs pages in `content/docs/advertisers/tracking/*`

---

## 9. Repo guidance / contributor workflow

### If these change
- docs repo ownership
- source-of-truth rules
- route structure
- deploy repo / Vercel target

### Sync these files
- `CLAUDE.md`
- `docs/AGENT-SOURCE-OF-TRUTH.md`
- `docs/docs-drift-checklist.md`
- this file: `docs/workflow-sync-map.md`

---

## Fast lookup

### Change: lead API field names
Sync:
- lead docs
- quickstart integration
- testing integration
- tracking overview
- dashboard lead snippets

### Change: Stripe metadata fields
Sync:
- payment tracking
- payment flow
- quickstart integration
- setup program
- testing integration
- FAQ
- dashboard Stripe snippets

### Change: pricing / invoice wording
Sync:
- pricing
- what is affitor
- how it works
- FAQ
- commission approval & cash flow
- payment tracking/payment flow

### Change: payout workflow wording
Sync:
- payouts
- commission approval & cash flow
- glossary
- FAQ
- how it works

### Change: docs route structure
Sync:
- internal links across `content/docs/`
- header/nav CTA links
- `CLAUDE.md`
- `docs/AGENT-SOURCE-OF-TRUTH.md`

---

## Minimum process

When a change lands in runtime:
1. identify the owning canonical runtime files
2. identify which workflow above is affected
3. update all listed docs/pages together
4. check dashboard snippets if examples are exposed there
5. run docs build
6. note the canonicals used in handoff
