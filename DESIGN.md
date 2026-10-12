# Denny Games — Arcade Press

## Character

A warm editorial arcade: confident typography, newspaper rules, generous breathing room and vivid game artwork. The catalogue should feel curated even with three games. Support hundreds without inventing content or repeating variants as separate games.

## Palette

Paper cream #F5F2E9 is the page background. Ink black #17211D is the primary text and rule color. Arcade cyan #A7F0E6 marks focus and selected controls. Acid yellow #D9ED68 highlights the daily challenge. Rust orange #EF896B belongs to arcade artwork. Muted moss #606B61 supports secondary text. Use ink-colored text on bright backgrounds.

## Typography and layout

Use system sans-serif fonts with a robust Korean fallback; no external font download. Oversized, tightly spaced headings establish the editorial hierarchy. Uppercase English labels are small accents, never the entire interface. Desktop has a narrow category rail and a broad content column. Mobile uses a compact header, horizontal category links and two game-card columns. Touch targets are at least 48px, or 56px in large-screen mode.

## Components

Game cards use a 16:10 original SVG thumbnail, title, short description, input labels and duration. Detail pages separate the start button from explanatory text and advertisements. Play pages use a dark frame, persistent pause/restart/mute/exit controls and an explicit start overlay. Focus uses cyan with a dark outline; status never relies on color alone.

## Motion and accessibility

Clean casual board refresh (2026-10-12): blue ink player surfaces, rounded pastel bricks and paddle, tactile number tiles, and clear rounded circuit paths. Keep optional tile feedback at 140ms and the ball trail to eight samples; disable both with reduced-motion or low-effects. Editorial badges use mint pills with a concise reason and never imply a popularity measurement. Imported cards frame actual pixel screenshots on soft colour fields; imported game pixels are preserved.

Keep motion restrained and honor reduced motion. Preserve native text zoom, document scrolling and visible keyboard focus. Only the game input surface captures touch gestures. A backgrounded game pauses and waits for an explicit resume action.

## Advertising

Label reserved content slots clearly. Never disguise an advertisement as a game card. No display advertising inside the live play frame. Hide inactive slots before layout; once an active slot reserves space, preserve that space through no-fill to prevent shifts.

## Evidence

Reference: Arcade Press v2 approved direction, 2026-10-10. Rendered desktop/mobile evidence and limitations are recorded in docs/releases. This document specifies design, not physical Tesla or controller certification.

Classic boards use ivory/wood grids against blue ink, mint/coral pieces with inset highlights, clear turn/status text, legal-move dots and separate 48px confirmation. Checkers marks movable pieces and capture-required turns. Gomoku retains a 15×15 grid; coordinates and preview mitigate dense mobile targets. Original SVG cards illustrate each rule set; actual playable screenshots support detail/social previews. No decorative motion is required.

Gomoku pointer interaction: first click/tap previews a legal intersection; clicking/tapping that same intersection again commits the stone. Selecting another intersection only moves the preview. The explicit confirm button and keyboard/gamepad confirmation remain available.
