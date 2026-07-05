# Affitor Content Standard

How we write docs, reference pages, blog posts, and changelog entries.
Every rule below traces to a verified observation of Dub, Mercury, Stripe, or Vercel
(pages fetched and cross-checked June–July 2026). Where their practices diverge, we say
which one we follow and why.

**Scope of surfaces:** `content/docs/**` (fumadocs guides + API reference),
`content/changelog/*.mdx`, and a future `affitor.com/blog`.

---

## 1. Principles

1. **The first sentence carries the whole message.** Vercel changelog entries state the
   feature as an accomplished fact in sentence one ("Vercel Sandbox now supports FUSE,
   letting you mount remote storage..."); Dub and Mercury open changelog entries with
   "You can now..."; Stripe puts a one-line dek directly under every H1. No throat-clearing,
   no "we're excited to announce." A skimmer reading only the first line of anything we
   publish gets the point.

2. **Titles are tasks and benefits, never feature nouns.** Stripe sidebar items are
   task-phrased ("Create a Stripe-hosted checkout page"); Mercury help titles are verbs
   ("Create debit and credit cards", never "Cards"); Mercury release headlines start with
   a verb or outcome ("Invoice customers in over 100 currencies"); Vercel headings are
   reader questions/outcomes ("Why functions should run near your data source"). Write the
   heading so the TOC alone answers "is my question covered here?"

3. **Every guide ends with proof it worked, then a handoff.** Dub's Stripe guide closes
   with "View conversion results" then "Example apps"; Stripe has a mandatory "Test your
   integration" H2 with a test-card table; Dub help articles end with a "What's next?"
   card grid; every Vercel changelog entry's last sentence is a docs link. Never end a
   page at the last instruction — end at verification + next step.

4. **One deliberate visual per unit; code is media too.** Mercury /releases ships exactly
   one 16:9 screenshot per entry; Stripe's 4,500-word checkout guide has ZERO screenshots —
   code blocks and tables do the showing; Vercel dashboard procedures are numbered text
   steps with **bolded UI labels** instead of per-step screenshots; Dub uses screenshots
   only where the reader must confirm a UI state mid-procedure. Never decorate; every
   image must confirm a state or explain a structure.

5. **Publish for machines as deliberately as for humans.** All four converge hard here:
   Dub and Mercury ship `llms.txt`; Stripe serves clean markdown at every URL + `.md` and
   embeds literal "Instructions for LLMs"; Vercel serves YAML-frontmattered markdown via
   content negotiation and a "Copy page" button. Our frontmatter (`title`, `description`)
   must be complete and accurate on every page, because it doubles as the machine index.

6. **Docs are evergreen and anonymous; announcements are dated and human-signed.**
   Dub, Mercury, and Stripe show no author or date on docs guides — docs are product
   surface, not content. But changelogs and blogs at all four carry real named authors
   with roles and avatars (Dub: "Steven Tey, Founder & CEO"; Vercel: "Software Engineer,
   Compute"; Stripe blog: headshot + LinkedIn + exact role). Sign what you ship; keep
   reference material timeless.

---

## 2. Template: Docs guide page

Stack mapping: fumadocs MDX in `content/docs/**`. Components already available:
`PageMeta`, `Callout`, `Checklist`, `CodeGroup`, `Mermaid`, `Flow`/`FlowStep`,
`FeatureCards`/`FeatureCard`, `VerifySuccess`, `CommonMistakes`, `NextStep`.

### Skeleton (top to bottom)

```mdx
---
title: "Track sales from your backend"        # task-phrased, imperative (Stripe/Mercury pattern)
description: "Send attributed sales to Affitor after payment succeeds."  # one-line dek; also the machine summary (Mercury: dek doubles as llms.txt description)
---

One or two opening sentences stating what the reader will accomplish, dense with
inline links to related concepts. (Vercel /docs/functions pattern: intro paragraph
links framework/CDN/data-locality inline.)

<PageMeta items={[
  { label: 'Who this is for', value: '...' },
  { label: 'Time required', value: '...' },
  { label: 'Prerequisites', value: '...' },
  { label: 'Outcome', value: '...' },
]} />
{/* Affitor's PageMeta = Stripe's "Integration effort" scorecard (Complexity 2/5,
    integration type, Try-it-out link): let readers self-select out before investing.
    Always include Outcome. Add a Complexity label for integration guides. */}

<Callout type="info">Plan/eligibility gate, if any, goes HERE — immediately after
the dek, never buried. (Dub: plan-availability Tip directly under the title.)</Callout>

## The flow at a glance
{/* Numbered overview of all steps before any detail: number + title + one-line
    description each. (Dub help "The flow at a glance"; confirmed as a numbered 1–5
    overview, not a thumbnail row.) Use <Flow>/<FlowStep> or a Mermaid diagram. */}

## Step 1: <imperative verb phrase>
## Step 2: ...
{/* Each step: 1–3 sentence WHY paragraph → the action with bolded UI labels
    ("navigate to the **Move Money** dropdown" — Mercury) → code block or screenshot.
    Stripe tags steps [Client-side]/[Server-side]; we write "(server-side)" in the
    heading when a guide mixes surfaces. */}

{/* Options instead of forced linear paths: when multiple valid routes exist, use
    H3s "Option 1: ... / Option 2: ... (recommended) / Option 3: ..." with the
    recommended path tagged IN the heading (Dub Stripe guide). Affitor's
    <RecommendedPath> component renders this. */}

## Optional: <anything non-essential>
{/* Literal "Optional:" prefix so the happy path stays short — Stripe puts 4
    Optional H2s at the bottom of the checkout guide; half its length is optional. */}

## Verify it worked
{/* Mandatory. Concrete verification: what to click, what the dashboard shows,
    a test payload + expected response. (Stripe "Test your integration" with
    numbered click-path + test-card table; Dub "View conversion results".)
    Use <VerifySuccess>. Add <CommonMistakes> here when failure modes are known. */}

## Next steps
<FeatureCards>...</FeatureCards>
{/* 2–4 cards: title + one-line description + link. (Dub "What's next?" 6-card grid;
    Vercel "Explore X" — "**Title**: one-line description. Learn more →".)
    Or <NextStep> for a single obvious continuation. */}
```

### Guide rules

- **Callouts:** place them at failure points, not decoratively — Dub interleaves
  Tip/Note/Warning exactly where readers break things (Warning: guest checkout leaves
  customer null). One callout type per fact: info = context, warn = data loss/irreversible.
- **Code:** every block carries a filename or endpoint label (Vercel: `api/hello.ts`;
  Dub eng blog: `storage.ts`). Multi-language tabs via `<CodeGroup>` only at the one
  primary integration point; secondary snippets in one language (Dub's Stripe guide has
  the full 7-language CodeGroup exactly once — everything else is Node-only).
- **Safety notes live inside code comments** where relevant: Stripe embeds
  "Don't put any keys in code." as a code comment, not a paragraph.
- **Length:** required path ≤ half the page (Stripe). Whole guide 800–1,500 words;
  push depth into linked pages rather than explaining inline ("Learn more in our
  fulfillment guide" — Stripe).
- **Voice:** second person, imperative, present tense, zero marketing adjectives
  (all four).

---

## 3. Template: Docs reference page (API-style)

Stack mapping: `content/docs/api-reference/*.mdx` with `ParamList`/`ParamField`,
`ResponseTabs`, `CodeGroup`. Current `track-sale.mdx` is close to standard already.

### Skeleton

```mdx
---
title: "Track Sale"                          # the resource/operation name — reference pages may use nouns
description: "Record an attributed sale and create the partner commission from your backend"
---

One sentence: when and why you call this. (Stripe: explains WHY in one sentence,
then shows the interface.)

## Endpoint
```POST https://api.affitor.com/api/v1/track/sale```   # method + URL + auth header shown together

## Authentication
{/* One short paragraph + one example header line. Where to find the key. */}

## Request fields
<ParamList>
  <ParamField name="..." type="..." required>
    Description states behavior AND consequence: "Used for duplicate detection —
    re-sending the same value returns 409." (Stripe changelog tables pair every
    parameter with its change and affected resource; our field docs pair every
    field with its runtime effect.)
  </ParamField>
</ParamList>

## Example request
{/* One copy-paste-runnable block, curl first; <CodeGroup> for SDK variants. */}

## Responses
<ResponseTabs>...</ResponseTabs>
{/* Success AND error shapes. Errors as a table: code | meaning | what to do
    (Stripe test-card table pattern: matrix of scenario → expected result). */}

## Related
{/* Flat bullet list of sibling endpoints and the guide that uses this endpoint —
    Stripe "See also" is a flat 5-link list, no cards needed on reference pages. */}
```

### Reference rules

- No screenshots, no Mermaid, no PageMeta — Stripe changelog/reference pages carry
  zero images; tables and code ARE the media.
- Deep links to other reference pages pin the anchor precisely
  (Stripe: `/api/checkout/sessions/create#create_checkout_session-subscription_data`).
- Conditional requirements get an explicit `requirement="conditional"` with the
  condition spelled out in prose (already done in `track-sale.mdx` — keep it).
- No author, no date (Dub/Mercury/Stripe docs show neither).

---

## 4. Template: Blog post (future affitor.com/blog)

### Length bands (observed)

| Band | Words | Use for | Model |
|---|---|---|---|
| S | 400–700 | Product announcements, data notes | Dub blog ~400–500; Stripe data post ~550 |
| M | 700–1,300 | Launches, engineering posts | Vercel 700–1,100 (5 min read); Stripe eng ~1,250 |
| L | 1,800–3,000 | Guides, comparisons | Mercury guides ~1,800–2,000; Dub comparisons ~2,500–3,000 |

### Skeleton

```
Category label + date above H1        (Dub, Mercury, Stripe, Vercel — all four)
H1: plain sentence or quantified outcome
    (customer stories: "How X runs Y for 120,000 companies" — Vercel)
One-line dek stating the payoff       (Mercury: single sentence under every H1)
Byline: name + exact role + avatar    (Stripe: "Product Manager, Link Consumer
    Product", linked; makes every post an accountable practitioner's statement)
Hero image: OPTIONAL — Vercel announcement posts ship with zero images and are
    the stronger pattern for us; if used, one branded 16:9, never stock
Intro: 1–3 paragraphs, thesis in sentence one; open with a hard number when we
    have one ("We surveyed 394 customers..." — Stripe)
Body: 3–6 H2s, each 100–250 words (Vercel); headings shaped as claims/benefits
    ("Built to start fast", "Backends are back" — Vercel), never "Overview"
Media: max 2 inline visuals + max 1–4 code blocks with filename labels;
    customer quotes as attributed pull-quote blocks (Vercel), proof woven into
    the argument, not a testimonials section (Dub comparison posts)
Close: short forward-looking section ("What's next") ending in dual CTA —
    product link + docs link (Dub, Vercel)
```

### Blog rules

- **No TOC, no related-posts module, no share buttons at launch** — Vercel proves
  radical omission works (zero hits for Related/Share/On-this-page in post HTML);
  add a TOC only if we start publishing L-band posts regularly (Dub uses a sticky
  sidebar TOC on 2,500-word comparisons).
- Comparison posts: repeat a bold `Competitor` / `Affitor` label pair inside every
  H2 criterion (Dub — verified as bold labels, not H3s), end with a summary table
  as the last section, concede competitor strengths honestly before positioning us.
- Every post written by a named practitioner, not "The Affitor Team" (Stripe).
- Serve markdown to agents: same URL + `.md` or Accept-header negotiation
  (Vercel/Stripe dual-publishing).

---

## 5. Template: Changelog entry

Affitor already ships benefit-first frontmatter — keep and refine:

```mdx
---
title: Invite partners in bulk            # feature as verb/benefit phrase, sentence case (Dub: "Advanced analytics filters"; Mercury: "Invoice customers in over 100 currencies")
date: '2026-07-05'
category: Dashboard                       # keep: Mercury tags entries by product/category and makes tags filterable
benefit: Onboard your whole partner list in one paste instead of one invite at a time.   # one sentence, second person — this is the index excerpt AND the social dek
authors: [son]                            # ADD: all four sign changelog entries with real humans (Dub: founder byline; Vercel: 1–6 engineers with roles)
---

First sentence = the complete announcement, stated as done, product name linked.
("You can now..." — Dub/Mercury; "Affitor now supports..." — Vercel form.)

One short paragraph or a 3-bullet list of capabilities. No H2 per feature even in
roundups — Dub demotes secondary items to bullets so a roundup stays the same
length as a single-feature post.

One visual OR one code block, not both:
- UI feature → one screenshot from the capture rig (Mercury: exactly one 16:9
  screenshot per release entry)
- API/CLI feature → one runnable code block (Vercel: "ship a runnable code sample
  instead of a screenshot"; code is the proof the feature exists)

Closing sentence = imperative CTA link, always:
"Invite your first batch of partners →" into the product (Mercury: CTA deep-links
into app flows) or "Read the bulk-invite docs" (Vercel: fixed closing docs link).
```

### Changelog rules

- **65–130 words of prose.** Dub runs 65–110; Mercury 25–128 (median 57); Vercel
  150–300 including bigger features. If it needs more, the extra belongs in docs —
  the changelog is a routing layer, not documentation (Dub: every mentioned
  sub-feature hyperlinks to its help/docs/API page).
- **No "Added/Fixed/Improved" changelog-speak.** Mercury explicitly avoids it;
  every entry reads as a mini product announcement.
- **Big features may escalate, same template:** add H2s in Vercel's near-fixed
  order — feature sections → "Under the hood" → "Pricing" → "Get started". Small
  entry = intro + one visual + CTA, no headings.
- Index stays a flat reverse-chron list: date + title + benefit line; tags/category
  as filter affordances (Mercury tag pills double as filters). RSS/JSON feed when
  we build the public page (Mercury `feed.json`, Dub RSS).

---

## 6. Media standards

### Screenshot capture (Affitor demo-program rig)

- Capture from the demo program at **1440×900 @2x**, export resized to **1600w**
  (existing rig settings — keep; matches Mercury's consistent 16:9 1920×1080
  masters served responsive).
- Show the UI **in realistic context**: real-looking demo data, full relevant panel,
  not cropped fragments (Mercury: "dashboard views, an email client with a matched
  receipt" — context sells the feature).
- Frame with a subtle rounded border, consistent across all surfaces (Dub renders
  images in Frame components; Mercury uses rounded-lg + 1px neutral border).
- Light theme for docs screenshots; provide dark variants only for hero/marketing
  images (Vercel: first_image_light/dark pairs on docs heroes only).

### Captions and alt text

- **Alt text is mandatory and functional**, describing state or action:
  "Getting started step in Create partner program" (Dub), "Select desired currency
  from dropdown" (Mercury). Never "screenshot of dashboard."
- **Visible captions are optional.** Dub, Mercury, and Stripe render no figcaptions;
  Vercel captions only diagrams with full-sentence declarative statements. Rule:
  screenshots inside a step need no caption (the step text is the caption); a
  diagram or standalone figure gets one full-sentence caption stating the takeaway.

### When to use what

| Situation | Use | Evidence |
|---|---|---|
| Reader must confirm a UI state mid-procedure | 1 screenshot per step (max 2–3 for dense steps) | Dub docs: framed screenshot(s) per Step |
| Dashboard click-path, simple | Numbered text steps with **bolded UI labels**, no screenshots | Vercel; Mercury bolds "Move Money → Deposit" |
| System/flow explanation (attribution flow, webhook lifecycle) | `<Mermaid>` diagram, one per page max, full-sentence caption | Mercury MCP architecture diagram; Vercel captioned diagrams |
| API behavior | Code block + response, never an image | Stripe: zero screenshots in a 4,500-word guide |
| Changelog UI feature | Exactly one 1600w screenshot | Mercury /releases |
| Changelog API/CLI feature | One runnable code block | Vercel FUSE entry |
| Comparison of options/plans | Table, not graphic | Stripe test-card matrix; Dub summary tables |

- **Never stack screenshots as a gallery** — one per point being proven (Mercury:
  "never zero, never a gallery").
- No decorative hero images inside docs pages. A single hero illustration directly
  after the intro is allowed on top-level landing pages only (Vercel /docs/functions).

---

## 7. Comparison appendix

### Docs guide pages

| Dimension | Dub | Mercury | Stripe | Vercel |
|---|---|---|---|---|
| Title style | Feature name + 1-line dek | Task verb + dek (dek = llms.txt description) | Imperative task ("Accept a payment") + dek | Product name + link-dense intro |
| Effort signal up front | Plan-gate Tip under dek | Beta callout (some pages) | "Integration effort" scorecard: Complexity 2/5, limits, live demo | Prerequisites in frontmatter |
| Step structure | Numbered Steps, 1–3 screenshots each; Option 1/2/3 with "(recommended)" | Numbered steps, screenshot per step | H2 verb steps with [Client-side]/[Server-side] badges; "Optional:" H2s last | Quickstart code + conceptual H2s as questions |
| Verification | "View conversion results" + "Example apps" | Deep links into live product | "Test your integration" + test-card table | Runnable code + emoji feedback widget |
| Ending | Edge-case H2s → verify → examples | Inconsistent (recap list / abrupt) | "See also" flat 5-link list | "Explore X": card units (title + one-liner + Learn more →) |
| Author/date shown | None | None (version selector only) | None (evergreen) | last_updated in frontmatter only |
| LLM plumbing | llms.txt + Copy page | llms.txt + .md URLs | .md suffix + "Instructions for LLMs" + agent skills | Markdown content negotiation + Copy page + open in v0 |

### Reference / API changelog pages

| Dimension | Dub | Mercury | Stripe | Vercel |
|---|---|---|---|---|
| Structure | Mintlify api-reference section | ReadMe /reference tab + version selector (v1/v2) | Fixed 5-section template: What's new / Why breaking / Impact / Changes / Upgrade | Frontmatter-typed pages (type: conceptual), related[] links |
| Media | Code tabs | H3-per-language (Ruby/Python/cURL) | Zero images; per-SDK parameter tables | Filename-labeled code with framework/language tabs |
| Versioning | None visible | v1/v2 selector | date.release strings (2026-06-24.dahlia), version-pinned deep links, Breaking flag | last_updated field |
| Breaking changes | — | — | Dedicated "Why is this a breaking change?" + 6-step Upgrade checklist + 72h rollback | — |

### Blog posts

| Dimension | Dub | Mercury | Stripe | Vercel |
|---|---|---|---|---|
| Length | 400–500 (product) to 2,500–3,000 (comparison) | 600–700 (product) to ~2,000 (guides/essays) | 550–1,300 | 700–1,100 (5 min read) |
| Byline | 1–2 authors, role + avatar | "By: name" (+role on company posts), Updated date | Headshot + LinkedIn + exact role | Names + avatars; role on some posts |
| Hero image | Branded hero + inline media per H2 | Exactly one hero, near-zero inline | Often none rendered; 1–2 inline max, no captions | Often zero images; code blocks do the showing |
| TOC | Sticky sidebar TOC (right) | None | None | None |
| Related posts | 4-card grid | 4-card "Related reads" | None (subscribe + hiring CTA) | None (sitewide deploy banner) |
| Signature move | Honest comparison template + summary table last | Rigid guide skeleton + "How Mercury helps" as skippable last H2 | Statistic cold-open; headings as claims | Filename-labeled code; quantified customer-story headlines |

### Changelog entries

| Dimension | Dub | Mercury (/releases) | Stripe (API changelog) | Vercel |
|---|---|---|---|---|
| Words of prose | 65–110 | 25–128 (median 57) | ~100–200 human-written (+generated tables) | 150–300 (400 for big) |
| Opening | "You can now..." | Benefit-verb headline + 1–4 sentences | Verb-first sentence title IS the summary ("Adds support for...") | First sentence = whole announcement |
| Author | 1–2, founder co-signs, avatar + role | None on /releases; named PMM team on monthly blog roundups | None (version metadata instead) | 1–6 real engineers, avatar + role ("Software Engineer, Compute") |
| Media | One branded hero (no title text baked in — verified) | Exactly one 16:9 screenshot (older entries: none) | Zero images; tables only | No hero; 1–3 code blocks; rare uncaptioned screenshot under an H2 |
| Metadata | Date, authors | Date + filterable product/category tag pills | date.release version, Breaking flag, affected products | Date, authors, "1 min read", Blog/Changelog breadcrumb |
| Closing | Imperative CTA sentence with link | CTA deep-link INTO the product | "Related changes" links | Fixed docs-link closing sentence |
| Feed | RSS | JSON Feed 1.1 mirror | .md dual-publish | RSS |

### Affitor decisions (where the four diverge)

- Changelog author: **yes** (Dub/Vercel) — small team, founder-signed entries are cheap credibility.
- Changelog media: Mercury's one-screenshot rule for UI, Vercel's code-block rule for API/CLI.
- Changelog CTA: Mercury's into-the-product link when the feature is clickable; Vercel's docs link otherwise.
- Blog chrome: Vercel's radical omission (no TOC/related/share) until volume justifies more.
- Docs verification section: Stripe's mandatory "Test your integration" — ours is "Verify it worked" via `<VerifySuccess>`.
- LLM plumbing: adopt llms.txt + per-page markdown (`.md`) as a build target — all four ship it; we currently don't.
