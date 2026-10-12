---
title: "Player interaction and viewport PRD"
summary: "Direct board actions and a default browser-viewport game stage."
read_when:
  - Changing player layout or game input
---

# Player interaction and viewport

All-game sizing follows [ADR 0021](../adr/0021-maximized-all-game-stages.md). Every immersive surface fills the available host while preserving its logical ratio. Scores and primary game actions share the tools area; optional 2048 arrows live in settings. At widths of 600px or more, choose side or bottom tools by which leaves a larger game surface, including wide imported games and portrait tablet windows. Smaller phones keep compact bottom controls. Resizing and switching views preserve running/paused state without remounting.

Default every game to a stage that fills the available browser viewport, keeping browser chrome intact. This is an in-page layout, never an automatic Fullscreen API request. Keep exit, title, locale, pause, restart, sound and the return-to-standard-view control reachable. Place secondary volume/stage/effect/help controls in an accessible settings disclosure. Use dynamic viewport and safe-area sizing; preserve board/canvas aspect ratios and allow internal scrolling on unusually short screens instead of clipping essential controls. Changing view must preserve the round.

For Gomoku and Reversi, select a legal space to preview, then click/tap that space again to place a stone. For Four in a Row, preview a column and select that column again to drop a disc. For Dots and Boxes, preview an edge and select it again to draw. Selecting elsewhere relocates the preview. Checkers uses piece selection followed by a legal destination click/tap to move; continued mandatory jumps stay with the same piece. Keyboard/gamepad preview/confirm and the explicit confirmation button remain available.

Audit the eight original games and shared imported-player wrapper by interaction family. Circuit Loop rotates a cell directly, 2048 accepts swipes/directions, Orbit Break launches/moves from its canvas, and imported games retain their own one-button/pointer controls. Do not claim a manual UX review of all 191 individual imported games. Regression tests cover direct board input, alternative input, viewport bounds, standard-view return, preserved progress and game lifecycle across families. Browser viewport tests do not certify physical vehicles or devices.

## Compact mobile acceptance

At 320×568 and larger phone sizes, opening/starting a game must not scroll the stage away from its top. Keep the full classic board and its confirmation reachable; use one row for shell pause/restart/sound/settings. Match mode, AI difficulty and detailed help live in settings, which must not duplicate on remount. Keep large direction buttons for precise Gomoku selection and show selected coordinates next to confirmation. Touch gestures must cancel cleanly on interrupted input; orientation changes preserve the round. Include safe-area insets and preserve browser pinch zoom. See [ADR 0017](../adr/0017-mobile-game-controls.md).

## Catalogue and classic-board space — 2026-10-12

See [ADR 0020](../adr/0020-compact-navigation-and-board-stage.md). Compact browser windows use a single-row catalogue header and a native menu disclosure instead of expanded primary/category rows. Classic boards use the full stage; turn/coordinates/confirmation and shell controls move to a side rail at widths of 600px or more. On-screen arrows remain available in settings, while keyboard/gamepad input and repeated-target touch confirmation stay unchanged. On narrower phones, the controls remain in a compact bottom toolbar. Validate 800×600 and 960×640 in both languages alongside phone, short-landscape and desktop scenarios; these are CSS viewport examples, not an assertion of the attached vehicle's exact viewport or firmware support.
