import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export async function getAdminEmails(): Promise<string[]> {
  const snapshot = await adminDb.collection("users").where("role", "==", "admin").get();
  return snapshot.docs
    .map((doc) => doc.data().email as string | undefined)
    .filter((email): email is string => Boolean(email));
}
