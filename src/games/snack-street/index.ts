import type { GameFactory } from "../../lib/types";
import { createMotion, gsap } from "../../lib/motion";
import {
  newShop,
  restoreShop,
  work,
  tick,
  buy,
  nextDay,
  foods,
  recipe,
  cost,
  patienceLimit,
  type Upgrade,
} from "./engine";
import "./style.css";
const el = <K extends keyof HTMLElementTagNameMap>(
  tag: K,
  cls = "",
  text = "",
) => {
  const e = document.createElement(tag);
  e.className = cls;
  e.textContent = text;
  return e;
};
const art = [
  '<ellipse cx="80" cy="85" rx="66" ry="29" fill="#7d302c"/><ellipse cx="80" cy="75" rx="64" ry="27" fill="#ed673e"/><g fill="#ffd5a1" stroke="#f7ad73" stroke-width="3"><rect x="36" y="56" width="16" height="38" rx="8" transform="rotate(-22 44 75)"/><rect x="64" y="50" width="16" height="38" rx="8" transform="rotate(30 72 69)"/><rect x="93" y="60" width="16" height="38" rx="8" transform="rotate(-35 101 79)"/></g><path d="m46 53 15 8m28-13 14 8" stroke="#70a966" stroke-width="5"/>',
  '<ellipse cx="80" cy="93" rx="65" ry="18" fill="#dfbb84"/><g stroke="#254b42" stroke-width="9" fill="#fdf0c8"><ellipse cx="47" cy="73" rx="21" ry="24"/><ellipse cx="82" cy="65" rx="21" ry="24"/><ellipse cx="115" cy="79" rx="21" ry="24"/></g><g fill="#e78e38"><circle cx="47" cy="73" r="8"/><circle cx="82" cy="65" r="8"/><circle cx="115" cy="79" r="8"/></g><path d="m40 70 8-8m27 2 8-8m25 22 8-8" stroke="#77a668" stroke-width="6"/>',
  '<path d="M17 65h126l-16 38H33Z" fill="#507d87"/><ellipse cx="80" cy="65" rx="63" ry="22" fill="#eab96d"/><g stroke="#a97541" stroke-width="4"><path d="m48 24 8 66m45-66-7 66"/></g><path d="m38 37 27 6-24 12 28 8-24 13m43-40 24 7-27 12 25 9-27 10" fill="none" stroke="#f9db98" stroke-width="12" stroke-linejoin="round"/>',
];
export const mount: GameFactory = (ctx) => {
  const ko = ctx.locale === "ko";
  let s = restoreShop(ctx.saved),
    active = false,
    ended = false,
    restoredEnding = s.phase === "done",
    selected = 0;
  const root = el("section", "snack-street");
  root.setAttribute("aria-label", ko ? "분식 골목" : "Snack Street");
  const awning = el(
    "header",
    "snack-awning",
    ko ? "분식 골목" : "SNACK STREET",
  );
  const stats = el("div", "snack-stats"),
    orders = el("div", "snack-orders"),
    counter = el("div", "snack-counter"),
    shop = el("div", "snack-upgrades"),
    note = el("p", "snack-note");
  note.setAttribute("role", "status");
  const names = ko
    ? ["떡볶이", "김밥", "어묵"]
    : ["Rice cakes", "Gimbap", "Fish cake"];
  const verbs = ko
    ? ["떡 넣기 · 젓기", "재료 · 말기 · 썰기", "꼬치 넣기"]
    : ["Add · stir", "Fill · roll · slice", "Add skewers"];
  const buttons = foods.map((food, i) => {
    const b = el("button", "snack-station");
    b.type = "button";
    b.dataset.food = food;
    const image = el("span", "snack-dish");
    image.innerHTML = `<svg viewBox="0 0 160 120" aria-hidden="true">${art[i]}</svg>`;
    const name = el("strong", "", names[i]),
      detail = el("span", "snack-detail"),
      meter = el("progress");
    meter.max = recipe[i]!.steps;
    meter.setAttribute(
      "aria-label",
      ko ? `${names[i]} 준비` : `${names[i]} preparation`,
    );
    b.append(image, name, detail, meter);
    b.addEventListener("focus", () => (selected = i));
    b.addEventListener("click", () => operate(i));
    counter.append(b);
    return b;
  });
  const upgrades: Upgrade[] = ["stove", "sign", "tips"];
  const upgradeNames = ko
    ? ["화력 +1 · 조리 −1초", "간판 +1 · 인내 +6초", "서비스 +1 · 수입 +2"]
    : [
        "Stove +1 · cook −1s",
        "Sign +1 · patience +6s",
        "Service +1 · income +2",
      ];
  const upgradeButtons = upgrades.map((u, i) => {
    const b = el("button");
    b.type = "button";
    b.dataset.upgrade = u;
    b.addEventListener("click", () => {
      if (!active) return;
      const n = buy(s, u);
      if (n === s) return;
      s = n;
      save();
      render();
      ctx.sound();
    });
    b.addEventListener("focus", () => (selected = i));
    shop.append(b);
    return b;
  });
  const next = el(
    "button",
    "snack-next",
    ko ? "다음 날 영업 시작" : "Open the next day",
  );
  next.type = "button";
  next.dataset.nextDay = "";
  next.addEventListener("focus", () => (selected = 3));
  next.addEventListener("click", () => {
    if (!active) return;
    s = nextDay(s);
    selected = 0;
    save();
    render();
  });
  shop.append(next);
  root.append(awning, stats, orders, counter, shop, note);
  ctx.host.append(root);
  const motion = createMotion(root);
  function save() {
    ctx.onChange(s.earned);
    ctx.onSave?.();
  }
  function render() {
    root.dataset.day = String(s.day);
    root.dataset.phase = s.phase;
    root.dataset.served = String(s.served);
    root.dataset.earned = String(s.earned);
    root.dataset.active = String(active);
    stats.textContent = ko
      ? `${s.day}/5일 · 동전 ${s.coins} · 판매 ${s.served} · 연속 ${s.combo}`
      : `DAY ${s.day}/5 · COINS ${s.coins} · SERVED ${s.served} · COMBO ${s.combo}`;
    orders.replaceChildren();
    for (const o of s.orders) {
      const card = el("div", "snack-order");
      card.dataset.order = o.food;
      const head = el(
          "strong",
          "",
          `${o.id + 1}. ${names[foods.indexOf(o.food)]}`,
        ),
        patience = el("progress");
      patience.max = patienceLimit(s);
      patience.value = o.patience;
      patience.setAttribute(
        "aria-label",
        ko
          ? `${head.textContent} 남은 인내 ${o.patience}초`
          : `${head.textContent} patience ${o.patience} seconds`,
      );
      card.append(head, patience);
      orders.append(card);
    }
    orders.hidden = s.phase !== "open";
    counter.hidden = s.phase !== "open";
    shop.hidden = s.phase !== "shop";
    buttons.forEach((b, i) => {
      const st = s.stations[i]!;
      b.disabled =
        !active ||
        s.phase !== "open" ||
        st.cook > 0 ||
        (st.ready && !s.orders.some((o) => o.food === foods[i]));
      b.dataset.ready = String(st.ready);
      b.querySelector(".snack-detail")!.textContent = st.ready
        ? ko
          ? "완성! 눌러서 서빙"
          : "Ready! Tap to serve"
        : st.cook > 0
          ? ko
            ? `조리 중 · ${st.cook}초`
            : `Cooking · ${st.cook}s`
          : `${verbs[i]} (${st.prep}/${recipe[i]!.steps})`;
      (b.querySelector("progress") as HTMLProgressElement).value = st.prep;
    });
    upgradeButtons.forEach((b, i) => {
      const u = upgrades[i]!;
      b.textContent = `${upgradeNames[i]} · ${s.upgrades[u] >= 2 ? (ko ? "최대" : "MAX") : cost(s, u) + " 🪙"}`;
      b.disabled = !active || s.upgrades[u] >= 2 || s.coins < cost(s, u);
    });
    next.disabled = !active;
    note.textContent =
      s.phase === "done"
        ? ko
          ? `5일 영업 완료! ${s.served}/40명 서빙 · 총 ${s.earned}동전. 다시 시작해 기록에 도전하세요.`
          : `Five days complete! Served ${s.served}/40 · earned ${s.earned} coins. Restart to beat your record.`
        : s.phase === "shop"
          ? ko
            ? "영업 종료! 동전으로 업그레이드하거나 다음 날을 시작하세요."
            : "Shop closed! Buy upgrades or open the next day."
          : ko
            ? "주문에 맞는 음식을 여러 번 눌러 준비 → 조리 후 다시 눌러 서빙! 동시 조리 가능! 5일간 24명 이상 서빙하면 성공."
            : "Tap a dish to prepare → wait for cooking → tap again to serve! Cook in parallel! Serve 24 guests over 5 days to win.";
  }
  function complete() {
    if (s.phase === "done" && !ended) {
      ended = true;
      active = false;
      render();
      ctx.onEnd({
        won: s.served >= 24,
        score: s.earned,
        message: note.textContent ?? "",
        restored: restoredEnding,
      });
    }
  }
  function operate(i: number) {
    if (!active) return;
    const previous = s;
    const n = work(s, i);
    if (n === s) return;
    motion.finish();
    s = n;
    save();
    render();
    const dish = buttons[i]!.querySelector(".snack-dish");
    motion.run(
      (t) => {
        t.fromTo(
          dish,
          {
            y: previous.served < s.served ? -16 : 6,
            rotation: previous.served < s.served ? 0 : -5,
            scale: 0.9,
          },
          {
            y: 0,
            rotation: 0,
            scale: 1,
            duration: 0.32,
            ease: "back.out(1.8)",
          },
        );
      },
      () => {
        gsap.set(dish, { clearProps: "transform" });
      },
    );
    ctx.sound();
    complete();
  }
  const timer = window.setInterval(() => {
    if (!active || s.phase !== "open") return;
    motion.finish();
    s = tick(s);
    save();
    render();
    complete();
  }, 1000);
  const activate = () => {
    active = true;
    render();
    complete();
  };
  render();
  ctx.onChange(s.earned);
  const portrait = matchMedia("(max-width: 600px) and (orientation: portrait)");
  const reportSize = () =>
    ctx.onReady?.(
      portrait.matches
        ? { width: 480, height: 640 }
        : { width: 720, height: 600 },
    );
  portrait.addEventListener("change", reportSize);
  reportSize();
  return {
    start: activate,
    resume: activate,
    pause() {
      active = false;
      motion.finish();
      render();
    },
    restart() {
      motion.finish();
      s = newShop();
      ended = false;
      restoredEnding = false;
      active = true;
      selected = 0;
      save();
      render();
    },
    action(a) {
      if (!active) return;
      const choices = s.phase === "shop" ? [...upgradeButtons, next] : buttons;
      if (a === "confirm") {
        choices[selected]?.click();
        return;
      }
      selected =
        (selected + (a === "right" || a === "down" ? 1 : -1) + choices.length) %
        choices.length;
      choices[selected]?.focus();
    },
    serialize() {
      return structuredClone(s);
    },
    destroy() {
      portrait.removeEventListener("change", reportSize);
      clearInterval(timer);
      motion.destroy();
      root.remove();
    },
  };
};
