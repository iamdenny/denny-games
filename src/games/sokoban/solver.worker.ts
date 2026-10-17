import {
  expandSolution,
  solve,
  type Level,
} from "../../../vendor/sokoban/upstream/src/sokoban";

let generation = 0;
self.addEventListener(
  "message",
  (
    event: MessageEvent<{
      type: "solve";
      requestId: number;
      level: Level;
    }>,
  ) => {
    const request = ++generation;
    const requestId = event.data.requestId;
    try {
      const result = solve(event.data.level);
      if (request !== generation) return;
      if (result.gaveUp) {
        self.postMessage({ requestId, path: null, gaveUp: true });
      } else if (result.pushes === null) {
        self.postMessage({ requestId, path: null, gaveUp: false });
      } else {
        self.postMessage({
          requestId,
          path: expandSolution(event.data.level, result.pushes),
          gaveUp: false,
        });
      }
    } catch {
      if (request === generation) self.postMessage({ requestId, error: true });
    }
  },
);
