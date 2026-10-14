# Hextris source and host integration

Upstream: https://github.com/Hextris/hextris
Pinned revision: `3f4847dc8fd7dab3d1c87e6324b9159d92fbd396`
License: GPL-3.0-or-later. The complete upstream source and license are included in `upstream/`.

`index.html`, `game.css`, and `bridge.js` are the Denny Games host integration. The hosted runtime removes third-party analytics, advertising, social popups, and the legacy score-reporting request to an external IP. It uses an opaque-origin sandbox, a restricted browser storage bridge, host pause/resume, touch-side rotation, and bilingual game-over labels. Upstream code remains under its original GPL license; local modifications are documented here.
