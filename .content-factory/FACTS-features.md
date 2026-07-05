# Affitor — Product Feature TRUTH List

Generated 2026-07-05 by reading code. Sources (verified paths):
- `cms:` = /Users/sonpiaz/Affitor-main/.worktrees/cms-partner-invites/src/api (Strapi)
- `dash:` = /Users/sonpiaz/Affitor-main/.worktrees/dash-partner-invites/src (Next.js pages router)
- `cli:` = /Users/sonpiaz/Affitor-main/affiliate-cli/packages (cli, mcp, recipes)
- `skills:` = /Users/sonpiaz/Affitor-main/affiliate-skills

`(beta)` = built but gated/in-migration/actively-being-shipped. `(legacy)` = older product surface still in code.

Spot-verified 2026-07-05 against source (6 highest-impact claims: MCP tools, v1 tracking API, commission holds/audit, payouts, platform billing, partner invites) — all confirmed; invite action list corrected (cancel, not expire).

Re-verified 2026-07-05 (second pass, same 6 claims re-read from source files) — all 6 confirmed exactly, no corrections needed: MCP = 7 registerTool calls with the exact names listed; v1 routes = POST /v1/track/click|lead|sale|refund in v1-routes.ts; invite routes = send/list/suggestions/resend/DELETE-cancel/by-token/check/accept/decline with status enum [pending, accepted, declined, cancelled, expired] and invite_expires_at (expiry applied lazily on token access, not cron); commission schema has is_on_hold/hold_period_expires_at/hold_extension_count/auto_approve_enabled/rejection_reason + commission-refund.ts/commission-dispute.ts + affiliate-commission-audit; payout enum exactly [bank_transfer, paypal, stripe, wise] with /affiliate-payouts/:id/complete, payout-audit + transaction APIs, program.payout_threshold; billing = tier_applied/stripe_application_fee_id on affiliate-fee, /advertiser/billing/invoices/:id/pdf + /checkout-session routes, platform_fee_tiers + invoice_overdue_pause_enabled in affiliate-config.

## 1. Brand / Advertiser

