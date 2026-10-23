---
title: "ADR 0052 — Solo and same-device search"
summary: "Filter search by supported play modes without loading game engines or implying online multiplayer."
read_when:
  - Changing player-mode filters or search-index metadata
---

# Solo and same-device search

Status: Accepted · 2026-10-23

## Context

The Korean market focus includes friends sharing one device, but search only offered genre, controls and duration. Visitors had to inspect each description to discover multiplayer support. Yutnori has no solo mode, while classic boards and four original arcade games support both solo and local multiplayer.

## Decision

Resolve play modes from explicit registry metadata, retaining the established classic-board default of solo and multiplayer and the general solo default. Export this small resolver and bilingual labels from the existing play-style data module. Include resolved modes in each locale's search index and show them on search cards. Keep game engines out of search bundles.

Add a native labeled select with all, solo and together-on-one-device choices. Store its value in the `mode` URL parameter alongside existing filters. Preserve query composition, pagination, language links, reload, browser history, normalization and reset. State that together means one shared device and does not provide online matchmaking. Keep search noindex and preserve static collection links when JavaScript is unavailable.

## Consequences

Visitors can find games for their group without guessing from genre. This does not add a multiplayer mode, certify a device, establish popularity or prove retention or search ranking. Every future registry multiplayer entry must keep the local-play wording accurate or introduce a more specific mode contract.

## Verification

Unit checks cover actual solo and multiplayer membership, Yutnori exclusion from solo, combined board filtering, and parity between raw registry and serialized index modes. Browser journeys cover both languages, direct filtered URLs, reload, browser history, language switching, reset, invalid parameters, phone/tablet/desktop widths and an in-site Yutnori launch. Existing search, no-JavaScript and catalogue regressions remain required before merge. Deployment and physical-device evidence are recorded separately.
