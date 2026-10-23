---
title: "Gonggi browser game"
summary: "A five-stage, touch-first digital adaptation of the Korean five-stones game."
read_when:
  - Developing the Gonggi game or its Korean search entry
---

# Gonggi browser game

## Evidence and opportunity

On 2026-10-23, a public search sample for `공기놀이 온라인 게임` and `공기놀이 브라우저 게임` surfaced rules, videos and physical play references, but no clear dedicated browser game. This is a limited result sample, not proof that no competitor exists, that search demand is high, or that the query can rank on page one.

The National Folk Museum of Korea describes a common sequence using five stones: pick one, then two, then three and one, then the last four, followed by Kkeokgi. It also notes that groups can vary the rules. The browser game should identify its own timing and scoring as a digital variation rather than a universal physical rule.

## Goal

Give Korean and English visitors a complete, replayable Gonggi game that starts in the Denny Games player, works with touch, mouse and keyboard, and teaches the common stage sequence in static page content. Use original code and art so all play stays under the Denny Games origin.

## Requirements

| ID  | Requirement                     | Acceptance                                                                                                                                                                                      |
| --- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| G01 | Five visible stages             | Stages 1–4 use one, two, three-then-one and four-stone groups. Stage 5 offers two timed Kkeokgi catches.                                                                                        |
| G02 | Catch timing                    | Every toss lasts 3.6 seconds. The amber window is centered at 2.6 seconds with a one-second total width. Catch quality affects score; stage progress requires a grade of at least three stones. |
| G03 | Fair retry                      | Each stage allows three misses. A miss keeps successful earlier groups on stages 1–4. A missed Kkeokgi attempt restarts its two-catch sequence.                                                 |
| G04 | Clear interaction               | Stone buttons can be selected and unselected. The Catch button is available only after the required group is selected, except during Kkeokgi. Touch targets are at least 48px.                  |
| G05 | Keyboard access                 | Tab, Enter and Space operate stones and buttons. Arrow controls move focus across stones. Focus remains visible.                                                                                |
| G06 | Pause and save                  | The shared player can pause a flight. Completed groups, score and stage progress serialize through the player lifecycle. Reloading during a toss restarts that toss.                            |
| G07 | Bilingual discovery             | English and Korean game details, rules, controls, tips, a guide and a Korean traditional-games collection link to the local player.                                                             |
| G08 | Honest source and compatibility | Original code/art are MIT. The National Folk Museum source is credited. No gamepad, physical-device, popularity, search-volume, indexing or rank claim is added.                                |

## Digital rule choices

The timed amber catch window and the score thresholds translate physical coordination into a browser input. In Stage 5, the first timing result sets the number of stones to recover on the second toss; the final score is based on the recovered count. Three misses end the current stage. These are Denny Games rules, not a claim that every region plays the physical game this way.

The game has five stage routes and a browser-local personal record. It has no accounts, online rooms, global rankings, external game host, network calls or gameplay analytics.

## Validation

Pure-rule coverage checks stage plans, timing boundaries, score outcomes, saves, missed catches and Kkeokgi. Browser coverage checks both locales, a complete stage, Stage 5, pause/reload, keyboard and narrow phone/tablet layouts. Browser emulation does not prove physical-device behavior.

See [ADR 0049](../adr/0049-original-gonggi.md) for implementation and release boundaries.
