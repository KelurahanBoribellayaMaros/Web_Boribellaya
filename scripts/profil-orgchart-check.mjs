import { chromium } from "playwright-core";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("http://localhost:3000/profil");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scripts/pp-profil-full.png", fullPage: true });
  await browser.close();
}

main();
