import "server-only";
import { adminDb } from "@/lib/firebase/admin";

export type PopulationData = {
  totalPenduduk: number;
  kepalaKeluarga: number;
  lakiLaki: number;
  perempuan: number;
};

const DEFAULT_POPULATION: PopulationData = {
  totalPenduduk: 12450,
  kepalaKeluarga: 3210,
  lakiLaki: 6120,
  perempuan: 6330,
};

export async function getPopulationStats(): Promise<PopulationData> {
  const doc = await adminDb.collection("settings").doc("population").get();
  if (!doc.exists) return DEFAULT_POPULATION;

  const data = doc.data()!;
  return {
    totalPenduduk: data.totalPenduduk ?? DEFAULT_POPULATION.totalPenduduk,
    kepalaKeluarga: data.kepalaKeluarga ?? DEFAULT_POPULATION.kepalaKeluarga,
    lakiLaki: data.lakiLaki ?? DEFAULT_POPULATION.lakiLaki,
    perempuan: data.perempuan ?? DEFAULT_POPULATION.perempuan,
  };
}
