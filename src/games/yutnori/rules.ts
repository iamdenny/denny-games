export type YutRoute = "a-forward" | "a-reverse" | "b-forward";

export interface YutToken {
  node: number | null;
  finished: boolean;
  route: YutRoute | null;
}

export interface YutPlayer {
  tokens: YutToken[];
}

export interface YutThrow {
  faces: boolean[];
  steps: 1 | 2 | 3 | 4 | 5;
}

export interface YutState {
  version: 1;
  players: YutPlayer[];
  turn: number;
  roll: YutThrow | null;
  winner: number | null;
  moves: number;
}

export interface YutMove {
  player: number;
  tokens: number[];
  from: number | null;
  to: number | null;
  trace: number[];
  route: YutRoute | null;
  finished: boolean;
}

export interface YutMoveResult {
  state: YutState;
  captured: number;
  bonusThrow: boolean;
  invalid: boolean;
}

const ROUTES: Record<YutRoute, readonly number[]> = {
  "a-forward": [5, 20, 21, 22, 23, 24, 15],
  "a-reverse": [15, 24, 23, 22, 21, 20, 5],
  "b-forward": [10, 25, 26, 22, 27, 28, 0],
};

const routeAt = (node: number, route: YutRoute) => {
  const path = ROUTES[route];
  const index = path.indexOf(node);
  return index > 0 && index < path.length - 1;
};

export function initialYutState(playerCount = 2): YutState {
  const count = Number.isFinite(playerCount)
    ? Math.max(2, Math.min(4, Math.floor(playerCount)))
    : 2;
  return {
    version: 1,
    players: Array.from({ length: count }, () => ({
      tokens: Array.from({ length: 4 }, () => ({
        node: null,
        finished: false,
        route: null,
      })),
    })),
    turn: 0,
    roll: null,
    winner: null,
    moves: 0,
  };
}

export function classifyYutThrow(faces: unknown): YutThrow | null {
  if (
    !Array.isArray(faces) ||
    faces.length !== 4 ||
    faces.some((face: unknown) => typeof face !== "boolean")
  )
    return null;
  const steps = faces.filter(Boolean).length || 5;
  return { faces: [...faces], steps: steps as YutThrow["steps"] };
}

export function restoreYutState(value: unknown): YutState | null {
  if (!value || typeof value !== "object") return null;
  const candidate = value as Partial<YutState>;
  if (
    candidate.version !== 1 ||
    !Array.isArray(candidate.players) ||
    candidate.players.length < 2 ||
    candidate.players.length > 4 ||
    !Number.isInteger(candidate.turn) ||
    candidate.turn! < 0 ||
    candidate.turn! >= candidate.players.length ||
    !Number.isSafeInteger(candidate.moves) ||
    candidate.moves! < 0 ||
    (candidate.winner !== null &&
      (!Number.isInteger(candidate.winner) ||
        candidate.winner! < 0 ||
        candidate.winner! >= candidate.players.length))
  )
    return null;

  const players: YutPlayer[] = [];
  for (const rawPlayer of candidate.players) {
    if (
      !rawPlayer ||
      !Array.isArray(rawPlayer.tokens) ||
      rawPlayer.tokens.length !== 4
    )
      return null;
    const tokens: YutToken[] = [];
    for (const rawToken of rawPlayer.tokens) {
      if (!rawToken || typeof rawToken !== "object") return null;
      const token = rawToken as Partial<YutToken>;
      if (
        typeof token.finished !== "boolean" ||
        (token.node !== null &&
          (!Number.isInteger(token.node) ||
            token.node! < 1 ||
            token.node! > 28)) ||
        (token.node !== null && token.node! >= 20 && token.route === null) ||
        (token.route !== null &&
          (typeof token.route !== "string" ||
            !Object.hasOwn(ROUTES, token.route) ||
            token.node === null ||
            !routeAt(token.node ?? -1, token.route as YutRoute))) ||
        (token.finished && (token.node !== null || token.route !== null)) ||
        (!token.finished && token.node === null && token.route !== null)
      )
        return null;
      tokens.push({
        node: token.node ?? null,
        finished: token.finished,
        route: (token.route as YutRoute | null) ?? null,
      });
    }
    players.push({ tokens });
  }

  let roll: YutThrow | null = null;
  if (candidate.roll !== null) {
    if (!candidate.roll || typeof candidate.roll !== "object") return null;
    const checkedRoll = classifyYutThrow(candidate.roll.faces ?? []);
    if (!checkedRoll || checkedRoll.steps !== candidate.roll.steps) return null;
    roll = checkedRoll;
  }
  if (candidate.winner !== null) {
    if (
      roll ||
      candidate.turn !== candidate.winner ||
      players[candidate.winner!]!.tokens.some((token) => !token.finished) ||
      players.some(
        (player, index) =>
          index !== candidate.winner &&
          player.tokens.every((token) => token.finished),
      )
    )
      return null;
  }
  if (
    candidate.winner === null &&
    players.some((player) => player.tokens.every((token) => token.finished))
  )
    return null;
  return {
    version: 1,
    players,
    turn: candidate.turn!,
    roll,
    winner: candidate.winner ?? null,
    moves: candidate.moves!,
  };
}

