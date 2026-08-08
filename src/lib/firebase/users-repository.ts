import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export async function getAdminEmails(): Promise<string[]> {
  const snapshot = await adminDb.collection("users").where("role", "==", "admin").get();
  return snapshot.docs
    .map((doc) => doc.data().email as string | undefined)
    .filter((email): email is string => Boolean(email));
}

export type AdminUser = {
  uid: string;
  email: string;
  name?: string;
};

export async function getAdminList(): Promise<AdminUser[]> {
  const snapshot = await adminDb.collection("users").where("role", "==", "admin").get();
  const admins: AdminUser[] = [];
  for (const doc of snapshot.docs) {
    const data = doc.data();
    if (typeof data.email === "string") {
      admins.push({ uid: doc.id, email: data.email, name: data.name ?? undefined });
    }
  }
  return admins;
}
