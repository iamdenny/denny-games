---
title: "Commands"
summary: "Reproducible local development and CI commands."
read_when:
  - Working on commands
---

# Commands

Use Node 22.22.3 (`.nvmrc`) and npm. Run from repository root.

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run dev` | Astro on localhost:4321 |
| `npm run build` | Static dist plus artifact audit |
| `npm run preview` | Preview production output on localhost:4321 |
| `npm run format` | Format Astro, TypeScript, styles and validation scripts |
| `npm run format:check` | Verify formatting |
| `npm run check` | Astro/TypeScript diagnostics |
| `npm test` | Game rules and shared services |
| `npm run test:e2e` | Chromium user journeys and mobile layouts |
| `npm run docs:check` | Frontmatter and internal documentation links |
| `npm run docs:lint` | Markdown style |
| `npm run test:scale` | Nonpublic 1,000-game registry and static generation |
| `node scripts/verify-public.mjs --sha <sha>` | Check deployed source and public routes |
| `npm run verify` | Types, unit tests, docs, scale and production build |

Use `npx playwright install chromium` once for local browser tests. No environment variables are required for development. Advertisement mode defaults to off. Do not copy another project's credentials.
