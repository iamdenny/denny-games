import { read, write, list, toggleFavorite } from "../lib/storage";
import { connectGamepad, focusNext } from "../lib/input";
import { initDisplayAds } from "../lib/ads";
import { initAnalytics, markCatalogueSearchSubmission } from "../lib/analytics";
import { loadCatalogue, makeCard } from "../lib/cards";
import { t } from "../data/i18n";
import type { Locale } from "../lib/types";
const locale = document.documentElement.lang as Locale,
  text = t(locale);
const large = document.querySelector<HTMLButtonElement>("[data-large]");
function setLarge(value: boolean) {
  document.body.classList.toggle("large-screen", value);
  large?.setAttribute("aria-pressed", String(value));
}
setLarge(read<boolean>("large-screen", false) === true);
large?.addEventListener("click", () => {
  const value = !document.body.classList.contains("large-screen");
  setLarge(value);
  write("large-screen", value);
});
document
  .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
  .forEach((link) => {
    link.search = location.search;
    link.hash = location.hash;
  });
const homeSearch = document.querySelector<HTMLFormElement>(".home-search");
homeSearch?.addEventListener("submit", (event) => {
  event.preventDefault();
  markCatalogueSearchSubmission();
  const query =
    homeSearch.querySelector<HTMLInputElement>('input[type="search"]')?.value ??
    "";
  const target = new URL(homeSearch.action, location.href);
  if (query.trim())
    target.hash = new URLSearchParams({
      q: query.trim().slice(0, 120),
    }).toString();
  location.assign(target);
});
let refreshing = 0;
async function refreshLibrary() {
  const grids = [...document.querySelectorAll<HTMLElement>("[data-library]")];
  if (!grids.length) return;
  const token = ++refreshing;
  try {
    const items = await loadCatalogue(locale);
    if (token !== refreshing) return;
    for (const grid of grids) {
      const ids = list(grid.dataset.library!);
      const selected = ids
        .map((id) => items.find((g) => g.id === id))
        .filter((g) => g !== undefined);
      grid.replaceChildren(...selected.map((g) => makeCard(g, locale)));
      const empty = document.querySelector<HTMLElement>(
        `[data-library-empty="${grid.dataset.library}"]`,
      );
      if (empty) empty.hidden = selected.length > 0;
    }
    refreshFavorites(false);
  } catch {
    grids.forEach((grid) => {
      grid.textContent =
        locale === "ko"
          ? "목록을 불러오지 못했어요. 새로고침해주세요."
          : "Could not load your library. Please refresh.";
    });
  }
}
function refreshFavorites(library = true) {
  document
    .querySelectorAll<HTMLButtonElement>("[data-favorite]")
    .forEach((button) => {
      const enabled = list("favorites").includes(button.dataset.favorite!);
      button.setAttribute("aria-pressed", String(enabled));
      if (button.classList.contains("favorite-button"))
        button.textContent = enabled ? "♥" : "♡";
      else
        button.textContent = `${enabled ? "♥" : "♡"} ${enabled ? text.saved : text.favorite}`;
    });
  if (library) void refreshLibrary();
}
document.addEventListener("click", (event) => {
  const button = (event.target as HTMLElement).closest<HTMLButtonElement>(
    "[data-favorite]",
  );
  if (!button) return;
  toggleFavorite(button.dataset.favorite!);
  refreshFavorites();
});
refreshFavorites();
const grid = document.querySelector<HTMLElement>("[data-sort-grid]");
if (grid) {
  const sort = document.querySelector<HTMLSelectElement>("[data-sort]")!;
  const input = document.querySelector<HTMLSelectElement>(
    "[data-input-filter]",
  )!;
  const categoryAd = document.querySelector<HTMLElement>(
    "[data-adsterra-category]",
  );
  const initialQuery = new URL(location.href).searchParams;
  const hasInitialFilter = ["sort", "input", "page"].some((key) =>
    initialQuery.has(key),
  );
  if (categoryAd) {
    const initialCards = [
      ...grid.querySelectorAll<HTMLElement>("[data-game-card]"),
    ];
    const eligible = !hasInitialFilter && initialCards.length >= 8;
    if (eligible) initialCards[7]!.after(categoryAd);
    categoryAd.hidden = !eligible;
  }
  let generation = 0;
  const render = async (page = 1) => {
    const token = ++generation;
    try {
      const items = (await loadCatalogue(locale)).filter(
        (item) =>
          item.category === grid.dataset.category &&
          (input.value === "any" || item.inputs.includes(input.value)),
      );
      if (token !== generation) return;
      if (sort.value === "name")
        items.sort((a, b) => a.title.localeCompare(b.title, locale));
      if (sort.value === "newest")
        items.sort((a, b) => b.added.localeCompare(a.added));
      const pageItems = items.slice((page - 1) * 24, page * 24);
      const existingCards = new Map(
        [...grid.querySelectorAll<HTMLElement>("[data-game-card]")].map(
          (card) => [card.dataset.gameCard!, card],
        ),
      );
      for (const card of existingCards.values()) card.remove();
      const cards = pageItems.map(
        (item) => existingCards.get(item.id) ?? makeCard(item, locale),
      );
      if (categoryAd) {
        categoryAd.hidden = pageItems.length < 8;
        if (!grid.contains(categoryAd)) grid.append(categoryAd);
        for (const card of cards.slice(0, 8))
          grid.insertBefore(card, categoryAd);
        for (const card of cards.slice(8)) grid.append(card);
      } else {
        for (const card of cards) grid.append(card);
      }
      refreshFavorites(false);
      let nav = document.querySelector<HTMLElement>("[data-pagination]");
      if (!nav) {
        nav = document.createElement("nav");
        nav.className = "pagination";
        nav.dataset.pagination = "";
        grid.after(nav);
      }
      nav.replaceChildren();
      for (let i = 1; i <= Math.ceil(items.length / 24); i++) {
        const link = document.createElement("a");
        const url = new URL(location.href);
        url.pathname = `/${locale}/category/${grid.dataset.category}/`;
        url.searchParams.set("sort", sort.value);
        url.searchParams.set("input", input.value);
        url.searchParams.set("page", String(i));
        link.href = url.href;
        link.textContent = String(i);
        if (i === page) link.setAttribute("aria-current", "page");
        link.addEventListener("click", (e) => {
          e.preventDefault();
          history.pushState(null, "", url);
          void render(i);
          grid.scrollIntoView({ block: "start" });
        });
        nav.append(link);
      }
      const url = new URL(location.href);
      url.searchParams.set("sort", sort.value);
      url.searchParams.set("input", input.value);
      url.searchParams.set("page", String(page));
      history.replaceState(null, "", url);
      const count = document.querySelector<HTMLElement>(".toolbar .count");
      if (count) count.textContent = `${items.length} ${text.available}`;
    } catch {
      if (categoryAd) categoryAd.hidden = true;
      const p = document.createElement("p");
      p.textContent =
        locale === "ko"
          ? "목록을 불러오지 못했어요. 새로고침해주세요."
          : "Could not load games. Please refresh.";
      grid.replaceChildren(p);
    }
  };
  const restore = () => {
    const q = new URL(location.href).searchParams;
    sort.value = ["name", "newest"].includes(q.get("sort") || "")
      ? q.get("sort")!
      : "recommended";
    input.value = ["touch", "mouse", "keyboard", "gamepad"].includes(
      q.get("input") || "",
    )
      ? q.get("input")!
      : "any";
    if (q.has("sort") || q.has("input") || q.has("page"))
      void render(Math.max(1, Number(q.get("page")) || 1));
  };
  sort.addEventListener("change", () => void render());
  input.addEventListener("change", () => void render());
  window.addEventListener("popstate", restore);
  restore();
}
document
  .querySelectorAll<HTMLElement>("[data-utc-date]")
  .forEach((el) => (el.textContent = new Date().toISOString().slice(0, 10)));
if (!document.querySelector("#player")) {
  const cleanup = connectGamepad(
    focusNext,
    () => {},
    () => {},
  );
  window.addEventListener("pagehide", cleanup, { once: true });
}
initDisplayAds();
window.addEventListener("denny-consent-changed", initDisplayAds);
initAnalytics();

const menu = document.querySelector<HTMLDetailsElement>(".compact-menu");
menu?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    menu.open = false;
    menu.querySelector("summary")?.focus();
  }
});
