---
title: "ADR 0016 — Browser viewport player"
summary: "Default to an in-page immersive stage with reversible view controls."
read_when:
  - Changing viewport or direct game input
---

# Browser viewport player

Status: Accepted · 2026-10-12

Use a fixed, dynamic-viewport player as the default play-page presentation. Do not call requestFullscreen or exitFullscreen: the requested surface is the browser/webview content area. A view toggle returns to the normal site layout without remounting the game. Keep essential controls visible; disclose secondary settings and help. Cap boards and canvases by available host height as well as width, preserving aspect ratios and providing internal scrolling where needed.

Board pointer actions follow [the player UX PRD](../product/PLAYER-UX.md). Reuse authoritative move validation, human-turn guards and lifecycle cancellation. Keep keyboard/controller actions separate from pointer shortcuts. Retain the explicit confirmation button as an alternative. Update both languages whenever interaction text changes.
