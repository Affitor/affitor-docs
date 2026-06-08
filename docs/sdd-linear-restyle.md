# SDD — Affitor Docs Linear-style Restyle (+ Motion Layer)

> Status: **APPROVED (mockup signed off 2026-06-07)** · Owner: Son · Surface: `affitor-docs` (Fumadocs 16 / Next 16 / Tailwind v4)
> Mockup (approved): `docs/mockups/linear-restyle-create-account.html` (interactive, light/dark toggle)
> Companion analyses: docs proposal workflow + cross-surface token audit + animations.dev motion study (this session)

---

## 1. Goal & Thesis

Upgrade the docs UI/UX to a **Linear-grade** feel **without rebuilding** — stay on Fumadocs, theme aggressively + override 4–5 structural components (**Option B**, ~6–12 days), and add a **motion layer** (Phase 5) following Emil Kowalski's standards.

**"Linear style for Affitor" = restraint, not Linear's dark palette:**
- Near-monochrome surfaces; **blue `#155DFC` demoted from decorative → functional** (CTA, sidebar-active, selection, logo only).
- Editorial typography (Inter, 15px body, tight headings at weight 590).
- Spatial hierarchy by **1px border**, not filled cards or shadows.
- **Light stays default** (audience lives in light-mode Stripe/Vercel dashboards), but ship a polished **dark mode + working toggle**.

**Convergence principle:** the restyle must pull docs *toward* the dashboard DS (`affiliate-dashboard/src/components/ui/settings/tokens.ts`), not create a third design language. On the 4 highest-signal axes (brand discipline, gray temperature, radius, heading weight) Linear-direction already converges with the dashboard's Stripe-cool system. The one legitimate fork — **elevation** — is scoped on purpose (app = soft-shadow, docs = flat-border).

---

