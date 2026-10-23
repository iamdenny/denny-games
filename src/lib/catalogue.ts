import { playModesFor, type PlayMode } from "../data/play-styles";

export const PAGE_SIZE = 24;
export function paginate<T>(
  items: readonly T[],
  page: number,
  size = PAGE_SIZE,
): T[] {
  if (!Number.isInteger(page) || page < 1 || size < 1) return [];
  return items.slice((page - 1) * size, page * size);
}
export function search<
  T extends { title: string; description: string; tags: readonly string[] },
>(items: readonly T[], query: string): T[] {
  const words = query
    .normalize("NFKC")
    .toLocaleLowerCase()
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  return items.filter((item) =>
    words.every((word) =>
      `${item.title} ${item.description} ${item.tags.join(" ")}`
        .normalize("NFKC")
        .toLocaleLowerCase()
        .includes(word),
    ),
  );
}

export interface SearchFilters {
  category: string;
  control: string;
  length: string;
  mode?: string;
}
export function filterCatalogue<
  T extends {
    category: string;
    controlStyle: string;
    duration: string;
    playModes?: readonly PlayMode[];
    classic?: boolean;
  },
>(items: readonly T[], filters: SearchFilters): T[] {
  return items.filter((item) => {
    const upper = Number(item.duration.split(/[–-]/).at(-1));
    return (
      (!filters.category || item.category === filters.category) &&
      (!filters.control || item.controlStyle === filters.control) &&
      (!filters.mode ||
        playModesFor(item).some((mode) => mode === filters.mode)) &&
      (!filters.length ||
        (Number.isFinite(upper) &&
          (filters.length === "short" ? upper <= 3 : upper > 3)))
    );
  });
}
export function searchPage(value: string | null, count: number): number {
  const n = Number(value);
  return Number.isSafeInteger(n) && n >= 1
    ? Math.min(n, Math.max(1, Math.ceil(count / PAGE_SIZE)))
    : 1;
}
