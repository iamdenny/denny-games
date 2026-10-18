import { list } from "../lib/storage";
import { loadCatalogue } from "../lib/cards";
import type { Locale } from "../lib/types";

const root = document.querySelector<HTMLElement>("[data-quick-play]");
if (root) {
  const locale = document.documentElement.lang as Locale;
  type Choice = {
    id: string;
    title: string;
    hook: string;
    image: string;
    note: string;
    duration: string;
  };
  type Pool = { id: string; label: string; ids: string[]; note?: string };
  const data = JSON.parse(root.dataset.choices!) as {
    items: Choice[];
    pools: Pool[];
  };
  const items = data.items;
  const byId = new Map(items.map((item) => [item.id, item]));
  const pools = data.pools
    .map((pool) => ({
      ...pool,
      games: pool.ids
        .map((id) => byId.get(id))
        .filter((item): item is Choice => item !== undefined),
    }))
    .filter((pool) => pool.games.length > 0);
  const allPool = pools.find((pool) => pool.id === "all")!;
  const get = <T extends HTMLElement>(key: string) =>
    root.querySelector<T>(`[data-quick-${key}]`)!;
  const shuffle = (values: Choice[]) => {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
  };

  let activePool = allPool;
  let order = shuffle(activePool.games);
  let orderIndex = 0;
  let current = order[0]!;
  let rotationRunning = !window.matchMedia("(prefers-reduced-motion: reduce)")
    .matches;
  let hovering = false;
  let inputModality: "keyboard" | "pointer" = "keyboard";
  let timer: number | undefined;
  const rotationButton = get<HTMLButtonElement>("toggle");
  const nextButton = get<HTMLButtonElement>("next");
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const rotationMs = 8000;

  const updateRotationButton = () => {
    const label = rotationRunning
      ? rotationButton.dataset.pauseLabel!
      : rotationButton.dataset.resumeLabel!;
    rotationButton.textContent = `${rotationRunning ? "Ⅱ" : "▶"} ${label}`;
    rotationButton.setAttribute("aria-label", label);
    rotationButton.setAttribute("aria-pressed", String(rotationRunning));
  };
  const clearTimer = () => {
    if (timer !== undefined) window.clearTimeout(timer);
    timer = undefined;
  };
  const schedule = () => {
    clearTimer();
    if (!rotationRunning || hovering || document.visibilityState !== "visible")
      return;
    timer = window.setTimeout(() => {
      advance(false);
      schedule();
    }, rotationMs);
  };
  const render = (announce: boolean) => {
    get("title").textContent = current.title;
    get("hook").textContent = current.hook;
    get("note").textContent = activePool.note ?? current.note;
    get("duration").textContent = current.duration;
    const play = `/${locale}/play/${current.id}/`;
    get<HTMLAnchorElement>("launch").href = play;
    get<HTMLAnchorElement>("details").href = `/${locale}/games/${current.id}/`;
    get<HTMLAnchorElement>("art-link").href = play;
    get<HTMLAnchorElement>("art-link").setAttribute(
      "aria-label",
      `${current.title}: ${
        get("art-link")
          .querySelector(".quick-art-play-label")
          ?.textContent?.trim() ?? current.title
      }`,
    );
    const image = get<HTMLImageElement>("image");
    image.src = current.image;
    image.alt = current.title;
    root.dataset.quickCurrent = current.id;
    const slide = get("slide");
    slide.setAttribute(
      "aria-label",
      `${locale === "ko" ? "추천 게임" : "Featured game"}: ${current.title}`,
    );
    root
      .querySelectorAll<HTMLButtonElement>("[data-quick-mood]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.quickMood === activePool.id),
        ),
      );
    if (announce) {
      get("status").textContent =
        `${activePool.label}: ${current.title}. ${current.hook}`;
    }
  };
  function advance(announce: boolean) {
    if (activePool.games.length > 1) {
      if (activePool.id !== "all") {
        orderIndex = (orderIndex + 1) % order.length;
      } else if (orderIndex + 1 < order.length) {
        orderIndex++;
      } else {
        order = shuffle(activePool.games);
        if (order[0]!.id === current.id) {
          [order[0], order[1]] = [order[1]!, order[0]!];
        }
        orderIndex = 0;
      }
      current = order[orderIndex]!;
    }
    render(announce);
  }

  root
    .querySelectorAll<HTMLButtonElement>("[data-quick-mood]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        const pool = pools.find(
          (value) => value.id === button.dataset.quickMood,
        );
        if (!pool) return;
        rotationRunning = false;
        activePool = pool;
        order = pool.id === "all" ? shuffle(pool.games) : [...pool.games];
        orderIndex = 0;
        current = order[0]!;
        render(true);
        updateRotationButton();
        schedule();
      }),
    );

  rotationButton.hidden = false;
  nextButton.hidden = false;
  get<HTMLElement>("controls").hidden = false;
  updateRotationButton();
  render(false);
  schedule();

  rotationButton.addEventListener("click", () => {
    rotationRunning = !rotationRunning;
    updateRotationButton();
    schedule();
  });
  nextButton.addEventListener("click", () => {
    rotationRunning = false;
    advance(true);
    updateRotationButton();
    schedule();
  });

  root.addEventListener("pointerenter", (event) => {
    if (event.pointerType !== "mouse") return;
    hovering = true;
    clearTimer();
  });
  root.addEventListener("pointerleave", (event) => {
    if (event.pointerType !== "mouse") return;
    hovering = false;
    schedule();
  });
  document.addEventListener(
    "pointerdown",
    () => {
      inputModality = "pointer";
    },
    true,
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (!["Alt", "Control", "Meta", "Shift"].includes(event.key)) {
        inputModality = "keyboard";
      }
    },
    true,
  );
  root.addEventListener("focusin", () => {
    if (inputModality === "keyboard") {
      rotationRunning = false;
      updateRotationButton();
    }
    schedule();
  });
  document.addEventListener("visibilitychange", schedule);
  motionPreference.addEventListener("change", (event) => {
    if (event.matches) {
      rotationRunning = false;
      updateRotationButton();
    }
    schedule();
  });

  // Existing local history only. Unknown IDs and external games cannot create links.
  const recent = async () => {
    const ids = list("recent");
    if (!ids.length) return;
    try {
      const recentItems = await loadCatalogue(locale);
      const selected = [...new Set(ids)]
        .map((id) =>
          recentItems.find((item) => item.id === id && !item.externalHost),
        )
        .filter((item) => item !== undefined)
        .slice(0, 3);
      get("recent-list").replaceChildren(
        ...selected.map((item) => {
          const link = document.createElement("a");
          link.href = `/${locale}/play/${item.id}/`;
          const img = document.createElement("img");
          img.src = item.artwork;
          img.alt = "";
          img.width = 52;
          img.height = 42;
          const title = document.createElement("span");
          title.textContent = item.title + " ↗";
          link.append(img, title);
          return link;
        }),
      );
      get("recent").hidden = selected.length === 0;
    } catch {
      /* The static game picker remains available without history. */
    }
  };
  void recent();
  window.addEventListener("pageshow", (event) => {
    if (event.persisted) void recent();
  });
}
