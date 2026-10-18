# Denny Games — Arcade Press

## Character

All-game stages follow ADR 0021: preserve logical aspect ratios, remove immersive width caps, and center surfaces against the full host dimensions. Scores, primary hint/launch/number actions and shell controls share the tools area. From 600px, choose side or bottom placement according to the larger game scale; smaller phones retain bottom tools. Optional 2048 direction buttons live in settings. Imported canvases fill their ratio-correct frame without an extra inset.

A warm editorial arcade: confident typography, newspaper rules, generous breathing room and vivid game artwork. The catalogue should feel curated even with three games. Support hundreds without inventing content or repeating variants as separate games.

## Palette

Paper cream #F5F2E9 is the page background. Ink black #17211D is the primary text and rule color. Arcade cyan #A7F0E6 marks focus and selected controls. Acid yellow #D9ED68 highlights the daily challenge. Rust orange #EF896B belongs to arcade artwork. Muted moss #606B61 supports secondary text. Use ink-colored text on bright backgrounds.

## Typography and layout

Use system sans-serif fonts with a robust Korean fallback; no external font download. Confident, tightly spaced headings establish the editorial hierarchy. The home introduction uses a compact 1.5–2rem fluid title (24–32px at the default browser font size), natural wrapping rather than a forced two-line slogan, and a single compact action row containing the full-catalogue link and search. Remove the duplicate tagline, introductory notice and pagination explanation from home; show the quick-play picker directly below, followed by game collections (ADR 0029). Keep the catalogue link and search beside each other on phones, with native wrapping for the title. Detail/editorial feature headings retain their own hierarchy. Uppercase English labels are small accents, never the entire interface. Desktop has a narrow category rail and a broad content column. At widths up to 1100px, use a 64px single-row header with a native menu disclosure for primary, category and guide navigation; hide the separate category rail. The menu works without JavaScript and Escape closes it when JavaScript is available. Wider desktop headers are 80px. Mobile uses two game-card columns. Touch targets are at least 48px, or 56px in large-screen mode.

## Components

Game cards use a 16:10 original SVG thumbnail, title, short description, input labels and duration. Detail pages separate the start button from explanatory text and advertisements. Play pages use a dark frame, persistent pause/restart/mute/exit controls and an explicit start overlay. Focus uses cyan with a dark outline; status never relies on color alone.

Play-style collection cards show a three-game artwork collage from the collection's actual registry members, followed by the real game count, localized title and introduction. Use a larger leading thumbnail and two smaller previews, preserving full artwork and pixel styling. The entire card links to the collection. Display two columns on desktop and one below 600px; keep images static, sized and lazy-loaded.

## Motion and accessibility

Clean casual board refresh (2026-10-12): blue ink player surfaces, rounded pastel bricks and paddle, tactile number tiles, and clear rounded circuit paths. Keep optional tile feedback at 140ms and the ball trail to eight samples; disable both with reduced-motion or low-effects. Editorial badges use mint pills with a concise reason and never imply a popularity measurement. Imported cards frame actual pixel screenshots on soft colour fields; imported game pixels are preserved.

Keep motion restrained and honor reduced motion. Preserve native text zoom, document scrolling and visible keyboard focus. Only the game input surface captures touch gestures. A backgrounded game pauses and waits for an explicit resume action.

## Advertising

Label reserved content slots clearly. Never disguise an advertisement as a game card. No display advertising inside the live play frame. Hide inactive slots before layout; once an active slot reserves space, preserve that space through no-fill to prevent shifts.

## Evidence

Reference: Arcade Press v2 approved direction, 2026-10-10. Rendered desktop/mobile evidence and limitations are recorded in docs/releases. This document specifies design, not physical Tesla or controller certification.

Classic boards use ivory/wood grids against blue ink, mint/coral pieces with inset highlights, clear turn/status text, legal-move dots, repeat-target pointer confirmation and an alternative 48px confirmation button. Checkers marks movable pieces and capture-required turns. Gomoku retains a 15×15 grid; coordinates and preview mitigate dense mobile targets. Original SVG cards illustrate each rule set; actual playable screenshots support detail/social previews. No decorative motion is required.

Gomoku pointer interaction: first click/tap previews a legal intersection; clicking/tapping that same intersection again commits the stone. Selecting another intersection only moves the preview. The explicit confirm button and keyboard/gamepad confirmation remain available.

Play pages default to a browser-viewport stage with persistent exit, locale, view, pause, restart and sound controls. Secondary settings use a disclosure; portrait boards fit both dimensions and short landscape boards place controls beside the board. No operating-system fullscreen is requested.

On compact phones, prioritize the full board: match selectors/help live in settings, coordinates and confirmation share a row, and pause/restart/sound/settings form a single 48px bottom row. Language targets are at least 44px wide. Use 16px settings select text and safe-area padding without disabling zoom.

Immersive classic boards use the full stage height and width while preserving their aspect ratio. From 600px, compare a 176px side rail with bottom tools and use the placement that leaves the larger board. On narrow phones, keep a compact toolbar below the board. Optional on-screen direction buttons live in Settings; keyboard and gamepad arrows continue to work without opening it. Standard view and pause/restart must preserve the current round.

## Quick play and replay

Home replaces its single feature with a dark ink game picker, real registered artwork, lime play action and three 48px mood buttons. The default game remains usable without JavaScript; cycling is explicit. Up to three browser-local recent games appear below. Place the picker after the compact introduction and before collections; preserve the six curated cards and full catalogue. Round-end score badges use actual comparable records; a next-game link appears only after completion. Short-screen result panels scroll from the top when needed. See ADR 0029.

Home discovery refresh (2026-10-18): keep exact-count catalogue and search actions together, then expose every real genre as a horizontally browsable, keyboard-accessible row of 48px links below the quick-play feature. The six opening editor picks represent six different genres and carry a direct local-play action alongside their detail route. Search results use the same real artwork, category, editorial description, estimated duration and control-style metadata; preserve the landscape artwork ratio and 48px actions at phone widths. Local games have a direct play action, while external games lead to their detail page first. Selection is editorial, never a popularity ranking. See ADR 0037.

On compact screens, label the quick-play artwork action "Play now" / "바로 플레이" so the first game can be launched without scrolling past its artwork. Keep its accessible name synchronized when the selected game changes.

## Daily return paths

Use a pale green progress panel on home and daily, with an explicit UTC date and text count. Daily cards show an actual completed-round status and best completed score; never imply a win from completion. Keep actions at least 48px and use a single card column on phones. At daily round end, show progress and a link to a remaining daily game or the completed summary. See ADR 0030.
