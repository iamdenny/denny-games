---
title: "ADR 0044 — State-independent game motion"
summary: "GSAP piece travel and player feedback, plus an on-demand Three.js victory scene."
read_when:
  - Changing game animations or motion preferences
  - Adding animation dependencies or GPU effects
---

# State-independent game motion

Status: Accepted · 2026-10-22

## Context

2048 recreated its sixteen cells after each action, which showed a value change rather than travel. Several DOM board games had the same discontinuity. The catalogue also contains sandboxed engines with existing canvas/WebGL animation. A visual upgrade must retain their independent rules, saves and licenses.

## Decision

Use pinned GSAP 3.15.0 for decorative, interruptible transform/opacity timelines. Commit game state immediately; never schedule a legal move, score, turn or save inside a decorative callback. The shared controller settles timelines on reduced-motion preference changes, low-effects changes and hidden documents, and releases observers/listeners on destruction. Rapid input finishes the preceding visual move before applying the next one. Resize settles spatial tile animations rather than retaining stale coordinates.

2048 rules now return source-to-target routes alongside the unchanged result/score. Disposable, inaccessible ghost tiles travel for 180ms; the committed board then reveals merge emphasis and new-tile emergence. Ghosts never accept input or appear in game serialization. Both tiles in a merge travel to the same target. Invalid moves do not animate or spawn.

Load Three.js 0.186.1 dynamically only for a reported win with effects enabled. A 36-piece lit 3D celebration lasts 1.35 seconds, caps pixel ratio at 1.5, blocks no controls and disposes geometry, materials and renderer after completion/restart/resize/context loss. No WebGL support or a failed optional import leaves the normal result/replay controls usable. No renderer runs continuously during play.

GSAP has its own standard no-charge license, not MIT. Preserve upstream bundle copyright, the license URL and a local notice. Three.js is MIT. The dependency record and bilingual license page identify both. The GSAP package README explicitly permits commercial use; its external license page was temporarily offline during implementation. No third-party art or additional fonts are introduced.

## Coverage

| Games                                                                     | Detail added                                                                                                                     |
| ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| All 209                                                                   | GSAP result-card entrance and score-increase emphasis; Three.js celebration for a reported win                                   |
| 2048                                                                      | Four-direction source/target travel, two-source merges, merge pulse and tile emergence                                           |
| Gomoku                                                                    | Stone descent and short settling effect                                                                                          |
| Reversi                                                                   | Previous face turns away, new face turns in; distance-based stagger                                                              |
| Four in a Row                                                             | Gravity-like drop and landing bounce                                                                                             |
| Checkers                                                                  | Piece travel and captured-piece fade/shrink                                                                                      |
| Dots and Boxes                                                            | Edge extension and completed-box reveal                                                                                          |
| Circuit Loop                                                              | Quarter-turn pipe rotation                                                                                                       |
| Lantern Grid                                                              | Staggered response on the affected cross                                                                                         |
| Number Trail                                                              | Number travel into the empty space, including undo                                                                               |
| Sokoban                                                                   | Keeper/crate travel and goal-arrival emphasis, including solver steps and undo                                                   |
| Orbit Break                                                               | Bounded, fading brick fragments on top of its existing ball trail                                                                |
| 191 Crisp games, 3 Crisp cycles, Bounce Back, Hextris, UNDERRUN, Gridland | Keep their engine-specific animation; add shared host feedback without injecting GSAP or Three.js into licensed sandbox runtimes |

There is no independent Go/Baduk game in the current registry; Gomoku uses a Go-style board. This change does not claim 209 individually redesigned engines. The 11 directly controlled games receive individual motion changes; 198 embedded games receive host feedback while preserving their existing animation.

## Consequences

Gameplay and persistence remain available with motion disabled. Source rules and deterministic seeds are unchanged. Optional Three.js costs bandwidth only on the first eligible win, while GSAP is limited to play-route code and excluded from catalogue/search scripts. Scores are displayed immediately rather than numerically counting up and obscuring the actual score. Host preferences govern the new effects, not every upstream engine's pre-existing effects.

## Verification

Check tile route conservation, merge destinations and all four directions in unit tests. Browser checks cover visible travel, rapid input, pause/reload, resize, reduced-motion/low-effects, Three.js creation/disposal, all board games, solver interaction and full catalogue regression. Inspect animations in Chromium at desktop and mobile viewport sizes. Physical phone, gamepad, Safari and sustained mobile thermal performance remain separate evidence gates.
