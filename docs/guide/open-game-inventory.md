---
title: "Open game inventory"
summary: "Where published games, provenance and the complete research disposition are recorded."
read_when:
  - Reviewing catalogue coverage or onboarding more open games
---

# Open game inventory

The 2026-10-24 release candidate registry contains 337 locally playable games; production publication is confirmed separately by deployed-SHA and public-route readback. It has zero external-play entries. The 149 researched outbound listings have been removed from public game, search and sitemap routes. Their source, host, price and license evidence remains in `vendor/external-browser-listings.json`; their unused catalogue illustrations are in `vendor/external-listing-art/`, outside the deployed site. The research includes proprietary, unpublished and mixed-license candidates, so free browser access alone does not authorize redistribution.

## One hundred additional arcade games — 2026-10-23

The century collection adds 88 imported Crisp games, 11 independent Canvas games and the original Signal Crossing game, all locally hosted with pinned source and MIT notices. Templates and alternate revisions are excluded. See [ADR 0058](../adr/0058-century-arcade.md), `src/data/century-crisp.json`, `src/data/agentic-games.ts`, `vendor/crisp/provenance.json` and `vendor/agentic/provenance.json`. External music is not imported. Original bytes and checked build adaptations remain reviewable. Browser admission, release deployment and physical-device verification are separate evidence states.

## Original Korean board game — 2026-10-22

Yutnori is a Denny Games original TypeScript rules engine, DOM interface, CSS and SVG artwork under the repository MIT license. The National Folk Museum of Korea is credited as the rules reference; no external code, artwork, sticks or sound assets are bundled. The 2–4 player same-device mode uses four pieces per player, corner shortcuts, stack movement, captures and extra throws for Yut/Mo or a capture. The detail page identifies exact-finish and no-Back-do as this edition's house rules because regional play can differ. See [ADR 0047](../adr/0047-original-yutnori.md) and [the bilingual rules guide](../../src/data/pages.ts).

## Original Korean dexterity game — 2026-10-23

