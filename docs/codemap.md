# Codemap

| Directory              | Responsibility                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/data/`            | Registry, shared editorial picks/order, interaction metadata, curated collections, translations and editorial pages                                                             |
| `src/layouts/`         | SEO shell, locale navigation and common chrome                                                                                                                                  |
| `src/components/`      | Cards, static worked game examples and choice guides, canonical share controls, responsive viewport player/settings host, pagination, artwork and disclosed ad/affiliate slots  |
| `src/pages/`           | Static bilingual route generation and discovery files                                                                                                                           |
| `src/scripts/`         | Catalogue/search state, player shell, canonical URL sharing with manual recovery, diagnostics and local device report downloads                                                 |
| `src/lib/`             | Storage, seed, input, filtered pagination, device report validation, advertisement contracts and registry-derived discovery schema                                              |
| `src/games/`           | Circuit, arcade, adapted 2048, classic board rules/AI/worker/renderer, restricted Crisp mini-game and cycle adapters, isolated GPL/WebGL game bridges, and Gridland save bridge |
| `vendor/`              | Pinned imports, unchanged runtime, candidate and asset provenance                                                                                                               |
| `public/vendor/crisp/` | Selected mini-game files, generated host runtime, sandbox bridge and reviewed sprites                                                                                           |
| `vendor/crisp-cycles/` | Pinned source, image/audio hashes and provenance for games with their own Crisp arcade cycles                                                                                   |
| `vendor/bounceback/`   | Pinned GPL source, hash provenance and isolated host adapter for Bounce Back                                                                                                    |
| `vendor/gridland/`     | Pinned MPL-2.0 source subset, exclusions, runtime build and local save adapter provenance                                                                                       |
| `scripts/`             | Docs/rights/output/scale and local/public SEO validation                                                                                                                        |
| `tests/`               | Unit and browser regression evidence                                                                                                                                            |
| `.github/workflows/`   | PR checks and main-only Pages deployment                                                                                                                                        |

- `src/lib/audio.ts`: original synthesized effects, volume and note cancellation.

- `src/data/quick-play.ts`, `src/components/QuickPlay.astro` and `src/scripts/quick-play.ts`: static-first mood picker, direct play and validated local recent links.

- `src/lib/daily.ts`, `src/components/DailyChallenges.astro` and `src/scripts/daily.ts`: bounded seven-day local completion trail, UTC rollover, daily cards and home progress.

- `src/games/logic/rules.ts`, `src/games/logic/index.ts`, `src/data/logic-games.ts`: original cross-toggle and sliding-number campaigns, validated move-history saves, bilingual registration and lazy DOM rendering.

- `src/lib/motion/`: scoped GSAP timelines, disposable tile travel, and a dynamically loaded Three.js victory scene.

- `src/games/heritage/`: original platform, raising-simulation and RPG rules/renderers.
- `src/games/neverball/`: parent lifecycle and bounded native-save adapter.
- `vendor/neverball/`: pinned upstream source/runtime, notices and opaque-frame host integration.
- `scripts/build-neverball.mjs`: provenance validation and local no-network runtime generation.
- `src/components/PromoKit.astro`: bilingual promotional previews, downloads and embed snippets at `/en/promote/` and `/ko/promote/`.
- `scripts/generate-promo.mjs`, `public/promo/`: original promotional artwork generator and twenty committed PNG assets.

- `src/games/yutnori/rules.ts`, `src/games/yutnori/index.ts`, `src/data/board-games.ts`: standalone Yutnori movement/capture rules, local save contract, bilingual registration and responsive 29-space board.

- `src/data/retro-discovery.ts`: the original eight-game ID set and bilingual arcade comparison guide, reused by collection and AI-discovery navigation.
- `src/lib/analytics.ts`, `src/lib/events.ts`: versioned optional GA4 consent and minimal game lifecycle measurement; local diagnostics remain separate from provider delivery.

## Owned-service promotion

`src/components/HouseBanner.astro` selects a local original banner once per page placement. `public/house-banners/` holds owner-authorized originals; provenance and placement rules are in ADR 0053.

## Cooking and table tennis

- `src/games/snack-street/`: cooking economy, checkpoint validation, DOM counter and lifecycle.
- `src/games/pocket-pingpong/`: rally physics, AI league, checkpoint validation and perspective canvas.
- `src/data/arcade-trio.ts`: typed metadata without engine imports.
- `src/data/arcade-trio-guides.ts`: bilingual cooking and table-tennis guides.

## Original retro duo

- `src/games/star-pinball/`: fixed-step pinball rules and renderer.
- `src/games/jewel-drop/`: falling-gem state, matching/chains and renderer.
- `src/data/retro-duo.ts` and `src/data/retro-duo-guides.ts`: bilingual registry and rules content.
- `tests/unit/{star-pinball,jewel-drop}.test.ts` and matching browser specs: rules, saves, real input and lifecycle evidence.

## Six original games

- `src/games/minefield-watch/`: seeded safe-first minefields and reusable dense-board presentation.
- `src/games/mosaic-mystery/`: original nonogram inventory, clues, uniqueness solver and marking rules.
- `src/games/traffic-escape/`: sliding-vehicle puzzle stages and controls.
- `src/games/river-hop/`: crossing stages and life management.
- `src/games/meteor-guard/`: five-wave action round.
- `src/games/pocket-bowling/`: ten-frame bowling round.
- `src/data/six-{puzzles,movement,action}.ts`: typed catalogue entries; companion guide modules own localized instructions.