interface Transition {
  node: number;
  route: YutRoute | null;
}

function nextSteps(node: number | null, route: YutRoute | null): Transition[] {
  if (node === null) return [{ node: 1, route: null }];
  if (route) {
    const path = ROUTES[route];
    const index = path.indexOf(node);
    if (index < 0 || index >= path.length - 1) return [];
    const nextIndex = index + 1;
    const next = path[nextIndex]!;
    return [
      {
        node: next,
        route: nextIndex === path.length - 1 ? null : route,
      },
    ];
  }
  if (node === 0) return [];
  if (node === 5)
    return [
      { node: 6, route: null },
      { node: 20, route: "a-forward" },
    ];
  if (node === 10)
    return [
      { node: 11, route: null },
      { node: 25, route: "b-forward" },
    ];
  if (node === 15)
    return [
      { node: 16, route: null },
      { node: 24, route: "a-reverse" },
    ];
  return [{ node: node === 19 ? 0 : node + 1, route: null }];
}

function groupAt(
  state: YutState,
  player: number,
  tokenIndex: number,
): number[] {
  const token = state.players[player]!.tokens[tokenIndex]!;
  if (token.finished) return [];
  if (token.node === null) return [tokenIndex];
  return state.players[player]!.tokens.flatMap((other, index) =>
    !other.finished && other.node === token.node ? [index] : [],
  );
}

function walkGroup(
  player: number,
  tokens: number[],
  from: number | null,
  route: YutRoute | null,
  steps: number,
): YutMove[] {
  let moves: YutMove[] = [];
  const visit = (
    node: number | null,
    currentRoute: YutRoute | null,
    remaining: number,
    trace: number[],
  ) => {
    if (remaining === 0) {
      moves.push({
        player,
        tokens: [...tokens],
        from,
        to: node,
        trace: [...trace],
        route: currentRoute,
        finished: false,
      });
      return;
    }
    for (const next of nextSteps(node, currentRoute)) {
      const nextTrace = [...trace, next.node];
      if (next.node === 0) {
        if (remaining === 1)
          moves.push({
            player,
            tokens: [...tokens],
            from,
            to: null,
            trace: nextTrace,
            route: null,
            finished: true,
          });
        continue;
      }
      visit(next.node, next.route, remaining - 1, nextTrace);
    }
  };
  visit(from, route, steps, []);
  return moves;
}

export function legalYutMoves(
  state: YutState,
  steps = state.roll?.steps,
): YutMove[] {
  if (
    state.winner !== null ||
    !Number.isInteger(steps) ||
    steps! < 1 ||
    steps! > 5
  )
    return [];
  const moves: YutMove[] = [];
  const player = state.players[state.turn]!;
  player.tokens.forEach((token, index) => {
    const group = groupAt(state, state.turn, index);
    if (!group.length || group[0] !== index) return;
    const routes = new Set(group.map((member) => player.tokens[member]!.route));
    for (const route of routes)
      moves.push(...walkGroup(state.turn, group, token.node, route, steps!));
  });
  return moves;
}

const sameMove = (a: YutMove, b: YutMove) =>
  a.player === b.player &&
  a.from === b.from &&
  a.to === b.to &&
  a.route === b.route &&
  a.finished === b.finished &&
  a.tokens.length === b.tokens.length &&
  a.tokens.every((token, index) => token === b.tokens[index]) &&
  a.trace.length === b.trace.length &&
  a.trace.every((node, index) => node === b.trace[index]);

export function applyYutMove(state: YutState, move: YutMove): YutMoveResult {
  const steps = state.roll?.steps;
  if (
    !steps ||
    !legalYutMoves(state, steps).some((legal) => sameMove(legal, move))
  )
    return { state, captured: 0, bonusThrow: false, invalid: true };

  const players = state.players.map((player) => ({
    tokens: player.tokens.map((token) => ({ ...token })),
  }));
  const current = players[state.turn]!;
  const destination = move.to;
  const capturedTokens =
    destination === null
      ? []
      : players.flatMap((player, playerIndex) =>
          playerIndex === state.turn
            ? []
            : player.tokens.filter(
                (token) => !token.finished && token.node === destination,
              ),
        );

  for (const player of players)
    for (const token of player.tokens)
      if (
        destination !== null &&
        token.node === destination &&
        !token.finished &&
        player !== current
      ) {
        token.node = null;
        token.route = null;
      }

  for (const index of move.tokens) {
    const token = current.tokens[index]!;
    token.node = destination;
    token.finished = move.finished;
    token.route = move.finished ? null : move.route;
  }

  if (destination !== null)
    for (const token of current.tokens)
      if (!token.finished && token.node === destination)
        token.route = move.route;

  const winner = current.tokens.every((token) => token.finished)
    ? state.turn
    : null;
  const bonusThrow = steps >= 4 || capturedTokens.length > 0;
  const nextState: YutState = {
    ...state,
    players,
    turn:
      winner !== null || bonusThrow
        ? state.turn
        : (state.turn + 1) % players.length,
    roll: null,
    winner,
    moves: state.moves + 1,
  };
  return {
    state: nextState,
    captured: capturedTokens.length,
    bonusThrow,
    invalid: false,
  };
}
