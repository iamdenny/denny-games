import type { GameFactory } from "../../lib/types";
import { boardGame } from "./board";
import { fresh, restore, reveal, flag, adjacent, counts } from "./engine";
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  return boardGame(ctx, {
    id: "minefield-watch",
    title: ko ? "지뢰 감시대" : "MINEFIELD WATCH",
    size: ctx.stage + 5,
    fresh: () => fresh(ctx.stage, ctx.seed),
    restore: (raw) => restore(raw, ctx.stage, ctx.seed),
    phase: (s) => s.phase,
    score: (s) => s.open.filter((i) => !s.mines.includes(i)).length * 10,
    change: (s, i, alt) => (alt ? flag(s, i) : reveal(s, i)),
    mode: ko ? ["열기 모드", "깃발 모드"] : ["Reveal mode", "Flag mode"],
    cell: (s, i) => {
      const open = s.open.includes(i),
        mine = s.mines.includes(i),
        flagged = s.flags.includes(i);
      return open
        ? mine
          ? { text: "✹", kind: "mine", label: ko ? "지뢰" : "Mine" }
          : {
              text: adjacent(s, i) ? String(adjacent(s, i)) : "·",
              kind: "open",
              label: ko
                ? `주변 지뢰 ${adjacent(s, i)}개`
                : `${adjacent(s, i)} adjacent mines`,
            }
        : {
            text: flagged ? "⚑" : "",
            kind: flagged ? "flag" : "hidden",
            label: flagged
              ? ko
                ? "깃발"
                : "Flag"
              : ko
                ? "닫힌 칸"
                : "Covered",
          };
    },
    status: (s) =>
      s.phase === "won"
        ? ko
          ? "안전한 칸을 모두 찾았습니다!"
          : "Every safe cell found!"
        : s.phase === "lost"
          ? ko
            ? "지뢰 발견! 다시 도전하세요."
            : "Mine found! Try another round."
          : ko
            ? `지뢰 ${counts[s.stage - 1]}개 · 깃발 ${s.flags.length}개 · 안전 칸 ${s.open.length}`
            : `${counts[s.stage - 1]} mines · ${s.flags.length} flags · ${s.open.length} safe cells`,
  });
};
