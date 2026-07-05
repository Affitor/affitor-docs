# FACTS — Agent Commerce (grounding for the Affitor vision page)

> Fact sheet for writing Affitor's "agent commerce" vision page.
> Every claim below is traceable to a file, a live URL, or a cited external source.
> Rule #1 for the writer: **never present a VISION item as shipped.** The page's credibility
> is the product — Affitor's whole pitch to agents is verifiability.
>
> Compiled: 2026-07-05. Live-URL checks performed same day.
> Fact-check pass 2026-07-05: the six highest-impact claims re-verified against their cited
> sources (CLI/MCP package.json + src, mcp.mdx, registry.json, skill.md/llms.txt live,
> openaffiliate.dev API live, affitor-context.md pricing, §3 external stats). Two unsourced
> §3 phrasings corrected; originals moved to §7 Unverified.
> Second verification pass 2026-07-05 (independent re-check of the same six claim sets):
> all confirmed against sources — CLI v0.4.1 (package.json + src/commands + lib + tests),
> MCP v0.2.0 with exactly 7 registered tools (src/index.ts matches mcp.mdx table),
> skill.md + llms.txt HTTP 200 live, registry.json 52 skills / 8 stages, openaffiliate.dev
> API live (Framer 50% recurring / 12 mo / 90-day cookie / payout fields present),
> pricing at affitor-context.md:9, and §3 externals re-fetched (eMarketer $20.57B / 1.5% /
> McKinsey $3–5T verbatim; ACP Sep 29 2025, AP2 Sep 16 2025 + FIDO Apr 28 2026, UCP
> Jan 11 2026 all verbatim in DigitalApplied). Two misquotes fixed in place: §1.2 drift
> quote had an extra leading "so"; §3 stack quote said "protocols" where the source says
> "standards". Nothing new moved to §7.

---

## 1. SHIPPED — what Affitor already gives agents today

All items in this section exist in the repos and/or are live in production. Beta caveat:
docs label `@affitor/mcp` and `@affitor/sdk` as **Beta** ("the documented happy-path works")
— keep that framing (`affitor-docs/content/docs/api-reference/mcp.mdx:10-12`).

### 1.1 The `affitor` CLI — agent-operable by design
- Package `affitor` v0.4.1, bin `affitor`, MIT, keywords include `agent`, `ai`
  (`affiliate-cli/packages/cli/package.json`).
- Global agent-mode flags on every command: `--json`, `--no-interactive`, `--auto-confirm`,
  `--quiet`, `--api-key`, `--api-url` (`affitor-docs/content/docs/brand/cli/commands.mdx`).
- Commands implemented in source: `login`, `logout`, `whoami`, `init`, `onboard`,
  `setup stripe` (Connect OAuth), `status`, `test`, `programs`
  (`affiliate-cli/packages/cli/src/commands/*.ts`).
- `npx affitor onboard` = one-shot **detect stack → install → inject → verify** — "the CLI
  equivalent of the MCP flow" (`api-reference/mcp.mdx:147`). Stack/webhook detection and code
  injection are real modules with tests (`src/lib/stack-detect.ts`, `src/lib/webhook-detect.ts`,
  `src/lib/inject.ts`; `tests/inject-stripe-tracksale.test.ts`, `tests/onboard-verify.test.ts`).

### 1.2 The MCP server — `@affitor/mcp`
- v0.2.0, stdio MCP server, bin `affitor-mcp`, runs via `npx -y @affitor/mcp` with
  `AFFITOR_API_KEY` (`affiliate-cli/packages/mcp/package.json`; `api-reference/mcp.mdx:20-34`).
- **Seven tools** (`api-reference/mcp.mdx:55-63`): `affitor_readiness`, `affitor_track_click`,
  `affitor_track_lead`, `affitor_track_sale`, `affitor_track_refund`,
  `affitor_get_integration_plan`, `affitor_run_verification`.
- `affitor_get_integration_plan` is a **pure** tool reading the canonical recipe registry
  (`@affitor/recipes`, `affiliate-cli/packages/recipes/`) — CLI, MCP, and public guides all read
  the same registry — "the integration contract can never drift between surfaces"
  (`api-reference/mcp.mdx:100-119`; exact quote verified, the sentence does not start with "so").
- `affitor_run_verification` fires a **synthetic click → lead → sale chain through the real
  attribution pipeline** (isolated `is_test` rows, no real commissions), then the agent polls
  `affitor_readiness` until `integration_verified: true`. Rate-limited 10 runs/program/hour
  with `retry_after_seconds` backoff (`api-reference/mcp.mdx:124-136`).

