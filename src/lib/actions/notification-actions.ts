"use server";

import { adminDb } from "@/lib/firebase/admin";
import { requireSession } from "@/lib/firebase/session";

export async function markNotificationsSeenAction(): Promise<void> {
  const session = await requireSession();
  await adminDb
    .collection("users")
    .doc(session.uid)
    .set({ notificationsSeenAt: new Date().toISOString() }, { merge: true });
}