- **Program creation + settings** — create an affiliate program with commission structure, cookie/attribution windows, hold periods, branding, ToS. `cms:affiliate-program` schema (default_commission_type/rate, cookie_window_days, attribution_window_days, attribution_model); `dash:pages/brand/create-program.tsx`, `containers/.../Advertiser/Settings/index.tsx` (tabs: business-details, approval-mode, commission, branding).
- **Brand workspace dashboard** — path-routed sections: dashboard, partners, applications, groups, policies, customer, commissions, billing, members, settings. `dash:config/brandTabs.ts`, `pages/brand/[[...section]].tsx`.
- **Partner applications review** — partners apply; brand approves/rejects with messages; `auto_accept` approval mode supported. `cms:affiliate-application` (application_status, initial_message, reject_message); `dash:components/.../Advertiser/AffiliateApplicationsList-v2.tsx`, `ProgramDetailsForm/ApprovalModeSection.tsx`.
- **Partner invites by email (beta)** — invite partners via tokenized email (send/resend/cancel/accept/decline + suggestions; invites auto-expire via `invite_expires_at`, status enum includes `expired`); active worktree feature. `cms:affiliate-partner-invite` routes (`/affiliate-programs/:id/partner-invites`, `/partner-invites/accept`); `dash:components/.../Advertiser/InvitePartnersDrawer/`, `pages/invite/partner.tsx`, `pages/invite/accept.tsx`.
- **Partner groups + versioned commission policies** — group partners; per-group default commission/hold/approval; policies with effective_from/to and previous_policy chain. `cms:affiliate-partner-group`, `cms:affiliate-commission-policy`; `dash:components/.../PartnerManagement/ChangePartnerGroupModal.tsx`.
- **Commission lifecycle with holds + audit trail** — commissions auto-created from sales, hold periods with expiry/extension, auto-approve, rejection reasons; every state change audited. `cms:affiliate-commission` (is_on_hold, hold_period_expires_at, hold_extension_count), `cms:affiliate-commission-audit`; refund/dispute reversal in `cms:affiliate-commission/services/commission-refund.ts`, `commission-dispute.ts`.
- **Stripe Connect onboarding** — brand connects Stripe account (status, charges/payouts enabled, requirements tracked). `cms:advertiser` schema (stripeConnectedAccountId, stripeChargesEnabled...); CLI `setup stripe` also drives it.
- **Stripe webhook auto-distribution** — incoming Stripe events analyzed and routed to sale/refund/dispute commission handlers with routing_reason + confidence_score, replayable log. `cms:webhook-distributor/services/webhook-distributor.ts`, routes `/webhook-distributor/stripe`; advertiser-facing event log in `dash:components/.../Advertiser/WebhookDistributorTab.tsx`.
- **Attribution windows + shadow attribution migration (beta)** — money follows click-rule; a parallel "signup rule" decision is logged per signup until `attribution_binding` flips per-program. `cms:attribution-shadow-decision/services/shadow-compute.ts` (explicit staged-migration design doc in header); `cms:affiliate-program.attribution_binding`.
- **Customer tracking with PII hygiene** — per-customer records with hashed+masked emails, per-partner customer relations (first/last purchase, totals). `cms:affiliate-customer` (email_hash, email_masked), `cms:affiliate-customer-partner`; hashing in `cms:utils/privacy-helpers` (used by webhook-distributor).
- **Platform billing: per-sale fees + monthly invoices** — tiered platform fee computed per sale event; monthly invoices with PDF, Stripe checkout payment, overdue pause. `cms:affiliate-fee` (tier_applied, stripe_application_fee_id), `cms:affiliate-invoice` routes (`/advertiser/billing/invoices/:id/pdf`, `/checkout-session`), config in `cms:affiliate-config` (platform_fee_tiers, invoice_overdue_pause_enabled); `dash:pages/brand/billing/[id].tsx`.
- **Workspace team members** — owner/member roles, email invites with tokens, activity log of workspace actions. `cms:affiliate-workspace-member` (role enum owner|member), `cms:affiliate-workspace-activity-log`; `dash:components/.../Advertiser/WorkspaceMembers/`.
- **Partner messaging (request-based)** — partners message brands; brand accepts/blocks/mutes conversations; file upload; unread counts; system messages. `cms:chat-message` routes, `cms:conversation-metadata` (accept, mute, message-requests); `dash:pages/brand/messages/`, `components/.../Advertiser/Messages/`.
- **In-app notifications** — typed, deduped notifications per recipient (advertiser or partner), mark-read/dismiss/stats. `cms:affiliate-notification` (dedupe_key, recipient_type) + routes.
- **Marketplace listing controls** — programs opt into public marketplace, can be featured; slug renames keep old URLs via alias. `cms:affiliate-program` (marketplace_visible, is_featured), `cms:program-slug-alias`.
- **Getting-started / integration status** — per-program integration readiness recalculated from real events (click/lead/payment tracking steps). `cms:affiliate-program/services/integration-status.ts`; `dash:components/.../Advertiser/GettingStarted/`, Settings integrations tabs (click-tracking, lead-tracking, payment-tracking).
- **Agent-first onboarding page** — dedicated page that hands a founder a paste-line for their AI agent (program id + API key + skill.md URL). `dash:pages/brand/onboarding/agent.tsx`, `utils/affitorDocs.ts` (buildAgentLine).
- **Share program** — shareable program link/modal for recruiting. `dash:components/.../Advertiser/ShareProgramModal/`.
- **Refer-a-brand program** — partners or advertisers refer new brands, earn recurring % of Affitor fee revenue with hold/release states and milestones. `cms:affiliate-referrer` (referrer_type, referral_balance), `cms:affiliate-referral` (recurring_rate, milestone_reached_date), `cms:affiliate-referral-commission` (hold_status, idempotency_key); routes `/affiliate-referrer/my-referral-code`, `/my-referred-brands`; `dash:containers/.../Advertiser/ReferAdvertiser/`.

## 2. Partner / Affiliate

- **Marketplace: discover + join programs** — public/authed program marketplace with search, featured, filters; per-program detail page; apply flow. `dash:pages/marketplace.tsx`, `pages/marketplace/[slug].tsx`, `cms:affiliate-application-form` (public application submissions with UTM capture).
- **Partner dashboard + per-program stats** — clicks/leads/conversions/revenue per joined program. `cms:partner-program` (total_clicks, total_leads, total_conversions, balance; routes `/affiliate-partner/programs/:id/stats`); `dash:pages/partner/performance.tsx`, `pages/affiliate/dashboard/`.
- **Referral links** — create/edit named links with short links, subids, per-link click/lead/conversion/revenue counters; template links with placeholders. `cms:affiliate-partner-referral-link` (short_link, subids, is_template, template_placeholders); `dash:components/.../Partner/AffiliatePartnerReferralLinks/`, `pages/referral-links-unified.tsx`.
- **Short links** — resolve + track short-link clicks with stats endpoint. `cms:short-link-resolver` routes (`/short-links/:shortLink/resolve`, `/track-click`, `/stats`).
- **Earnings + withdrawals** — balance per partner, payout request above program threshold via bank_transfer / paypal / stripe / wise; status flow with audit log; every money movement recorded as transaction. `cms:affiliate-payout` (payment_method enum, `/affiliate-payouts/:id/complete`), `cms:affiliate-payout-audit`, `cms:affiliate-transaction`; `dash:components/.../Partner/WithdrawalModal.tsx`, `pages/partner/withdraw.tsx`, `payout.tsx`.
- **Message brands** — start conversations with program advertisers (request → accept model). `dash:pages/partner/messages/`, `components/.../Partner/Messages/`.
- **Partner profile** — website + social handles (YouTube, X, Instagram, TikTok, LinkedIn). `cms:affiliate-partner` schema; `dash:pages/partner/profile.tsx`.
- **Partner-recruits-partner tracking** — partners record who recruited them (recruited_by/recruited_partners/recruited_at on `cms:affiliate-partner`). No dedicated UI found — data-model level (beta).
- **Notifications** — same notification system as brands (recipient_partner). `cms:affiliate-notification`.

