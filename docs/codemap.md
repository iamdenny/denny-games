# Codemap

| Directory | Responsibility |
| --- | --- |
| `src/data/` | Registry, shared editorial picks/order, interaction metadata, curated collections, translations and editorial pages |
| `src/layouts/` | SEO shell, locale navigation and common chrome |
| `src/components/` | Cards, responsive viewport player/settings host, complete-catalogue pagination, original SVG artwork, content ad slots and disclosed static affiliate cards |
| `src/pages/` | Static bilingual route generation and discovery files |
| `src/scripts/` | Catalogue/search state, player shell, diagnostics and local device report downloads |
| `src/lib/` | Storage, seed, input, filtered pagination, device report validation, advertisement contracts and registry-derived discovery schema |
| `src/games/` | Circuit, arcade, adapted 2048, classic board rules/AI/worker/renderer and restricted Crisp adapter |
| `vendor/` | Pinned imports, unchanged runtime, candidate and asset provenance |
| `public/vendor/crisp/` | Selected game files, generated host runtime, sandbox bridge and reviewed sprites |
| `scripts/` | Docs/rights/output/scale and local/public SEO validation |
| `tests/` | Unit and browser regression evidence |
| `.github/workflows/` | PR checks and main-only Pages deployment |

- `src/lib/audio.ts`: original synthesized effects, volume and note cancellation.
