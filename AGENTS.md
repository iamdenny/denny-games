# Denny Games

Static English/Korean browser arcade at games.iamdenny.com. Read the PRD and relevant ADR before changing behavior. Never equate implementation with device verification or advertising approval.

## Working rules

- Use `ghr` for every GitHub CLI operation; local `ghr.profile=iamdenny`. Author: Denny Lim <hi.iamdenny@gmail.com>. Preserve active work.
- Node 22.22.3, npm lockfile, Astro static output, strict TypeScript. Use `npm ci` for reproducible installs.
- Add a game through typed registry metadata and the lifecycle contract. Keep game engines out of catalogue bundles.
- Every public feature and error needs English and Korean. No empty categories, fabricated counts, ratings or compatibility claims.
- Keep third-party license and provenance records. No ROMs or unreviewed assets. Secrets and account-specific credentials never enter source or static output.
- Run `npm run verify` and browser tests before PR. Merge only passing reviewed changes. Read public URLs after deployment.
- Update relevant docs and ADRs with behavior changes. Details belong in docs, not here.

## Evidence capture

| Field | Value |
| --- | --- |
| Surface | Desktop/mobile website and game canvas |
| Dev command | `npm run dev` |
| URL / health | `http://localhost:4321/ko/` |
| Capture | CUA browser screenshots; Playwright regression artifacts |
| Prerequisites | `npm ci`; `npx playwright install chromium` for tests |
| Viewport | Desktop 1440×900; mobile 320/360/390/430px |

## Documentation

| Document | Purpose |
| --- | --- |
| [Index](docs/README.md) | Start here |
| [PRD](docs/product/PRD.md) | Current requirements and delivery boundaries |
| [Design](DESIGN.md) | Arcade Press visual system |
| [Architecture](docs/architecture.md) | Static routes, data and game lifecycle |
| [ADR index](docs/adr/README.md) | Accepted decisions and supersession |
| [Commands](docs/commands.md) | Environment and checks |
| [Testing](docs/testing.md) | Automated and physical-device evidence |
| [Game onboarding](docs/guide/game-onboarding.md) | Rights, modules and metadata |
| [Open game inventory](docs/guide/open-game-inventory.md) | Published games and candidate dispositions |
| [Ads](docs/guide/advertising.md) | Approval, consent and adapter contract |
| [Deployment](docs/guide/deployment.md) | PR, Pages, DNS and rollback |
| [Documentation rules](docs/guide/documentation.md) | Frontmatter, ownership and ADR format |
| [Codemap](docs/codemap.md) | Source directory responsibilities |

## Local code graph

Run `graphify update . --no-cluster` after structural changes. Query `graphify-out/graph.json` for source relationships; output is ignored and never deployed. This AST graph does not replace PRD, ADR or runtime evidence.