## 3. Public site — research & discovery tools (legacy directory product)

- **Affiliate program directory** — browse programs by industry/category with commission info, cookie duration, payment methods, traffic rank. `cms:affiliate`, `category`, `industry`, `commission`, `payment-method`, `tag`; `dash:pages/[industry]/`, `pages/product/[id].tsx`, `pages/list.tsx`.
- **Traffic analytics per program** — monthly visits, bounce rate, top keywords/countries/sources charts. `cms:traffic-web` schema (visits, bounce_rate, traffic_sources, global_rank).
- **Top Ads library** — TikTok top ads per industry with CTR/cost/likes; keyword-fetch logs. `cms:top-ad`, `top-ad-log`; `dash:pages/top-ads/index.tsx`, `pages/ad/`.
- **Top Videos / social listening** — YouTube + TikTok video monitoring per program keyword, incl. video download/detail endpoints. `cms:social-listening` routes (`/fetch-youtube`, `/fetch-tiktok`, `/tiktok-download/:videoId`), `cms:social-log`; `dash:pages/top-videos/`.
- **YouTube transcript tool** — free public tool: fetch video transcript (cached with segments/languages). `dash:pages/script/index.tsx`; `cms:transcript-cache`, transcript endpoints under `cms:social-listening` routes.
- **AI script chat (legacy)** — LangChain multi-model (OpenAI/Anthropic/Google) chat sessions that process `/generate` commands into pages. `cms:aiscript/services/aiscript.ts`, `aiscript-session`, `prompt`, `user-prompt`, `ai-config`.
- **Page builder (legacy)** — user-authored pages with editor, view counts, SEO fields, tied to referrer links. `cms:page` schema; `dash:pages/editor/[id].tsx`, `pages/my-pages/`, `pages/landing-pages/`.
- **Consumer subscription for research tools (legacy)** — Stripe-billed tiers with request limits/day counters. `cms:subscription-tier`, `transaction`, `user-tracking-request`; `dash:pages/profile/upgrade/`, `pages/pricing/`.
- **Affitor's own referral program (legacy)** — referrer codes, referrer links, referral commissions and payouts for the subscription product. `cms:referrer`, `referrer-link`, `referral`, `referral-commission`, `payout`, `track-link`; `dash:containers/Referral/`.
- **Community SSO via Discourse (beta)** — SSO login/logout/return endpoints (user-sync route commented out). `cms:discourse/routes/discourse.ts`; `dash:pages/discourse/callback.tsx`.
- **Lead capture** — early-access + join/advertiser application forms. `cms:early-access-form`, `customer-info`; `dash:pages/get-early-access.tsx`, `pages/join/`.

## 4. Developer API

- **Program API key management** — per-program secret token (hashed at rest, masked display, one-time reveal on regenerate) in a dedicated Settings tab. `cms:affiliate-program.api_token_hash`; `dash:components/.../Advertiser/ApiKeyTab.tsx`.
- **Tracking REST API v1** — `POST /v1/track/click | /lead | /sale | /refund` server-side conversion endpoints. `cms:affiliate-tracking/routes/v1-routes.ts`, `controllers/v1-tracking.ts`.
- **Test + verification endpoints** — `/v1/cli/test-event`, `/tracking/test`, `/tracking/check-test-events`, `/tracking/readiness/:programId`, `/tracking/run-verification/:programId` verify a live integration end-to-end. `cms:affiliate-tracking/routes/*`, `cms:cli/routes/custom-routes.ts`.
- **Tracking status/analytics endpoints** — `/tracking/status|events|performance/:programId`. `cms:affiliate-tracking/routes/affiliate-tracking.ts`.
- **Browser tracking snippet** — click tracking via `affitor_click_id` cookie consumed by server calls (cookie name visible in Settings code examples). `dash:containers/.../Advertiser/Settings/index.tsx` (~line 2537).
- **Auth API** — email/password signup with verification, Google OAuth, Firebase auth, token validation. `cms:auth/routes/auth.ts` (12 endpoints incl. `/auth/firebase/authenticate`).
- **Lead auth hardening (beta)** — `lead_auth` + `payment_tracking_mode` flags on program gate S2S-only signup (prerequisite for attribution flip per shadow-compute design). `cms:affiliate-program` schema.
- **Agent-readable integration doc** — public `skill.md` served from docs site; the API-key UI emits a one-line agent instruction referencing it. `dash:utils/affitorDocs.ts`.

