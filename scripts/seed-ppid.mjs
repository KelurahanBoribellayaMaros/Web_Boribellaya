// Seeds a handful of example PPID documents (metadata only, no real files)
// so the page isn't empty on first launch. Safe to re-run: skips seeding if
// the collection already has data. Admin can upload real files later via
// /admin/ppid, which will add alongside these or you can delete these first.
// Usage: node --env-file=.env.local scripts/seed-ppid.mjs
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

const seedItems = [
  {
    title: "Laporan Realisasi Anggaran Triwulan I 2026",
    description:
      "Rincian realisasi anggaran belanja Kelurahan Boribellaya periode Januari - Maret 2026.",
    category: "berkala",
    year: 2026,
    date: "2026-04-10",
  },
  {
    title: "Laporan Kinerja Kelurahan Boribellaya Tahun 2025",
    description:
      "Ringkasan capaian program dan kegiatan Kelurahan Boribellaya sepanjang tahun 2025.",
    category: "berkala",
    year: 2025,
    date: "2026-01-20",
  },
  {
    title: "Struktur Organisasi dan Tata Kerja Kelurahan",
    description:
      "Susunan aparatur, tugas, dan fungsi pemerintahan Kelurahan Boribellaya.",
    category: "setiap-saat",
    year: 2025,
    date: "2025-06-01",
  },
  {
    title: "Standar Operasional Prosedur Pelayanan Administrasi",
    description:
      "SOP pengurusan surat, dokumen kependudukan, dan layanan administrasi lainnya.",
    category: "setiap-saat",
    year: 2025,
    date: "2025-03-15",
  },
];

async function main() {
  const existing = await db.collection("ppid_documents").limit(1).get();
  if (!existing.empty) {
    console.log("ppid_documents collection already has data — skipping seed.");
    return;
  }

  const now = new Date().toISOString();
  const batch = db.batch();
  for (const item of seedItems) {
    const ref = db.collection("ppid_documents").doc();
    batch.set(ref, { ...item, createdAt: now, updatedAt: now });
  }
  await batch.commit();
  console.log(`Seeded ${seedItems.length} PPID documents.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