Gonggi is a Denny Games original five-stage adaptation using project-authored TypeScript, DOM controls, CSS and SVG under the repository MIT license. The [National Folk Museum of Korea Gonggi article](https://webzine.nfm.go.kr/2016/03/30/%EA%B3%B5%EA%B8%B0%EB%86%80%EC%9D%B4-%EC%96%B4%EB%96%BB%EA%B2%8C-%ED%95%98%EB%8A%94-%EB%86%80%EC%9D%B4%EC%9D%BC%EA%B9%8C/) is a rules reference only; no third-party code, artwork, sound or game assets are bundled. The timed catch and Kkeokgi scoring are identified as digital rules. See [ADR 0049](../adr/0049-original-gonggi.md) and [the bilingual rules guide](../../src/data/pages.ts).

## Original Korean kicking game — 2026-10-24

Jegi Rally is an original MIT Canvas adaptation with single-foot, alternating-feet and back-foot rounds. The [Ministry of Culture Jegichagi page](https://www.mcst.go.kr/usr/child/enter/play/jegichagi.jsp) and [National Folk Museum of Korea entry](https://www.nfm.go.kr/kids/elecontents/view.do?topic=13) are rules references only; no third-party source, images, sound or game assets are bundled. The fixed six/eight/ten-kick sequence, timing gate and scoring are labeled as Denny Games digital rules. See [ADR 0059](../adr/0059-jegi-rally.md) and the [English/Korean Jegichagi guide](../../src/data/pages.ts).

## Original classic-rule additions — 2026-10-22

Lantern Grid and Number Trail use project-authored TypeScript, CSS and SVG under the repository MIT license. Their cross-toggle and sliding-number rules are implemented without copied branded art, levels, sound or code. Each has 24 solvable seeded stages. See [ADR 0043](../adr/0043-original-logic-pack.md).

Further import candidates are research only: [Chogan](https://github.com/choganhq/chogan) and [wavde/games](https://github.com/wavde/games) require per-game source, dependency and asset license review before selection. Neither has been imported. [Komyo](https://github.com/N0zz/komyo.online) declares noncommercial restrictions and is excluded from commercial import selection. A public repository or free-to-play page is not redistribution approval. Prefer a small number of complete, tested games over counting research candidates as playable inventory.

## Archived external-host research — not public listings

The following notes preserve observations from earlier external-host research. They describe candidates that are no longer linked as playable games from Denny Games.

The latest link wave adds The Evolution of Trust, Scorched Tanks and BananaBread. Chromium opened the Trust start and first scene at 390×844, and the Scorched Tanks menu at 390×844 and 820×1180 without horizontal overflow. BananaBread rendered a 640×480 WebAssembly arena after about 18 seconds and roughly 14.8 MB transferred; at 390px its page measured 986 CSS px wide. Trust’s CC0 core has separately credited sound terms, Scorched Tanks publishes no source-code license, and BananaBread separates zlib code from CC-BY/CC-BY-SA art. No full game chapter, battle, combat run or physical-device behavior was tested. No third-party code or artwork was copied.

The 2026-10-17 wave adds OpenFront and Hypersomnia as external links. OpenFront’s code is AGPL-3.0, while its assets have separate CC BY-SA 4.0 and proprietary terms; Chromium opened its solo map chooser and the first UI fit 390×844 and 820×1180, though an automated GET returned HTTP 403. Its policy says the host may collect IP, device/browser and gameplay data including chat, use analytics and advertising cookies, receive Discord account details for sign-in, and display some profile and match information publicly. The bilingual detail page summarizes these points and links the [official privacy policy](https://openfront.io/privacy-policy.html) before the play button. Hypersomnia’s AGPL-3.0 browser tutorial loaded for a guest after about 23.42 MB; at 390px its canvas measured about 980 CSS px and showed no touch controls, while the 820×1180 view fit without overflow. Neither a complete battle nor physical-device behavior was tested, and no third-party build or artwork was copied. See `vendor/external-browser-listings.json` for per-entry evidence.

Each locally hosted import has English/Korean controls, a primary category, a fixed source commit, original notices and self-hosted files. External-host candidates have no public game page or play action. Gameplay and device support remain unverified until tested. Names remain the authors' original English names. Imported games keep their upstream interface language unless a Denny Games adapter provides translations; Sokoban's entire custom interface is bilingual.

The seven published categories are board, puzzle, arcade, action, shooting, racing and sports. They describe the main interaction, not an assertion that a miniature steering game is a full vehicle simulator. Counts are computed from the local-play registry. No empty categories or placeholder games are published.

## Rights records

The 2026-10-17 local additions Sokoban and Gridland use MIT and MPL-2.0 respectively. Sokoban has pure TypeScript rules and six original levels recorded in `vendor/sokoban/provenance.json`. Gridland uses locally served sprite sheets in a no-network sandbox and stores progress through the Denny Games browser-save bridge; music and upstream analytics/share/donation integrations are omitted. Its source hashes and exclusions are recorded in `vendor/gridland/provenance.json`. Gridland's catalog illustration is original; its gameplay screenshot, if present, is captured from the locally hosted runtime.

- `vendor/crisp/provenance.json`: fixed upstream revisions, per-game source hashes and procedural asset review.
- `public/licenses/crisp/`: original three game-bundle notices, runtime MIT and Lodash MIT.
- `vendor/bounceback/provenance.json`: pinned GPL-2.0-or-later source and hashes for Bounce Back, its tile sprite and title-screen image. `public/licenses/bounceback/` provides the full license and corresponding-source links.
- `vendor/underrun/provenance.json`: pinned MIT source and hashes for UNDERRUN's game, level maps and texture; the modified Sonant-X module keeps its separate zlib notice. `public/licenses/underrun/` provides both notices and source links.
- `vendor/hextris/provenance.json`: pinned GPL-3.0-or-later source and hashes for the full Hextris repository snapshot. `public/licenses/hextris/` includes the complete GPL license, MIT dependency notices and the Keypress Apache-2.0 license. The hosted adapter removes upstream ads, analytics, social popups and score reporting.
- vendor/external-browser-listings.json: 149 source-project/host pairs. Direct GET reachability was checked for each except where a per-entry rate-limit note says otherwise; Denny Games does not claim complete gameplay or physical-device compatibility. Recent Chromium checks found CityMaker's 3D board and Bash Fighter's touch layout without horizontal overflow at 390×844. No Survivor asks portrait users to rotate to landscape and showed its ready screen at 844×390; its README warns of an approximately 40 MB first engine download. Courier City's initial phone page measures 409 CSS px wide at 390px and lists keyboard controls without touch. Racez displays a landscape lobby and asks portrait users to rotate; Friday Night Funkin's Newgrounds page uses a desktop-width layout and clips its 1280×720 embed in a 390px mobile emulation. FNF's Apache-2.0 software license is separate from its proprietary creative content. The previous four links distinguish shapez's GPL-3.0 code from its demo/free-level and paid-full-game boundary, Cube Wars's MIT code from its prototype and unstated separate asset terms, Bitburner's Apache-2.0-plus-Commons-Clause commercial restriction, and Spot!'s MIT game code from its unstated separate artwork terms. At 390×844, shapez and Cube Wars showed initial game UI, while Bitburner measured 980 CSS px wide and Spot! embeds a 769px canvas. The current four links include three projects with MPL-2.0/MIT game-code licenses and one Unlicense/CC0 game with separately credited sounds; an itch.io page returned 429 to one automated GET, then 200 to HEAD and a later GET. No complete session or physical-device behavior was tested. The OpenFront automated GET returned 403 even though its official solo map chooser loaded in Chromium. Link-only entries do not change the local import count or the port-required candidate dispositions.
- The newest three entries preserve rights and device limits separately: Trust’s sound credits include CC BY-NC/CC Sampling+ terms; Scorched Tanks has no published source-code license; BananaBread uses zlib code and separately licensed CC-BY/CC-BY-SA artwork. Their per-host reachability and Chromium observations are in `vendor/external-browser-listings.json`.
- `vendor/catalogue-review.json`: a disposition for all 295 local-port research entries. Integrated, port-required and rights-or-integration-review are distinct.
- `scripts/build-crisp.mjs`: reproducible, checked runtime hooks. Original game source files are not rewritten.

Chain Drift, Comet Slash and Volt Keeper use their own arcade phases and score tables, so they run in a dedicated restricted cycle frame instead of the shared Crisp mini-game adapter. Their source, sprite and audio hashes are recorded in `vendor/crisp-cycles/provenance.json`; the build rejects changed files, symbolic links and paths outside each game's source directory. A localized on-screen direction pad and action button drive the original key controls. The three score tables live only for the open play page. Browser input is automated; physical phones, controllers and Tesla remain unverified. Other candidates include native/homebrew ports and separately licensed assets. They remain recorded for follow-up rather than offered as broken games or external embeds.

Bounce Back adds a boomerang roguelite with generated rooms, enemy variants, pickups, a shop and a final boss. The original source and sprite are retained under GPL-2.0-or-later; the debug console containing eval is preserved as source but excluded from the hosted runtime. Its touch/gamepad bridge and local progress are automated in Chromium, while physical devices remain unverified.

UNDERRUN adds a three-level WebGL twin-stick shooter. Its MIT source and level/texture images are pinned; modified Sonant-X code has a separate zlib notice, and the composer credit is preserved. The host adds touch movement/aim, standard gamepad movement/fire/aim, sound and pause/resume in a no-network opaque-origin frame. Chromium coverage does not establish physical phone, controller, or Tesla support.

Hextris adds a quick hexagonal block-matching puzzle. The source page includes the corresponding runtime source and dependency licenses. Large labeled rotation buttons supplement the original touch gestures; keyboard and standard gamepad left/right actions share the same mapping. The board and high scores are checkpointed every 500 ms and after rotation or pause. In-site language switching waits for a fresh host-side save; a hard reload restores the latest completed checkpoint. A pinned GitHub star count is only a source-repository signal, never a player count or popularity ranking.

## Player differences

Most imports restart on page reload or language change; the shell saves personal best scores, favorites and recent plays. Hextris is an exception: its latest completed board checkpoint and high scores are restored locally. Imported games do not participate in daily seeded challenges. Optional upstream external music/WebGL effects are disabled in the shared Crisp adapter; its sound switch controls simple shell-generated effects where supported. The eleven independent Agentic editions retain local synthesized sound under the shared mute and volume controls. A connected standard controller can move a virtual pointer and hold A; Start and disconnect pause. Mouse/touch remains available after controller use. DIGI10 uses number keys or the on-screen number buttons.

At research time the Hextris repository showed about 2.4k GitHub stars. This is a changing developer-interest signal, not evidence of player counts, demand, search rankings or earnings. Candidates that fail license, load-size or mobile-UX review remain unpublished. External play listings are not permitted. A Dark Room and Ancient Beast remain unpublished because the reviewed browser versions have mobile or orientation limitations; those old host observations do not represent Denny Games compatibility.

See [runtime decision](../adr/0009-imported-games.md), [onboarding](game-onboarding.md) and [testing](../testing.md).

Sky Golf keeps its course/stroke counter inside the game and does not use the shell score panel. Imported games have no artificial numbered stages; their stage selector is hidden.

## DANGO CSP arithmetic adaptation

The original DANGO uses `Function` to calculate collected integer expressions. CI exposed a CSP failure when a scoring branch was reached. Its unchanged upstream `main.js` and source hash are retained. The build emits `main.csp.js` with a restricted addition/multiplication parser preserving normal precedence; only DANGO loads that derivative. No eval permission or sandbox privilege is added. A deterministic browser regression executes the scoring branch for ordinary, leading-operator and empty expressions. See `host_adaptations` in the provenance record.

The latest 2026-10-17 wave adds Bloxd.io, Lichess, Pokémon Showdown, City Guesser and skribbl.io. Their official home or lobby menus loaded at 390×844 and 810×1080 emulated browser sizes without horizontal overflow. Lichess publishes its Lila code under AGPL-3.0-or-later with separately licensed asset exceptions; Pokémon Showdown publishes MIT server code but its client and Pokémon-related content have separate rights and the simulator is unofficial. Published privacy policies link from the notice before outbound play; host terms and source-code licenses appear in each listing's licensing details. Only opening screens were checked: no full game, match, room, drawing round or video round was completed, and physical-device behavior was not tested. No third-party game build, code, video, maps or artwork was copied; per-host evidence is in `vendor/external-browser-listings.json`.

## Classic expansion

Three original short campaigns and the locally hosted Neverball/Neverputt pair add five playable games. Rights, source archives, scoped native data budget and remaining port work are recorded in [classic expansion tracking](classic-expansion.md) and [ADR 0045](../adr/0045-classic-arcade-expansion.md). No proprietary classic game files are imported.

## Original cooking and sports additions — 2026-10-23

Snack Street and Pocket Table Tennis add two locally implemented solo games. Their rules, renderers, covers and bilingual copy are original MIT work. Ember Maze receives visual improvements without creating another catalogue entry. The registry remains the authoritative current count; earlier dated counts above are historical. See [ADR 0054](../adr/0054-cooking-and-table-tennis.md).

## Original pinball and falling gems — 2026-10-23

Star Pinball and Jewel Drop add an original three-ball table and a falling-column chain puzzle under MIT. Neither imports archived pinball research entries or commercial game assets. The registry is the authoritative current count; earlier dated counts above remain historical. See [ADR 0056](../adr/0056-pinball-and-falling-gems.md).

## Six original additions

| Game | Scope | Rights |
| --- | --- | --- |
| Minefield Watch | Three seeded minefields; safe first cell and neighbors | Original MIT |
| Mosaic Mystery | Twelve unique-solution 5×5/6×6 nonograms | Original MIT |
| Traffic Escape | Twelve sliding-vehicle stages | Original MIT |
| River Hop | Five crossing stages; three lives per stage | Original MIT |
| Meteor Guard | Five internal twenty-second waves | Original MIT |
| Pocket Bowling | Ten-frame round | Original MIT |

These additions use original code and artwork, without ROMs or third-party game assets. Runtime publication, CI and public verification are separate release evidence; this inventory does not claim physical-device certification, search ranking or ad approval. See ADR 0057.

## Original Klondike Solitaire — 2026-10-24

Klondike Solitaire adds a locally playable standard 52-card layout with Draw 1 and Draw 3 rules. The TypeScript engine, bilingual interface, card-table illustration and gameplay screenshot are project-authored under the repository MIT license. It does not reuse the external Klondike research candidate's code, card artwork, assets or host runtime. Every shuffle is allowed to be unsolvable; the game makes no winnability promise. It supports tap-to-select/tap-to-place, keyboard and standard gamepad focus, hint, undo, new deals and validated browser-local saves. See [ADR 0060](../adr/0060-local-klondike-solitaire.md).

## PACKABUNCHAS tile-packing puzzle — 2026-10-24

PACKABUNCHAS adds one MIT-licensed, locally hosted puzzle game with five internal modes. The original source, license, per-file hashes and product artwork hashes are retained in `vendor/packabunchas/`; separate MIT notices cover generated ZzFX/ZzFXM audio. A no-network opaque frame replaces localStorage with a bounded browser-save bridge and pauses its animation, timers and music with the player. The original game UI remains English; the site guide, rules, host controls and errors are bilingual. Touch and mouse input are listed; keyboard, gamepad and physical-device support are not claimed. See [ADR 0062](../adr/0062-packabunchas-import.md).
