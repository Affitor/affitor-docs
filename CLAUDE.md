# Affiliate Docs v2 — Claude Rules

## Repo role
This repo owns the current docs v2 / Fumadocs site for public Affitor documentation.

It is a **derived docs repo**:
- it documents canonical behavior owned by runtime repos
- it does **not** define CMS/dashboard tracking or payment behavior by itself

## Read first for behavior changes
Before editing docs content about product behavior, read in this order:
1. `../affitor-context.md`
2. `../docs/AGENT-SOURCE-OF-TRUTH.md`
3. `docs/AGENT-SOURCE-OF-TRUTH.md`
4. canonical runtime/source repos for the affected domain

## Canonical source rule
When docs conflict with runtime repos, trust:
1. runtime code / executed config
2. schema / contract definitions
3. repo-level source-of-truth docs in the runtime repo
4. public docs in this repo

For tracking / attribution / billing docs, the primary sources are usually:
- `../affiliate-cms/src/api/affiliate-tracking/*`
- `../affiliate-cms/src/api/webhook-distributor/*`
- `../affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/*`

## Current docs structure
- content lives in `content/docs/`
- docs app routes are served at the **root**, with no `/docs` prefix: `content/docs/api-reference/errors.mdx` is `https://docs.affitor.com/api-reference/errors`. a permanent page redirect under `/docs` keeps old links alive, for both HTML and the `.md` twins (measured 2026-09-20: `/api-reference/errors` 200, `/docs/api-reference/errors` 308, `/docs/api-reference/errors.md` 308)
- static files are the exception — they really do live under `/docs`, because they sit in `public/docs/` (for example `public/docs/brand/dashboard.png` is served at `/docs/brand/dashboard.png`)
- app/router code lives in `src/app/`
- Fumadocs config lives in `source.config.ts`
- workflow sync guidance lives in `docs/workflow-sync-map.md`

## Rules
1. **Runtime-first docs** — never invent behavior to fill gaps
2. **Prefer public supported paths** — mention legacy aliases only as compatibility notes when runtime still accepts them
3. **Keep pathing correct** — link pages at the root (`/api-reference/track-click`), not `/docs/...`, which only redirects. Reference files by where they sit in `public/`, so `public/docs/brand/x.png` is linked as `/docs/brand/x.png`. `scripts/check-agent-surface.mjs` fails the build if a file reference is missing from `public/` or is swallowed by a redirect
4. **Do not revive removed features** — Affitor Pay is removed unless explicitly reintroduced in canonical runtime/docs
5. **Avoid unsupported certainty** — if payout timing or business wording is ambiguous across canonicals, use conservative wording and note the dependency
6. **Keep docs self-serve** — optimize for advertisers and agents implementing integrations without support calls
7. **Build after meaningful docs changes** — run `npm run build`

## High-risk domains
Treat these topics as high-risk even in docs-only changes:
- tracking / attribution
- sale and lead API contracts
- Stripe metadata requirements
- invoice / billing wording
- commissions / payout lifecycle
- auth / API keys

For these, read runtime code first and capture the source files used.

## Validation
At minimum for meaningful docs changes:
```bash
cd /Users/sonpiaz/Affitor-main/affiliate-docs-port
npm run build
```

Also manually inspect:
- internal link correctness
- naming consistency (`customerKey`, `customer_key`, `affitor_customer_key`)
- supported integration paths
- whether adjacent workflows in `docs/workflow-sync-map.md` also need syncing
