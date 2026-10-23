import { t } from "../data/i18n";
import type { Locale } from "./types";
import type { PlayMode } from "../data/play-styles";
export interface CatalogueItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: string;
  controlStyle: string;
  playModes: PlayMode[];
  categoryName: string;
  subtitle: string;
  artwork: string;
  color: string;
  duration: string;
  added: string;
  inputs: string[];
  externalHost?: string;
  editorReason?: string;
}
let cache: Promise<CatalogueItem[]> | undefined;
export function loadCatalogue(locale: Locale) {
  return (cache ??= fetch(`/${locale}/search-index.json`).then(async (r) => {
    if (!r.ok) throw Error("catalogue");
    return r.json() as Promise<CatalogueItem[]>;
  }));
}
export function makeCard(item: CatalogueItem, locale: Locale): HTMLElement {
  const text = t(locale),
    card = document.createElement("article");
  card.className = "game-card";
  card.dataset.gameCard = item.id;
  const link = document.createElement("a");
  link.href = `/${locale}/games/${item.id}/`;
  link.className = "game-card-link";
  const art = document.createElement("div");
  art.className = `card-art ${item.color} ${item.id.startsWith("crisp-") ? "imported-art" : ""}`;
  const image = document.createElement("img");
  image.src = item.artwork;
  image.width = 640;
  image.height = 400;
  image.alt = "";
  image.loading = "lazy";
  const category = document.createElement("span");
  category.className = "card-category";
  category.textContent = item.categoryName;
  art.append(image, category);
  const copy = document.createElement("div");
  copy.className = "card-copy";
  const h = document.createElement("h3");
  h.textContent = item.title + " ↗";
  const p = document.createElement("p");
  p.textContent = item.editorReason ?? item.subtitle;
  const meta = document.createElement("div");
  meta.className = "card-meta";
  const duration = document.createElement("span");
  duration.textContent =
    item.duration === "varies"
      ? `◷ ${text.durationVaries}`
      : `◷ ${item.duration} ${text.minutes}`;
  const inputs = document.createElement("span");
  inputs.textContent = item.inputs
    .map((v) =>
      v === "gamepad"
        ? text.pad
        : v === "touch"
          ? text.touch
          : v === "mouse"
            ? text.mouse
            : text.keyboard,
    )
    .join(" · ");
  meta.append(duration, inputs);
  if (item.externalHost) {
    const external = document.createElement("span");
    external.textContent = text.externalLabel;
    meta.append(external);
  }
  if (item.editorReason) {
    const pick = document.createElement("span");
    pick.className = "editor-pick";
    pick.textContent = locale === "ko" ? "에디터 픽" : "EDITOR PICK";
    copy.append(pick);
  }
  copy.append(h, p, meta);
  link.append(art, copy);
  const favorite = document.createElement("button");
  favorite.type = "button";
  favorite.className = "favorite-button";
  favorite.dataset.favorite = item.id;
  favorite.setAttribute("aria-label", `${text.favorite}: ${item.title}`);
  favorite.setAttribute("aria-pressed", "false");
  favorite.textContent = "♡";
  card.append(link, favorite);
  return card;
}
