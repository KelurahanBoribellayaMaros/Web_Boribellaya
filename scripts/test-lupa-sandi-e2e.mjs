import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const TEST_EMAIL = "tmp-test-rate-limit@example.com";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

console.log("=== Step 1: Buka halaman Lupa Sandi ===");
await page.goto(`${BASE}/lupa-sandi`, { waitUntil: "networkidle" });
console.log("Berhasil membuka", page.url());

console.log("\n=== Step 2: Cek apakah Turnstile Widget muncul ===");
try {
  await page.waitForSelector('iframe', { timeout: 5000 });
  const count = await page.locator('iframe').count();
  if (count > 0) {
    console.log("✅ Widget Turnstile berhasil di-render di halaman.");
  } else {
    console.log("❌ Widget Turnstile TIDAK DITEMUKAN.");
  }
} catch (e) {
  console.log("❌ Widget Turnstile TIDAK DITEMUKAN (timeout).");
}

console.log("\n=== Step 3: Isi form email dan submit (Percobaan 1) ===");
await page.locator("#email").fill(TEST_EMAIL);
await page.waitForTimeout(1000); // Wait for turnstile to generate token
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3000); // Tunggu server action selesai
const errorCount = await page.locator(".text-red-600").count();
if (errorCount > 0) {
  const errText = await page.locator(".text-red-600").first().innerText();
  console.log("⚠️ Submit Pertama gagal dengan error UI:", errText);
} else {
  const bodyText = await page.locator("body").innerText();
  if (bodyText.includes("telah dikirim")) {
    console.log("✅ Submit Pertama Berhasil (Email Reset terkirim / sukses statis).");
  } else {
    console.log("ℹ️ Submit Pertama merespon tanpa error merah. Body text:", bodyText.substring(0, 50));
  }
}

console.log("\n=== Step 4: Refresh halaman dan submit lagi (Percobaan 2 - Uji Rate Limit) ===");
await page.goto(`${BASE}/lupa-sandi`, { waitUntil: "networkidle" });
await page.locator("#email").fill(TEST_EMAIL);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(3000); // Tunggu respon rate limiter

const errorEl = page.locator(".text-red-600");
if (await errorEl.count() > 0) {
  const errorText = await errorEl.first().innerText();
  if (errorText.includes("Terlalu banyak percobaan")) {
    console.log("✅ Rate Limiter Bekerja dengan baik! Error yang muncul:", errorText);
  } else {
    console.log("❌ Error lain yang muncul:", errorText);
  }
} else {
  console.log("❌ Rate Limiter tidak memblokir percobaan kedua.");
}

await browser.close();
process.exit(0);
