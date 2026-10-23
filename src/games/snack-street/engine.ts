export const foods = ["rice", "roll", "broth"] as const;
export type Food = (typeof foods)[number];
export type Upgrade = "stove" | "sign" | "tips";
export interface Station {
  prep: number;
  cook: number;
  ready: boolean;
}
export interface Order {
  id: number;
  food: Food;
  patience: number;
}
export interface Shop {
  version: 1;
  day: number;
  coins: number;
  earned: number;
  served: number;
  missed: number;
  combo: number;
  resolved: number;
  issued: number;
  phase: "open" | "shop" | "done";
  orders: Order[];
  stations: Station[];
  upgrades: Record<Upgrade, number>;
}
export const recipe = [
  { steps: 2, seconds: 3 },
  { steps: 3, seconds: 0 },
  { steps: 1, seconds: 5 },
];
const emptyStation = (): Station => ({ prep: 0, cook: 0, ready: false });
export const totalOrders = (s: Shop) => 5 + s.day;
export const patienceLimit = (s: Shop) => 38 - s.day * 2 + s.upgrades.sign * 6;
function fill(s: Shop) {
  while (s.orders.length < 3 && s.issued < totalOrders(s)) {
    const id = s.issued++;
    s.orders.push({
      id,
      food: foods[(id + s.day - 1) % 3]!,
      patience: patienceLimit(s),
    });
  }
}
export function newShop(): Shop {
  const s: Shop = {
    version: 1,
    day: 1,
    coins: 0,
    earned: 0,
    served: 0,
    missed: 0,
    combo: 0,
    resolved: 0,
    issued: 0,
    phase: "open",
    orders: [],
    stations: foods.map(emptyStation),
    upgrades: { stove: 0, sign: 0, tips: 0 },
  };
  fill(s);
  return s;
}
function settle(s: Shop) {
  fill(s);
  if (s.resolved === totalOrders(s)) {
    s.phase = s.day === 5 ? "done" : "shop";
    s.stations = foods.map(emptyStation);
  }
}
export function work(s: Shop, index: number): Shop {
  if (s.phase !== "open" || !Number.isInteger(index) || index < 0 || index > 2)
    return s;
  const station = s.stations[index]!;
  if (station.cook > 0) return s;
  const next = structuredClone(s),
    target = next.stations[index]!;
  if (target.ready) {
    const orderIndex = next.orders.findIndex((o) => o.food === foods[index]);
    if (orderIndex < 0) return s;
    next.orders.splice(orderIndex, 1);
    next.combo++;
    const income = 8 + next.upgrades.tips * 2 + Math.min(5, next.combo);
    next.coins += income;
    next.earned += income;
    next.served++;
    next.resolved++;
    next.stations[index] = emptyStation();
    settle(next);
  } else {
    target.prep++;
    if (target.prep === recipe[index]!.steps) {
      target.cook = Math.max(0, recipe[index]!.seconds - next.upgrades.stove);
      target.ready = target.cook === 0;
    }
  }
  return next;
}
export function tick(s: Shop): Shop {
  if (s.phase !== "open") return s;
  const next = structuredClone(s);
  next.stations.forEach((station) => {
    if (station.cook > 0) {
      station.cook--;
      station.ready = station.cook === 0;
    }
  });
  next.orders.forEach((order) => order.patience--);
  const expired = next.orders.filter((o) => o.patience <= 0).length;
  if (expired) {
    next.combo = 0;
    next.missed += expired;
    next.resolved += expired;
    next.orders = next.orders.filter((o) => o.patience > 0);
  }
  settle(next);
  return next;
}
export function cost(s: Shop, upgrade: Upgrade) {
  return 22 + s.upgrades[upgrade] * 20;
}
export function buy(s: Shop, upgrade: Upgrade): Shop {
  if (
    s.phase !== "shop" ||
    s.upgrades[upgrade] >= 2 ||
    s.coins < cost(s, upgrade)
  )
    return s;
  const next = structuredClone(s);
  next.coins -= cost(s, upgrade);
  next.upgrades[upgrade]++;
  return next;
}
export function nextDay(s: Shop): Shop {
  if (s.phase !== "shop") return s;
  const next = structuredClone(s);
  next.day++;
  next.resolved = 0;
  next.issued = 0;
  next.orders = [];
  next.combo = 0;
  next.phase = "open";
  fill(next);
  return next;
}
export function restoreShop(value: unknown): Shop {
  try {
    const s = value as Shop;
    const int = (v: unknown, lo: number, hi: number) =>
      typeof v === "number" && Number.isInteger(v) && v >= lo && v <= hi;
    if (
      !s ||
      s.version !== 1 ||
      !int(s.day, 1, 5) ||
      !["open", "shop", "done"].includes(s.phase) ||
      !int(s.coins, 0, 2000) ||
      !int(s.earned, 0, 2000) ||
      s.coins > s.earned ||
      !int(s.served, 0, 40) ||
      !int(s.missed, 0, 40) ||
      !int(s.combo, 0, s.served) ||
      !int(s.resolved, 0, totalOrders(s)) ||
      !int(s.issued, 0, totalOrders(s)) ||
      !s.upgrades ||
      !["stove", "sign", "tips"].every((k) =>
        int(s.upgrades[k as Upgrade], 0, 2),
      ) ||
      !Array.isArray(s.orders) ||
      s.orders.length > 3 ||
      !Array.isArray(s.stations) ||
      s.stations.length !== 3
    )
      return newShop();
    const past = Array.from({ length: s.day - 1 }, (_, i) => 6 + i).reduce(
      (a, b) => a + b,
      0,
    );
    if (
      s.served + s.missed !== past + s.resolved ||
      s.earned < s.served * 9 ||
      s.earned > s.served * 17 ||
      s.earned - s.coins !==
        Object.values(s.upgrades).reduce(
          (sum, level) => sum + (level === 2 ? 64 : level === 1 ? 22 : 0),
          0,
        ) ||
      s.issued !== s.resolved + s.orders.length ||
      new Set(s.orders.map((o) => o.id)).size !== s.orders.length ||
      !s.orders.every(
        (o) =>
          int(o.id, 0, s.issued - 1) &&
          o.food === foods[(o.id + s.day - 1) % 3] &&
          int(o.patience, 1, patienceLimit(s)),
      ) ||
      !s.stations.every(
        (st, i) =>
          int(st.prep, 0, recipe[i]!.steps) &&
          int(st.cook, 0, recipe[i]!.seconds) &&
          typeof st.ready === "boolean" &&
          (st.prep < recipe[i]!.steps
            ? !st.ready && st.cook === 0
            : st.ready === (st.cook === 0)),
      )
    )
      return newShop();
    if (
      s.phase === "open"
        ? s.resolved >= totalOrders(s) || s.orders.length === 0
        : s.resolved !== totalOrders(s) ||
          s.orders.length !== 0 ||
          (s.phase === "done" ? s.day !== 5 : s.day === 5)
    )
      return newShop();
    return {
      version: 1,
      day: s.day,
      coins: s.coins,
      earned: s.earned,
      served: s.served,
      missed: s.missed,
      combo: s.combo,
      resolved: s.resolved,
      issued: s.issued,
      phase: s.phase,
      orders: s.orders.map(({ id, food, patience }) => ({
        id,
        food,
        patience,
      })),
      stations: s.stations.map(({ prep, cook, ready }) => ({
        prep,
        cook,
        ready,
      })),
      upgrades: {
        stove: s.upgrades.stove,
        sign: s.upgrades.sign,
        tips: s.upgrades.tips,
      },
    };
  } catch {
    return newShop();
  }
}
