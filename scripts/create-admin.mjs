// Bootstraps the first admin account, since there is no self-serve admin signup.
// Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password>
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const [, , email, password] = process.argv;

if (!email || !password) {
  console.error("Usage: node --env-file=.env.local scripts/create-admin.mjs <email> <password>");
  process.exit(1);
}

const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const auth = getAuth(app);
const db = getFirestore(app);

async function main() {
  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`Found existing user ${user.uid} for ${email}.`);
    await auth.updateUser(user.uid, { password, emailVerified: true });
  } catch {
    // Bootstrapped directly by whoever runs this script, not self-registered,
    // so there's no citizen-facing "is this email reachable" guarantee to
    // enforce here the way there is for warga sign-ups.
    user = await auth.createUser({ email, password, emailVerified: true });
    console.log(`Created new user ${user.uid} for ${email}.`);
  }

  await auth.setCustomUserClaims(user.uid, { role: "admin" });

  await db.collection("users").doc(user.uid).set(
    {
      email,
      role: "admin",
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  );

  console.log(`${email} is now an admin. They can sign in at /login.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
