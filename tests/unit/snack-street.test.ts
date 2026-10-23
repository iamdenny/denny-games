import { describe, it, expect } from "vitest";
import {
  newShop,
  work,
  tick,
  buy,
  nextDay,
  restoreShop,
  foods,
  type Shop,
} from "../../src/games/snack-street/engine";
function serve(s: Shop, i: number) {
  while (!s.stations[i]!.ready) s = s.stations[i]!.cook ? tick(s) : work(s, i);
  return work(s, i);
}
describe("Snack Street", () => {
  it("keeps every checkpoint valid across a perfect upgraded campaign", () => {
    let s = newShop();
    while (s.phase !== "done") {
      if (s.phase === "shop") {
        for (const upgrade of ["stove", "tips", "sign"] as const) {
          s = buy(s, upgrade);
          expect(restoreShop(s)).toEqual(s);
        }
        s = nextDay(s);
      } else {
        const i = foods.indexOf(s.orders[0]!.food);
        s = s.stations[i]!.cook ? tick(s) : work(s, i);
      }
      expect(restoreShop(s)).toEqual(s);
    }
    expect(s.served).toBe(40);
    expect(s.missed).toBe(0);
  });
  it("uses three distinct recipes and rewards consecutive correct dishes", () => {
    let s = newShop();
    s = serve(s, 1);
    expect(s.served).toBe(1);
    expect(s.coins).toBe(9);
    s = serve(s, 0);
    expect(s.coins).toBe(19);
    expect(s.combo).toBe(2);
  });
  it("ends a day, charges upgrades once and starts the next queue", () => {
    let s = newShop();
    while (s.phase === "open") s = serve(s, foods.indexOf(s.orders[0]!.food));
    expect(s.phase).toBe("shop");
    const before = s.coins;
    s = buy(s, "stove");
    expect(s.coins).toBe(before - 22);
    expect(s.upgrades.stove).toBe(1);
    s = nextDay(s);
    expect(s.day).toBe(2);
    expect(s.orders.length).toBe(3);
    expect(buy(s, "tips")).toBe(s);
  });
  it("expires customers without negative money or hanging and completes five days", () => {
    let s = newShop();
    while (s.phase !== "done") s = s.phase === "shop" ? nextDay(s) : tick(s);
    expect(s.missed).toBe(40);
    expect(s.coins).toBe(0);
    expect(tick(s)).toBe(s);
  });
  it("restores exact cooking and patience, rejects corrupt and inconsistent checkpoints", () => {
    let s = work(work(newShop(), 0), 0);
    s = tick(s);
    expect(restoreShop(s)).toEqual(s);
    for (const bad of [
      null,
      { ...s, coins: Infinity },
      { ...s, day: 99 },
      { ...s, stations: [] },
      { ...s, served: 3 },
      { ...s, orders: [...s.orders, s.orders[0]] },
    ])
      expect(restoreShop(bad)).toEqual(newShop());
  });
  it("does not sell a ready dish without a matching customer", () => {
    const s = newShop();
    s.orders = s.orders.map((o) => ({ ...o, food: "rice" }));
    let n = work(work(work(s, 1), 1), 1);
    expect(n.stations[1]!.ready).toBe(true);
    expect(work(n, 1)).toBe(n);
  });
});
