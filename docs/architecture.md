---
title: "Architecture"
summary: "Static catalogue and lazy game lifecycle."
read_when:
  - Working on architecture
---

# Architecture

The shared player fits every immersive game surface by logical aspect ratio (ADR 0021), selecting side or bottom tools from measured space. Imported onReady may report validated width/height; native ratios are known at the page boundary. Primary game actions use controlsHost and are inert while overlays block gameplay; secondary 2048 directions use settingsHost. Adapters remove their externally mounted controls on destroy, and viewport/view changes never remount the engine.

Astro generates real index.html routes for English and Korean. The locally playable game registry drives home, category pagination, detail pages, search indexes and sitemap; every published game has a local `/play/{id}/` route. External-host research records stay out of generated public routes until their code and assets are cleared and imported locally. No API server or database is required.

The root page supplies an inline script through the Base layout's head slot to open the first supported browser language before rendering the selector. Explicit locale routes do not redirect. Root HTML retains bilingual fallback links and SEO/verification metadata. See [ADR 0019](adr/0019-browser-language-entry.md).

## Boundaries

- `src/data`: typed game metadata, localized editorial copy, categories, shared play-style labels in `play-styles.ts`, and explicit external-host records.
- `src/pages`: static routes, search indexes, sitemap and robots endpoints.
- `src/components` and `src/layouts`: semantic UI, SEO metadata and advertising slots.
- `src/lib`: storage, deterministic randomness, input, ads and lifecycle contracts.
- `src/games`: independently loaded game rules and rendering.
- `public`: original artwork, CNAME, third-party license notices.
- `vendor`: pinned third-party provenance, unchanged runtime source, external-link audit, archived external-listing artwork and all-candidate dispositions. This directory is not copied into the public site.
- `scripts`: documentation, artifact, scale and public-readback checks.

## Lifecycle

A game module mounts into a host and receives seed, saved state, translations and result callbacks. It supports start/pause/resume/restart/serialize/destroy and normalized actions. Restored terminal results use the same result view without counting as a new completion. The shell owns focus, page visibility, storage, sound preference, gamepad input, viewport presentation and the H5 ad boundary. Only an explicit user action resumes gameplay. Games never load advertisements themselves.

## Persistence

Versioned `denny-games:v1:*` localStorage keys isolate game progress, settings, favorites and recent plays. Storage failures fall back to memory. Language navigation serializes state first, then loads the same localized route. Daily challenges use UTC date plus game ID and rules version. Progress is keyed by seed so a previous daily board cannot overwrite today's. Client scores are personal records, not a global leaderboard.

## Scalability

The complete `/en/all/` and `/ko/all/` catalogues and category pages show 24 games per page. Every numbered page is real HTML with its own canonical. The full catalogue includes every registry entry exactly once and shows its total, range, category links and top/bottom pagination. Home is explicitly a preview and links to the complete catalogue. Search downloads a localized JSON index only on the search route. Nonexistent and untranslated content is never generated. A nonpublic 1,000-entry fixture validates pagination and search without publishing fake games.

## Imported games

Sokoban uses a native, lazily loaded module because its pinned MIT rules and solver are pure TypeScript with no runtime dependencies. The Denny Games adapter translates the game UI, adds touch/gamepad controls and saves completed levels. Build-time provenance checks retain and publish the full upstream snapshot and license. See [ADR 0034](adr/0034-self-hosted-sokoban.md).

`src/data/editorial.ts` supplies explicit editorial priorities and bilingual reasons without importing engines. Home, complete pages, categories and search indexes share its stable ordering; unpicked entries preserve their original order. Name/newest overrides remain separate. Registry IDs, source and rules are not changed by editorial promotion. See [ADR 0014](adr/0014-editorial-and-visual-polish.md).

See [ADR 0009](adr/0009-imported-games.md). The catalogue never imports the engine bundle. An opaque-origin iframe loads one self-hosted Crisp source after the player mounts. Checked runtime hooks stop simulation while paused and relay validated score/results. Imported games retain only best scores, not mid-round progress. Home previews are bounded; category sorting/filtering uses the full JSON index and libraries instantiate only saved/recent cards.

## Play-style discovery and local reports

Search refinements use a native disclosure, initially collapsed below 700px. Its active count follows the URL-backed form state. The existing Adsterra adapter observes the search banner's eligibility attribute and removes frames when a result page has fewer than eight games. The canonical board guide and llms.txt describe finding solo and shared-device games; GA4 retains its existing sanitized, optional event contract. See [ADR 0055](adr/0055-compact-search-discovery-and-ads.md).

Resolved solo and same-device modes are serialized into the locale search indexes using the small `play-styles.ts` resolver. Search displays those modes and composes a `mode` URL parameter with its existing filters; no game engines are loaded. See [ADR 0052](adr/0052-player-mode-search.md).

The registry carries interaction metadata separately from input/device evidence. `src/data/collections.ts` owns curated IDs and bilingual editorial copy; routes and JSON-LD derive from those entries. Search indexes include control style and estimated duration, and `src/lib/catalogue.ts` filters and bounds pagination. Device checks use a shared list/report validator and a local form/download script; they do not change the public compatibility table or send reports to a backend.

## Classic board games

Five original traditional rule implementations share `src/games/board/rules.ts`, a bounded alpha-beta AI, worker and DOM renderer. Catalogue metadata lives in `src/data/board-games.ts` and imports no engine runtime. Worker requests are invalidated and terminated on pause, mode reset and destroy. Three AI settings and same-device two-player mode are restored with validated board arrays. Selection and confirmation are separate actions. Board scores in the shared shell are hidden; the board displays turns, material/box counts and result instead. See [ADR 0015](adr/0015-classic-board-games.md).

