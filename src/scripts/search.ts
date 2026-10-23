import {
  search,
  filterCatalogue,
  paginate,
  searchPage,
  PAGE_SIZE,
} from "../lib/catalogue";
import { loadCatalogue, type CatalogueItem } from "../lib/cards";
import {
  controlLabels,
  playModeLabels,
  playModesFor,
} from "../data/play-styles";
import { t } from "../data/i18n";
import type { Locale } from "../lib/types";
const locale = document.documentElement.lang as Locale,
  text = t(locale);
const form = document.querySelector<HTMLFormElement>("#search-form")!;
const input = form.querySelector<HTMLInputElement>("#search-query")!;
const category = form.querySelector<HTMLSelectElement>("[name=category]")!;
const control = form.querySelector<HTMLSelectElement>("[name=control]")!;
const length = form.querySelector<HTMLSelectElement>("[name=length]")!;
const mode = form.querySelector<HTMLSelectElement>("[name=mode]")!;
const results = document.querySelector<HTMLUListElement>("#search-results")!;
const count = document.querySelector<HTMLElement>("#result-count")!;
const empty = document.querySelector<HTMLElement>("#search-empty")!;
const pages = document.querySelector<HTMLElement>("#search-pages")!;
const refinements = form.querySelector<HTMLDetailsElement>(
  "[data-search-refinements]",
)!;
const filterCount = document.querySelector<HTMLElement>(
  "#search-filter-count",
)!;
const searchAd = document.querySelector<HTMLElement>("[data-adsterra-search]");
let items: CatalogueItem[] = [],
  timer: ReturnType<typeof setTimeout>;

function resultCard(item: CatalogueItem): HTMLLIElement {
  const li = document.createElement("li");
  li.dataset.searchResult = item.id;

  const card = document.createElement("article");
  card.className = "search-result-card";

  const imageLink = document.createElement("a");
  imageLink.className = "search-result-art";
  imageLink.href = `/${locale}/games/${item.id}/`;
  imageLink.setAttribute("aria-label", item.title);
  const image = document.createElement("img");
  image.src = item.artwork;
  image.width = 320;
  image.height = 200;
  image.alt = "";
  image.loading = "lazy";
  imageLink.append(image);

  const body = document.createElement("div");
  body.className = "search-result-body";
  const categoryName = document.createElement("span");
  categoryName.className = "search-result-category";
  categoryName.textContent = item.categoryName;
  const title = document.createElement("a");
  title.className = "search-result-title";
  title.href = `/${locale}/games/${item.id}/`;
  title.textContent = item.title;
  const description = document.createElement("p");
  description.className = "search-result-description";
  description.textContent = item.editorReason ?? item.subtitle;

  const metadata = document.createElement("div");
  metadata.className = "search-result-meta";
  const duration = document.createElement("span");
  duration.textContent =
    item.duration === "varies"
      ? text.durationVaries
      : `${item.duration} ${text.minutes}`;
  const playStyle = document.createElement("span");
  playStyle.textContent =
    controlLabels[item.controlStyle as keyof typeof controlLabels]?.[locale] ??
    text.filter;
  metadata.append(duration, playStyle);
  const players = document.createElement("span");
  players.dataset.searchModes = "";
  players.textContent = playModesFor(item)
    .map((mode) => playModeLabels[mode][locale])
    .join(" · ");
  metadata.append(players);
  if (item.externalHost) {
    const host = document.createElement("span");
    host.textContent = text.externalLabel;
    metadata.append(host);
  }

  const actions = document.createElement("div");
  actions.className = "search-result-actions";
  if (!item.externalHost) {
    const play = document.createElement("a");
    play.className = "button primary";
    play.dataset.searchPlay = item.id;
    play.href = `/${locale}/play/${item.id}/`;
    play.textContent = text.play;
    actions.append(play);
  }
  const details = document.createElement("a");
  details.className = "button secondary";
  details.dataset.searchDetails = item.id;
  details.href = `/${locale}/games/${item.id}/`;
  details.textContent = text.details;
  actions.append(details);

  body.append(categoryName, title, description, metadata, actions);
  card.append(imageLink, body);
  li.append(card);
  return li;
}

function updateUrl(url: URL, push: boolean) {
  if (url.href !== location.href)
    history[push ? "pushState" : "replaceState"](null, "", url);
  document
    .querySelectorAll<HTMLAnchorElement>("[data-locale-link]")
    .forEach((link) => {
      link.search = url.search;
    });
}
function render(requested: string | null = "1", push = false) {
  const query = input.value.slice(0, 120);
  const matches = search(
    filterCatalogue(items, {
      category: category.value,
      control: control.value,
      length: length.value,
      mode: mode.value,
    }),
    query,
  );
  const page = searchPage(requested, matches.length);
  results.replaceChildren();
  const pageItems = paginate(matches, page);
  for (const item of pageItems) results.append(resultCard(item));
  if (searchAd) searchAd.hidden = pageItems.length < 8;
  const activeFilters = [category, control, length, mode].filter(
    (select) => select.value,
  ).length;
  filterCount.textContent = activeFilters
    ? locale === "ko"
      ? `${activeFilters}개 적용`
      : `${activeFilters} active`
    : "";
  count.textContent = `${matches.length} ${text.results}`;
  empty.hidden = matches.length > 0;
  const url = new URL(location.href);
  url.search = "";
  for (const [key, value] of Object.entries({
    q: query,
    category: category.value,
    control: control.value,
    length: length.value,
    mode: mode.value,
  }))
    if (value) url.searchParams.set(key, value);
  if (page > 1) url.searchParams.set("page", String(page));
  updateUrl(url, push);
  pages.replaceChildren();
  for (let n = 1; n <= Math.ceil(matches.length / PAGE_SIZE); n++) {
    const link = document.createElement("a"),
      target = new URL(url);
    if (n > 1) target.searchParams.set("page", String(n));
    else target.searchParams.delete("page");
    link.href = target.href;
    link.textContent = String(n);
    if (n === page) link.setAttribute("aria-current", "page");
    link.addEventListener("click", (event) => {
      event.preventDefault();
      render(String(n), true);
      results.scrollIntoView({ block: "start" });
    });
    pages.append(link);
  }
}
function restore() {
  const params = new URL(location.href).searchParams;
  input.value = params.get("q")?.slice(0, 120) ?? "";
  for (const select of [category, control, length, mode]) {
    const value = params.get(select.name) ?? "";
    select.value = [...select.options].some((option) => option.value === value)
      ? value
      : "";
  }
  render(params.get("page"));
}
input.addEventListener("input", () => {
  clearTimeout(timer);
  timer = setTimeout(() => render(), 120);
});
for (const select of [category, control, length, mode])
  select.addEventListener("change", () => {
    clearTimeout(timer);
    render("1", true);
  });
form.addEventListener("submit", (event) => {
  event.preventDefault();
  clearTimeout(timer);
  render("1", true);
  if (matchMedia("(max-width: 699px)").matches) refinements.open = false;
});
form.addEventListener("reset", () => {
  clearTimeout(timer);
  queueMicrotask(() => {
    input.value = "";
    category.value = control.value = length.value = mode.value = "";
    render("1", true);
  });
});
window.addEventListener("popstate", () => {
  clearTimeout(timer);
  restore();
});
try {
  items = await loadCatalogue(locale);
  restore();
} catch {
  count.textContent =
    locale === "ko"
      ? "검색을 불러오지 못했어요. 새로고침하거나 아래 게임 모음을 이용하세요."
      : "Search could not load. Please refresh or use the collections below.";
}
