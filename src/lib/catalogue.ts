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
