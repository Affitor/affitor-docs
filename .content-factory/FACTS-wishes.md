# FACTS — Son's stated wishes/ideas mined from old context files (never-shipped or under-used)

Mined 2026-07-05 from `/Users/sonpiaz/Affitor-main` (affitor-context.md, AGENTS.md, docs/, root *.md, specs/SDDs).
Every item carries its source path. Sections split into **FOUND** (with quote) and **NOT-FOUND**.
Fact-checked 2026-07-05: highest-impact claims re-read against cited sources — quotes/line numbers confirmed;
3 precision fixes applied (§4 STEP-not-bracket fee caveat, §4 Dub-floor source conflict, §6 MCP guardrail scope).
Second verify pass 2026-07-05: 6 most consequential claims re-checked against sources, incl. code-level read of
`affiliate-fee.ts` — all 6 CONFIRMED (no wrong claims found); 2 precision additions (§4 crossing-sale-is-free fee
nuance from code; §4 third conflicting Dub Advanced figure $250 in `PLAN-AGENT-DEFAULT-90D.md` §0 vs teardown $300).

---

## 1. The name "Affitor" — meaning / origin

**NOT-FOUND.** No file in the workspace explains the name. Searched: `portmanteau`, `stands for`, `why the name`,
`name origin`, `named it`, `đặt tên`, brand-story/about/mission phrasing across all root *.md, docs/, _overnight-2026-06-12/,
affiliate-docs, affiliate-dashboard. Zero hits. The only "about" artifacts are program-page generators
(`affiliate-dashboard/src/utils/programAbout.ts`, `.../api/affiliate-programs/generate-about.ts`) — about *customer programs*, not the brand.
- Closest official self-description (not an etymology): "Affitor is an AI-native affiliate marketing platform for SaaS companies."
  — `affitor-context.md:7`
- If content needs an origin story, it must come from Son directly. Any "Affiliate + -tor / attribution" reading is **inference, not fact**.

---

## 2. Positioning statements — FOUND

- **Canonical one-liner:** "AI-native, agent-completable affiliate / partner-tracking / link-attribution platform for SaaS.
  Pricing: $0 until $10k cumulative affiliate revenue, then 3.5%. Attribution: signup-anchored, heading toward
  third-party-verifiable (VSAL)." — `docs/competitors/README.md:7`
- **North star:** "when a user asks a coding agent 'add an affiliate program to my SaaS,' the agent scaffolds Affitor —
  and can *prove* the integration works." — `PLAN-AGENT-DEFAULT-90D.md` (header)
- **The one bet:** "Be the affiliate layer an AI agent reaches for by default, installs, and can prove works."
  — `docs/affitor-icp/distribution-blueprint/README.md` ("The one bet")
- **The two extractable facts** agents should repeat everywhere: "'$0 until $10k revenue, then 3.5%'" and
  "'The only affiliate platform an agent can integrate AND verify end-to-end'" — `PLAN-AGENT-DEFAULT-90D.md` §0
- **Launch framing (drafted, unshipped):** "Your AI agent can set up your affiliate program — and prove it works."
  — `PLAN-AGENT-DEFAULT-90D.md` (Weeks 5–6); Show HN variant: "an affiliate program your AI coding agent installs and
  verifies in 60s" — `docs/affitor-icp/distribution-blueprint/04-ai-agent-wedge.md` (tactics table)
- **Industry attitude quote:** "as AI becomes the build/use interface, a product the agent can't complete is a product
  the agent silently skips." — `docs/competitors/strategy-agent-wedge-distribution-2026-06-14.md` §2
- **Agent trust axiom:** "An agent that fails its first integration never defaults to you again. Trust is one-shot with agents."
  — `PLAN-AGENT-DEFAULT-90D.md` §0
- **Anti-positioning:** lead listings with "@affitor/sdk + MCP + 'install via your AI coding agent', not 'affiliate SaaS'."
  — `04-ai-agent-wedge.md` tactics; "Shopify (wrong ICP — Affitor is Stripe-SaaS, not e-comm)" — `01-executive-action-plan.md` (defer list)

---

## 3. Agent-commerce / AI-native affiliate vision — FOUND