Gonggi is a separate lazy-loaded DOM game in `src/games/gonggi/`. Pure stage, catch timing, score and save validation live in `rules.ts`; the renderer uses native buttons and the shared player lifecycle. It has no external runtime or network service. See [ADR 0049](adr/0049-original-gonggi.md).

Shared player audio uses original synthesized event cues in `src/lib/audio.ts`. Audio starts after a user gesture, with persisted mute/volume preferences and cancellation on pause/background. Board engines report semantic cues through the existing lifecycle sound callback; shared Crisp sound events retain the default cue. Independent Agentic games retain original synthesized audio behind their isolated sound adapter.

Gameplay transitions run independently of asynchronous audio resume. Mute can cancel audio immediately without leaving a paused overlay behind. Score presentation uses localized whole numbers and wrapping; stored scores keep their original precision.

The player defaults to a full dynamic-viewport stage in normal document flow above the separate promotion section (ADR 0053) and toggles standard layout without remounting the engine. Locale controls live inside the player; secondary settings use a native disclosure. See ADR 0016.

GameContext may provide a setupHost in the ready overlay, a settingsHost owned by the player disclosure and a controlsHost owned by the player tools area. Classic boards show AI/local mode choices before starting, retain mode and difficulty in settings, and mount turn/coordinates/confirm in the controls host. Setup choices appear only while ready; pause and result overlays hide them. Without these hosts they retain inline controls. Engine destroy removes stage, tools, settings and setup nodes. All immersive games compare side and bottom tools from 600px (ADR 0021) and use compact bottom tools on narrower phones, leaving the stage for the surface. Focus changes use preventScroll so starting a compact game does not reposition the stage.

Daily completion keeps validated game IDs, rule versions and scores in a bounded seven-day UTC trail. Only a real same-date, stage-1 shell result qualifies. Home and daily pages read it locally; daily results lead to remaining challenges. See [ADR 0030](adr/0030-daily-completion-and-return.md) and [ADR 0032](adr/0032-seven-day-daily-trail.md).

Daily challenge shares point directly to the local player with `daily=1&stage=1`; the seed uses the UTC date when the recipient opens the URL. The share link contains no player result or tracking value. Game and collection landing-page shares continue to use canonical URLs under [ADR 0036](adr/0036-game-learning-and-sharing.md); daily challenge invites follow [ADR 0039](adr/0039-daily-challenge-sharing.md).

## Cooking and table tennis

`src/data/arcade-trio.ts` contains metadata only. `src/games/snack-street/` and `src/games/pocket-pingpong/` are lazy modules with separately testable rules and validated checkpoints. Cooking uses a contained DOM counter; table tennis uses an 800×520 perspective canvas. Both expose the common lifecycle and own their campaign progression within one shell stage. `src/data/arcade-trio-guides.ts` supplies bilingual rules pages. See [ADR 0054](adr/0054-cooking-and-table-tennis.md).

## Pinball and falling gems

`src/games/star-pinball/` and `src/games/jewel-drop/` separate pure rule state from rendering and decoration. Typed entries in `src/data/retro-duo.ts` and guides in `src/data/retro-duo-guides.ts` feed existing static discovery. Both use lazy player imports and raw validated checkpoints; no catalogue bundle imports their engines. See [ADR 0056](adr/0056-pinball-and-falling-gems.md).

## Six-game runtime extension

The six new engines remain lazy player imports. `six-puzzles.ts`, `six-movement.ts` and `six-action.ts` contribute typed metadata; matching guide modules contribute localized editorial routes. Minefield Watch and Mosaic Mystery reuse `minefield-watch/board.ts` for dense-board selection, controls and decorative feedback, with independent pure rule engines. Shared player consent, stage persistence and completion reporting remain authoritative. See ADR 0057.

## Century arcade extension

The release candidate adds exactly 100 distinct games to the 234-game baseline: 88 imported shared-runtime titles from two ABA Games repositories, 11 independent Canvas titles from a third ABA repository, and the original Signal Crossing. `src/data/century-crisp.json` supplies the 89 shared-runtime entries; `src/data/agentic-games.ts` supplies the 11 independent entries. The `arcade-century` collection contains exactly these IDs. Counts, static bilingual routes, search metadata and structured data still derive from the typed registry. See [ADR 0058](adr/0058-century-arcade.md).

`build-crisp.mjs` retains the original source bytes and disables optional external audio declarations through checked adaptations. `scripts/build-agentic.mjs` validates every retained source and artwork hash before bundling local modules into per-game HTML. The existing locked Rolldown package performs module bundling. No runtime network dependency is introduced. Original procedural artwork, fonts and synthesized sound remain local; catalogue PNGs are captures of actual gameplay. The Agentic provenance retains the repository MIT grant and the inconsistent Twin Vector README ISC reference without rewriting either notice.

`src/games/agentic/index.ts` loads only the selected independent game in an opaque-origin iframe. Parent and child check the peer window, origin and random channel. The frame CSP blocks network connections and external media. Explicit per-game hooks start normal gameplay, read the actual score and recognize genuine terminal state. The bridge owns virtual RAF time and timers, clears held keyboard/pointer/touch input on pause, freezes sound contexts and emits completion once. Shared controls include native 48px actions, mute and volume. Restart loads a fresh frame document; leaving retains only the shell personal best, with no mid-round save claim. Destroy removes the frame, externally mounted controls, listeners and load timeout.

The century release raises only the total static artifact ceiling from 100 MiB to 120 MiB because 100 additions generate 400 bilingual detail/player pages. The 5 MiB per-file limit and 28 MiB Neverball runtime allowance remain unchanged. This is a build-size budget, not a measured first-play download or performance result; engines remain lazy. See ADR 0058.
