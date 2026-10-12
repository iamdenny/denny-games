---
title: "Player interaction and viewport PRD"
summary: "Direct board actions and a default browser-viewport game stage."
read_when:
  - Changing player layout or game input
---

# Player interaction and viewport

Default every game to a stage that fills the available browser viewport, keeping browser chrome intact. This is an in-page layout, never an automatic Fullscreen API request. Keep exit, title, locale, pause, restart, sound and the return-to-standard-view control reachable. Place secondary volume/stage/effect/help controls in an accessible settings disclosure. Use dynamic viewport and safe-area sizing; preserve board/canvas aspect ratios and allow internal scrolling on unusually short screens instead of clipping essential controls. Changing view must preserve the round.

For Gomoku and Reversi, select a legal space to preview, then click/tap that space again to place a stone. For Four in a Row, preview a column and select that column again to drop a disc. For Dots and Boxes, preview an edge and select it again to draw. Selecting elsewhere relocates the preview. Checkers uses piece selection followed by a legal destination click/tap to move; continued mandatory jumps stay with the same piece. Keyboard/gamepad preview/confirm and the explicit confirmation button remain available.

Audit the eight original games and shared imported-player wrapper by interaction family. Circuit Loop rotates a cell directly, 2048 accepts swipes/directions, Orbit Break launches/moves from its canvas, and imported games retain their own one-button/pointer controls. Do not claim a manual UX review of all 191 individual imported games. Regression tests cover direct board input, alternative input, viewport bounds, standard-view return, preserved progress and game lifecycle across families. Browser viewport tests do not certify physical vehicles or devices.
