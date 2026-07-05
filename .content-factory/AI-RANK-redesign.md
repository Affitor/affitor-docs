# AI-RANK redesign — spec for making Affitor the most citable result

Derived from `AI-RANK-anatomy.md` (10 ranked factors, 8 probes) + `AI-RANK-probes.md` + `CONTENT-STANDARD.md`. Everything below is implementable this week. Scope: the 7 live posts at `docs.affitor.com/blog/*` (source: `content/blog/*.mdx`), plus new pages and tracking.

---

## A. Page redesign rules (10)

Apply to every comparison/guide post. Rules 1–8 are per-page; 9–10 are site-level.

### A1. Title formula: exact query + year + parenthetical count

`<verbatim query phrase>` + `in 2026` + `(N Tools Compared)` — the trait shared by the #1 page in 6/8 probes.

- Alternatives posts: `Best Rewardful Alternatives for SaaS in 2026 (5 Tools Compared)`
- How-to posts: `How to <query verb phrase> (Step-by-Step Guide 2026)`
- Vs posts: `Rewardful vs FirstPromoter: Which Is Best for SaaS in 2026?`
- H1 = title. The query phrase must appear verbatim, not paraphrased.

### A2. JSON-LD stack (the #1 technical gap: built HTML has 0 ld+json today)

Embed server-rendered `<script type="application/ld+json">` per post type:

| Post type | Required types |
|---|---|
| Every post | `BlogPosting` with `datePublished` AND `dateModified` (ISO dates), `author` (Person, name + url), `headline` | 
| Alternatives / listicle | + `FAQPage` + `ItemList` (one `ListItem` per tool, `position` + `name` + `url`) |
| Vs post | + `FAQPage` |
| How-to post | + `HowTo` (one `HowToStep` per Step H2) + `FAQPage` — HowTo was on exactly one page across all 8 probes: the #1 how-to result (payproglobal) |
| All | + `BreadcrumbList` (Home → Blog → Post) |

FAQPage was unclaimed on nearly every probed SERP — it is the cheapest differentiator available. Implement once in the blog layout template, driven by frontmatter (`faq:` array, `tools:` array), not hand-written per post.

### A3. "Quick answer" block directly under the intro

Literal H2 `Quick answer: <the query as a question>` within the first screen. 2–4 sentences, first sentence is a standalone liftable soundbite naming the pick:

> "Affitor is the best Rewardful alternative for SaaS that wants to pay $0/month until affiliates generate their first $10,000 in revenue."

Evidence: FirstPromoter's "Quick answer" H2 was what AI summaries reproduced; introw's self-crowning sentence got quoted verbatim with zero schema. Write the #1-pick sentence as the soundbite you want repeated, because it will be repeated.

### A4. Numbered tool H2s where each heading is itself an answer

Pattern: `N. <Tool> — best for <use case>` ("1. Affitor — best for paying only on results"). Under each tool H2, uniform H3 subheads: `Key features` / `Pricing` / `Pros & cons` (the Partnero/FirstPromoter template AI answers reproduce). Keep our honest concessions inside these sections — they are the citation magnet (efficient.app effect, factor 7).

### A5. One comparison table above the fold, real `<table>` shape

Directly after the Quick answer block. Exact columns for alternatives/listicle posts:

| Tool | Best for | From price (as of Jul 2026) | Transaction fee | Attribution |

