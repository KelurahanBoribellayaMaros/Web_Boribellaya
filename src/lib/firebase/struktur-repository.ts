import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Leader, OrgNode } from "@/types/profile";

export type OrgPosition = {
  id: string;
  name: string;
  position: string;
  order: number;
};

// Shown only if settings/leader hasn't been configured yet — deliberately
// generic placeholder text, never a specific person's name. Silently
// falling back to a stale real name would risk misrepresenting who
// actually holds the position.
const EMPTY_LEADER: Leader = {
  name: "Data belum tersedia",
  position: "-",
  nip: "-",
  bio: "Profil pimpinan belum diperbarui melalui panel admin.",
  email: "-",
  term: "-",
};

export async function getLeader(): Promise<Leader> {
  const doc = await adminDb.collection("settings").doc("leader").get();
  if (!doc.exists) return EMPTY_LEADER;

  const data = doc.data()!;
  return {
    name: data.name ?? EMPTY_LEADER.name,
    position: data.position ?? EMPTY_LEADER.position,
    nip: data.nip ?? EMPTY_LEADER.nip,
    photo: data.photo ?? EMPTY_LEADER.photo,
    bio: data.bio ?? EMPTY_LEADER.bio,
    email: data.email ?? EMPTY_LEADER.email,
    term: data.term ?? EMPTY_LEADER.term,
  };
}

/** Raw Firestore rows, for the admin CRUD list — empty array if nothing saved yet (no fake IDs). */
export async function getOrgPositions(): Promise<OrgPosition[]> {
  const snapshot = await adminDb
    .collection("org_positions")
    .orderBy("order", "asc")
    .get();

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      position: data.position,
      order: data.order,
    };
  });
}

export async function getOrgPositionById(id: string): Promise<OrgPosition | null> {
  const doc = await adminDb.collection("org_positions").doc(id).get();
  if (!doc.exists) return null;
  const data = doc.data()!;
  return { id: doc.id, name: data.name, position: data.position, order: data.order };
}

/** For public display — shows just the leader box if no positions are saved yet. */
export async function getOrgChart(): Promise<OrgNode> {
  const [leader, positions] = await Promise.all([getLeader(), getOrgPositions()]);
  return {
    name: leader.name,
    position: "Lurah",
    children: positions.map((p) => ({ name: p.name, position: p.position })),
  };
}