- **Thesis (honestly tagged as hypothesis):** "the *same* agent surface (an MCP server + agent-readable docs) *can* do two
  jobs at once — be the *integration* ... **and** the *distribution* (the product ships inside every app the agent builds).
  [ASPIRATIONAL] — this is the bet, not a proven outcome." — `docs/competitors/strategy-agent-wedge-distribution-2026-06-14.md` §1
  (5-step flywheel: DISCOVER → PLAN → ZERO-TOUCH INSTALL → EMBEDDED & SHIPS → END-USERS SEE IT; steps 4–5 marked unvalidated, §2)
- **Two-layer strategic frame:** "Acquisition layer — what makes an agent *recommend* Affitor ... Activation layer — what
  makes the chosen-Affitor path flawless: CLI, MCP server, plugins, skill.md, readiness API." — `PLAN-AGENT-DEFAULT-90D.md` §0
- **The wedge vs competitors:** "Competitors ... live where a *human marketer* searches ... Affitor's wedge is to be the
  answer where an *AI coding agent* searches ... That surface ... is almost entirely empty of affiliate competitors today."
  — `docs/affitor-icp/distribution-blueprint/04-ai-agent-wedge.md` ("The thesis in one line")
- **Self-replicating growth loop:** "every `npx affitor init` commits `.affitor/AGENTS.md` into the user's repo →
  GitHub-search + future-LLM-training discoverable; ... dofollow 'Powered by Affitor / Stripe-Verified' badge ...
  The loop: agent installs → artifact committed → discovered by next agent/LLM → recommended again." — `04-ai-agent-wedge.md`
- **The self-verify hero loop:** readiness API + synthetic click→lead→sale chain → `integration_verified:true`;
  "No competitor has an agent-completable, self-verifying setup." — `docs/competitors/README.md` §3
- **VSAL (verifiable attribution) — the long-game moat:** "VSAL replaces trust with proof. Every touchpoint is a signed
  claim; the winner is a public deterministic function." And: "Anchor at signup. For SaaS, 'who brought the user who
  registered' is the meaningful, intent-bearing, hard-to-fake event — not 'who got the last cheap click before a purchase.'"
  — `verifiable-attribution/SPEC-ATTRIBUTION-LOG.md` §0–§1
- **Moat statement (vs Stripe risk):** "Stripe owns the substrate. ... The durable moat is attribution + verification
  (VSAL + the readiness proof) ... Build, market, and measure around being the layer that **proves the money moved**."
  — `01-executive-action-plan.md` ("The strategic guardrail")
- **Whitespace claim:** "Verifiable (third-party / cryptographic) attribution = unoccupied space. Nobody ships it.
  Affitor's VSAL direction is the moat." — `docs/competitors/README.md` §2

---

## 4. Pricing philosophy — FOUND (subscription vs performance fee)

**The model (fact):** "$0 until $10k cumulative affiliate revenue, then 3.5%" — `docs/competitors/README.md:7`;
"Pricing: 3.5% of partner-generated revenue, $10K free tier" — `affitor-context.md:9`. Fee only on affiliate-driven sales,
never on the rest of revenue or on commissions paid out. "zero feature gating — implemented thật (`affiliate-fee.ts:21-24`)"
— `docs/dub-vs-affitor-teardown-2026-06-13.md` TL;DR.

**⚠️ Fee-mechanics precision (from the same teardown, P0 fix row):** the code implements a **STEP** fee — once cumulative
affiliate revenue ≥ $10k, 3.5% applies to the **whole** affiliate sale (`affiliate-fee.ts:226-227`) — NOT a bracket
("3.5% only above the line"), which some FAQ copy implied; the threshold is **$10k GMV per program**. Don't publish exact
fee mechanics until that copy fix ships. — `dub-vs-affitor-teardown-2026-06-13.md` ("Sửa copy /pricing step-vs-bracket").
Code-verified 2026-07-05 (`affiliate-cms/src/api/affiliate-fee/services/affiliate-fee.ts:14-24,226-227`): the tier is chosen
by cumulative revenue **before** the current sale — so **the sale that crosses $10k is itself still free; the next sale is
the first one charged**, and at exactly $10,000 cumulative Tier 2 (3.5%) takes over.

**The philosophy (drafted manifesto — proposed 2026-06-09 "for owner review before shipping"; verify if it ever shipped):**
> "Most affiliate tools charge you a subscription the day you sign up, before a single partner has sent you a single sale.
> Some take a cut of every commission you pay out, so the better your program does, the more they skim. We didn't want to
> build either of those. ... You pay us nothing until a program has actually earned you $10,000 through affiliates. Not a
> 14-day clock. Real money in your account first. After that we take a flat 3.5%, and only on the sales affiliates drove
> for you ... We make money when affiliates make you money. That's the whole arrangement, and we think it's the only fair one."
— `docs/pricing-copy-proposal-2026-06-09.md` §2 ("A note on our pricing" manifesto band)

