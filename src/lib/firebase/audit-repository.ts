import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export type AuditAction = "create" | "update" | "delete" | "status_change" | "login";

export type AuditLogEntry = {
  id: string;
  uid: string;
  email: string;
  action: AuditAction;
  target: string;
  targetId?: string;
  details?: string;
  createdAt: string;
};

export async function logAudit(input: {
  uid: string;
  email: string;
  action: AuditAction;
  target: string;
  targetId?: string;
  details?: string;
}): Promise<void> {
  // Best-effort: an admin action is already applied regardless of whether
  // its audit entry gets written, so a logging failure must never block or
  // roll back the action itself.
  try {
    await adminDb.collection("audit_logs").add({
      ...input,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Gagal mencatat audit log:", error);
  }
}

export async function getAuditLogs(limitCount = 100): Promise<AuditLogEntry[]> {
  const snapshot = await adminDb
    .collection("audit_logs")
    .orderBy("createdAt", "desc")
    .limit(limitCount)
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      uid: data.uid,
      email: data.email,
      action: data.action,
      target: data.target,
      targetId: data.targetId ?? undefined,
      details: data.details ?? undefined,
      createdAt: data.createdAt,
    };
  });
}
