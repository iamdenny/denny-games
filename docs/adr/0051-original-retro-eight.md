---
title: "Eight original arcade games"
summary: "Add original arcade genres with bilingual discovery and honest local-play boundaries."
read_when:
  - Changing the original arcade games or their discovery content
---

# Eight original arcade games

## Status

Accepted — 2026-10-23.

## Context

The requested expansion covers bomb mazes, snowball platform arenas, turn-based artillery, tank defense, splitting-sphere action, color-bubble puzzles, vertical shooting and ladder escape puzzles. Familiar commercial titles describe genre inspiration, not redistribution permission.

## Decision

Publish eight independently implemented games: Ember Maze (`ember-maze`), Frost Patrol (`frost-patrol`), Crater Duel (`crater-duel`), Iron Bastion (`iron-bastion`), Prism Pop (`prism-pop`), Bubble Harbor (`bubble-harbor`), Starfall Wing (`starfall-wing`) and Vault Runner (`vault-runner`). Use original names, code, generated graphics and stages under the project license. Do not bundle commercial ROMs, music, characters or maps, or claim licensed remake status.

Ember Maze offers same-device duels; Frost Patrol and Iron Bastion offer same-device cooperation; Crater Duel offers alternating local turns. The remaining games are solo. No online rooms, matchmaking, cloud saves or account service are introduced. Each game uses the common lifecycle, localized controls, local save behavior and stage progression. Keep game engines out of catalogue bundles.

Expose bilingual detail pages, a `retro-arcade` collection and a comparison guide. Generate canonical URLs, alternate languages, structured data, sitemap/search entries and `llms.txt` references from the registered metadata. Describe implemented play modes instead of search-volume, popularity, indexing or ranking claims. The guide and canonical detail pages are the source of truth; `llms.txt` is a navigation aid, not guaranteed AI inclusion.

Analytics follows [ADR 0050](0050-consented-game-analytics.md): renewed consent is required for minimal game lifecycle counts, and no inputs or scores are sent.

## Verification

Require meaningful rules tests, lifecycle and browser play journeys, bilingual route/discovery checks, responsive screenshots and the repository release checks. Actual screenshots must depict the implemented game. Browser viewport results do not establish physical-device compatibility. Deployment, indexing and GA4 provider receipt need separate evidence after release; code and generated discovery files alone do not prove them.
