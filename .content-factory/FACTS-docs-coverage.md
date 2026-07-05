# FACTS: Docs coverage vs product (2026-07-05)

Source of truth: `content/docs/**` + `content/changelog/*.mdx` (61 MDX pages: 56 docs, 5 changelog),
`CONTENT-STANDARD.md`, and the dashboard app nav at
`affiliate-dashboard/src/components/AffiliateManagement/Advertiser/brandNav.tsx:45-54` (advertiser)
and `affiliate-dashboard/src/containers/AffiliateManagement/Partner/PartnerNavBar.tsx:52-59` (partner).

---

## 1. Page inventory

### Getting started (3 + root)
| Page | Covers |
|---|---|
| `docs/index.mdx` | What Affitor is, stack fit, performance pricing teaser, audience |
| `getting-started/index.mdx` | Reading order + what Affitor helps you do (advertiser focus) |
| `getting-started/how-it-works.mdx` | 7-step affiliate lifecycle, click → commission → payout |
| `getting-started/pricing-performance-model.mdx` | 3.5% fee model, invoice billing, $10K guarantee |

### Brand / advertiser — quickstart (9)
| Page | Covers |
|---|---|
| `brand/quickstart/index.mdx` | Setup checklist landing page |
| `brand/quickstart/create-account.mdx` | Advertiser registration walkthrough (portal → role → email → wizard) |
| `brand/quickstart/setup-program.mdx` | Program details, approval mode, commission, tracking steps, sharing |
| `brand/quickstart/define-commission.mdx` | Commission types (rev-share/CPC/CPL/CPS), per-group rates, duration |
| `brand/quickstart/inviting-partners.mdx` | Invite by email/CSV/other-programs; auto-written invitation email |
| `brand/quickstart/partner-approval-quality-control.mdx` | Approval modes, reviewing applications, managing/removing partners |
| `brand/quickstart/view-performance.mdx` | Dashboard tab: overview metrics, charts, Action Center, partner table |
| `brand/quickstart/commission-approval-cash-flow.mdx` | Sale → commission → invoice → payout pipeline; hold workflow; refunds |
| `brand/quickstart/payouts.mdx` | Payout workflow, methods, status states, advertiser's role |

### Brand / advertiser — tracking (7)
| Page | Covers |
|---|---|
| `tracking/quickstart-integration.mdx` | 3-step integration: tracker install, signup, sale (Stripe or server-side) |
| `tracking/tracking-overview.mdx` | Core model: click/lead/sale linkage, identifier mapping, attribution basics |
| `tracking/click-tracking.mdx` | Tracker SDK / script tag install, link format, verify, common issues |
| `tracking/lead-tracking-signup.mdx` | Browser `signup()` vs server lead API, test mode, failure modes |
| `tracking/payment-tracking-stripe.mdx` | Sale tracking: server-side vs Stripe metadata; pay-as-you-go; attribution lookup |
| `tracking/payment-flow.mdx` | End-to-end narrative click → attributed revenue; one-time vs subscription |
| `tracking/testing-integration.mdx` | Test-mode verification of click/lead/sale, real-world scenarios, go-live |

### Brand — billing (1) + CLI (2)
| Page | Covers |
|---|---|
| `billing/overdue-policy.mdx` | Unpaid invoice timeline, program pause, resume, how to pay |
| `cli/quickstart.mdx` | `npx affitor` 3-command setup + non-interactive mode |
| `cli/commands.mdx` | Full CLI reference: init/onboard/setup stripe/status/test, config, errors |

### Partners side (8)
| Page | Covers |
|---|---|
| `partners/index.mdx` | Partner landing: earning path, how it works, start-here cards |
| `partners/quickstart/create-account.mdx` | Sign up, verify email, pick Partner role |
| `partners/quickstart/find-and-join-programs.mdx` | Marketplace browse, apply, approval |
| `partners/quickstart/get-your-referral-link.mdx` | Find/copy/share the tracked link |
| `partners/dashboard.mdx` | Tour of Home / Performance / Analytics / Customers / Payout tabs |
| `partners/payouts.mdx` | Balance, payment method setup, withdraw, timing, refunds |
| `partners/refer-program.mdx` | Refer-a-brand program legal terms (rewards, holds, clawbacks) |
| `partners/faq.mdx` | Partner FAQ: joining, approval, links, getting paid |

