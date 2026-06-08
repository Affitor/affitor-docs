# Affitor Design Language — Reusable Reference

> Cross-surface design reference. Born from the docs Linear-restyle (2026-06-07), but written **surface-agnostic** so it can be applied to **dashboard** and **homepage/marketing** next.
> Companion: `docs/sdd-linear-restyle.md` (docs execution) · live mockup `docs/mockups/linear-restyle-create-account.html`.

---

## 0. The one-sentence philosophy

**Linear-grade restraint + Stripe-cool palette + functional-only brand blue + purposeful motion.** Hierarchy comes from typography and 1px borders, not color or shadow. Color appears at *interaction*, not decoration.

The four DS layers: **`color · type · space · motion`**. Most teams ship the first three and skip motion — motion is what makes Linear *feel* premium, so it's a first-class layer here.

---

## 1. Token SSOT (shared across surfaces)

Today only `brand.blue` + `font.family` are *literally* shared between docs and dashboard. The table below is the **convergence target** — the canonical values any Affitor surface should adopt.

| Token | Light | Dark | Notes |
|---|---|---|---|
| `brand.blue` | `#155DFC` | `#5881FF` (lifts) | **functional only** — CTA, active, selection, focus, logo. Never decorative. |
| `brand.blue.hover` | `#1249D6` | `#6F92FF` | |
| `brand.blue.tint` | `rgba(21,93,252,0.08)` | `rgba(88,129,255,0.14)` | active bg, soft accents |
| `font.family` | `Inter` (variable) + system | same | load the **variable axis** to unlock weight 590 |
| `font.mono` | `JetBrains Mono`, ui-monospace | same | |
| `font.weights` | `400 / 500 / 590 / 600` | — | **never 700** (docs article H1 is the single allowed exception) |
| `gray.ink` (headings) | `#262626` | `#f7f8f8` | dashboard slate |
| `gray.body` | `#3c4257` | `#d0d6e0` | **dedicated body token**, not muted |
| `gray.help` (muted) | `#6a7383` | `#80848c` | captions, secondary |
| `surface.bg` | `#ffffff` | `#08090a` | pure white / Linear near-black |
| `surface.card` | `transparent` or `#fff` | `#121314` | border-only, no resting shadow (docs) |
| `border.default` | `#e3e8ee` | `rgba(255,255,255,0.07)` | |
| `border.strong` | `#d8dee4` | `rgba(255,255,255,0.14)` | inputs, link underline |
| `radius` | `10px` (card) · `7px` (button) · `6px` (input) | same | docs cards use 10px |
| `code.bg` | `#0e0f11` | `#0e0f11` | dark in both modes |
| `code.text` | `#c7d2e6` | `#c7d2e6` | |
| **Semantic** (verbatim from dashboard `dsFeedbackTones`) | | | pale bg + solid icon/stripe + **dark text, never colored** |
| `danger` | solid `#e5484d` · bg `#fef2f2` | bg `rgba(229,72,77,.09)` | |
| `warning` | solid `#d68a18` · bg `#fffbeb` | bg `rgba(214,138,24,.09)` | |
| `success` | solid `#15935e` · bg `#ecfdf5` | bg `rgba(21,147,94,.09)` | |
| `info` | solid `#155dfc` · bg `#eff6ff` | bg `rgba(88,129,255,.08)` | |

**Type scale** (docs/long-form): H1 `32px/590/-0.015em` · H2 `22px/590/-0.012em` · H3 `17px/590/-0.008em` · body `15px/1.6` · section-label `12–13px/600/uppercase/0.04–0.06em`. (Dashboard/app body is denser at `14px`; keep that — see §3.)

**Sharing mechanism (no monorepo):** `design-tokens.json` owned by the dashboard repo (canonical) → docs copies it; CI diffs the two. Docs needs a `generate-css-tokens.js` step (JSON → `_tokens.css` partial) since CSS can't import JSON. v0-acceptable: a `TOKENS.md` reference + manual copy. Graduate to `@affitor/tokens` npm pkg only when `@affitor/ui` extraction (Phase D) happens.

---

## 2. Motion standards (reusable "skill") — Emil Kowalski / animations.dev

