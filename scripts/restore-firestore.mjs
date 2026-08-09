// Restores Firestore collections from a JSON backup produced by
// backup-firestore.mjs or the admin dashboard's "Backup Data" download.
//
// Writes each document back to its ORIGINAL id via .set() — this overwrites
// any document that still exists under that id today, but does NOT delete
// documents that exist in Firestore now yet are absent from the backup file
// (this is a point-in-time restore, not a mirror/sync). Requires typing a
// confirmation phrase before writing anything, since this can overwrite live
// data.
//
// Usage:
//   node --env-file=.env.local scripts/restore-firestore.mjs <path-to-backup.json> [collections]
//
// Examples:
//   node --env-file=.env.local scripts/restore-firestore.mjs backups/firestore-backup-2026-08-09.json
//   node --env-file=.env.local scripts/restore-firestore.mjs backups/firestore-backup-2026-08-09.json news,ppid_documents
import { readFileSync } from "fs";
import { createInterface } from "readline/promises";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const [, , filePath, collectionsArg] = process.argv;

if (!filePath) {
  console.error(
    "Usage: node --env-file=.env.local scripts/restore-firestore.mjs <path-to-backup.json> [collection1,collection2,...]"
  );
  process.exit(1);
}

const backup = JSON.parse(readFileSync(filePath, "utf-8"));
const allCollections = Object.keys(backup);
const targetCollections = collectionsArg
  ? collectionsArg.split(",").map((c) => c.trim())
  : allCollections;

for (const name of targetCollections) {
  if (!backup[name]) {
    console.error(
      `Koleksi "${name}" tidak ditemukan di file backup. Tersedia: ${allCollections.join(", ")}`
    );
    process.exit(1);
  }
}

console.log(`Akan memulihkan dari ${filePath}:`);
for (const name of targetCollections) {
  console.log(`  - ${name}: ${backup[name].length} dokumen`);
}
console.log(
  "\nPERINGATAN: ini akan MENIMPA dokumen yang id-nya cocok di database saat ini."
);
console.log(
  "Dokumen yang ada sekarang tapi TIDAK ada di file backup ini tidak akan dihapus."
);

const rl = createInterface({ input: process.stdin, output: process.stdout });
const answer = await rl.question('\nKetik "PULIHKAN" untuk melanjutkan: ');
rl.close();

if (answer.trim() !== "PULIHKAN") {
  console.log("Dibatalkan.");
  process.exit(0);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});
const db = getFirestore(app);

const BATCH_SIZE = 500; // Firestore's max writes per batch.

async function main() {
  for (const name of targetCollections) {
    const docs = backup[name];
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const chunk = docs.slice(i, i + BATCH_SIZE);
      const batch = db.batch();
      for (const doc of chunk) {
        const { id, ...data } = doc;
        batch.set(db.collection(name).doc(id), data);
      }
      await batch.commit();
      console.log(`  ${name}: ${Math.min(i + BATCH_SIZE, docs.length)}/${docs.length} dipulihkan`);
    }
  }
  console.log("\nPemulihan selesai.");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Pemulihan gagal:", error);
    process.exit(1);
  });
