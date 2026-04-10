# Affitor Docs — Claude Rules

**Read first:** [../affitor-context.md](../affitor-context.md) — shared architecture & conventions.

## Stack
Astro 5.6.1 + Starlight 0.37.3

## Rules

1. **Content in MDX** — All docs in `src/content/docs/`. Use `.mdx` extension.
2. **Frontmatter required** — Every page needs: `title`, `description`. Optional: `author`, `tags`, `featured`.
3. **Sidebar config** — Defined in `astro.config.mjs`. Update when adding new sections.
4. **Canonical-first docs** — Public docs are derived from the owning runtime repo. Verify behavior in `affiliate-cms`, `affiliate-dashboard`, `affiliate-list`, or `affiliate-skills` before changing product claims.
5. **Images** — Put in `public/images/`. Reference as `/images/filename.png`.
6. **Custom docs UI is allowed** — This repo currently uses shared custom components under `src/components/mintlify/` and site styles in `src/styles/custom.css`. Reuse existing patterns; do not add Tailwind.
7. **Site URL** — `docs.affitor.com`. Set in `astro.config.mjs`.

## Content Status

Content status changes frequently. Do not trust static counts here as canonical truth.
Audit `src/content/docs/` directly and verify claims against the owning runtime repo before editing.

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Site config + sidebar |
| `src/content/content.config.ts` | Schema (custom fields) |
| `src/components/mintlify/*` | Reusable docs UI components |
| `src/styles/custom.css` | Shared docs styling |
| `vercel.json` | Deploy config + security headers |

## Dev
```
npm run dev                      # Dev server (:4321)
npm run build                    # Build static site
npm run preview                  # Preview build
```
