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
