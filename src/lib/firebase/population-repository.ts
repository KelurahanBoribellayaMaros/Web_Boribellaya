import "server-only";
import { adminDb } from "@/lib/firebase/admin";
import type { PopulationRw } from "@/types/population";

export type PopulationData = {
  totalPenduduk: number;
  kepalaKeluarga: number;
  lakiLaki: number;
  perempuan: number;
};

// Empty until an admin fills in the detailed RW/RT breakdown — the public
// table simply doesn't render until then (see PopulationTable.tsx).
export async function getPopulationDetail(): Promise<PopulationRw[]> {
  const doc = await adminDb.collection("settings").doc("population_detail").get();
  if (!doc.exists) return [];
  const data = doc.data()!;
  return Array.isArray(data.rws) ? data.rws : [];
}

// The 4 headline numbers (homepage + Profil summary cards) are derived
// straight from the RW/RT table rather than entered separately, so there's
// only ever one place to keep the population count accurate.
export function computePopulationStats(rws: PopulationRw[]): PopulationData {
  let lakiLaki = 0;
  let perempuan = 0;
  let kepalaKeluarga = 0;

  for (const rw of rws) {
    for (const rt of rw.rts) {
      lakiLaki += rt.laki;
      perempuan += rt.perempuan;
      kepalaKeluarga += rt.kk;
    }
  }

  return {
    totalPenduduk: lakiLaki + perempuan,
    kepalaKeluarga,
    lakiLaki,
    perempuan,
  };
}

export async function getPopulationStats(): Promise<PopulationData> {
  const rws = await getPopulationDetail();
  return computePopulationStats(rws);
}
