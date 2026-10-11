# Denny Games · 데니 게임즈

Free browser arcade in English and Korean at [games.iamdenny.com](https://games.iamdenny.com).

Circuit Loop, Orbit Break and a credited MIT adaptation of 2048. Arcade Press catalogue, daily seeded challenges, local progress, favourites and responsive controls. Physical phones, controllers and Tesla browsers still require device testing. Advertising slots and approval/consent gates are implemented; actual serving is inactive.

## Develop

Use Node 22.22.3 and npm:

```sh
npm ci
npm run dev
```

Open `http://localhost:4321/ko/` or `/en/`. Run `npm run verify`, then `npx playwright install chromium` and `npm run test:e2e` before a PR.

## Documentation

Start with [AGENTS.md](AGENTS.md), [documentation index](docs/README.md), [PRD](docs/product/PRD.md), [ADRs](docs/adr/README.md) and [design](DESIGN.md). [Testing](docs/testing.md) separates automated checks from physical-device evidence.

## Deployment

GitHub Actions builds Astro static output and deploys only `dist/` to GitHub Pages. Custom domain: `games.iamdenny.com`; DNS: `CNAME iamdenny.github.io`. [Deployment runbook](docs/guide/deployment.md) covers CI, HTTPS, public readback and rollback. No backend or paid infrastructure is required.

## Credits

Original code and art: Denny Games, MIT. 2048 rule adaptation: Gabriele Cirulli, MIT; retained [notice and pinned upstream provenance](public/licenses/2048.txt). The research catalogue is not a list of approved launch games. Review every new game's code, assets and runtime separately.
