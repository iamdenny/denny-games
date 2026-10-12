import { chooseMove } from "./ai";
import type { Position } from "./rules";
self.onmessage = (event: MessageEvent<{ position: Position; level: number }>) =>
  self.postMessage(chooseMove(event.data.position, event.data.level));
