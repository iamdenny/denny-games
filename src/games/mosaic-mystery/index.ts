import type { GameFactory } from "../../lib/types";
import { boardGame } from "../minefield-watch/board";
import { fresh, restore, mark, puzzles, rowClues, colClues } from "./engine";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko",
    p = puzzles[ctx.stage - 1]!;
  return boardGame(ctx, {
    id: "mosaic-mystery",
    title: ko ? "모자이크 미스터리" : "MOSAIC MYSTERY",
    size: p.size,
    fresh: () => fresh(ctx.stage),
    restore: (raw) => restore(raw, ctx.stage),
    phase: (s) => s.phase,
    score: (s) => (s.phase === "won" ? Math.max(100, 1000 - s.moves * 5) : 0),
    change: (s, i, alt) => mark(s, i, alt ? 2 : 1),
    mode: ko ? ["칠하기 모드", "빈칸 표시 모드"] : ["Paint mode", "Cross mode"],
    row: rowClues(p),
    col: colClues(p),
    cell: (s, i) => ({
      text: s.marks[i] === 2 ? "×" : "",
      kind: s.marks[i] === 1 ? "filled" : s.marks[i] === 2 ? "cross" : "blank",
      label:
        s.marks[i] === 1
          ? ko
            ? "칠한 칸"
            : "Filled"
          : s.marks[i] === 2
            ? ko
              ? "빈칸 표시"
              : "Marked empty"
            : ko
              ? "미정"
              : "Unknown",
    }),
    status: (s) =>
      s.phase === "won"
        ? ko
          ? `${p.name[1]} 완성! ${s.moves}번 조작`
          : `${p.name[0]} revealed! ${s.moves} moves`
        : ko
          ? `퍼즐 ${s.stage}/12 · 조작 ${s.moves}회 · 숫자는 연속 칠한 칸 수`
          : `Puzzle ${s.stage}/12 · ${s.moves} moves · Clues count filled runs`,
  });
};
