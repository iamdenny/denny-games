---
title: "ADR 0022 — Visible local-play choice"
summary: "Show same-device two-player mode before starting a board game."
read_when:
  - Changing classic board game setup or ready screens
---

# Visible local-play choice

Status: Accepted · 2026-10-13. Extends ADR 0015, 0017 and 0021.

## Context

The classic-board engines supported local two-player mode, but the only mode selector was inside the collapsed settings disclosure. The Gomoku ready screen did not tell players how to choose a friend match or that both players take turns on the same device.

## Decision

Show native radio choices for browser AI and same-device two-player play in the ready overlay for all five classic board games. State the local-play action plainly in both languages. Keep the settings selector for later match changes and synchronize both controls with the same saved mode. Hide the ready-screen choice during pause and result overlays. Remove it with the game instance on remount.

## Verification

Check choice visibility and mode synchronization for all five games in English and Korean before starting. Verify Gomoku's first local move advances to player two without scheduling an AI move. Retain the existing board, lifecycle, responsive and WebKit browser checks; physical-device evidence remains separate.
