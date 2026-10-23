---
title: "One hundred additional arcade games"
summary: "Pin and adapt 88 shared-runtime, one original and 11 independent arcade titles without duplicate editions or external gameplay hosts."
read_when:
  - Adding or reviewing the century arcade collection
  - Changing imported runtime isolation or admission evidence
---

# One hundred additional arcade games

## Status

Accepted — 2026-10-23.

## Context

The user requested 100 additional real games. The existing registry contains 234. Reusing levels, alternate revisions or renamed games would not meet that request. The already-pinned Crisp repositories do not contain 100 unused games.

## Decision

Add 88 distinct shared-runtime games from two pinned ABA Games repositories,11 independent Canvas games from a third repository, and the original Signal Crossing traffic game. Keep the original source bytes, individual hashes, exact commits and complete repository notices. `src/data/century-crisp.json` and `src/data/agentic-games.ts` define the new inventory; the existing 191-entry Crisp JSON stays intact. The new bilingual `arcade-century` collection lists exactly these 100 IDs.

The 88 imported shared games and Signal Crossing reuse the restricted Crisp player. Optional upstream external audio declarations are cleared before runtime initialization; local shell cues remain. The S SHAKE filename variant was rejected as a duplicate of the existing game. Input is a button press/hold/release; metadata explains each game's particular objective and controls.

The 11 independent games use a separately loaded adapter and per-game lifecycle integration. Their local runtime is isolated from site storage and external connections. Frame communication binds the parent window, origin and random channel. Loading or playing a game must not fetch a foreign script, font, sound or image. Pause freezes the simulation; restart creates a fresh round; destroy removes the frame and host listeners. Score and terminal callbacks come from actual game state.

Keep English and Korean host instructions, errors, search metadata and controls. Generated static detail pages provide canonical, hreflang and structured game data through the existing registry pipeline. The common player retains consent-aware analytics, advertising boundaries and local best scores. Imported rounds restart after leaving; no checkpoint, deterministic daily replay, new GA property, ad approval or physical-device certification is implied.

## Consequences

The registry has 334 games. Catalogue pages, search, category counts, the sitemap and public verification derive from that registry. Existing games retain their routes and source hashes. The catalogue does not download game engines until a player route is opened.

The measured candidate output is approximately 105.3 MiB, primarily the existing native payload and bilingual static HTML. The 100 additions introduce 400 detail/player HTML pages. Raise the total artifact budget from 100 to 120 MiB for this bounded expansion, superseding only that total in ADR 0045. Keep all per-file limits unchanged (5 MiB generally,28 MiB for the existing Neverball payload). This is deployment storage, not a catalogue page download: game engines remain lazy and no new large native payload is added.

## Verification

Admission includes source/asset review, distinct IDs and hashes, initial rendering, actual input, observable score or terminal progress, pause/resume/restart, no remote requests or runtime errors, and actual gameplay screenshots. The filtered import runner retains per-title JSON and images; an observed lack of progression is `needs-review`, never an automatic pass. Browser emulation and bounded input soaks do not prove campaign completion or physical phones, tablets, controllers or Tesla support.

Run `npm run verify`, the full browser suite and the targeted admission audit before release. Review all added artwork and representative WebKit layouts. Merge only reviewed passing changes, then verify the deployed commit and public 334-game inventory separately.
