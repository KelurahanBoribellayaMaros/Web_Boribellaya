import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";

const outDir = path.resolve("./public/images/guide");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function run() {
  console.log("Launching browser...");
  let browser;
  try {
    browser = await chromium.launch({
      channel: "chrome",
      headless: true,
    });
  } catch (err) {
    console.log("Chrome channel failed, trying default chromium:", err.message);
    browser = await chromium.launch({ headless: true });
  }

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 2, // High DPI for crisp screenshots
  });

  const page = await context.newPage();

  const pagesToCapture = [
    { url: "http://localhost:3000/", filename: "beranda.png", clip: { x: 0, y: 0, width: 1280, height: 780 } },
    { url: "http://localhost:3000/login", filename: "login.png", fullPage: false },
    { url: "http://localhost:3000/layanan", filename: "layanan.png", clip: { x: 0, y: 0, width: 1280, height: 750 } },
    { url: "http://localhost:3000/cek-status", filename: "cek-status.png", fullPage: false },
    { url: "http://localhost:3000/profil", filename: "profil-kelurahan.png", clip: { x: 0, y: 0, width: 1280, height: 800 } },
    { url: "http://localhost:3000/berita", filename: "berita.png", clip: { x: 0, y: 0, width: 1280, height: 750 } },
    { url: "http://localhost:3000/informasi-publik", filename: "informasi-publik.png", clip: { x: 0, y: 0, width: 1280, height: 750 } },
  ];

  for (const item of pagesToCapture) {
    try {
      console.log(`Capturing ${item.url}...`);
      await page.goto(item.url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(1500); // Allow animations to settle

      const savePath = path.join(outDir, item.filename);
      if (item.clip) {
        await page.screenshot({ path: savePath, clip: item.clip });
      } else {
        await page.screenshot({ path: savePath, fullPage: item.fullPage ?? false });
      }
      console.log(`Saved: ${savePath}`);
    } catch (e) {
      console.error(`Failed capturing ${item.url}:`, e.message);
    }
  }

  await browser.close();
  console.log("Screenshots captured successfully!");
}

run().catch(console.error);