## 2. Design Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| Default theme | **Light**, with dark toggle enabled | Audience uses light-mode tools; dark-first = context-switch friction |
| Brand color | `#155DFC` functional-only | Matches dashboard "blue = primary action only" rule |
| Gray ramp | **Cool slate** (dashboard's), drop warm taupe | Kills the single biggest visual fork vs dashboard |
| Elevation | **Flat border for docs** (app keeps Stripe shadow) — documented as intentional scope | Both surfaces already diverged correctly; re-unifying = negative ROI |
| Code blocks | **Dark in both modes** | Syntax pops; matches current docs choice. (See §7 bug-fix) |
| Prose links | Monochrome (`color: inherit`) + subtle rest underline, ink on hover | Linear's #1 tell; keeps prose readable vs blue-everywhere |
| Emoji in callouts | **Removed** → real SVG icons | Part of the restraint upgrade |
| Theme-toggle icon | **Keep existing** (reuse Son's current toggle component/icon — do NOT redesign) | Son's instruction 2026-06-07. Mockup's emoji toggle is a demo affordance only |

---

## 3. Token Mapping (current → target)

All values land in `affitor-docs/src/app/globals.css`. **Heading/body ink converge to dashboard slate**, not warm.

| Token | Current | Target |
|---|---|---|
| Page bg (light) | `#F4F3F0` warm | `#FFFFFF` |
| Page bg (dark) | `#14130F` warm | `rgb(8,9,10)` cool |
| Heading ink (light) | `#111827` | `#262626` (dashboard) |
| Body text (light) | `#454340` 16px/1.75 | `#3c4257` **15px/1.6** (dashboard slate) |
| Muted (light) | `#767572` warm | `#6a7383` (dashboard) |
| Body text (dark) | `#a5a3a0` | `rgb(208,214,224)` — **via new `--color-fd-body-text` token (see §6.A2)** |
| H1 | 30px/700/-0.025em | **32px/590/-0.015em** |
| H2 | 24px/600 | 22px/590/-0.012em |
| H3 | 20px/600 | 17px/590 |
| Body links | `#155DFC` w500 | `inherit` w400, rest underline `--border-strong`, hover ink |
| Border (default) | 2 warm values (`rgba(165,163,160,.3)`, `rgba(16,15,12,.1)`) | `#e3e8ee` (dashboard), tokenized `--aff-card-border` |
| Card radius | 16px (`--aff-radius-lg`) | **10px** (dashboard band) |
| Card bg | `#FFFFFF` filled | `transparent` + 1px border, **no resting shadow** |
| Callout | filled colored box + emoji | **left-stripe 3px** + dashboard `dsFeedbackTones` colors + dark text + SVG icon |
| `--aff-error` | `#cf222e` | `#e5484d` (dashboard danger) |
| `--aff-warning` | `#ffa500` | `#d68a18` (dashboard warning) |
| Code block bg | `#0F0E0C`/`#14130F` warm | `rgb(14,15,17)` cool, both modes |
| Inter loading | weights `[400,500,600,700]` | **variable font** (drop weights array → enables 590) |
| Header height | 56px | 48px |
| Dead tokens | gold `#D4A843`, `--aff-dark-blue #0a3069` | **delete** (vestigial) |

---

## 4. Shared SSOT Token Set (8) + Mechanism

Pragmatic starter (not 14 — right-sized for 2 repos / 2-person team). **Today only `brand.blue` + `font.family` are truly shared; the rest are the convergence target.**

```
brand.blue        #155DFC
brand.blue.hover  #1249D6
brand.blue.tint   rgba(21,93,252,0.08)
font.family       Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
font.weights      [400, 500, 600]            # 700 = docs-only exception for article H1
gray.ink          #262626
gray.body         #3c4257
gray.help         #6a7383
border.default    #e3e8ee
```
Semantic tones (`danger/warning/success/info`) lifted verbatim from dashboard `dsFeedbackTones` **only when docs adds those callouts**.

**Mechanism (no monorepo):** `design-tokens.json` owned by dashboard repo (canonical); docs copies it. CI diffs the two JSON files. **Critical gap fix:** docs CSS can't import JSON → add `scripts/generate-css-tokens.js` (reads JSON → writes `_tokens.css` partial of `--aff-*` vars, imported atop `globals.css`), else CI only catches JSON drift, not stale CSS hex. For a 2-person team, a `TOKENS.md` canonical reference + manual copy is an acceptable v0; graduate to `@affitor/tokens` npm pkg only when Phase D (`@affitor/ui` extraction) triggers.

---

## 5. Phased Roadmap

Each phase ships independently and is **gated by `npm run build` passing + screenshot diff vs mockup** (per repo CLAUDE.md). Tag `pre-linear-restyle` before Phase 0 for rollback.

### Phase 0 — Token surgery + dead-code purge · **S (~1 day)**
- Rewrite `:root` / `.dark` fd-* + aff-* vars per §3 token table.
- `layout.tsx`: drop the `weight: [...]` array from `Inter()` → variable font (enables 590).
- Body → 15px/1.6 `#3c4257`; H1 → 32/590/-0.015em; H2/H3 per table.
- Links → monochrome.
- `--aff-radius-lg` 16→**10px**; consolidate the 7 radius values → sm 6 / md 10 / lg 12.
- Delete legacy CSS block (`globals.css` ~lines 997–1297), dead `src/components/mintlify/*.astro`, orphaned content tree, gold + dark-blue dead tokens.
- **VERIFY GATE:** `npm run build` must pass (variable-font swap can break the build); Lighthouse check (variable font adds ~180KB — acceptable with `display:swap`; fallback to weight 500 if hard constraint).

### Phase 1 — Card system · **S (~1 day)**
- All card classes (`.docs-card`, `.docs-flow-card`, `.docs-task-card`, `.docs-meta-card`, `.docs-checklist`, `.docs-recommended-path`, `.docs-verify`, `.docs-mistakes`, `.kyma-card`): bg → `transparent`(light)/`rgb(18,19,20)`(dark), radius → 10px, **remove resting box-shadow + translateY**, hover = border-color only (Phase 5 re-adds a *compliant* 1px lift).
- Step pills / check icons: brand-blue → muted gray; keep card-title-turns-blue-on-hover as the single blue injection.

### Phase 2 — Callout + sidebar · **S/M (1–2 days)**
- Callouts → left-stripe 3px + `dsFeedbackTones` colors, transparent bg tint, body stays ink. Remove emoji → SVG icons.
- **Tab-strip plan (critic must-fix — do NOT just drop `tabMode`):** keep the `tabs` prop but move tabs into the sidebar (sidebar mode), OR restructure root `meta.json` with separators for all sections. **Explicitly define sidebar behavior for `/changelog`** (separate collection in `source.config.ts`) before shipping.
- Sidebar items → 13px, active = 2px blue left-stripe + tint (no fill).
- Vertical rhythm: paragraph margin 20→16px, H2 margin-top 40→48px.

### Phase 3 — Header slot · **M (2–3 days, only real TSX work)**
- `docs-header.tsx`: 2-column (logo glyph + "Affitor / Docs" left | compact 220px search + Changelog/Dashboard ghost links + blue CTA + **existing theme toggle** right). Glass `backdrop-filter: blur(12px)`; height 48px.
- **Theme toggle: reuse Son's current toggle component/icon — do NOT replace or restyle the icon.** Only enable it (remove `themeSwitch:{enabled:false}` restriction).
- **Re-enable `searchToggle` (critic must-fix):** currently `enabled:false` in DocsShell but header renders a search button → wire it on, else it opens nothing.
- **Use real logo** `/affitor-icon.svg` glyph (NOT a fake "A" box).
- **Mobile header spec:** logo + theme toggle visible; search/links/CTA collapse into a menu. Define breakpoints explicitly.

### Phase 4 — Polish + dark tuning · **S (1–2 days)**
- Dark code bg → `rgb(14,15,17)`; inline code dark → `rgba(255,255,255,0.08)` / `rgb(199,210,230)`.
- Replace remaining hard-coded hex (`#111827`, `#454340`, `#565552`) with token refs.
- Reduce `!important` 47 → <20 (only where Fumadocs cascade confirmed safe).
- WCAG AA verified: light body `#3c4257` on white ≈ 9.7:1; dark body `rgb(208,214,224)` on `rgb(8,9,10)` ≈ 13.3:1; muted both ≥4.6:1. ✅

### Phase 5 — **Motion layer** · **S/M (1–2 days)** — NEW
Apply Emil Kowalski's standards (animations.dev). See §6 for the rule set. Ships a defined, restrained motion system — not ad-hoc animations.

---

## 6. Motion Layer Spec (Phase 5)

Source of truth: Emil Kowalski, *Great animations* + `emil-design-eng/SKILL.md`. **Every animation must answer "why does this animate?"**

### 6.1 Global rules (enforce as lint/review checklist)
- **Easing:** enter/exit → `ease-out`; on-screen move → `ease-in-out`; hover/color → `ease`. **Never `ease-in`** on UI.
- **Duration:** **< 300ms** for all UI. Buttons 100–160ms · tooltips 125–200 · dropdowns 150–250 · modals/drawers 200–500.
- **Only animate `transform` + `opacity`.** Never `height/width/margin/padding/gap`. **Never `transition: all`** — name properties.
- **Entry:** never `scale(0)` → start `scale(0.95)` + `opacity:0`.
- **Frequency:** no animation on 100+/day or keyboard-initiated actions.
- **Interruptible:** CSS transitions (not keyframes) for rapid-fire UI.
- **A11y:** `@media (prefers-reduced-motion: reduce)` → drop transforms, keep opacity/color; wrap hover in `@media (hover:hover)`.
- Named curve: strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`; iOS drawer `cubic-bezier(0.32, 0.72, 0, 1)`.

### 6.2 Per-surface motion map (docs)
| Element | Motion | Rule applied |
|---|---|---|
| CTA / copy button | `transform: scale(0.97)` on `:active`, 160ms strong-ease-out | button press 100–160ms |
| Card / callout hover | `border-color` + `translateY(-1px)`, 150ms ease-out | occasional, transform-only |
| Sidebar-active / TOC dot | indicator moves via `transform`, 200ms ease-in-out | on-screen move |
| Theme toggle | `opacity` crossfade 200ms ease, **no transform** | avoid layout jump |
| Search ⌘K dialog | `scale(0.97)→1` + `opacity`, 150–200ms, `transform-origin:center` | modal entry |
| Mobile sidebar drawer | Vaul-pattern: `translateY`, momentum dismiss (velocity > 0.11), edge friction | gesture/spring |
| **Do NOT animate** | page transitions, scroll, long-TOC expand | frequent/repeated task |

### 6.3 Already prototyped in approved mockup
CTA `scale(0.97)`/160ms with `cubic-bezier(0.23,1,0.32,1)`; card hover lift 150ms; `prefers-reduced-motion` guard. These are the reference implementation.

---

## 7. Bug-fix folded in (caught on mockup review)

**Code-block title bar invisible in light mode.** Cause: `.codeblock` container had no background, only `<pre>` was dark; the title strip's `rgba(255,255,255,0.03)` overlay rendered white-on-white. **Fix:** give `.codeblock` the dark `--code-block-bg`, so the strip's subtle white overlay sits on dark → light text legible. (Applied in mockup; carry into Phase 2/4 CSS.)

---

## 8. Risks & Verification Gates

- **Build gate every phase** — `npm run build` + screenshot-diff vs mockup. Variable-font swap (Phase 0) is the highest build-break risk.
- **Dark body-text token** — Phase 0 must add `--color-fd-body-text: rgb(208,214,224)` and use it on `.dark article` (currently line 111 points at `muted-foreground`), else dark body goes dim-gray, not the intended blue-gray.
- **Tab-strip / changelog routing** — define before Phase 2 ships (see §5 Phase 2).
- **Search re-enable** — Phase 3, or header search opens a void.
- **Monochrome link affordance** — if analytics show missed inline links, the rest-state underline is the built-in fallback; tune underline opacity in light (borders read harsher on white — use ~0.10–0.12, not 0.08).
- **Fragile Fumadocs internal selectors** (`#nd-sidebar > div:first-child`, etc.) — pin `fumadocs-ui` to 16.7.x; audit selectors in Phase 4.
- **Rollback** — tag `pre-linear-restyle`; optional PostHog event on inline-link clicks for before/after.

---

## 9. Out of Scope / Open Questions

- Full custom rebuild (Option C) — rejected for a 2–3 person team.
- Sanity-style per-page hero images, Ask-AI sidebar — feature work, not this restyle.
- `@affitor/tokens` npm package — defer to Phase D (`@affitor/ui` extraction).
- Open Q: tint home hero to a faint brand gradient? (optional, Phase 4).

---

## 10. Execution Order

`Phase 0 → 1 → 2 → 3 → 4 → 5`, each its own PR to **uat** (Affitor flow: `feat/docs-linear-restyle-phaseN` → PR uat → verify → PR main). Phase 0 is the high-ROI quick win (ships a visibly different site day 1). Motion (5) lands last so it polishes a stable layout.
