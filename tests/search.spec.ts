import { test, expect } from "@playwright/test";

test.describe("Pencarian global", () => {
  test("kotak cari di beranda mengirim ke /cari?q=...", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[name="q"]').fill("KTP");
    await page.locator('form[action="/cari"] button[type="submit"]').click();
    await page.waitForURL("**/cari?q=KTP");
    await expect(page.locator("h1")).toContainText("KTP");
  });

  test("/cari tanpa kata kunci menampilkan ajakan mengetik", async ({ page }) => {
    await page.goto("/cari");
    await expect(page.getByText("Masukkan kata kunci untuk mulai mencari.")).toBeVisible();
  });

  test("/cari dengan kata kunci tak cocok menampilkan pesan kosong", async ({ page }) => {
    await page.goto("/cari?q=xyzxyzxyztidakketemu");
    await expect(page.getByText("Tidak ada hasil yang cocok")).toBeVisible();
  });
});
