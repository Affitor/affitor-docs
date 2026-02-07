# Affitor Docs — Claude Rules

**Read first:** [../affitor-context.md](../affitor-context.md) — shared architecture & conventions.

## Stack
Astro 5.6.1 + Starlight 0.37.3

## Rules

1. **Content in MDX** — All docs in `src/content/docs/`. Use `.mdx` extension.
2. **Frontmatter required** — Every page needs: `title`, `description`. Optional: `author`, `tags`, `featured`.
3. **Sidebar config** — Defined in `astro.config.mjs`. Update when adding new sections.
4. **Stub pages** — 23 pages are stubs ("Coming soon"). Fill before launch.
5. **Images** — Put in `public/images/`. Reference as `/images/filename.png`.
6. **No custom CSS** — Use Starlight defaults. No Tailwind in this repo.
7. **Site URL** — `docs.affitor.com`. Set in `astro.config.mjs`.

## Content Status

| Section | Done | Stubs |
|---------|------|-------|
| Getting Started | 4 | 0 |
| Advertiser Quickstart | 1 | 6 |
| Tracking | 2 | 4 |
| FAQ | 1 | 0 |
| Support | 1 | 1 |
| **Total** | **9** | **11** |

## Key Files

| File | Purpose |
|------|---------|
| `astro.config.mjs` | Site config + sidebar |
| `src/content/content.config.ts` | Schema (custom fields) |
| `vercel.json` | Deploy config + security headers |
| `scripts/create-placeholders.js` | Stub page generator |

## Dev
```
npm run dev                      # Dev server (:4321)
npm run build                    # Build static site
npm run preview                  # Preview build
```
