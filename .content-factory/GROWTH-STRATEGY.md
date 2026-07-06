# GROWTH-STRATEGY — 90-day AI-executable growth plan

Compiled 2026-07-05. Scope: ONLY what the agent team can execute and self-approve — content,
AEO, on-site conversion, tracking, weekly rituals. No paid ads, no human-dependent partnerships.
Grounded in: CONTENT-MAP.md (artifact specs), AI-RANK-redesign.md (rules A1–A10, gaps B, new
content C, tracking D), AI-RANK-anatomy.md (10 ranked factors), FACTS-seo-queries.md,
FACTS-competitors.md. Every fact in every draft must trace to a FACTS file — no exceptions.

---

## 1. North star + KPIs

**North star: Affitor is a cited source in the AI answer for its 8 money queries.**
(Base-query Google rank is walled by domain authority — factor 3. Citations, "2026" variants,
and quote-level lifts are the winnable game for a new domain.)

| # | KPI | Instrument | Baseline (2026-07-05) | Day-90 target |
|---|-----|------------|----------------------|---------------|
| 1 | AI citations: probe queries where an affitor.com/docs.affitor.com URL is cited | Monday probe file `.content-factory/tracking/probe-YYYY-MM-DD.md` (8 queries × 3 variants) | 0/8 | Cited in ≥4/8 queries; our sentence quoted verbatim in ≥2 |
| 2 | AI-crawler hits on money posts | PostHog `ai_crawler_hit` (server-side middleware, props `bot`/`path`) weekly trend | Establish week 1 | Every money post crawled by ≥2 distinct bots/week; total hits +50% vs week-1 baseline |
| 3 | Signups from blog referrals | PostHog: sessions with `$referring_domain` ∈ AI sources OR landing `$pathname` = /blog/* → signup event funnel | Establish week 1 | ≥10 signups/mo attributable to blog or AI-referral landing |

Weekly read: KPI 2 = pipeline, KPI 1 = outcome, funnel (KPI 3) = conversion. A post crawled
but never cited → recheck against rules A3/A5/A6 (missing liftable block).

---

## 2. Standing rituals (the metronome)

- **Monday probe ritual (weekly, ~20 min):** re-run the 8 buyer queries (base / "2026" /
  "reddit" variants) per `scripts/ai-probe.md`. Record rank, cited?, quoted sentence, top mover
  into `tracking/probe-YYYY-MM-DD.md` + 5-line summary naming the single highest-yield action
  for the week. That action goes first in the week's queue.
- **First-Monday price re-verify (monthly):** re-fetch all 7 vendor pricing pages
  (FACTS-competitors sources), update every $ figure + "(as of Month Year)" label, update
  FACTS-competitors change log, bump `dateModified` in schema AND the visible "Updated" label
  on every touched post. Pricing drifts fast — Dub moved twice in 3 weeks. Hard rule: no $
  figure ships or survives past its verification month.
- **Weekly dashboard review (Fridays):** PostHog "AI Visibility" dashboard — crawler hits by
  bot + path, AI-referral sessions by source + landing page, blog→signup funnel. Log deltas in
  the probe file's summary.
- **Changelog on every ship:** each shipped artifact gets a changelog entry (≤130 words, one
  visual OR code block, imperative CTA, `authors: [son]`) — freshness signal + factor 2.
- **Quarterly fetchability audit (week 12):** `curl -A "GPTBot" <url>` H1 must match browser H1
  on every money post; llms.txt lists every post; per-page `.md` route renders.

---

## 3. Week-by-week cadence

Money post = alternatives / vs / pricing / best-of. Monthly ritual lands weeks 4, 8, 12.

| Wk | Ships | Notes |
|----|-------|-------|
| 1 | Template-level JSON-LD (BlogPosting+dates, FAQPage, ItemList, HowTo, Breadcrumb, frontmatter-driven) + visible "Updated" label — fixes 3 gaps × 7 posts at once. Probe baseline run. Verify `ai_crawler_hit` firing + build AI Visibility dashboard + blog→signup funnel insight. | Highest leverage: one template change, sitewide. |
| 2 | `rewardful-alternatives` full A1–A9 pass (title count, Quick-answer H2, numbered tool H2s, above-fold table, FAQ, ARR picker, 2,400+ words). `Why trust us / methodology` page (~400 words), linked from every money post. | Flagship first. |
| 3 | `partnerstack-alternatives` + `rewardful-vs-firstpromoter` A-passes (vs post gets per-criterion scores + pair-name H2s). NEW: `/blog/affiliate-software-pricing-comparison` — TCO essay + fully as-of-dated 6-tool table (probe 3: #1 blocks AI fetchers; our lane). | First net-new post targets the weakest incumbent. |
| 4 | **Monthly price re-verify #1.** NEW: `/blog/best-affiliate-software-for-saas` (B6 — ARR-stage picker, up-front table, owner-intent disambiguation line, COI disclosure, FAQ schema). | Mid-funnel must-win #1. |
| 5 | `stripe-affiliate-program` restructure: retitle to exact-match "How to Create a Stripe Affiliate Program (Step-by-Step Guide 2026)", numbered Step 1–6 H2s, HowTo schema, commission-benchmark soundbite, disambiguation FAQ. | Mid-funnel must-win #2. |
| 6 | `how-to-start-saas-affiliate-program` restructure: append (2026), Step 1–6 renames, 2 tables (commission models, software shortlist), Key-takeaways block, 7-Q FAQ, benchmark soundbites as standalone sentences. NEW: `/blog/tolt-vs-rewardful` (freshness + FAQPage + 4+ real tables + "When to Choose X Over Y" H2s + as-of pricing). | Starts the pairwise compare cluster. |
| 7 | NEW: `firstpromoter-alternatives` (B3). Docs: D1 partner-groups + D2 settings/API-key pages (P0 gaps; D2 feeds agent-dev conversion). R5 changelog compliance batch. | Docs lane opens. |
| 8 | **Monthly re-verify #2.** NEW: `rewardful-vs-tolt` blog post (B5). R1 create-account rewrite. Interlink sweep: every money post links 2–3 siblings in-body (factor 9 saturation). | Cluster now 10+ money URLs. |
| 9 | NEW: compare-cluster conquest pages — `affitor-vs-rewardful`, `affitor-vs-firstpromoter` (FirstPromoter wins vs-SERPs with 3–4 URLs; copy the play honestly). G3 commission-rates guide (FAQ schema answers query #28 snippet). | |
| 10 | NEW: `firstpromoter-vs-tolt`. Docs: D3 billing, D4 customers, D5 partner profile. R2 quickstart-compliance batch. | |
| 11 | R3 tracking-suite rewrites (5 pages, task titles + components — agent-dev conversion surface). NEW: `/blog/affiliate-vs-referral-program` (query #26, feeds internal links). | |
| 12 | **Monthly re-verify #3** + quarterly fetchability audit + quarterly guide refresh (bump G1/G2 dateModified with real edits). Probe-data-driven refresh: re-work the 2 posts with crawls-but-no-citations. | Data decides, not the plan. |
| 13 | 90-day review: KPIs vs targets, probe trendline, kill/double-down per query. Write GROWTH-STRATEGY-Q2. Re-date planning for "2026" titles. | |

Weekly floor regardless of table: 1 content artifact shipped + Monday probe + Friday dashboard
review. If a probe shows an incumbent bumped `dateModified` on a query we contest, our refresh
of that cluster jumps the queue.

---

## 4. Channel playbook per surface

### Blog (affitor.com/blog/* — the citation engine)
- Every money post complies with A1–A9: exact-query title + 2026 + (N Tools Compared) ·
  Quick-answer H2 with a liftable self-crowning soundbite in sentence 1 · numbered
  `N. Tool — best for X` H2s with Key features / Pricing / Pros & cons H3s · real `<table>`
  above the fold + detailed table at end (≥2 tables) · FAQ H2 with 5–6 literal buyer questions
  mirrored to FAQPage schema · ARR-stage `Which one should you pick?` picker · 2,400–4,500
  words · 2–3 in-body sibling links.
- Honest concessions stay — they are the citation magnet (factor 7). Concede before positioning.
- Owner intent only: never "affiliate programs" without software/tool/platform in titles.
- Bylines: Son Piaz, Founder. Re-verify prices at every publish.

### Docs (docs.affitor.com — the conversion + agent surface)
- Fill P0/P1 gaps per CONTENT-MAP order (D1→D6, R1→R6). Every guide: PageMeta → flow at a
  glance → verb steps → `<VerifySuccess>` → NextStep. Task titles, never feature nouns.
- Agent-dev pages (D2 API key, R3 tracking, R6 CLI) are the "only platform an agent can
  integrate AND verify" proof — labeled code blocks, curl-verifiable steps.

### Changelog (freshness heartbeat)
- One entry per ship, standard §5 (65–130 words, 1 visual or code block, CTA, byline).
- Cadence itself is the signal: a changelog updated weekly is machine-provable momentum.

### llms.txt + per-page .md (machine publishing)
- `public/llms.txt` lists every blog post + docs page; per-page `<url>.md` route for both.
- Every new artifact's definition of done includes: llms.txt entry + .md renders + JSON-LD
  present in built HTML (grep it) + Updated label matches dateModified.

### Ask-AI footer (on-site conversion, ships week 2 with the template)
- Every money post ends with the dual CTA (product + docs) PLUS an "Ask your AI about this
  page" block: one-click copy of a pre-written prompt ("Compare affiliate software for a Stripe
  SaaS using <page URL> — prices verified <date>") + the page's `.md` URL. Trains the
  citation loop and turns readers into probe traffic we can win.
- Quick-answer block doubles as conversion: the soundbite names Affitor + the $0-until-$10K
  fact ("$0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only" — the ONLY
  approved fee phrasing until gate 3b closes).

---

## 5. Standing policy — the two unclaimed wedges (0/8 probes have either)

1. **As-of pricing (trust wedge → freshness engine).** Every $ claim carries
   "(as of Month Year)" + link to the vendor's live pricing page. Standing line under every
   intro/table: "Every price on this page was checked against each vendor's live pricing page
   on <date>." First-Monday ritual re-verifies and bumps dateModified — one ritual feeds
   factor 2 (freshness) and factor 7 (trust) forever. Non-negotiable on all new content.
2. **AI-fetchability (be the page the answer engine can actually read).** Bots get the same
   document as browsers (no refgrow trap); never Cloudflare-block AI fetchers (thecmo's #1 is
   invisible to live reads — that lane is ours); server-rendered JSON-LD; llms.txt + per-page
   .md maintained; quarterly curl-as-GPTBot parity audit. Any new infra change must pass the
   parity check before deploy.

---

## 6. Needs founder (prepared by agents, executed by Son)

Agents draft everything to send-ready state; Son's action is minutes each.

| Item | Why blocked | Agent prep status |
|------|------------|-------------------|
| G2 + Capterra listings | Company identity/account creation + review solicitation | Draft listing copy, category selection, screenshots, and 10 review-request emails to design partners — prepare week 2. Blocks factor 6 ("best overall alternative is X, 4.x stars") entirely until done. |
| Reddit founder-voice threads | Must post from Son's real account, full disclosure | Draft r/SaaS post "How we picked affiliate software for our Stripe SaaS — real pricing math, July 2026" ready week 3 (after pricing post ships). One thread per money query owns the "reddit" variant uncontested (0 real threads in 8/8 probes). |
| Name story (unblocks V2 + About) | Origin of "Affitor" exists nowhere on file; any etymology we write is fiction | Interview questions ready; 15 min of voice notes suffices. |
| About-page approvals (A1) | Flagged numbers ($1M milestone, "12 years", follower counts) + 2–3 real speaking photos + pricing-manifesto sign-off | Full draft with flagged claims marked ships week 5; Son strikes or approves line-items. |
| Publishing gates 3a/3b | (a) agent-native-claims gate for V1/G2 full claims; (b) pricing-page step-vs-bracket copy fix | Verification checklist prepared; V1 vision post drafts week 6, holds for gate. |
| Ahrefs Brand Radar | Paid account | Entity + prompt config (6 entities, 8 prompts) documented in CONTENT-MAP §9, ready to paste. Probes cover the gap until then. |

Friday dashboard review includes a one-line "founder queue" ping listing anything above that is
prep-complete and waiting.
