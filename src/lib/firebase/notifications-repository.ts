import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import { getPermohonanByEmail } from "@/lib/firebase/permohonan-repository";
import type { NotificationData } from "@/types/notification";

const MAX_ITEMS = 10;

export async function getNotificationsForUser(
  uid: string,
  email: string
): Promise<NotificationData> {
  const [permohonanList, userDoc] = await Promise.all([
    getPermohonanByEmail(email),
    adminDb.collection("users").doc(uid).get(),
  ]);

  const seenAt = (userDoc.data()?.notificationsSeenAt as string | undefined) ?? null;
  // Only status changes count as notifications — a request's own creation
  // (status "baru") isn't an "update" of anything yet.
  const updated = permohonanList.filter((item) => item.status !== "baru");

  const items = updated.slice(0, MAX_ITEMS).map((item) => ({
    id: item.id,
    type: item.type,
    categoryLabel: item.categoryLabel,
    status: item.status,
    updatedAt: item.updatedAt,
    isUnread: !seenAt || item.updatedAt > seenAt,
  }));

  const unreadCount = updated.filter((item) => !seenAt || item.updatedAt > seenAt).length;

  return { items, unreadCount };
}
