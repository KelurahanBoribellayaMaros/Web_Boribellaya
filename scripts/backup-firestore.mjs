// Manual/scheduled Firestore backup — dumps every collection this app uses
// to a single timestamped JSON file. Firestore's Spark (free) plan has no
// built-in automatic backups, and scheduled server-side exports require the
// paid Blaze plan, so this script (runnable locally or via a scheduled
// GitHub Actions workflow) is the zero-cost alternative.
//
// Usage: node --env-file=.env.local scripts/backup-firestore.mjs
import { mkdirSync, writeFileSync } from "fs";
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

// Every top-level collection the app reads/writes (see grep for
// `.collection("...")` across src/lib if this list ever needs updating).
// Note: org structure and other admin-editable settings live as single
// documents under `settings/*`, not their own top-level collections.
const COLLECTIONS = [
  "news",
  "permohonan",
  "keberatan",
  "ppid_documents",
  "settings",
  "users",
  "audit_logs",
];

async function main() {
  const backup = {};

  for (const name of COLLECTIONS) {
    const snapshot = await db.collection(name).get();
    backup[name] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log(`  ${name}: ${snapshot.size} dokumen`);
  }

  mkdirSync("backups", { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const filePath = `backups/firestore-backup-${timestamp}.json`;
  writeFileSync(filePath, JSON.stringify(backup, null, 2), "utf-8");

  console.log(`\nBackup tersimpan di ${filePath}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Backup gagal:", error);
    process.exit(1);
  });
