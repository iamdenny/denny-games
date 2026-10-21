---
title: "ADR 0042 — Visible multi-stage progression"
summary: "Show campaign length and a direct next-stage action for multi-stage games."
read_when:
  - Changing multi-stage player progression
  - Changing player completion actions
---

# Visible multi-stage progression

Status: Accepted · 2026-10-21

## Context

Circuit Loop has 30 deterministic, solvable boards and Orbit Break has 12 board layouts. The current stage was only available in player settings, and a win offered replay or another game without a direct way to continue. That made multi-stage content look like a single round.

## Decision

Show the current stage and total beside the game title for registered games with more than one stage. After a win, offer the next stage as the primary action and persist its stage number in the existing browser-local preference. Update the URL stage parameter as the next board mounts. After the final stage, the action returns to stage 1 and says so explicitly; it does not claim that a campaign was completed.

Do not show this action for losses, one-stage games, or daily challenge routes. Daily completion keeps its existing next-challenge route. Keep the stage selector in settings for direct selection.

## Consequences

Players can see the size of a multi-stage game and proceed without opening settings. Each stage remains independently seeded and keeps its existing score/progress storage key. This adds no account, server state, ranking or completion claim.

## Verification

Browser checks cover bilingual stage count, Circuit Loop stage 1 to 2 progression, final-stage return to stage 1, daily-route exclusion and responsive header bounds. Registry metadata remains the source of stage counts.