## 5. CLI (`affitor` on npm)

Package: `cli:cli` — "CLI-native affiliate tracking. Connect Stripe, track commissions, manage partners — all from your terminal."

- **`affitor login`** — browser-based auth: CLI opens URL, polls `/v1/cli/auth/poll` until token issued. `cli:cli/src/commands/login.ts`; server side `cms:cli-auth-session`, routes `/v1/cli/auth/start|callback|poll`.
- **`affitor init`** — initialize project config against a program. `cli:cli/src/commands/init.ts`; `cms:` `/v1/cli/init`.
- **`affitor onboard`** — end-to-end wiring: detect stack → install browser tracking → inject Stripe `track/sale` call into the webhook handler → verify; `--json` machine-readable step summary. `cli:cli/src/commands/onboard.ts`, `lib/stack-detect.ts`, `lib/webhook-detect.ts`, `lib/inject.ts`.
- **`affitor status` / `affitor test [event-type]`** — integration readiness + fire test events through the chain. `cli:cli/src/commands/status.ts`, `test.ts`; `cms:` `/v1/cli/status`, `/v1/cli/test-event`.
- **`affitor programs` / `whoami` / `logout`** — list programs, session info. `cli:cli/src/commands/`.
- **`affitor setup stripe|dns`** — Stripe Connect + domain setup from terminal. `cli:cli/src/commands/setup-stripe.ts`; `cms:` `/v1/cli/stripe-connect`.
- **Recipe registry** — canonical per-stack payment-tracking recipes shared by CLI, MCP, and docs; frameworks: next-app, next-pages, express, fastify, node. `cli:recipes/src/index.ts` (Framework type).
- **Non-Stripe providers (beta)** — provider detection knows polar/lemonsqueezy/paddle but code injection is Stripe-only (`injectStripeTrackSale`). `cli:recipes/src/index.ts` (Provider type), `cli:cli/src/lib/inject.ts`.

## 6. Agent / MCP

- **`@affitor/mcp` stdio MCP server** — lets AI agents (Claude Desktop, Cursor, ...) call Affitor as tools. `cli:mcp/src/index.ts` (`new McpServer({ name: 'affitor' })`).
- **Tools (7)** — `affitor_readiness`, `affitor_track_click`, `affitor_track_lead`, `affitor_track_sale`, `affitor_track_refund`, `affitor_get_integration_plan` (returns stack recipe), `affitor_run_verification` (end-to-end check). `cli:mcp/src/index.ts` registerTools.
- **Agent paste-line onboarding** — brand onboarding hands founders one line for their coding agent: "Follow <docs>/skill.md to integrate Affitor. Program <id> ... Key in AFFITOR_API_KEY." `dash:pages/brand/onboarding/agent.tsx`, `utils/affitorDocs.ts`.
- **Affiliate Skills library** — Claude-compatible skill pack for affiliate marketers across 8 stages (research, content, blog/SEO, landing, distribution, analytics, automation, meta), with registry + evals + platform setup. `skills:registry.json`, `skills/`, `evals/`, `setup/`.

## 7. Platform admin (internal ops)

- **Payout ops** — list/approve/mark-sent partner payouts. `cms:affiliate-payout` routes `/admin/affiliate-payouts/...`.
- **Invoice ops** — run generation, summary, mark-paid. `cms:affiliate-invoice` routes `/admin/invoices/...`.
- **Webhook replay/inspection** — `/admin/webhook-distributors`. `cms:webhook-distributor` routes.
- **Missed-sale reconcile** — `/admin/reconcile/missed-sales`. `cms:sale-reconcile/routes/sale-reconcile.ts`.
- **Runtime env reload** — `/system-config/reload-env`, `/env-status`. `cms:system-config`.
- **Admin dashboard pages** — `dash:pages/admin/` (dashboard, affiliate-management, authentication, architecture).