### 1.3 Agent instruction surfaces (retrieval + runbook layer)
- `npx affitor init` writes `.affitor/AGENTS.md` + `.affitor/skills.md` (identical content,
  two filename conventions) pre-populated with live program values, ready-to-paste snippets,
  an identifier-consistency table, and CLI/API references; secrets go to `.affitor/.env`,
  auto-gitignored (`affitor-docs/content/docs/api-reference/agent-integration.mdx`).
- Works with Claude Code, Cursor, Copilot, Windsurf, Aider (same file, lines 149-157).
- **`https://docs.affitor.com/skill.md` — live, HTTP 200 (verified 2026-07-05).** A
  self-contained integration runbook: inputs from a trigger line, never invent fields not in
  the OpenAPI spec (`<api_base>/openapi.yaml`), never print the key
  (source: `affitor-docs/public/skill.md`).
- **`https://docs.affitor.com/llms.txt` — live, HTTP 200 (verified 2026-07-05)**, and it points
  agents at skill.md as the integration entry point (`affitor-docs/public/llms.txt`).
- Note: the June 12 audit (`PLAN-AGENT-DEFAULT-90D.md`) listed prod skill.md as 404 — that gap
  is now closed. Do not reuse stale "broken" claims from that plan without rechecking.

### 1.4 Self-verification — the differentiating primitive
- Readiness API: 5-gate verdict + `blocker` + `next_action`; agent loop = run verification →
  read blocker → self-correct → repeat (`api-reference/mcp.mdx:57,126-132`).
- Positioning line that survived adversarial critique: **"the only affiliate platform an agent
  can integrate AND verify end-to-end"** (`PLAN-AGENT-DEFAULT-90D.md` §0). Safe to use.

### 1.5 The affiliate-side toolkit — `affiliate-skills`
- **52 skills across 8 stages** (research, content, blog, landing, distribution, analytics,
  automation, meta) with a machine-readable `registry.json` (version/stages/skills keys,
  52 entries verified) (`affiliate-skills/README.md`, `affiliate-skills/registry.json`).
- Install: `npx skills add Affitor/affiliate-skills`; works with Claude Code, Cursor, Windsurf,
  ChatGPT, Gemini CLI, "any AI that reads text" (`affiliate-skills/README.md`).
- Example skills: affiliate-program-search, commission-calculator, competitor-spy,
  traffic-analyzer, trending-content-scout, submit-program (`registry.json`).

### 1.6 The open program directory — openaffiliate.dev
- **Live public API (verified 2026-07-05):** `GET https://openaffiliate.dev/api/programs?q=...`
  returns structured program data — commission type/rate/duration, cookie days, payout minimum
  and methods (live response includes e.g. Framer, 50% recurring 12 months, 90-day cookie).
- The skills README's "try it now" demo is an agent querying this API with zero install
  (`affiliate-skills/README.md`).
- Per the 90-day plan: `openaffiliate-mcp` was the **only affiliate-category entry in the
  official MCP registry** (added 2026-04-18) — call it a talking point, **not a moat** (the
  registry is uncurated) (`PLAN-AGENT-DEFAULT-90D.md` §0). Recheck before publishing.

### 1.7 Core platform (context, all shipped)
- AI-native affiliate platform for SaaS; pricing **3.5% of partner-generated revenue, $10K
  free tier** — verified vs market in the plan: Rewardful $49/mo floor, Tolt $59/mo,
  Dub $75/mo+, "no free tier anywhere" (`affitor-context.md:9`; `PLAN-AGENT-DEFAULT-90D.md`).
- Tracking: ref link → cookie → click/lead/sale events; Stripe Checkout → webhook →
  commission hold → Stripe Connect payout (`affitor-context.md:35-37`).
- Amounts always integer cents; `invoiceId`/`transaction_id` is the idempotency key; the same
  `customer_key` must be used at lead time and sale time (`agent-integration.mdx:163-169`).

---

## 2. SPECIFIED but NOT shipped (label as roadmap if mentioned at all)

