import { test, expect } from "@playwright/test";

test.describe("Navigasi header", () => {
  test("tidak ada lagi menu PPID (sudah diganti Informasi Publik)", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("header")).not.toContainText("PPID");
  });

  const links: { label: string; href: string }[] = [
    { label: "Profil", href: "/profil" },
    { label: "Berita", href: "/berita" },
    { label: "Layanan", href: "/layanan" },
    { label: "Informasi Publik", href: "/informasi-publik" },
    { label: "Kontak", href: "/kontak" },
  ];

  for (const link of links) {
    test(`link header "${link.label}" menuju ${link.href}`, async ({ page }) => {
      await page.goto("/");
      await page.locator("header").locator(`a[href="${link.href}"]`).first().click();
      await page.waitForURL(`**${link.href}`);
      expect(new URL(page.url()).pathname).toBe(link.href);
    });
  }
});

test.describe("Footer", () => {
  test("footer memuat link Kebijakan Privasi dan Syarat & Ketentuan", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer").locator('a[href="/kebijakan-privasi"]')).toHaveCount(1);
    await expect(page.locator("footer").locator('a[href="/syarat-ketentuan"]')).toHaveCount(1);
  });
});

test.describe("Proteksi rute (belum login)", () => {
  const protectedPaths = ["/admin", "/akun", "/informasi-publik/ajukan"];

  for (const path of protectedPaths) {
    test(`${path} mengarahkan ke /login jika belum masuk`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    });
  }
});
