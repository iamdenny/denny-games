---
title: "Classic board games release PRD"
summary: "Five original browser board games, bilingual discovery and local play."
read_when:
  - Developing or reviewing classic board games
---

# Classic board games — 2026-10-12

## Product

Add Gomoku, Reversi, Four in a Row, English checkers and Dots and Boxes in a new Board category. Use a consistent midnight-blue player, ivory board, mint/coral pieces, clear turn and result labels, legal-move previews and explicit move confirmation. Ship browser AI and same-device two-player modes, three bounded AI levels, restart and local restoration. No account, network opponent or server required. Janggi and Go remain future work; do not represent them as delivered.

Before a new match, show the AI and same-device two-player choices on the ready screen. Describe local play as taking turns on the same device; keep the mode selector in settings as well.

## Rules and interaction

- Gomoku: 15×15 freestyle, five or more wins, no forbidden moves.
- Reversi: 8×8, capture all bracketed lines, automatic legal pass, finish when neither side can move.
- Four in a Row: seven columns, six rows, gravity, four aligned wins, full-board draw.
- English checkers: 8×8, mandatory captures and continued jumps by the same piece, forward-only men, kings move/jump both ways, promotion ends the turn, no-move loss and 80 non-capture king plies draw.
- Dots and Boxes: 4×4 boxes, claim one edge, completed boxes score and grant another move, double-box captures supported.
- Tap/click previews a space, column or edge; repeating that target commits it. Checkers selects a piece, then a marked destination click commits immediately. A separate 48px confirm button remains an alternative. Arrow keys navigate, confirm selects/commits. Visible on-screen directions support touch; shared gamepad mapping uses the same actions.
- No optional decorative motion is necessary for rules. Preserve pause across visibility changes, cancel pending AI on pause/destroy, resume safely, restore board/mode/difficulty and outcome. AI is a bounded local search, not a professional-strength claim.

## Discovery and monetization

Publish distinct Korean/English game descriptions, rule variants, controls, strategy tips and a comparison guide. Add a classic-board collection, category, contextual links, canonical/hreflang, sitemap entries and accurate VideoGame playMode. Publish llms.txt as a discovery aid with links to authoritative visible pages; it is not an indexing or AI-citation guarantee. No fabricated rankings or FAQ rich-result claims. Existing catalogue/detail ad positions remain; no ads inside repeated-input gameplay.

The South Korea collection entry uses a natural Korean phrase for playing a free two-player board game with a friend. Every game card also links straight to its local player, with a game-specific accessible name. The route remains bilingual and describes the same five verified games; it does not imply online matchmaking.

## Delivery acceptance

Rules fixtures cover captures, passes, gravity, wins/draws, jump continuation, crowning and box extra turns. Browser journeys cover all five engines, AI replies, local mode, reload, locale, pause and 320–430px overflow. Inspect actual desktop/mobile boards. Verify exact catalogue inventory and SEO locally and publicly after passing CI, PR merge and Pages deployment. Physical controller/Tesla proof and third-party search processing remain separate.

## Sound

Original Web Audio synthesis distinguishes stone placement, gravity drops, disc flips, checker steps/captures, edges and completed boxes, plus win/loss/draw cues. No third-party recordings or continuous background music. Sound is initially off; remember the user's mute and effects-volume settings, but create/resume audio only from an explicit gesture. Stop active and scheduled notes on mute/pause/background, so stale cues do not replay on resume. Sound is supplementary: turn, legal moves and results remain visible without it.

Gomoku pointer interaction: first click/tap previews a legal intersection; clicking/tapping that same intersection again commits the stone. Selecting another intersection only moves the preview. The explicit confirm button and keyboard/gamepad confirmation remain available.

Pointer interactions and viewport presentation are further specified by [the player UX PRD](../product/PLAYER-UX.md) and [ADR 0016](../adr/0016-viewport-player.md).
