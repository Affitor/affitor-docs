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
- docs pages are served under **`/docs`** and published at `https://affitor.com/docs/...` (the dashboard rewrites `/docs/*` and `/blog/*` to this app's Vercel alias, multi-zone): `content/docs/api-reference/errors.mdx` is `https://affitor.com/docs/api-reference/errors`, its twin is `.../errors.md`. The blog stays at `https://affitor.com/blog`
- `docs.affitor.com` (`src/middleware.ts`): blog pages always 301 to `affitor.com/blog/<path>`. Docs pages 301 (or 302) to `affitor.com/docs/<path>` only when the Vercel env `DOCS_HOST_REDIRECT` is `301` or `302`; unset, they are served in place from `/docs<path>`. Files that moved under `/docs` (`.md` twins, `skill.md`, `llms*.txt`, `openapi.yaml`, logo, favicons, `images/`, `changelog/` screenshots) are always served there in place with a canonical `Link` header; `/_next/*` keeps loading from it (`assetPrefix`). Renamed pages (`advertisers`→`brand`, `errors`, `/docs/blog`→`/blog`, ...) live in `RENAMES` in the middleware, not in next.config. `scripts/check-docs-host.mjs` (unit) and `scripts/check-docs-host-http.mjs` (real router, every mode) pin this
- static files live in `public/docs/` and are served at `/docs/...` (for example `public/docs/brand/dashboard.png` is `/docs/brand/dashboard.png`); chrome assets (logo, favicons), `skill.md`, `llms.txt` and `openapi.yaml` live there too, because `affitor.com/<file>` belongs to the dashboard
- app/router code lives in `src/app/`
- Fumadocs config lives in `source.config.ts`
- workflow sync guidance lives in `docs/workflow-sync-map.md`

## Rules
1. **Runtime-first docs** — never invent behavior to fill gaps
2. **Prefer public supported paths** — mention legacy aliases only as compatibility notes when runtime still accepts them
3. **Keep pathing correct** — link docs pages under `/docs` (`/docs/api-reference/track-click`) and blog posts under `/blog`; a bare root link (`/brand/...`) resolves to the dashboard on affitor.com. Reference files by where they sit in `public/`, so `public/docs/brand/x.png` is linked as `/docs/brand/x.png`. `scripts/check-agent-surface.mjs` fails the build if a page link is not a real `/docs` page or a `/blog` link, or a file reference is missing from `public/` or swallowed by a redirect
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