### API reference (20)
| Page | Covers |
|---|---|
| `api-reference/overview.mdx` | Base URL, auth, response envelope, endpoint families, test mode |
| `track-click.mdx` / `track-lead.mdx` / `track-sale.mdx` / `track-refund.mdx` | The 4 tracking endpoints (params, responses, errors, test mode) |
| `status.mdx` / `events.mdx` / `performance.mdx` | Program API: integration status, event list, performance aggregates |
| `integrations/nextjs.mdx` (+ `-clerk`, `-supabase`, `-nextauth`) | Next.js recipes per auth provider: click, signup, sale |
| `integrations/stripe.mdx` | Canonical Stripe metadata recipe, one-time + subscription |
| `integrations/node-express.mdx` / `integrations/fastify.mdx` | Server SDK recipes incl. raw-body Stripe webhook |
| `attribution.mdx` | Cookie, click ID, windows, last-partner-wins, recurring attribution |
| `errors.mdx` | Error codes by class + troubleshooting (CORS, cookies, duplicates) |
| `sdks.mdx` | `@affitor/sdk` browser + server: options, methods, full examples |
| `agent-integration.mdx` | AGENTS.md instruction files for AI coding agents |
| `mcp.mdx` | `@affitor/mcp` server: setup, tools, verification tool |

### FAQ + Support (5)
| Page | Covers |
|---|---|
| `faq/index.mdx` | Cross-cutting FAQ: pricing, tracking, commissions, support |
| `support/index.mdx` | Self-serve path + what to include when contacting support |
| `support/contact.mdx` | Emails, socials, location, response commitment |
| `support/status.mdx` | No status page yet; what to do if you suspect an outage |
| `support/glossary.mdx` | A–Z terms (advertiser, attribution, customer key, hold period…) |

### Changelog (5)
| Entry | Covers |
|---|---|
| `2026-03-28-affiliate-skills-v2` | 47 open-source agent skills library (CLI) |
| `2026-04-10-partner-profile-settings` | Partner Settings page: Account + Security tabs |
| `2026-04-20-content-lab-launch` | Content Lab on openaffiliate.dev — one-click affiliate posts |
| `2026-04-25-faster-docs-search` | Title-only ⌘K docs search |
| `2026-07-05-invite-partners` | Partner invites (email/CSV/cross-program) + unified partners table |

---

## 2. Standard violations (vs CONTENT-STANDARD.md)

### Changelog (standard §5)
- **All 5 entries missing `authors`** — standard mandates named humans (`authors: [son]`); no entry has the field.
- **`2026-07-05-invite-partners`: 164 words of prose** — over the 65–130 budget; the 4-bullet "shipped alongside" list belongs in docs.
- **Missing the "one visual OR one code block" rule** in 3 entries: `affiliate-skills-v2` (CLI feature, no runnable code block — bullets only), `partner-profile-settings` (Dashboard feature, no screenshot), `faster-docs-search` (no visual, no code).
- **Missing imperative closing CTA** in 4 of 5: only `invite-partners` closes with a link ("Read the full guide"); `affiliate-skills-v2`, `partner-profile-settings`, `content-lab`, `faster-docs-search` end on a plain sentence.

### Docs guides (standard §2)
- **`brand/quickstart/create-account.mdx`** — worst offender: two "Step 3" headings (lines 44 + 50, real duplicate); uses raw `> **Note**:` blockquotes instead of `<Callout>`; zero standard components (no PageMeta/VerifySuccess/NextStep); has an in-page "Frequently Asked Questions" H2 (FAQ content belongs in `/faq`); "What You'll Learn" heading instead of a dek-style opener.
- **`brand/quickstart/define-commission.mdx`** — no PageMeta, no verification section, no components at all; two "Coming Soon" sections (CPC/CPL/CPS "Coming Soon" + "Group Rewards (Coming Soon)") — docs should be evergreen product surface, roadmap belongs in changelog/blog; "Best Practices" filler H2.
- **`brand/quickstart/view-performance.mdx`** — zero components; no "Verify it worked" equivalent; "Best Practices" + "About Data Access" filler sections; noun-ish sections instead of task flow.
- **`brand/quickstart/partner-approval-quality-control.mdx`** — noun title ("Partner Approval & Quality Control" — standard: titles are tasks); no components; ends on "Coming Soon" instead of verification + next step.
- **`brand/quickstart/inviting-partners.mdx`** — no PageMeta/Verify/NextStep; ends at "Tips", violating "never end a page at the last instruction".
- **`brand/tracking/*` titles are feature nouns** — "Click Tracking", "Lead Tracking (Signup)", "Payment Tracking", "Tracking Overview", "Testing Integration" all violate principle 2 (task-phrased titles) — should read like "Track clicks from your site". Content itself is strong (options, verify sections, failure modes) but none use `<VerifySuccess>`/`<CommonMistakes>` components (plain H2s instead).
- **`brand/cli/quickstart.mdx`** — "Why CLI?" throat-clearing H2; no PageMeta, no components, no next-steps handoff.
- **Ending-handoff rule broken widely**: `payment-tracking-stripe.mdx` ends on "Troubleshooting → 401", `payment-flow.mdx` and `click-tracking.mdx` end acceptably ("Next Steps") but without `<FeatureCards>`/`<NextStep>` components.
- Compliant models worth copying: `getting-started/index.mdx`, `brand/quickstart/index.mdx`, `payouts.mdx`, `commission-approval-cash-flow.mdx`, `billing/overdue-policy.mdx` (PageMeta + Flow/Mermaid + NextStep) and all 7 `api-reference/integrations/*` (numbered steps + Verify + CommonMistakes + NextStep).

