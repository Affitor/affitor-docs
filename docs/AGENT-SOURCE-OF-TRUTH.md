# Affiliate Docs v2 — Agent Source of Truth

> Purpose: define what to trust first when editing `affiliate-docs-port`.

## Core principle
This repo is a **derived documentation repo**. Public docs here do not override runtime behavior in Affitor's product repos.

When sources disagree, trust in this order:

1. **runtime code / executed config** in owning repos
2. **schema / route / contract definitions**
3. **repo-level source-of-truth docs** in owning repos
4. **public docs in this repo**

## Repo reality
- site content lives in `content/docs/`
- docs routes are served under `/docs/...`
- app code lives in `src/app/`
- docs config lives in `source.config.ts`

## Canonical sources by domain

### Tracking / attribution / lead / sale
Trust first:
- `../affiliate-cms/src/api/affiliate-tracking/controllers/v1-tracking.ts`
- `../affiliate-cms/src/api/affiliate-tracking/routes/v1-routes.ts`
- `../affiliate-cms/src/api/webhook-distributor/services/webhook-distributor.ts`
- `../affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/Details/IntegrationTracking.tsx`
- `../affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/Settings/index.tsx`

### Billing / Stripe / invoice flow / commissions
Trust first:
- `../affiliate-cms/src/api/webhook-distributor/services/webhook-distributor.ts`
- `../affiliate-cms/src/api/affiliate-commission/*`
- `../affiliate-cms/docs/AFFILIATE_PARTNER_MONEY_FLOW.md`
- `../affiliate-cms/docs/COMMISSION_STATE_MACHINE_SPECIFICATION.md`
- `../affiliate-cms/docs/affitor-pay-removal.md`

### Top-level product positioning
Trust first:
- runtime/source repos that own the behavior being described
- pricing/tracking/public wording already aligned with canonical runtime docs

## Working rules
- prefer public supported field names over legacy aliases in examples
- if runtime still accepts a legacy alias, label it as compatibility only
- do not document removed features as live behavior
- keep internal links rooted at `/docs/...`
- treat disagreement as drift to fix intentionally
- use `docs/workflow-sync-map.md` to identify which adjacent doc workflows must be updated together

## Validation baseline
At minimum:
```bash
cd /Users/sonpiaz/Affitor-main/affiliate-docs-port
npm run build
```

Then inspect:
- route/link correctness
- consistency of field naming
- agreement between docs examples and runtime contracts
- whether all affected workflows from `docs/workflow-sync-map.md` were covered
