---
title: "Architecture"
summary: "Static catalogue and lazy game lifecycle."
read_when:
  - Working on architecture
---

# Architecture

The shared player fits every immersive game surface by logical aspect ratio (ADR 0021), selecting side or bottom tools from measured space. Imported onReady may report validated width/height; native ratios are known at the page boundary. Primary game actions use controlsHost and are inert while overlays block gameplay; secondary 2048 directions use settingsHost. Adapters remove their externally mounted controls on destroy, and viewport/view changes never remount the engine.

Astro generates real index.html routes for English and Korean. Catalogue metadata drives home, category pagination, detail pages, search indexes and sitemap. Fifteen external-play records have indexable Denny Games detail pages and outbound links, but no local `/play/{id}/` route or embedded third-party runtime. No API server or database is required.

The root page supplies an inline script through the Base layout's head slot to open the first supported browser language before rendering the selector. Explicit locale routes do not redirect. Root HTML retains bilingual fallback links and SEO/verification metadata. See [ADR 0019](adr/0019-browser-language-entry.md).

## Boundaries

- `src/data`: typed game metadata, localized editorial copy, categories and explicit external-host records.
- `src/pages`: static routes, search indexes, sitemap and robots endpoints.
- `src/components` and `src/layouts`: semantic UI, SEO metadata and advertising slots.
- `src/lib`: storage, deterministic randomness, input, ads and lifecycle contracts.
- `src/games`: independently loaded game rules and rendering.
- `public`: original artwork, CNAME, third-party license notices.
- `vendor`: pinned third-party provenance, unchanged runtime source, external-link audit and all-candidate dispositions.
- `scripts`: documentation, artifact, scale and public-readback checks.

## Lifecycle

A game module mounts into a host and receives seed, saved state, translations and result callbacks. It supports start/pause/resume/restart/serialize/destroy and normalized actions. The shell owns focus, page visibility, storage, sound preference, gamepad input, viewport presentation and the H5 ad boundary. Only an explicit user action resumes gameplay. Games never load advertisements themselves.

## Persistence

Versioned `denny-games:v1:*` localStorage keys isolate game progress, settings, favorites and recent plays. Storage failures fall back to memory. Language navigation serializes state first, then loads the same localized route. Daily challenges use UTC date plus game ID and rules version. Progress is keyed by seed so a previous daily board cannot overwrite today's. Client scores are personal records, not a global leaderboard.

## Scalability

The complete `/en/all/` and `/ko/all/` catalogues and category pages show 24 games per page. Every numbered page is real HTML with its own canonical. The full catalogue includes every registry entry exactly once and shows its total, range, category links and top/bottom pagination. Home is explicitly a preview and links to the complete catalogue. Search downloads a localized JSON index only on the search route. Nonexistent and untranslated content is never generated. A nonpublic 1,000-entry fixture validates pagination and search without publishing fake games.

## Imported games

`src/data/editorial.ts` supplies explicit editorial priorities and bilingual reasons without importing engines. Home, complete pages, categories and search indexes share its stable ordering; unpicked entries preserve their original order. Name/newest overrides remain separate. Registry IDs, source and rules are not changed by editorial promotion. See [ADR 0014](adr/0014-editorial-and-visual-polish.md).

See [ADR 0009](adr/0009-imported-games.md). The catalogue never imports the engine bundle. An opaque-origin iframe loads one self-hosted Crisp source after the player mounts. Checked runtime hooks stop simulation while paused and relay validated score/results. Imported games retain only best scores, not mid-round progress. Home previews are bounded; category sorting/filtering uses the full JSON index and libraries instantiate only saved/recent cards.

## Play-style discovery and local reports

The registry carries interaction metadata separately from input/device evidence. `src/data/collections.ts` owns curated IDs and bilingual editorial copy; routes and JSON-LD derive from those entries. Search indexes include control style and estimated duration, and `src/lib/catalogue.ts` filters and bounds pagination. Device checks use a shared list/report validator and a local form/download script; they do not change the public compatibility table or send reports to a backend.

## Classic board games

Five original traditional rule implementations share `src/games/board/rules.ts`, a bounded alpha-beta AI, worker and DOM renderer. Catalogue metadata lives in `src/data/board-games.ts` and imports no engine runtime. Worker requests are invalidated and terminated on pause, mode reset and destroy. Three AI settings and same-device two-player mode are restored with validated board arrays. Selection and confirmation are separate actions. Board scores in the shared shell are hidden; the board displays turns, material/box counts and result instead. See [ADR 0015](adr/0015-classic-board-games.md).

Shared player audio uses original synthesized event cues in `src/lib/audio.ts`. Audio starts after a user gesture, with persisted mute/volume preferences and cancellation on pause/background. Board engines report semantic cues through the existing lifecycle sound callback; imported game sound events retain the default cue.

Gameplay transitions run independently of asynchronous audio resume. Mute can cancel audio immediately without leaving a paused overlay behind. Score presentation uses localized whole numbers and wrapping; stored scores keep their original precision.

The player defaults to a fixed dynamic-viewport stage and toggles standard layout without remounting the engine. Locale controls live inside the player; secondary settings use a native disclosure. See ADR 0016.

GameContext may provide a setupHost in the ready overlay, a settingsHost owned by the player disclosure and a controlsHost owned by the player tools area. Classic boards show AI/local mode choices before starting, retain mode and difficulty in settings, and mount turn/coordinates/confirm in the controls host. Setup choices appear only while ready; pause and result overlays hide them. Without these hosts they retain inline controls. Engine destroy removes stage, tools, settings and setup nodes. All immersive games compare side and bottom tools from 600px (ADR 0021) and use compact bottom tools on narrower phones, leaving the stage for the surface. Focus changes use preventScroll so starting a compact game does not reposition the stage.
