import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { requireAdmin } from "@/lib/firebase/session";
import { logAudit } from "@/lib/firebase/audit-repository";

// Mirrors scripts/backup-firestore.mjs — keep the collection list in sync
// with that script if it ever changes.
const COLLECTIONS = [
  "news",
  "permohonan",
  "keberatan",
  "ppid_documents",
  "settings",
  "users",
  "audit_logs",
];

export async function GET() {
  const session = await requireAdmin();

  const backup: Record<string, unknown[]> = {};
  for (const name of COLLECTIONS) {
    const snapshot = await adminDb.collection(name).get();
    backup[name] = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  await logAudit({
    uid: session.uid,
    email: session.email ?? "",
    action: "export",
    target: "firestore_backup",
  });

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

  return new NextResponse(JSON.stringify(backup, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="firestore-backup-${timestamp}.json"`,
    },
  });
}