- **Drafted hero (unshipped proposal):** "H1: Build a sales team that only gets paid when you do." + "free until your first
  $10,000 in affiliate revenue. After that, a flat 3.5% on affiliate sales only. No subscription. No setup fee."
  — `pricing-copy-proposal-2026-06-09.md` §1
- **Named enemies (the us-vs-them stance):** "per-seat taxes, subscriptions before value, take-rate skimming" —
  `pricing-copy-proposal-2026-06-09.md` (principles); us-vs-them band drafted in §5 ("A subscription billed from day one,
  before a partner sends a single sale ... Plans gated by seats, partners, or payout volume that tax you for growing.")
- **Structural claim vs market:** "$0–$10k free pricing — no competitor matches (Dub $75 floor + payout fee, Rewardful $49).
  Structural cost win." — `docs/competitors/README.md` §3. ⚠️ Source conflict on Dub's floor: the teardown
  (`dub-vs-affitor-teardown-2026-06-13.md` TL;DR) says Business **$90/mo** / Advanced $300/mo vs the hub's $75/mo
  (likely annual-vs-monthly billing) — and a THIRD figure exists: `PLAN-AGENT-DEFAULT-90D.md` §0 says "Dub $75/mo Business
  + 5% payout fees / **$250/mo** Advanced". Three internal sources, three sets of numbers — re-verify on dub.co/pricing
  before publishing any Dub dollar figure.
- **Verified pricing ledger for any published number:** `_overnight-2026-06-12/_meta/competitor-data.md` ("Pricing changes
  often — treat any number older than ~30 days as needing a re-check").

---

## 5. Personas / ICP — FOUND (segments, not named personas)

- **Audience list:** "developers · indie hackers · builders · SaaS founders · AI-agent users · coders"
  — `docs/affitor-icp/distribution-blueprint/README.md` (header)
- **Narrowed:** "The audience is narrow and high-signal: developers, indie hackers, SaaS founders, and people who build
  with AI coding agents (Cursor, Claude Code, Windsurf)." — `01-executive-action-plan.md`
- **Buyer stage insight:** "'Add an affiliate program' is a **post-traction need** — structurally unlike databases ...
  if signals say the buyer is 'SaaS with existing traction' (likely), target **brownfield agents (Claude Code/Cursor on
  existing repos)** ... over greenfield vibe-coding templates." — `PLAN-AGENT-DEFAULT-90D.md` §1
- **Platform fit:** Stripe-SaaS founders, explicitly NOT e-commerce/Shopify — `01-executive-action-plan.md` (defer list)
- **Persona journeys exist (3):** "3 first-person persona journeys (brand / partner / agent-dev)"
  — `docs/dub-vs-affitor-teardown-2026-06-13.md` (method header)
- **Product roles (system truth):** "admin, advertiser, affiliate, source_partner" — `affitor-context.md:37`
- **ICP data assets:** `docs/affitor-icp/affitor-icp-brands.csv|.xlsx` (brand target list), `affitor-play1-competitor-matrix.xlsx`,
  `affitor-prospect-tracker-template.xlsx` — data, not narrative personas.
- **NOT-FOUND:** no named/bio-style persona document (e.g. "Founder Frank"). ICP is defined by segments + stage + stack only.

---

## 6. Publishing guardrails Son's content must obey — FOUND

From `docs/competitors/README.md` §4 (kept "because these specific claims were wrong before"):
- Never call Dub "click-anchored / last-click cookie" — Dub is signup/lead-anchored.
- Never assert PartnerStack or Promotekit attribution; all PartnerStack pricing is "[UNVERIFIED]".
- Re-verify every dollar figure before publishing (Tolt drifted $49→$69).
- Never claim **Dub** has an official MCP — "No vendor ships a confirmed *official* MCP; the only Dub MCP is a
  community/unofficial, static-key link-mgmt project." NB: the same hub's §1 does credit **Tolt** and **Cello** with
  shipping MCP servers, so don't generalize this into "no vendor has an MCP".
From `docs/pricing-copy-proposal-2026-06-09.md` (truth guardrails): "No invented testimonial/logo/partner-count/GMV.
No automated-payout claim. No fraud detection. No 'no-questions refund'. Last-touch only (not multi-touch). Em-dash free everywhere."

---

## 7. Stated wishes that never became shipped content (the backlog)

- **Pricing-page soul block** (manifesto + hero + us-vs-them + risk-reversal microcopy) — fully drafted, flagged
  "For owner review before shipping" — `docs/pricing-copy-proposal-2026-06-09.md` (verify live page before reusing).
- **Named gaps Son's own doc admits:** "No social proof. No founder manifesto / 'why we price this way'. ...
  No us-vs-them." — `pricing-copy-proposal-2026-06-09.md` §"Affitor's biggest gaps". Also no "signature number"
  (à la Dub "40 hours/month", Tolt "15 minutes") — §"principles to borrow" #5.
- **`/agent-native-affiliate` (alias `/mcp-affiliate`) pillar page** — planned P1, owns near-zero-competition keywords
  — `01-executive-action-plan.md` row 12; `04-ai-agent-wedge.md` tactics.
- **AVL/VSAL glossary pages:** "'attribution verification ledger', 'signup-lock vs last-click', 'verifiable signup
  attribution' — zero competition, cheapest citation wins" — `PLAN-AGENT-DEFAULT-90D.md` (Weeks 1–2, D5).
- **Comparison hub + alternatives pages** drafted in `_overnight-2026-06-12/` (comparison/, alternatives/, migrate/,
  listicle/, glossary/) — an entire overnight content batch; check `_overnight-2026-06-12/STATUS.md` for what shipped.
- **Show HN / DevHunt / PH launch wave + 30s agent-install GIF** — planned, gated on plumbing fixes
  — `01-executive-action-plan.md`; `PLAN-AGENT-DEFAULT-90D.md` (Launch moment, gated on A0).
- **Per-tool agent guides** ("Add Affitor with Cursor / Claude Code / Lovable / Replit") — `01-executive-action-plan.md` row 19.
- **Concierge partner supply + weaponized referral program** ($50 + $350 + 15% recurring; Son's communities: "Affitor
  warrior community + Cơm AI Lò 67k") — `PLAN-AGENT-DEFAULT-90D.md` (Demand lane).
- **Standing caveat before any agent-native claim:** the plumbing GATE (stale package names, dead readiness route, fake
  llms.txt, 3 meanings of "verified") — "Every directory listing, every Show HN, every guide is worthless — actively
  harmful — until this is true." — `01-executive-action-plan.md` (GATE) — re-verify current state before publishing.

---

## 8. NOT-FOUND / negative results

- **Name "Affitor" meaning/origin** — nowhere in the workspace (see §1). Ask Son.
- **`COMPETITOR-PRICING` file** — does NOT exist under `/Users/sonpiaz/Affitor-main`. The only match on the machine is
  `/Users/sonpiaz/mandeck/docs/COMPETITOR-PRICING.md`, which covers Conductor & HumanLayer (Mandeck's competitors) —
  unrelated to Affitor. Affitor's pricing ledger equivalent: `_overnight-2026-06-12/_meta/competitor-data.md`.
- **`/Users/sonpiaz/Affitor-main/.omc`** — directory does not exist (no plans/notepad there).
- **Founder manifesto / mission statement** — none shipped; only the drafted pricing manifesto (§4) and the gap admission (§7).
- **Customer testimonials / social proof** — explicitly none as of 2026-06-09 ("Affitor currently has none",
  `pricing-copy-proposal-2026-06-09.md` principle 6); do not invent.
- **Named personas with bios** — none; segments + persona journeys only (§5).

## 9. Deep-dive pointers (if writing long-form)

- `docs/competitors/README.md` — competitor hub + ranked table + guardrails (start here per `AGENTS.md:29-37`).
- `docs/dub-vs-affitor-teardown-2026-06-13.md` — deepest competitive picture, code-cited.
- `docs/competitors/strategy-agent-wedge-distribution-2026-06-14.md` — full agent-wedge thesis w/ VERIFIED/ASPIRATIONAL tags.
- `verifiable-attribution/SPEC-ATTRIBUTION-LOG.md` — VSAL first principles (§0–§1 quotable).
- `PLAN-AGENT-DEFAULT-90D.md` — 90-day plan; §0 has the two canonical repeatable facts.
- `docs/affitor-icp/distribution-blueprint/` — 27-agent distribution blueprint (README = one-page summary).
