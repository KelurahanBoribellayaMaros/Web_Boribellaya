import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { Leader, OrgNode } from "@/types/profile";

export type OrgPosition = {
  id: string;
  name: string;
  position: string;
  order: number;
  nip?: string;
  photo?: string;
  // null/undefined = reports directly to the Lurah (tree root). Otherwise
  // the id of another position in this same list — lets admin build any
  // depth of hierarchy instead of a fixed template.
  parentId?: string | null;
};

const ROOT_ID = "lurah";

// Shown only if settings/leader hasn't been configured yet — deliberately
// generic placeholder text, never a specific person's name. Silently
// falling back to a stale real name would risk misrepresenting who
// actually holds the position.
const EMPTY_LEADER: Leader = {
  name: "Data belum tersedia",
  position: "-",
  nip: "-",
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
  };
}

// Single document holding the whole list — the admin form edits and saves
// it as one unit. Each row keeps its own id so other rows can reference it
// as their "Atasan" (parentId), forming a real tree instead of a fixed
// two-tier template.
export async function getOrgPositions(): Promise<OrgPosition[]> {
  const doc = await adminDb.collection("settings").doc("org_positions").get();
  if (!doc.exists) return [];

  const data = doc.data()!;
  const positions = Array.isArray(data.positions) ? data.positions : [];
  return [...positions].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

/** For public display — shows just the Lurah box if no positions are saved yet. */
export async function getOrgChart(): Promise<OrgNode> {
  const [leader, positions] = await Promise.all([getLeader(), getOrgPositions()]);

  function buildChildren(parentId: string): OrgNode[] {
    return positions
      .filter((p) => (p.parentId || ROOT_ID) === parentId)
      .map((p) => ({
        id: p.id,
        name: p.name,
        position: p.position,
        nip: p.nip,
        photo: p.photo,
        children: buildChildren(p.id),
      }));
  }

  return {
    id: ROOT_ID,
    name: leader.name,
    position: "Lurah",
    nip: leader.nip,
    photo: leader.photo,
    children: buildChildren(ROOT_ID),
  };
}
