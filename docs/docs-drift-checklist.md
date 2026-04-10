# Docs Drift Checklist

Use this checklist whenever canonical behavior changes in CMS or dashboard repos.

See also: [Workflow Sync Map](./workflow-sync-map.md) for the grouped workflows and file sets that should move together.

## 1. Tracking contract changes
If any of these change:
- `/api/v1/track/click`
- `/api/v1/track/lead`
- `/api/v1/track/sale`
- tracker script / signup helper behavior

Then review:
- `content/docs/advertisers/tracking/quickstart-integration.mdx`
- `content/docs/advertisers/tracking/lead-tracking-signup.mdx`
- `content/docs/advertisers/tracking/tracking-overview.mdx`
- `content/docs/advertisers/tracking/testing-integration.mdx`
- `content/docs/advertisers/tracking/payment-flow.mdx`

## 2. Stripe metadata / webhook flow changes
If any of these change:
- required Stripe metadata fields
- lookup chain in webhook attribution
- one-time vs subscription handling
- test mode expectations

Then review:
- `content/docs/advertisers/tracking/payment-tracking-stripe.mdx`
- `content/docs/advertisers/tracking/payment-flow.mdx`
- `content/docs/advertisers/tracking/testing-integration.mdx`
- `content/docs/faq/index.mdx`

## 3. Billing / invoice / payout wording changes
If any of these change:
- Bill Flow wording
- invoice timing/collection model
- partner payout operations
- hold/review lifecycle exposed publicly

Then review:
- `content/docs/getting-started/pricing-performance-model.mdx`
- `content/docs/getting-started/how-it-works.mdx`
- `content/docs/getting-started/what-is-affitor.mdx`
- `content/docs/faq/index.mdx`
- relevant quickstart cash-flow docs

## 4. Removed / added product capabilities
If a capability is removed or reintroduced (example: Affitor Pay), review:
- tracking docs
- glossary / FAQ
- pricing / how-it-works / homepage copy
- dashboard-linked guides

## 5. Naming changes
If field names or public terms change, check consistency across:
- `customerKey`
- `customer_key`
- `affitor_customer_key`
- `click_id`
- `affitor_click_id`
- `program_id`
- `transaction_id`

## 6. Route/path changes in docs v2
If docs IA or route serving changes, verify:
- all internal links resolve under `/docs/...`
- header/CTA links still point to valid docs pages
- build completes without broken generated paths

## 7. Validation before merge
- run `npm run build`
- inspect the highest-risk edited pages manually
- note which runtime files were treated as canonical
- if dashboard snippets drift from runtime, document the drift explicitly

## 8. Workflow grouping check
Before merging, confirm whether the change also requires updates in:
- tracking API workflow
- tracker/client integration workflow
- Stripe metadata/webhook workflow
- pricing/billing workflow
- commission/payout workflow
- homepage/quickstart workflow

Reference: [Workflow Sync Map](./workflow-sync-map.md)
