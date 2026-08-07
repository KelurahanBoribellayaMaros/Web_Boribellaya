"use server";

import { adminDb } from "@/lib/firebase/admin";
import { getSession } from "@/lib/firebase/session";
import { requireSession } from "@/lib/firebase/session";
import { getNotificationsForUser } from "@/lib/firebase/notifications-repository";
import type { Session } from "@/lib/firebase/session";
import type { NotificationData } from "@/types/notification";

// Called client-side by Header on mount, instead of the root layout fetching
// this server-side — cookies() (via getSession) forces the whole route tree
// into dynamic rendering, which was preventing public pages (Berita, Profil,
// etc.) from ever being cached even after they set `revalidate`. Moving it
// here means the layout/public pages no longer touch a Request-time API at
// render time, at the cost of a brief "loading" flash in the header while
// this resolves on the client.
export async function getHeaderDataAction(): Promise<{
  session: Session | null;
  notifications: NotificationData | null;
}> {
  const session = await getSession();
  const notifications = session?.email
    ? await getNotificationsForUser(session.uid, session.email)
    : null;
  return { session, notifications };
}

export async function markNotificationsSeenAction(): Promise<void> {
  const session = await requireSession();
  await adminDb
    .collection("users")
    .doc(session.uid)
    .set({ notificationsSeenAt: new Date().toISOString() }, { merge: true });
}
