export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}
const memory = new Map<string, unknown>();
function backend(): StorageLike | undefined {
  try {
    return typeof localStorage !== "undefined" ? localStorage : undefined;
  } catch {
    return undefined;
  }
}
export function read<T>(key: string, fallback: T, store = backend()): T {
  const full = `denny-games:v1:${key}`;
  try {
    const value = store?.getItem(full);
    if (value) return JSON.parse(value) as T;
  } catch {
    /* private mode or corrupt storage: use session memory */
  }
  return memory.has(full) ? (memory.get(full) as T) : fallback;
}
export function write(key: string, value: unknown, store = backend()): boolean {
  const full = `denny-games:v1:${key}`;
  memory.set(full, value);
  try {
    if (!store) return false;
    store.setItem(full, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
export function list(key: string): string[] {
  const value = read<unknown>(key, []);
  return Array.isArray(value)
    ? value.filter((v): v is string => typeof v === "string").slice(0, 100)
    : [];
}
export function toggleFavorite(id: string): boolean {
  const ids = list("favorites");
  const enabled = !ids.includes(id);
  write("favorites", enabled ? [...ids, id] : ids.filter((v) => v !== id));
  return enabled;
}
export function addRecent(id: string): void {
  write("recent", [id, ...list("recent").filter((v) => v !== id)].slice(0, 12));
}
