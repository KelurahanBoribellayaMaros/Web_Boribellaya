import { chromium } from "playwright-core";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  const consoleErrors = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") consoleErrors.push(msg.text());
  });
  page.on("pageerror", (err) => consoleErrors.push(err.message));

  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(500);

  // Scroll to the Berita section so its Reveal-wrapped cards enter viewport.
  await page.locator("#berita").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  const midAnimOpacity = await page
    .locator("#berita .grid > div")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  console.log("Opacity shortly after scroll-into-view:", midAnimOpacity);

  await page.waitForTimeout(1000);
  const finalOpacity = await page
    .locator("#berita .grid > div")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  console.log("Opacity after animation should complete:", finalOpacity);

  console.log("Console errors:", consoleErrors.length ? consoleErrors : "none");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
