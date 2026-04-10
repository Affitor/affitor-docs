# Affitor Docs

Public documentation site for Affitor, built with Astro + Starlight.

- **Site:** https://docs.affitor.com
- **Local dev:** `http://localhost:4321`
- **Content root:** `src/content/docs/`

## What lives here

This repo owns the docs-site structure and published documentation content.

Current docs sections include:

- `src/content/docs/index.mdx` — docs homepage
- `src/content/docs/getting-started/` — overview, pricing, glossary
- `src/content/docs/advertisers/quickstart/` — advertiser onboarding
- `src/content/docs/advertisers/tracking/` — tracking + integration guides
- `src/content/docs/faq/` — common questions
- `src/content/docs/support/` — contact and support pages

## Development

```bash
npm install
npm run dev
```

### Useful commands

| Command | Action |
|---|---|
| `npm run dev` | Start local docs server |
| `npm run build` | Build production site |
| `npm run preview` | Preview the production build |

## Editing docs

- Write docs in `src/content/docs/` using `.mdx`
- Keep pages concise and user-facing
- Prefer updating docs to match the owning runtime repo, not the other way around
- For product behavior, verify against the source repo first (`affiliate-dashboard`, `affiliate-cms`, `affiliate-list`, or `affiliate-skills` depending on ownership)

## Components and styling

Shared docs UI pieces live in:

- `src/components/`
- `src/styles/`

## Build

```bash
npm run build
```

Output is generated in `dist/`.
