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
- `scripts`: documentation, artifact, scale and public-readback checks.

## Lifecycle

A game module mounts into a host and receives seed, saved state, translations and result callbacks. It supports start/pause/resume/restart/serialize/destroy and normalized actions. The shell owns focus, page visibility, storage, sound preference, gamepad input, fullscreen fallback and the H5 ad boundary. Only an explicit user action resumes gameplay. Games never load advertisements themselves.

## Persistence

Versioned `denny-games:v1:*` localStorage keys isolate game progress, settings, favorites and recent plays. Storage failures fall back to memory. Language navigation serializes state first, then loads the same localized route. Daily challenges use UTC date plus game ID and rules version. Progress is keyed by seed so a previous daily board cannot overwrite today's. Client scores are personal records, not a global leaderboard.

## Scalability

Pages show 24 games per category. Every numbered page is real HTML with its own canonical. Search downloads a localized JSON index only on the search route. Nonexistent and untranslated content is never generated. A nonpublic 1,000-entry fixture validates pagination and search without publishing fake games.
