import { read, write, list, toggleFavorite } from "../lib/storage";
import { connectGamepad, focusNext } from "../lib/input";
import { initDisplayAds } from "../lib/ads";
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
  });
function refreshLibrary() {
  document.querySelectorAll<HTMLElement>("[data-library]").forEach((grid) => {
    const key = grid.dataset.library!,
      ids = list(key);
    let visible = 0;
    [...grid.querySelectorAll<HTMLElement>("[data-game-card]")]
      .sort(
        (a, b) =>
          ids.indexOf(a.dataset.gameCard!) - ids.indexOf(b.dataset.gameCard!),
      )
      .forEach((card) => {
        card.hidden = !ids.includes(card.dataset.gameCard!);
        if (!card.hidden) visible++;
        grid.append(card);
      });
    const empty = document.querySelector<HTMLElement>(
      `[data-library-empty="${key}"]`,
    );
    if (empty) empty.hidden = visible > 0;
  });
}
function refreshFavorites() {
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
  refreshLibrary();
}
document
  .querySelectorAll<HTMLButtonElement>("[data-favorite]")
  .forEach((button) =>
    button.addEventListener("click", () => {
      toggleFavorite(button.dataset.favorite!);
      refreshFavorites();
    }),
  );
refreshFavorites();
const grid = document.querySelector<HTMLElement>("[data-sort-grid]");
const original = grid ? ([...grid.children] as HTMLElement[]) : [];
document
  .querySelector<HTMLSelectElement>("[data-sort]")
  ?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    [...original]
      .sort((a, b) =>
        value === "name"
          ? a.dataset.title!.localeCompare(b.dataset.title!, locale)
          : value === "newest"
            ? b.dataset.added!.localeCompare(a.dataset.added!)
            : original.indexOf(a) - original.indexOf(b),
      )
      .forEach((card) => grid?.append(card));
  });
document
  .querySelector<HTMLSelectElement>("[data-input-filter]")
  ?.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    original.forEach((card) => {
      card.hidden =
        value !== "any" && !card.dataset.inputs?.split(",").includes(value);
    });
  });
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