### Reference pages (standard §3)
- **`track-click.mdx`** — "## Auth" instead of "## Authentication"; ends with "## Next steps" instead of the flat "## Related" list its siblings use.
- **`status.mdx`, `events.mdx`, `performance.mdx`** — no "Related" section; `status.mdx` has no example request block (standard: one copy-paste-runnable block).
- **Heading-case drift** across reference pages: "Request Fields" vs "Request fields" vs "Body fields"; "Path Parameter" vs "Path Parameters".
- Only `track-sale.mdx` uses `<ResponseTabs>`; the other three track endpoints render responses as plain headings.

### Site-level
- **`llms.txt` exists** — `public/llms.txt` shipped 2026-04-10 (updated since; full page index + agent entry point). The standard's own closing line ("we currently don't", `CONTENT-STANDARD.md:390`) is stale on this half. **Per-page `.md` is still missing** — no markdown route per docs URL; only the single agent runbook `public/skill.md`.

---

## 3. Missing pages (product features with zero/thin docs)

Advertiser nav (brandNav.tsx, visible tabs): Dashboard, Partners, Applications, Groups, Customer, Commissions, Billing, Settings. Hidden (skip): Policies, Members.

| Nav item | Docs state | Gap |
|---|---|---|
| Dashboard | Covered — `view-performance.mdx` | — |
| Partners | Covered — `inviting-partners` + `partner-approval-quality-control` | — |
| Applications | Covered — inside `partner-approval-quality-control` | — |
| **Groups** | **No page.** Mentioned only in passing (`define-commission.mdx:12-14,60` plus its roadmap-only "Group Rewards (Coming Soon)" section at `:133-135`, `inviting-partners.mdx:46,63`) | MISSING: managing the Groups tab — create/rename groups, move partners, per-group policy mechanics. Commission model is per-group, so this is a core concept with no home |
| **Customer** (referrals tab) | **Zero docs.** No advertiser page mentions the referred-customers list (masked emails, per-customer attribution — `CustomersList.tsx` exists in product) | MISSING: "View your referred customers" page |
| Commissions | Partial — `commission-approval-cash-flow.mdx` covers the workflow conceptually | Thin on the actual Commissions tab UI (row-level approve/reject/hold) |
| Billing | Partial — `overdue-policy.mdx` (pause + how to pay) and pricing page (model) | MISSING: normal-path Billing tab walkthrough — invoice list, statuses, payment methods before anything is overdue |
| **Settings** | **No page.** API key location gets only scattered one-sentence pointers (`api-reference/overview.mdx:39`, `sdks.mdx:155`, `track-sale.mdx:20`, `errors.mdx:32`) | MISSING: program settings page — edit terms after launch, API key management/rotation, `ApiKeyTab` exists in product |

Partner side (PartnerNavBar: Home / Marketplace / Payout; pages: analytics, performance, payout, profile, withdraw, messages):

| Feature | Docs state | Gap |
|---|---|---|
| Home / Marketplace / Payout / withdraw | Covered — `partners/dashboard.mdx`, `find-and-join-programs`, `partners/payouts.mdx` | — |
| **Partner profile & settings** | **Zero docs** — announced in changelog `2026-04-10` (Account + Security tabs) but `partners/dashboard.mdx` covers only Home/Performance/Analytics/Customers/Payout | MISSING: profile, avatar, password, payout details settings page |
| **Messages** | **Zero docs** — product has messages surfaces on both sides (`src/pages/partner/messages/`, advertiser `Messages/` component dir) | MISSING: partner↔advertiser messaging page (both personas) |
| Analytics | Thin — one 2-line section in `dashboard.mdx` | Optional deeper page if the tab grows |

Other zero-doc surfaces referenced by shipped changelog entries:
- **Content Lab** (`2026-04-20`) — external openaffiliate.dev tool, no docs anywhere; fine if intentionally out of docs scope, but nothing says so.
- **Agent skills library** (`2026-03-28`) — GitHub-linked only; `agent-integration.mdx` covers AGENTS.md but not the 47-skill library.

Persona gap: docs cover advertiser + partner. No docs for **customer-facing behavior** (what the referred customer sees/consents to — cookie disclosure) — relevant for privacy/compliance questions in FAQ but undocumented.
