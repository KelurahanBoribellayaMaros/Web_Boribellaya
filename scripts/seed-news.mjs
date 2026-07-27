// Seeds a handful of example Berita/Pengumuman items so the site isn't empty
// on first launch. Safe to re-run: skips seeding if the collection already has data.
// Usage: node --env-file=.env.local scripts/seed-news.mjs
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore(app);

function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

const seedItems = [
  {
    title: "Pemadaman Listrik Terjadwal di Wilayah RW 02",
    excerpt:
      "PLN akan melakukan pemeliharaan jaringan listrik yang berdampak pada pemadaman sementara di wilayah RW 02.",
    date: "2024-10-26",
    category: "pengumuman",
  },
  {
    title: "Jadwal Pelayanan Jemput Bola Administrasi Kependudukan Bulan Depan",
    excerpt:
      "Dalam rangka meningkatkan pelayanan kepada masyarakat, Kelurahan Boribellaya akan mengadakan layanan jemput bola administrasi kependudukan.",
    date: "2024-10-24",
    category: "pengumuman",
  },
  {
    title: "Kegiatan Kerja Bakti Lingkungan RW 03 Akhir Pekan Ini",
    excerpt:
      "Warga RW 03 bergotong royong membersihkan lingkungan sekitar untuk menjaga kebersihan dan kenyamanan bersama.",
    date: "2024-10-22",
    category: "berita",
  },
  {
    title: "Jadwal Posyandu Balita & Lansia Bulan Oktober",
    excerpt:
      "Posyandu balita dan lansia akan dilaksanakan serentak di seluruh RW untuk memantau kesehatan warga.",
    date: "2024-10-20",
    category: "berita",
  },
  {
    title: "Pelatihan Kewirausahaan bagi Pelaku UMKM Lokal",
    excerpt:
      "Puluhan pelaku UMKM mengikuti pelatihan pengelolaan usaha dan pemasaran digital yang diselenggarakan kelurahan.",
    date: "2024-10-18",
    category: "berita",
  },
];

async function main() {
  const existing = await db.collection("news").limit(1).get();
  if (!existing.empty) {
    console.log("news collection already has data — skipping seed.");
    return;
  }

  const now = new Date().toISOString();
  const batch = db.batch();
  for (const item of seedItems) {
    const ref = db.collection("news").doc();
    batch.set(ref, {
      ...item,
      slug: slugify(item.title),
      createdAt: now,
      updatedAt: now,
    });
  }
  await batch.commit();
  console.log(`Seeded ${seedItems.length} news items.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
