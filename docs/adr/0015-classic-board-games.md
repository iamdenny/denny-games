---
title: "ADR 0015 — Shared classic board engine"
summary: "Original rules, bounded local AI and accessible confirmation controls."
read_when:
  - Changing board rules, AI, saves or discovery
---

# Shared classic board engine

Status: Accepted · 2026-10-12

Implement five traditional rule sets independently in pure TypeScript, with a shared lifecycle renderer and bounded local AI. No researched third-party game code, artwork, audio or training data is copied. New original source and SVG artwork use the repository MIT license. Keep catalogue metadata free of runtime engines. Record exact variants instead of implying tournament rules or professional AI strength.

Explicit selection plus confirmation reduces accidental moves on dense mobile grids. Show selected coordinates and legal moves in text and graphics. Both AI and local two-player share one authoritative move function. AI timers are cancelled on pause/destroy; serialize valid board state and mode independently of transient UI selection. Validate restored saves before use. Shared shell controls remain responsible for pause, audio, restart and advertising separation.

The Board category and classic-board collection expose five playable games. Static bilingual rules and comparison guide are the authoritative SEO/GEO content. Structured data describes single-player and local multiplayer; no online rooms, ratings or hardware verification are implied. llms.txt is a discoverability aid, not a crawler contract.

See [release PRD](../product/CLASSIC-BOARD-GAMES.md). Janggi, Go and additional researched games are deferred.

## Sound

Original Web Audio synthesis distinguishes stone placement, gravity drops, disc flips, checker steps/captures, edges and completed boxes, plus win/loss/draw cues. No third-party recordings or continuous background music. Sound is initially off; remember the user's mute and effects-volume settings, but create/resume audio only from an explicit gesture. Stop active and scheduled notes on mute/pause/background, so stale cues do not replay on resume. Sound is supplementary: turn, legal moves and results remain visible without it.

Gomoku pointer interaction: first click/tap previews a legal intersection; clicking/tapping that same intersection again commits the stone. Selecting another intersection only moves the preview. The explicit confirm button and keyboard/gamepad confirmation remain available.

Pointer interactions and viewport presentation are further specified by [the player UX PRD](../product/PLAYER-UX.md) and [ADR 0016](../adr/0016-viewport-player.md).