> Source: Emil Kowalski (design engineer @ Linear; author of Sonner, Vaul). [Great animations](https://emilkowal.ski/ui/great-animations) · [SKILL.md](https://github.com/emilkowalski/skill/blob/main/skills/emil-design-eng/SKILL.md). There are community Claude skills that codify these (`design-motion-principles`) — worth installing as a reusable agent skill.

**Every animation must answer "why does this animate?" — else delete it.**

| Topic | Rule |
|---|---|
| Easing | enter/exit → `ease-out`; on-screen move → `ease-in-out`; hover/color → `ease`. **Never `ease-in`** on UI. |
| Duration | **< 300ms** all UI. Button 100–160ms · tooltip 125–200 · dropdown 150–250 · modal/drawer 200–500. |
| Frequency | 100+/day or **keyboard-initiated → do NOT animate** (feels slow). |
| Properties | only `transform` + `opacity` (GPU). Never `height/width/margin/padding/gap`. **Never `transition: all`** — name properties. |
| Entry | never `scale(0)` → start `scale(0.95)` + `opacity:0`. Popover `transform-origin` = trigger; modal = center. |
| Interruptible | CSS transitions (not keyframes) for rapid-fire UI. |
| A11y | `@media (prefers-reduced-motion: reduce)` → drop transforms, keep opacity/color. Wrap hover in `@media (hover:hover)`. |
| Named curves | strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` · iOS drawer `cubic-bezier(0.32, 0.72, 0, 1)`. |
| Spring | drag/playful only; bounce `0.1–0.3`; most UI = no bounce. |

**Component motion map (any surface):** button press `scale(0.97)`/160ms · card hover `translateY(-1px)`/150ms ease-out · active indicator move via `transform`/200ms ease-in-out · theme toggle = `opacity` crossfade (no transform) · modal/⌘K = `scale(0.97)→1`+opacity, origin center · mobile drawer = Vaul pattern. **Do NOT animate**: page/route transitions, scroll, frequently-expanded trees.

---

## 3. What is shared vs surface-specific (legitimate forks)

Stripe/Linear/Vercel all let app ≠ docs ≠ marketing while sharing primitives. Affitor's intentional forks:

| Axis | App (dashboard) | Docs | Marketing/homepage |
|---|---|---|---|
| **Elevation** | **Stripe soft-shadow** (`0 0 0 1px …, 0 2px 5px …`) | **flat border-only** | flat / hero gradients |
| Density | dense (14px body, 22px card pad) | airy (15px, 48px H2 top) | airy, large hero type |
| Links | blue = action (app chrome) | monochrome prose links | per-design |
| Default theme | forced-light | light + dark toggle | per-design |

**Shared everywhere:** brand blue (functional), Inter, semantic palette + "muted bg + dark text" callout discipline, uppercase-600-muted section labels, the motion standards in §2, radius family.

> Document the elevation fork explicitly so it reads as *intentional scope*, not drift.

---

## 4. Applying to other surfaces later

- **Dashboard** (`affiliate-dashboard`, already Stripe-DS): mostly already converged (slate grays, semantic discipline, never-700). To Linear-ize: adopt the §2 motion standards, tighten heading letter-spacing toward `-0.015em`, keep soft-shadow elevation. Lowest-effort high-value = motion layer + a `Chart.tsx`-style single-source for transitions.
- **Homepage/marketing**: airy register, can use hero gradients (the one place chroma is allowed), large variable-weight type, the §2 motion for scroll/entry — but still functional-only blue and the shared palette.
- **Reuse path**: lift §1 token table into `design-tokens.json`, install a `design-motion-principles` skill for §2, and apply the §3 fork table to decide per-surface choices.

---

## 5. Honest gaps / follow-ups (docs restyle, 2026-06-07)

- **Callout semantic color**: blockquote callouts are all info-blue (CSS can't vary by emoji). Warning/success need content to use real callout components (`<Callout type=…>`), which means content edits.
- **Emoji in content** (💡⚠️✅): still present; removal is a content pass.
- **Bespoke components from the mockup** (numbered step-cards, 2×2 card grids, icon checklists): need content/MDX structure (`<Steps>`, `<Cards>`), not just CSS. Re-theme delivers ~80% of the mockup feel on existing markdown; these are the remaining ~20%.
- **Tab strip → sidebar**: kept the Fumadocs top tab strip (real section nav); consolidating into the sidebar is an optional Linear-purist follow-up.
- **Shared token mechanism**: not yet wired (`design-tokens.json` + CI) — do when dashboard work starts.
