import type { Page } from "@playwright/test";
export async function setBoardMode(page: Page, mode: "ai" | "local") {
  const settings = page.locator("#player-settings");
  const wasOpen = (await settings.getAttribute("open")) !== null;
  if (!wasOpen) await settings.locator("summary").click();
  await page.locator("[data-board-mode]").selectOption(mode);
  if (!wasOpen) await settings.locator("summary").click();
}
