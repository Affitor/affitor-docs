# SDD — Docs Phase 2: Content Accuracy & IA

> Phase 1 (DONE, shipped) = UI/UX/layout/components (Linear+Mintlify). Phase 2 = make every word TRUE to the shipped product, fix navigation, polish, delete dead text.

## Goal
`docs.affitor.com` should describe **what the code actually does** — verified endpoint by endpoint, command by command, field by field — then reorganized and polished. No invented behavior, no stale "coming soon", no removed features.

## Why now
Phase-1 carried the existing content as-is; it was never verified against runtime. Per repo `CLAUDE.md`, **docs are derived — runtime code is canonical**. So content is the biggest remaining risk.

## Canonical sources (the truth)
| Domain | Source of truth |
|---|---|
| Tracking / attribution | `affiliate-cms/src/api/affiliate-tracking/*`, `webhook-distributor/*` |
| Sale / Lead API contracts | cms tracking endpoints (verify paths, payload fields) |
| Stripe metadata + webhook events | cms webhook-distributor + `docs/autocapture-stripe-wiring-spec.md` |
| Dashboard behavior | `affiliate-dashboard/src/containers/AffiliateManagement/Advertiser/*` |
| CLI (`npx affitor …`) | `affiliate-cli` (⚠️ CLI onboarding is being redesigned — some CLI docs may be aspirational; coordinate) |
| Commission / payout lifecycle | cms commission/payout APIs + cron jobs |
| Pricing (3.5%, $10K threshold) | current public pricing / dashboard billing |

## Phases

### P2.0 — Audit / gap analysis (workflow, parallel, read-only)
One agent per docs domain: extract EVERY factual claim (endpoint, field, default, flag, behavior) → verify against canonical runtime → tag **CORRECT / WRONG / DEAD / UNVERIFIABLE** with the source file:line. Deliverable = a gap report the owner approves before any rewrite.

**Known suspects to verify first:**
- CLI commands/flags (`affitor init/setup stripe/setup dns/status/test`) — do they exist + match? (CLI is mid-redesign)
- **DNS CNAME tracking** marked "coming soon" → dead text? remove or clearly gate.
- **Affitor Pay** — removed; ensure zero references survive.
- Field-name consistency: `customerKey` / `customer_key` / `affitor_customer_key`.
- Sale API path (`POST /api/v1/track/sale`?) + Lead API payload.
- Commission types (`percent/fixed/recurring_percent/recurring_fixed`) + defaults (rate 40, cookie 90, duration 12).
- Stripe metadata field list + webhook events list.
- Attribution: last-click, 60-day window default — verify.
- Pricing claims (3.5% fee, $10K fee-free threshold).

### P2.1 — IA / menu restructure
- Re-group sidebar/tabs around the *verified* content. Candidate tabs: **Getting Started · Tracking · Commissions & Payouts · Billing · API Reference · Support**.
- Add a real **API Reference** section (Sale/Lead API request/response) — like Dub/Kyma — if the contracts are stable.
- Fix sidebar section labels + ordering; remove orphan/empty pages.

### P2.2 — Content rewrite (per page, from verified data)
- Rewrite each page to match runtime; polish for clarity (short, scannable, task-first).
- Apply Phase-1 components: `<Flow>`, `<FeatureCards>`, `<Checklist>`, clean tables, dark code, sequence diagrams.
- **Delete dead text** flagged in P2.0.

### P2.3 — Verify & ship (per domain)
- Each rewritten domain: re-read canonical source → build → screenshot → PR per domain (small, reviewable). Light owner review per PR.

## Orchestration
1. Run **P2.0 audit workflow** (parallel agents over docs domains, grounded in the runtime repos) → gap report.
2. **Owner reviews** the gap report → decides keep/rewrite/delete per claim.
3. **P2.1 IA** proposal (mockup the new sidebar/tabs) → approve.
4. **P2.2 rewrite** domain-by-domain (workflow per domain) → ship via P2.3.

## Guardrails (repo CLAUDE.md)
- Runtime-first: never invent behavior; read source first for high-risk domains (tracking, sale/lead contracts, Stripe metadata, invoice/billing, commission/payout, auth/keys).
- Do not revive removed features (Affitor Pay).
- Conservative wording where canonicals are ambiguous; note the dependency.
- `npm run build` after each meaningful change.

## Effort
- P2.0 audit: ~1 workflow run (parallel) + owner review.
- P2.1 IA: ~0.5 day + approval.
- P2.2 rewrite: scales with # of WRONG/DEAD claims — likely 2–4 domain PRs.

## Out of scope (Phase 1, done)
Visual system, layout, components, top-bar/footer, table/code UI, root-landing, Mintlify nav — all shipped.
