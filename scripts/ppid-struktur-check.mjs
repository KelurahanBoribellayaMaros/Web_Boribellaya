import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  await page.goto(`${BASE}/login`);
  await page.click('button:has-text("Admin")');
  await page.fill('input[type="email"]', "qa-ppid-struktur-check@example.com");
  await page.fill('input[type="password"]', "QaAdmin12345!");
  await page.click('button[type="submit"]');
  await page.waitForURL((url) => !url.pathname.includes("/login"), { timeout: 15000 });

  await page.goto(`${BASE}/admin/struktur-organisasi`);
  await page.waitForSelector("text=Struktur PPID");
  await page.screenshot({ path: "scripts/pp-admin-before.png", fullPage: true });

  await page.fill("#ppid-name", "QA Test Pelaksana");
  await page.fill("#ppid-position", "QA PPID Pelaksana");
  await page.click('button:has-text("Simpan Struktur PPID")');
  await page.waitForURL((url) => url.pathname === "/admin/struktur-organisasi", { timeout: 15000 });
  console.log("Saved, landed on:", page.url());

  const nameValue = await page.locator("#ppid-name").inputValue();
  const positionValue = await page.locator("#ppid-position").inputValue();
  console.log("Admin form now shows:", nameValue, "/", positionValue);

  await page.goto(`${BASE}/ppid`);
  await page.waitForTimeout(500);
  const pageText = await page.content();
  console.log("Public /ppid page contains 'QA Test Pelaksana':", pageText.includes("QA Test Pelaksana"));
  await page.screenshot({ path: "scripts/pp-public-ppid.png" });

  await page.goto(`${BASE}/profil`);
  await page.waitForTimeout(500);
  await page.screenshot({ path: "scripts/pp-public-profil.png" });

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
