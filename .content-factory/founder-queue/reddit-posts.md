# Reddit Founder-Voice Drafts — ready to post

> Founder-queue draft. Son posts from his real account, full disclosure, no cross-posting the
> same day. Per GROWTH-STRATEGY §6: the "reddit" query variant returned zero real threads in
> 8/8 probes — one substantive thread owns each variant uncontested.
>
> Voice per `FACTS-founder-profile.md`: flowing sentences, real numbers, honest failure arcs,
> no em-dashes, no corporate speak. Every number below traces to `FACTS-competitors.md`
> (prices live-fetched 2026-07-05), `FACTS-features.md` (code-verified), or
> `FACTS-founder-profile.md` / `FACTS-agent-commerce.md`.
>
> Posting notes: links live in the first comment, not the body (spam filters, and
> r/Entrepreneur removes link-in-body posts). Stay in the thread for the first 24h and answer
> everything. If a mod asks, both posts are disclosed self-promotion by the founder.

---

## Post 1 — r/SaaS

### Title
I built an affiliate platform where AI coding agents do the integration instead of your devs. Lessons from making the machine the customer

### Body
Disclosure first: I'm the founder of Affitor, this is a build in public post, and any links are in the first comment so the body stays clean.

The backstory. Affiliate software has a quiet failure mode: integration. Every tool hands you a snippet, a webhook guide, and a prayer, and a lot of founders abandon setup halfway because they can't tell whether tracking actually works. I decided to build the integration path for AI coding agents instead of humans. You run npx affitor onboard, or paste one line into Claude or Cursor. The tooling detects your stack, installs browser tracking, injects the sale tracking call into your Stripe webhook handler, then fires synthetic click, lead, and sale events through the whole chain until a readiness endpoint returns integration_verified: true. There's an MCP server with 7 tools so the agent can do all of that itself, and a skill.md file it reads instead of our human docs.

Lessons so far, AMA style.

1. Agents don't forgive. A human retries after a failed setup. An agent that fails its first integration never defaults to you again, it just recommends a competitor next time. So we ended up spending more effort on the self-verification loop than on the tracking itself. The verify step is the real product.

2. Docs are the API now. The paste line points the agent at a skill.md runbook, and we maintain llms.txt plus a raw .md route for every docs page. Machine readability turned out to matter more than the pretty human version of the same page.

3. Pricing had to match the promise. If an agent finishes your integration in minutes, charging $49 a month before the first affiliate sale feels wrong. As of July 2026, checked against each vendor's live pricing page: Rewardful starts at $49/mo, FirstPromoter at $49/mo with the API paywalled to the $99 tier, Tolt at $69/mo, PartnerStack from $1,000/mo billed annually. We went with $0 until $10K affiliate revenue, then 3.5% on affiliate-driven sales only. It means we earn nothing on programs that never activate, which is exactly the pressure that forced lesson 1.

4. Open source pulls harder than ads. I open sourced a pack of affiliate marketing skills for AI agents and the repo got 123 stars and 56 forks in the first 3 days, at $0 spend. It's at 50 skills now. We also run a free directory of 450 affiliate programs with a public API that agents can query with zero install.

Honest limits, because they matter more than the pitch: code injection currently works for Stripe only. We detect Polar, Lemon Squeezy, and Paddle but don't inject for them yet. And agents don't solve partner recruiting, that part is still very human.

Happy to go deep on building for agents as the user, attribution that survives cookie loss, or the pricing math. AMA.

### First comment (from Son, immediately after posting)
Links, since I kept the body clean:

- Product: https://affitor.com
- Docs (including the skill.md agents read): https://docs.affitor.com
- Open source skills repo: https://github.com/Affitor
- Free program directory with public API: https://openaffiliate.dev

All competitor prices in the post were checked against each vendor's live pricing page on July 5, 2026. If any of them changed since, tell me and I'll correct the post.

---

## Post 2 — r/Entrepreneur

### Title
My SaaS is free until the customer earns their first $10K, then we take 3.5%. The math and the tradeoffs of performance pricing

### Body
I run an affiliate marketing platform for SaaS companies, and the hardest decision so far wasn't technical, it was pricing. Sharing the reasoning because I rarely see the tradeoffs of performance pricing written down honestly. Founder here, so read everything with that in mind. No links in the body, details in the first comment if you want them.

The category default is a subscription with revenue caps. As of July 2026, checked against live pricing pages: Rewardful starts at $49/mo capped at $7,500/mo in affiliate revenue, FirstPromoter at $49/mo capped at $5,000/mo, Tolt at $69/mo, PartnerStack from $1,000/mo paid annually. Every one of them charges you before your program has earned a dollar.

Here's the problem with that for an early program. A new affiliate program typically earns nothing for months while you recruit partners and wait for the first conversions. If it takes you six months to reach your first $10K in affiliate-driven revenue, you paid Rewardful about $294 for the privilege of waiting. Not ruinous, but psychologically it's a tax on trying, and a lot of founders never start because of it.

So we flipped it: $0 monthly, $0 setup, your first $10,000 in affiliate-driven revenue is completely fee-free, and after that we take 3.5% of affiliate-driven sales only. Not your total revenue, only what partners actually generated. It's enforced in code as fee tiers and billed by monthly invoice.

The tradeoffs, honestly.

Where we lose: at scale we get more expensive than flat pricing. At $20K/mo in affiliate revenue our fee is $700/mo against a $99 flat plan elsewhere. Competitors literally write "revenue-share pricing punishes growth" in their marketing, and past a certain volume they have a point. Some customers will graduate away and we accepted that as the cost of the model.

Where it changed our behavior: we make $0 on every customer who signs up but never activates their program. That sounds scary and it is, but it forced us to build integration verification into the product instead of sending onboarding email sequences, because a customer who never tracks a sale is pure cost to us. When your revenue only exists if the customer's revenue exists, activation stops being a growth metric and becomes survival.

Where it wins: the customer we actually want is pre-revenue or early, the exact person a $49/mo floor filters out. And the fee never arrives before the value does, which makes the sales conversation very short.

Would you take a model where your product is free until it produces $10K for the customer? And for those further along, what breaks at scale that I'm not seeing yet?

### First comment (from Son, immediately after posting)
For anyone who wants to verify the numbers: all competitor prices were checked against each vendor's live pricing page on July 5, 2026 (Rewardful $49/mo, FirstPromoter $49/mo, Tolt $69/mo, PartnerStack from $1,000/mo annual). The platform is Affitor, the pricing model is documented publicly on our docs site, and I'm happy to share the link if that's okay with the mods, otherwise DM me. Full disclosure again: I'm the founder.
