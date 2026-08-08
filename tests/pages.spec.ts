import { test, expect } from "@playwright/test";

test.describe("Halaman publik utama", () => {
  test("Beranda menampilkan hero dan judul kelurahan", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#beranda").getByRole("heading", { name: "Kelurahan Boribellaya" })).toBeVisible();
  });

  test("Profil menampilkan Sejarah Singkat", async ({ page }) => {
    await page.goto("/profil");
    await expect(page.getByRole("heading", { name: "Profil Kelurahan" })).toBeVisible();
    await expect(page.getByText("Sejarah Singkat")).toBeVisible();
  });

  test("Berita menampilkan daftar berita", async ({ page }) => {
    await page.goto("/berita");
    await expect(page.locator("h1")).toContainText("Berita");
  });

  test("Layanan menampilkan 3 layanan online + Informasi Publik", async ({ page }) => {
    await page.goto("/layanan");
    await expect(page.getByText("Surat Pengantar/SKCK")).toBeVisible();
    await expect(page.getByText("Layanan Pengurusan KK")).toBeVisible();
    await expect(page.getByText("Lapor Keluhan", { exact: true })).toBeVisible();
    await expect(page.getByText("SOP Pelayanan", { exact: true })).toBeVisible();
  });

  test("Informasi Publik menampilkan Dasar Hukum dan daftar dokumen", async ({ page }) => {
    await page.goto("/informasi-publik");
    await expect(
      page.getByRole("heading", { name: "Daftar Informasi Publik", exact: true })
    ).toBeVisible();
    await expect(page.getByText("Dasar Hukum")).toBeVisible();
  });

  test("Kontak menampilkan alamat dan peta", async ({ page }) => {
    await page.goto("/kontak");
    await expect(page.getByRole("heading", { name: "Kontak & Lokasi" })).toBeVisible();
  });

  test("Kebijakan Privasi dan Syarat Ketentuan bisa diakses", async ({ page }) => {
    await page.goto("/kebijakan-privasi");
    await expect(page.locator("h1")).toContainText("Kebijakan Privasi");

    await page.goto("/syarat-ketentuan");
    await expect(page.locator("h1")).toContainText("Syarat");
  });

  test("Login dan Daftar menampilkan form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator('input[type="email"]')).toBeVisible();

    await page.goto("/daftar");
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

test.describe("Rute lama /ppid harus sudah tidak ada", () => {
  for (const path of ["/ppid", "/ppid/informasi", "/ppid/ajukan"]) {
    test(`${path} mengembalikan 404`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBe(404);
    });
  }
});

test("Halaman tak dikenal menampilkan halaman 404 kustom", async ({ page }) => {
  const response = await page.goto("/halaman-yang-tidak-ada-xyz");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("404")).toBeVisible();
});
