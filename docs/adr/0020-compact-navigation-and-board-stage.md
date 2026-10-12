---
title: "ADR 0020 — Compact navigation and board stage"
summary: "Collapse catalogue navigation and move classic-board controls beside a larger stage."
read_when:
  - Changing responsive catalogue navigation or classic-board control placement
---

# Compact navigation and board stage

Status: Accepted · 2026-10-12. Extends ADR 0016 and ADR 0017.

## Context

User-provided Tesla screenshots show the catalogue header, expanded main navigation and horizontal category rail consuming much of the browser content. In Gomoku, on-screen directions and bottom shell controls leave a small board despite unused side space. The screenshots establish these layout problems on the observed vehicle, not complete gameplay or device certification.

## Decision

Use a 64px single-row catalogue header up to 1100 CSS pixels, with a native details/summary menu containing primary, category and guide links. Hide the separate category rail at that width. Keep English/Korean switching and large-screen targets accessible; desktop headers are 80px. No user-agent detection or browser zoom restriction is needed. The menu works without JavaScript; Escape closes it and restores summary focus when scripting is enabled.

Add an optional controlsHost to GameContext. Classic boards mount turn, selected coordinates and confirmation into it, and optional direction buttons into settingsHost. Both have inline fallbacks. Destroy removes all mounted nodes, including external controls, so remounts do not duplicate actions.

Immersive classic boards use a 176px side rail from 600px wide; narrower phones retain compact bottom controls. The stage contains only the board and sizes it against both available dimensions with the correct square or 7:6 aspect ratio. Keyboard/controller actions, repeated-target pointer confirmation, authoritative move rules, saves, pause and reversible standard view are unchanged. Other game engines keep their current control layout.

## Verification

Check compact header height, visible thumbnail position, menu navigation with JavaScript disabled, Escape/focus, both locales and 320–1100px widths. Assert a materially larger full board at 800×600 and 960×640, side controls within the viewport, optional arrow access in settings, confirmation, pause/resume, remount cleanup and orientation/view state preservation. Retain phone/short-landscape/desktop and all-game browser regressions. Public release readback is separate from a repeat run on the physical Tesla.
