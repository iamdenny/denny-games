# Third-party runtime components

The runtime uses the following upstream browser libraries. Their original source files remain in the corresponding-source directory. License texts are published under `/licenses/hextris/`.

- jQuery 1.9.1 — Copyright 2005, 2012 jQuery Foundation, Inc. — MIT.
- JavaScript Cookie 2.0.0-pre — Copyright 2006, 2015 Klaus Hartl — MIT.
- Keypress 1.0.8 — Copyright 2013 David Mauro — Apache License 2.0.

The original upstream JSONfn serializer is not bundled. A Denny Games JSON-only serializer stores plain data; the host restores Hex and Block instances through their pinned constructors, so saved data cannot execute functions. No upstream font, analytics, advertising, social-sharing, or audio asset is executed by the hosted game. The runtime uses the original GPL game code with Denny Games' host bridge and responsive control shell.

The jQuery runtime retains its MIT license and upstream source. The build removes its obsolete inline event-attribute probes for legacy browsers; current supported browser engines already bubble these events and the strict game CSP remains enabled.
