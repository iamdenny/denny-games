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
  const groups = JSON.parse(root.dataset.choices!) as {
    id: string;
    label: string;
    games: Choice[];
  }[];
  let group = groups[0]!;
  let index = 0;
  const get = <T extends HTMLElement>(key: string) =>
    root.querySelector<T>(`[data-quick-${key}]`)!;
  const render = () => {
    const item = group.games[index]!;
    get("title").textContent = item.title;
    get("hook").textContent = item.hook;
    get("note").textContent = item.note;
    get("duration").textContent = item.duration;
    const play = `/${locale}/play/${item.id}/`;
    get<HTMLAnchorElement>("launch").href = play;
    get<HTMLAnchorElement>("details").href = `/${locale}/games/${item.id}/`;
    get<HTMLAnchorElement>("art-link").href = play;
    const playLabel =
      get("art-link")
        .querySelector(".quick-art-play-label")
        ?.textContent?.trim() ?? item.title;
    get("art-link").setAttribute("aria-label", `${item.title}: ${playLabel}`);
    const image = get<HTMLImageElement>("image");
    image.src = item.image;
    image.alt = item.title;
    get("status").textContent = `${group.label}: ${item.title}. ${item.hook}`;
    root
      .querySelectorAll<HTMLButtonElement>("[data-quick-mood]")
      .forEach((button) =>
        button.setAttribute(
          "aria-pressed",
          String(button.dataset.quickMood === group.id),
        ),
      );
  };
  root
    .querySelectorAll<HTMLButtonElement>("[data-quick-mood]")
    .forEach((button) =>
      button.addEventListener("click", () => {
        group = groups.find((value) => value.id === button.dataset.quickMood)!;
        index = 0;
        render();
      }),
    );
  get("controls").hidden = false;
  get("next").hidden = false;
  get("next").addEventListener("click", () => {
    index = (index + 1) % group.games.length;
    render();
  });

  // Existing local history only. Unknown IDs and external games cannot create links.
  const recent = async () => {
    const ids = list("recent");
    if (!ids.length) return;
    try {
      const items = await loadCatalogue(locale);
      const selected = [...new Set(ids)]
        .map((id) => items.find((item) => item.id === id && !item.externalHost))
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
