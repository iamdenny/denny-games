---
title: "Architecture"
summary: "Static catalogue and lazy game lifecycle."
read_when:
  - Working on architecture
---

# Architecture

Astro generates real index.html routes for English and Korean. Catalogue metadata drives home, category pagination, detail pages, search indexes and sitemap. No API server or database is required.

## Boundaries

- `src/data`: typed game metadata, localized editorial copy and categories.
- `src/pages`: static routes, search indexes, sitemap and robots endpoints.
- `src/components` and `src/layouts`: semantic UI, SEO metadata and advertising slots.
- `src/lib`: storage, deterministic randomness, input, ads and lifecycle contracts.
- `src/games`: independently loaded game rules and rendering.
- `public`: original artwork, CNAME, third-party license notices.
- `vendor`: pinned third-party provenance, unchanged runtime source and all-candidate dispositions.
- `scripts`: documentation, artifact, scale and public-readback checks.

## Lifecycle

A game module mounts into a host and receives seed, saved state, translations and result callbacks. It supports start/pause/resume/restart/serialize/destroy and normalized actions. The shell owns focus, page visibility, storage, sound preference, gamepad input, fullscreen fallback and the H5 ad boundary. Only an explicit user action resumes gameplay. Games never load advertisements themselves.

## Persistence

Versioned `denny-games:v1:*` localStorage keys isolate game progress, settings, favorites and recent plays. Storage failures fall back to memory. Language navigation serializes state first, then loads the same localized route. Daily challenges use UTC date plus game ID and rules version. Progress is keyed by seed so a previous daily board cannot overwrite today's. Client scores are personal records, not a global leaderboard.

## Scalability

The complete `/en/all/` and `/ko/all/` catalogues and category pages show 24 games per page. Every numbered page is real HTML with its own canonical. The full catalogue includes every registry entry exactly once and shows its total, range, category links and top/bottom pagination. Home is explicitly a preview and links to the complete catalogue. Search downloads a localized JSON index only on the search route. Nonexistent and untranslated content is never generated. A nonpublic 1,000-entry fixture validates pagination and search without publishing fake games.

## Imported games

`src/data/editorial.ts` supplies explicit editorial priorities and bilingual reasons without importing engines. Home, complete pages, categories and search indexes share its stable ordering; unpicked entries preserve their original order. Name/newest overrides remain separate. Registry IDs, source and rules are not changed by editorial promotion. See [ADR 0014](adr/0014-editorial-and-visual-polish.md).

See [ADR 0009](adr/0009-imported-games.md). The catalogue never imports the engine bundle. An opaque-origin iframe loads one self-hosted Crisp source after the player mounts. Checked runtime hooks stop simulation while paused and relay validated score/results. Imported games retain only best scores, not mid-round progress. Home previews are bounded; category sorting/filtering uses the full JSON index and libraries instantiate only saved/recent cards.

## Play-style discovery and local reports

The registry carries interaction metadata separately from input/device evidence. `src/data/collections.ts` owns curated IDs and bilingual editorial copy; routes and JSON-LD derive from those entries. Search indexes include control style and estimated duration, and `src/lib/catalogue.ts` filters and bounds pagination. Device checks use a shared list/report validator and a local form/download script; they do not change the public compatibility table or send reports to a backend.
