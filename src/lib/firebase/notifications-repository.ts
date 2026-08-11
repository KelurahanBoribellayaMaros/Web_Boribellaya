import "server-only";
import { adminDb } from "@/lib/firebase/admin";

import type { NotificationData } from "@/types/notification";

const MAX_ITEMS = 10;

export async function getNotificationsForAdmin(
  uid: string
): Promise<NotificationData> {
  const [snapshot, userDoc] = await Promise.all([
    adminDb
      .collection("permohonan")
      .where("status", "==", "baru")
      .orderBy("createdAt", "desc")
      .limit(MAX_ITEMS)
      .get(),
    adminDb.collection("users").doc(uid).get(),
  ]);

  const seenAt = (userDoc.data()?.notificationsSeenAt as string | undefined) ?? null;
  const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as any));

  const items = docs.map((item) => ({
    id: item.id,
    type: item.type,
    categoryLabel: item.categoryLabel,
    status: item.status,
    updatedAt: item.createdAt, // For new items, we care about when it was created
    isUnread: !seenAt || item.createdAt > seenAt,
  }));

  const unreadCount = docs.filter((item) => !seenAt || item.createdAt > seenAt).length;

  return { items, unreadCount };
}
