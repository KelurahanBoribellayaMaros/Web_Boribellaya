import { chromium } from "playwright-core";

const BASE = "http://localhost:3000";
const TEST_EMAIL = "tmp-emailtest-user@example.com";
const PASSWORD = "TestPassw0rd!23";

const browser = await chromium.launch();
const page = await browser.newPage();
page.on("pageerror", (err) => console.log("[pageerror]", err.message));

console.log("=== Step 1: register a new account ===");
await page.goto(`${BASE}/daftar`, { waitUntil: "networkidle" });
await page.locator("#name").fill("Tes Email Verifikasi");
await page.locator("#email").fill(TEST_EMAIL);
await page.locator("#password").fill(PASSWORD);
await page.locator("#confirmPassword").fill(PASSWORD);
await page.locator('button[type="submit"]').click();
await page.waitForTimeout(4000);
console.log("post-register url:", page.url());
const errorEl = page.locator(".text-red-600");
console.log("visible error count:", await errorEl.count());
if (await errorEl.count() > 0) {
  console.log("error text:", await errorEl.first().innerText());
}

console.log("\n=== Step 2: click 'Kirim Ulang Email Verifikasi' (should succeed once) ===");
await page.goto(`${BASE}/verifikasi-email`, { waitUntil: "networkidle" });
const resendBtn = page.locator('button:has-text("Kirim Ulang Email Verifikasi")');
console.log("resend button visible?", await resendBtn.count());
await resendBtn.click();
await page.waitForTimeout(3000);
const sentText = await page.locator("body").innerText();
console.log("shows 'telah dikirim ulang'?", sentText.includes("telah dikirim ulang"));
console.log("shows an error instead?", sentText.includes("Gagal") || sentText.includes("Terlalu banyak"));

console.log("\n=== Step 3: immediately click resend AGAIN (should hit rate limit) ===");
await page.goto(`${BASE}/verifikasi-email`, { waitUntil: "networkidle" });
const resendBtn2 = page.locator('button:has-text("Kirim Ulang Email Verifikasi")');
await resendBtn2.click();
await page.waitForTimeout(3000);
const rateLimitText = await page.locator("body").innerText();
console.log("shows rate-limit message?", rateLimitText.includes("Terlalu banyak percobaan"));

await browser.close();
process.exit(0);
