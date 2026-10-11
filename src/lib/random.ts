export function hash(text: string): number {
  let value = 2166136261;
  for (const char of text)
    value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return value >>> 0;
}
export function random(seed: string): () => number {
  let state = hash(seed);
  return () => {
    state += 0x6d2b79f5;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function dailySeed(id: string, date = new Date()): string {
  return `${id}:v1:${date.toISOString().slice(0, 10)}`;
}
export function validSeed(value: string | null): string | undefined {
  return value && /^[a-zA-Z0-9:_-]{1,100}$/.test(value) ? value : undefined;
}
