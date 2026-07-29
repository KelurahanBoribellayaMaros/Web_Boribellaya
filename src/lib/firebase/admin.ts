import "server-only";
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

// Prefer a base64-encoded key (FIREBASE_PRIVATE_KEY_BASE64) when present:
// it has no newlines or special characters, so it can't be mangled by a
// host's env var UI (e.g. a bulk ".env paste" collapsing/escaping the \n
// sequences in the raw PEM string, which OpenSSL then fails to parse).
// Falls back to the raw PEM string for local dev via .env.local.
function resolvePrivateKey(): string | undefined {
  const base64Key = process.env.FIREBASE_PRIVATE_KEY_BASE64;
  if (base64Key) {
    return Buffer.from(base64Key, "base64").toString("utf-8");
  }
  return process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: resolvePrivateKey(),
      }),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);
