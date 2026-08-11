const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

const fs = require('fs');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const env = {};
for (let line of envFile.split('\n')) {
  line = line.trim();
  if (!line || line.startsWith('#')) continue;
  const equalsIdx = line.indexOf('=');
  if (equalsIdx > -1) {
    const key = line.slice(0, equalsIdx);
    let val = line.slice(equalsIdx + 1);
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.substring(1, val.length - 1);
    }
    env[key] = val;
  }
}

const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const app = initializeApp({
  credential: cert({
    projectId: env.FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  }),
});

const db = getFirestore(app);
const auth = getAuth(app);

async function cleanup() {
  console.log("Memulai pembersihan Firestore...");

  // 1. Delete notifications collection
  console.log("Menghapus koleksi 'notifications' yang sudah tidak dipakai...");
  const notifs = await db.collection("notifications").get();
  let notifCount = 0;
  for (const doc of notifs.docs) {
    await doc.ref.delete();
    notifCount++;
  }
  console.log(`Berhasil menghapus ${notifCount} dokumen notifikasi.`);

  // 2. Delete non-admin users from 'users' collection
  console.log("Mencari akun warga di koleksi 'users'...");
  const usersSnapshot = await db.collection("users").get();
  let deletedWargaCount = 0;
  for (const doc of usersSnapshot.docs) {
    const data = doc.data();
    if (data.role !== "admin") {
      await doc.ref.delete();
      
      try {
        await auth.deleteUser(doc.id);
        console.log(`- Berhasil menghapus akun warga dari Auth & DB: ${data.email || doc.id}`);
      } catch (err) {
        if (err.code === 'auth/user-not-found') {
          console.log(`- Menghapus warga dari DB (tidak ditemukan di Auth): ${data.email || doc.id}`);
        } else {
          console.error(`Gagal menghapus dari Auth untuk UID ${doc.id}:`, err.message);
        }
      }
      deletedWargaCount++;
    }
  }
  console.log(`Berhasil menghapus ${deletedWargaCount} akun warga dari DB dan Auth.`);

  console.log("Selesai!");
}

cleanup().catch(console.error);