- **VSAL — Verifiable Signup Attribution Log** (`verifiable-attribution/SPEC-ATTRIBUTION-LOG.md`,
  Draft v0.2, 2026-06-10): a neutral, cryptographically verifiable, cross-network attribution
  standard, **anchored at signup**. Every touchpoint is a signed claim; the winner is a public
  deterministic function; Certificate-Transparency-style operator model ("operator ≠ trusted
  party"). Explicit non-goals: no blockchain settlement, no payment rails — "VSAL decides who
  is owed, once, provably." This is the intellectual backbone of the vision page's settlement
  story — but it is a **draft spec + in-browser verifier demo**, not a product.
- **1-shot agent onboarding to the PostHog bar** (`SPEC-AGENT-FIRST-ONBOARDING.md`): gap-closure
  spec ("~80% of machinery ships today"). Core lesson from the real Echoly integration failure:
  **make the correct path the only expressible path** — when an agent *can* hand-roll an
  endpoint, some agent eventually hand-rolls the wrong one.

---

## 3. Industry context — "agentic commerce" discourse (2025–2026)

Use to frame the vision, not as Affitor claims. Headline stats and protocol dates below were
fact-checked against the cited sources on 2026-07-05; still re-verify at publish time.

- **The protocol stack materialized in ~12 months** (dates re-verified vs the DigitalApplied
  UCP/ACP/AP2 guide, 2026-07-05). ACP (Agentic Commerce Protocol) — OpenAI + Stripe, launched
  Sep 29 2025, payment execution inside AI surfaces. AP2 (Agent Payments Protocol) — Google,
  Sep 16 2025, donated to the FIDO Alliance Apr 28 2026: cryptographically signed mandates
  proving *who authorized* a purchase. UCP (Universal Commerce Protocol) — announced Jan 11
  2026 at NRF, backed by Google/Shopify/Etsy/Wayfair/Target/Walmart: discovery → post-purchase,
  incl. a `.well-known/ucp` merchant endpoint. Source quote (verbatim): "The standards are
  designed to stack, not to replace one another."
- **Scale claims (re-verified vs the eMarketer FAQ source, 2026-07-05):** AI platforms will
  account for 1.5% of US retail ecommerce in 2026 — $20.57B, "nearly quadruple 2025 figures" —
  per a December 2025 EMARKETER forecast; McKinsey projects $3–5T global agentic commerce by
  2030, "with up to $1 trillion in US B2C retail alone."
- **The attribution-collapse problem** is the discourse's open wound: in agent-mediated
  commerce, discovery/consideration happen inside the chat, agents bypass browser-based
  tracking, and "the entire purchase funnel collapses to a single interaction." Coverage calls
  server-side tracking "the only reliable solution" and puts full attribution maturity
  18–24 months out (all quotes: DigitalApplied attribution guide, re-verified 2026-07-05).
- **Where Affitor plugs in:** the protocols above solve *checkout* (who pays, who authorized).
  None of them solve *referral economics* — who gets paid for causing the sale. Signup-anchored,
  server-side, verifiable attribution is exactly the missing layer. That is the page's thesis.

Sources: [Bitontree — AP2, x402 and AI payments](https://www.bitontree.com/agentic-commerce-ai-agents-payments-ap2-x402) ·
[DigitalApplied — UCP vs ACP vs AP2](https://www.digitalapplied.com/blog/agentic-commerce-standards-ucp-acp-ap2-2026-merchant-guide) ·
[DigitalApplied — agent commerce revenue attribution](https://www.digitalapplied.com/blog/ai-agent-commerce-revenue-attribution-guide-2026) ·
[MetaRouter — agentic commerce trends/statistics](https://www.metarouter.io/post/agentic-commerce-trends-statistics) ·
[eMarketer — agentic commerce FAQ](https://www.emarketer.com/content/faq-on-agentic-commerce-how-brands-should-act-now-compete-ai-driven-landscape) ·
[Paz.ai — ACP glossary](https://www.paz.ai/glossary/agentic-commerce-protocol-acp)

---

## 4. The honest vision narrative (the page's spine)

The affiliate loop has five verbs: **discover → join → promote → attribute → settle.**
Affitor's claim is not "agents will do commerce someday" — it is that each verb is becoming an
API call, and Affitor has already shipped the hard middle of the loop:

1. **Discover** — SHIPPED for programs (openaffiliate.dev API; program-search skill). An agent
   can query commissions, cookie windows, payout terms as structured JSON today.
2. **Join** — PARTIAL. Merchants create programs via `affitor init`; affiliate-side
   programmatic join/apply is not an agent API yet. (VISION where not shipped.)
3. **Promote** — SHIPPED as tooling (52 skills: research → content → landing → distribution),
   VISION as autonomy (a standing agent running the flywheel unattended).
4. **Attribute** — SHIPPED and differentiated: signup-anchored server-side tracking + the
   synthetic verification chain. The only loop where the agent *proves* tracking works
   (`integration_verified: true`) instead of hoping.
5. **Settle** — SHIPPED as rails (commission hold → Stripe Connect payout); VISION as
   *verifiable* settlement (VSAL: signed claims, deterministic winner, cross-network dedup).

One-line thesis candidate: *"Agentic commerce standards decide how an agent pays.
Affitor decides who earned the commission — and lets the agent prove it."*

---

## 5. Five concrete near-future scenarios (VISION — each grounded in a shipped primitive)

1. **"Add an affiliate program to my SaaS" — one prompt, zero questions.** A founder says the
   sentence; the coding agent runs `npx affitor onboard` (or the MCP flow), injects tracking,
   fires the synthetic chain, and reports `integration_verified: true` with the readiness
   verdict as receipts. *Grounded in:* onboard command, recipes registry, readiness API
   (§1.1, §1.4). *Gap:* 1-shot reliability spec still closing (§2).
2. **The agent-run affiliate micro-business.** A creator's agent queries openaffiliate.dev for
   programs matching its niche, scores them (commission-calculator, traffic-analyzer), writes
   the comparison post (content skills), deploys the landing page, and watches conversions —
   a weekly human review is the only human touch. *Grounded in:* §1.5, §1.6. *Gap:*
   programmatic join/apply, autonomous scheduling.
3. **Agent-to-agent recruiting.** A merchant's growth agent publishes its program to the open
   directory; creator agents discover it via the same API and negotiate nothing — the terms
   are machine-readable (rate, cookie days, payout minimum). Matching becomes a query, not a
   cold email. *Grounded in:* live directory API returning exactly those fields (§1.6).
4. **Referrals inside AI answers.** When assistants recommend products in-chat, last-click
   cookies are dead (the attribution-collapse problem, §3). Signup-anchored attribution —
   the referred *user registering* — survives the chat-to-checkout jump. The agent that made
   the recommendation gets credited on signup, not on a click that never happened.
   *Grounded in:* signup-anchored tracking (§1.7), VSAL anchoring rationale (§2).
5. **Provable settlement across networks.** Two networks claim the same customer. Instead of
   the brand arbitrating blindly, both submit signed claims to an append-only log; a public
   deterministic function picks the winner; anyone can audit without seeing PII. Commissions
   settle from proof, not trust. *Grounded in:* VSAL spec §0-§1 (§2 — DRAFT, say so).

---

## 6. Writer's rules (non-negotiable)

- **Label every section SHIPPED / BETA / VISION.** The mcp.mdx Beta note is the house style.
- **Never claim "Dub = click-anchored / last-click cookie."** Dub is signup-anchored
  (dub.co/docs/concepts/attribution). Honest vs-Dub rows: no free tier; closed single-network
  silo; no cryptographic verifiability; static-key MCP auth; MCP covers ops, not setup
  (`PLAN-AGENT-DEFAULT-90D.md` §0 — critical correction, pre-publication audit required).
- Safe repeatable facts: "$0 until $10K revenue, then 3.5%" and "integrate AND verify
  end-to-end" (§1.4, §1.7).
- Amounts in integer cents; idempotency by invoice/transaction id; same `customer_key` at
  lead and sale — if the page shows code, it follows these (`agent-integration.mdx:163-169`).
- External market stats (§3) are secondary-source; re-verify numbers before the page ships.
- Trust is one-shot with agents: "an agent that fails its first integration never defaults to
  you again" (`PLAN-AGENT-DEFAULT-90D.md`) — good closing beat, and the reason the honest
  SHIPPED/VISION split *is* the marketing.

---

## 7. Unverified (removed from sections above — do not publish without a new source)

Moved here during the 2026-07-05 fact-check pass. Each was checked against every §3 cited
source and found in none of them.

- **"Server-side tracking is non-negotiable" (as a quote).** No cited source uses the word
  "non-negotiable." Sourced alternatives now used in §3: DigitalApplied calls server-side
  tracking "the only reliable solution"; MetaRouter notes AI agents "do not trigger
  client-side JavaScript."
- **"The merchant's data stream starts at add-to-cart."** Not found in any cited source.
  The closest sourced framing (now in §3): "the entire purchase funnel collapses to a single
  interaction" and agents bypass browser-based tracking (DigitalApplied attribution guide).
  Re-add the add-to-cart formulation only with a direct citation.