- Real HTML `<table>`, never div-grids (div tables rank but get quoted less for numbers).
- Every post also keeps its detailed "Every X at a glance" table at the end. Target 2+ real tables minimum per money post (winners run 2–8; irev's 20-table page was the most-quoted for numbers).

### A6. As-of-dated pricing on every $ claim — our wedge, systematized

0 pages across 8 probes date their pricing; we are already the only one doing it. Rules:

- Every price line carries `(as of <Month Year>)` or lives under a table header that does, plus a link to the vendor's live pricing page.
- One standing line under the intro/table: "Every price on this page was checked against each vendor's live pricing page on <date>."
- **Monthly re-verification ritual** (first Monday): re-fetch all vendor pricing pages, update numbers, bump `dateModified` in schema + the visible label. This turns the trust wedge into a perpetual-freshness engine (factor 2) simultaneously.

### A7. Visible "Updated" label + provable freshness

Under the byline: `Updated: July 5, 2026` — must match `dateModified` in the BlogPosting schema exactly. Owning the "2026" query variant required a real recent `dateModified` in 6/8 probes. Refresh cadence: money posts (alternatives / vs / pricing) monthly with the A6 ritual; guides quarterly; always bump both the label and the schema together.

### A8. FAQ section with the literal buyer questions + FAQPage schema

5–6 Q&As as the last content H2 (`## FAQ`), questions written exactly as buyers type them:

- "What is the best Rewardful alternative for SaaS?"
- "Is <Tool> cheaper than <Tool>?" 
- "Does <Tool> charge transaction fees?"
- "Can I run an affiliate program directly in Stripe?"
- "How much does affiliate tracking software cost in 2026?"
- "Which affiliate software has no monthly fee?"

Each answer: 2–3 sentences, first sentence self-contained (liftable without context). Mirror into `FAQPage` JSON-LD (A2).

### A9. Word count, segment picker, and cluster interlinking

- Money posts: 2,400–4,500 words (winners' band). Ours run 1,843–2,267 — expand via the A4 per-tool subheads and A8 FAQ, not padding.
- Every listicle gets a `## Which one should you pick?` segment picker keyed to ARR stage ($0–500K / $500K–5M / $5M+) — the picker logic is what AI answers reproduce (refgrow, #1).
- Every money post links to 2–3 sibling money posts in-body (not just "What's next") so 2–3 Affitor URLs can co-occupy one top-10 (factor 9: linkjolt/refgrow/firstpromoter all win via 3-URL saturation).

### A10. Fetchability parity + machine surface (keep and verify)

- Bots must receive the same document as rendered browsers (the refgrow trap: curl gets a different page). Verify quarterly: `curl -A "GPTBot" <url> | grep '<h1>'` matches the browser H1.
- Keep the per-post `llms.md` route; ensure `llms.txt` at the docs root links every blog post.
- Never put the blog behind Cloudflare bot-blocking (thecmo 403s AI fetchers — that's our lane past its authority).

---

## B. Per-post gap list (7 live posts, audited 2026-07-05)

Site-wide gaps first — every post violates these, fix once in the blog template:

- **A2**: 0 ld+json blocks of any kind in built HTML (no BlogPosting, no FAQPage, no ItemList).
- **A7**: no visible "Updated" label, no dateModified mechanism.
- **A8**: no post has an FAQ section (0/7).

Per-post (beyond the site-wide three):

### 1. `rewardful-alternatives` — flagship, fix first
- A1: title lacks `(5 Tools Compared)`.
- A3: verdict exists but sits at the BOTTOM ("The short version…") — no Quick answer H2 up top.
- A4: tool H2s not numbered, not `N. Tool — best for X` shape ("Affitor: pay nothing until…" is quotable but not the reproduced pattern).
- A5: comparison table is at the end only, none above the fold.
- A9: 2,216 words vs 2,400+ target; picker exists implicitly but no explicit ARR-stage `Which one should you pick?` H2.
- Strengths to keep: as-of pricing (A6 — best in any probed SERP), honest disclosure/concessions.

### 2. `partnerstack-alternatives`
- A1: has exact phrase + year, missing `(5 Tools Compared)` count.
- A3: no Quick answer H2 (the "When PartnerStack is the right call" concession is great — keep, but add the soundbite block above it).
- A4: tool H2s not numbered; missing uniform Key features / Pros & cons H3s.
- A9: 2,267 words — slightly under band; no ARR picker H2.
- A6 strong (11 as-of mentions).

### 3. `rewardful-vs-firstpromoter`
- A1: good title; consider appending explicit "2026" is present — OK.
- A2 (extra): needs FAQPage; also consider scored criteria — the AI answer for vs-queries is criteria-shaped, and efficient.app's x/7 rubric is what got quoted. Add a score per criterion H2 (Pricing / Attribution / API / Payouts) with a one-sentence verdict soundbite per section.
- A3: no Quick answer H2 ("Who should pick which" is buried at H2 #5).
- A9: 1,905 words — under band.
- Keyword-scaffold note: Rewardful's own page prefixes all 9 H2s "Rewardful vs. FirstPromoter: X" and owns the head-to-heads; our criteria H2s should carry the pair name ("Pricing: Rewardful vs FirstPromoter — same floor, different ceilings").

### 4. `stripe-affiliate-program`
- A1: title "How to add an affiliate program to your Stripe SaaS" is NOT the exact-match query — winners use "Stripe Affiliate Program" verbatim + year: retitle to `How to Create a Stripe Affiliate Program (Step-by-Step Guide 2026)` (refgrow's exact winning shape) or keep H1 close to it.
- A2 (extra): this is the one post that should carry `HowTo` schema.
- A4-variant: H2s are not numbered `Step 1–6` — winners walk numbered steps (create account → connect Stripe → commissions → tracking → test).
- A8: FAQ should include the intent-disambiguation Q ("Does Stripe have a built-in affiliate program?" — the "Stripe can't do this alone" first-paragraph fact is already there, good).
- Missing commission-rate benchmark line (15–30% SaaS) that AI answers lift.
- 1,843 words — under band.

### 5. `how-to-start-saas-affiliate-program`
- A1: title lacks year — append `(2026)`.
- A2 (extra): `HowTo` schema candidate #2.
- A4-variant: six decision H2s are good but not numbered — rename to `Step 1: Decide what you'll pay` … `Step 6: Launch and measure`.
- A5: **0 tables** — add the commission-model comparison table (the payproglobal #1 pattern) and a software-shortlist table.
- A8 + key-takeaways: #1 winner carries a 7-question FAQ + "Key takeaways" block; we have neither.
- Benchmark soundbites: put the numbers AI lifts verbatim on-page as standalone sentences ("20–30% recurring commission is the SaaS standard", "60–90 day cookie window", "5–20 aligned partners beat 100 random affiliates").

### 6. `agent-commerce-attribution-layer`
- Vision post, not a money-query page — exempt from A1/A3/A4/A5/A8.
- Needs only site-wide fixes: BlogPosting schema + Updated label. Its as-of-dated stats practice (5 mentions) already matches A6 — keep.

### 7. `what-affitor-means`
- Brand post, still DRAFT-gated (publish blocker in file). Exempt from money-post rules; needs BlogPosting schema only when it ships.

**Execution order this week:** (1) template-level JSON-LD + Updated label (fixes 3 gaps × 7 posts at once) → (2) rewardful-alternatives full A1–A9 pass → (3) partnerstack-alternatives + rewardful-vs-firstpromoter → (4) the two how-to retitles/restructures.

---

## C. New content the probes show we're missing

Queries where no Affitor page can win today, in citation-yield order:

1. **`/blog/affiliate-software-pricing-comparison`** — probe 3: linkjolt owns the 2026 variant with 3 URLs; the winning stitch = table facts (thecmo) + pricing-thesis framing (linkjolt "revenue-share pricing punishes growth", TCO over 12–24 months). Ours: TCO essay + fully as-of-dated pricing table for 6 tools — no page in that SERP dates prices, and thecmo (the #1) blocks AI fetchers. Title: `Affiliate Software Pricing Comparison 2026 (Real Numbers, Verified July 2026)`.
2. **`/blog/best-affiliate-software-for-saas`** — probe 4: zero independent comparisons; every winner self-crowns. Title: `Best Affiliate Software for SaaS in 2026 (7 Tools Compared)`. Must include: ARR-stage picker (the reproduced element), one up-front table, an early "this is software to run YOUR program" disambiguation line (intent (b) pollution).
3. **`/blog/tolt-vs-rewardful`** (or a `/compare/` hub) — probe 2: vibegrowthstack's template wins the 2026 variant with freshness + FAQPage + 8 real tables + "When to Choose X Over Y" H2s. We combine all four + as-of pricing. First entry of a pairwise compare cluster (next: `firstpromoter-vs-tolt`, `affitor-vs-rewardful`, `affitor-vs-firstpromoter` conquest pages — FirstPromoter saturates vs-SERPs with 3–4 compare URLs).
4. **Reddit founder-voice threads** — the "reddit" variant returned zero actual threads in 8/8 probes; one substantive thread would own each variant uncontested. This week: one honest r/SaaS post ("How we picked affiliate software for our Stripe SaaS — real pricing math, July 2026") linking the pricing post. Founder account, full disclosure, no spam.
5. **G2 + Capterra listings (off-page, blocks a whole factor)** — no G2 profile → Affitor can never appear in the aggregator-sourced "best overall alternative is X, ~4.x stars" sentence that anchors every alternatives answer. Create both listings + seed first 5–10 reviews from design partners. Start this week; reviews compound.
6. **`Why trust us / methodology` page** — linked from every money post (thecmo + efficient.app E-E-A-T block). One page, ~400 words: how we verify prices, disclosure policy, refresh cadence.

---

## D. Tracking spec — weekly AI-visibility measurement

### D1. Ahrefs Brand Radar (setup: ~30 min)

- **Entities (6):** Affitor, Rewardful, FirstPromoter, Tolt, PartnerStack, Dub (Partners).
- **Prompts to track** (the 8 probe queries, phrased as buyer prompts):
  1. "how to set up a Stripe affiliate program"
  2. "Tolt vs Rewardful which is better"
  3. "affiliate tracking software pricing comparison"
  4. "best affiliate software for SaaS"
  5. "best Rewardful alternatives"
  6. "PartnerStack alternatives"
  7. "how to start an affiliate program for my SaaS"
  8. "Rewardful vs FirstPromoter"
- Weekly export: share-of-voice per entity per AI surface (AI Overviews / ChatGPT / Perplexity), plus which URLs get cited. Log the weekly numbers into `.content-factory/tracking/brand-radar-YYYY-WW.md`.

### D2. Self-hosted: PostHog (docs + landing)

Two capture lanes — note AI crawlers don't execute JS, so lane 1 must be server-side:

1. **AI-crawler hits (server-side).** In the docs (fumadocs/Next.js) and landing middleware, match `user-agent` against: `GPTBot`, `ClaudeBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Bytespider`, `OAI-SearchBot`. On match, fire a server-side PostHog capture:
   ```ts
   // middleware.ts (edge) — fire-and-forget, never block the response
   const AI_BOTS = /GPTBot|ClaudeBot|Claude-User|PerplexityBot|Perplexity-User|Google-Extended|Bytespider|OAI-SearchBot/i;
   const m = req.headers.get('user-agent')?.match(AI_BOTS);
   if (m) fetch('https://us.i.posthog.com/capture/', { method: 'POST', body: JSON.stringify({
     api_key: PH_KEY, event: 'ai_crawler_hit',
     distinct_id: 'bot:' + m[0].toLowerCase(),
     properties: { bot: m[0], path: req.nextUrl.pathname, host: req.nextUrl.host },
   })});
   ```
   Insight: weekly `ai_crawler_hit` trend broken down by `bot`, and by `path` (which posts get crawled = which are in the answer pool).
2. **AI-referral sessions (client-side, config only).** posthog-js already autocaptures `$referring_domain`. Create one insight: weekly sessions where `$referring_domain` ∈ {`chatgpt.com`, `chat.openai.com`, `perplexity.ai`, `gemini.google.com`, `copilot.microsoft.com`, `claude.ai`} broken down by domain + landing `$pathname`. These are humans who clicked a citation — the conversion signal.
3. **Dashboard "AI Visibility":** 4 tiles — crawler hits by bot (trend), crawler hits by path (table), AI-referral sessions by source (trend), AI-referral landing pages (table). Weekly subscription to email/Slack.

### D3. Manual weekly probe script

Re-run the 8 probes every Monday, same method as the originals (WebSearch base + "2026" + "reddit" variants), and record deltas. Runnable as a Claude Code ritual:

- **Input:** the 8 queries from D1.
- **For each query record:** top-10 URLs per variant; whether any `affitor.com`/`docs.affitor.com` URL appears (and rank); which sentence the AI answer quotes verbatim (and from whom); any new entrant vs last week.
- **Output:** `.content-factory/tracking/probe-YYYY-MM-DD.md` — one table per query: `variant | our rank | cited? | quoted sentence | top mover`. Append a 5-line summary: queries where we entered/moved, freshness of incumbents (who bumped dateModified), and the single highest-yield action for the coming week.
- **Trigger:** calendar reminder or a `/loop`-style weekly run; ~20 min. First run this week establishes the baseline (which is effectively the 2026-07-05 probes file).

**Weekly review loop:** Brand Radar SOV (D1) = outcome; crawler + referral data (D2) = pipeline; probe file (D3) = diagnosis. Any post crawled by bots but never cited → check it against rules A3/A5/A6 (missing liftable block); any query where an incumbent bumped dateModified → schedule our A6 refresh for that cluster.
