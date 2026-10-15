import type { Locale } from "../lib/types";

// Small editorial sets, not popularity rankings or hardware certification.
export const quickPlayGroups = [
  {
    id: "quick",
    label: { en: "Quick reflexes", ko: "빠른 손맛" },
    ids: ["hextris", "orbit-break", "crisp-chain-drift"],
  },
  {
    id: "think",
    label: { en: "Think it through", ko: "머리 쓰기" },
    ids: ["circuit-loop", "2048", "reversi"],
  },
  {
    id: "together",
    label: { en: "Play together", ko: "둘이 한 판" },
    ids: ["gomoku", "four-in-a-row", "dots-and-boxes"],
  },
] satisfies { id: string; label: Record<Locale, string>; ids: string[] }[];
