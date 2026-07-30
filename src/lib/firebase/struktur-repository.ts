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

export type PpidPelaksana = {
  name: string;
  position: string;
};

// Same placeholder philosophy as EMPTY_LEADER — never default to a specific
// person's name before an admin has actually configured this.
const EMPTY_PPID_PELAKSANA: PpidPelaksana = {
  name: "Data belum tersedia",
  position: "PPID Pelaksana",
};

export async function getPpidPelaksana(): Promise<PpidPelaksana> {
  const doc = await adminDb.collection("settings").doc("ppid_pelaksana").get();
  if (!doc.exists) return EMPTY_PPID_PELAKSANA;

  const data = doc.data()!;
  return {
    name: data.name ?? EMPTY_PPID_PELAKSANA.name,
    position: data.position ?? EMPTY_PPID_PELAKSANA.position,
  };
}
