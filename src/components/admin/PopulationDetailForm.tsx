"use client";

import { useState, type FormEvent } from "react";
import { unstable_rethrow } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { updatePopulationDetailAction } from "@/lib/actions/population-actions";
import type { PopulationRt, PopulationRw } from "@/types/population";

const EMPTY_RT: PopulationRt = { rt: "", laki: 0, perempuan: 0, kk: 0, rumah: 0 };

export function PopulationDetailForm({ rws: initialRws }: { rws: PopulationRw[] }) {
  const [rws, setRws] = useState<PopulationRw[]>(
    initialRws.length > 0 ? initialRws : [{ name: "", rts: [{ ...EMPTY_RT }] }]
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateRwName(rwIndex: number, name: string) {
    setRws((prev) => prev.map((rw, i) => (i === rwIndex ? { ...rw, name } : rw)));
  }

  function addRw() {
    setRws((prev) => [...prev, { name: "", rts: [{ ...EMPTY_RT }] }]);
  }

  function removeRw(rwIndex: number) {
    setRws((prev) => prev.filter((_, i) => i !== rwIndex));
  }

  function updateRt(rwIndex: number, rtIndex: number, field: keyof PopulationRt, value: string) {
    setRws((prev) =>
      prev.map((rw, i) => {
        if (i !== rwIndex) return rw;
        const rts = rw.rts.map((rt, j) =>
          j !== rtIndex
            ? rt
            : { ...rt, [field]: field === "rt" ? value : Number(value) || 0 }
        );
        return { ...rw, rts };
      })
    );
  }

  function addRt(rwIndex: number) {
    setRws((prev) =>
      prev.map((rw, i) => (i === rwIndex ? { ...rw, rts: [...rw.rts, { ...EMPTY_RT }] } : rw))
    );
  }

  function removeRt(rwIndex: number, rtIndex: number) {
    setRws((prev) =>
      prev.map((rw, i) =>
        i === rwIndex ? { ...rw, rts: rw.rts.filter((_, j) => j !== rtIndex) } : rw
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("rwsJson", JSON.stringify(rws));

    try {
      await updatePopulationDetailAction(formData);
    } catch (err) {
      unstable_rethrow(err);
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-4">
        {rws.map((rw, rwIndex) => (
          <div key={rwIndex} className="rounded-xl border border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={rw.name}
                onChange={(event) => updateRwName(rwIndex, event.target.value)}
                placeholder="Nama RW/Lingkungan (mis. Marampesu)"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
              />
              <button
                type="button"
                onClick={() => removeRw(rwIndex)}
                disabled={rws.length === 1}
                aria-label="Hapus RW ini"
                className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 px-3 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 className="size-4" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              <div className="grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr_auto] gap-1.5 px-0.5 text-[0.65rem] font-semibold tracking-wide text-gray-400 uppercase">
                <span>RT</span>
                <span>Laki-laki</span>
                <span>Perempuan</span>
                <span>KK</span>
                <span>Rumah</span>
                <span />
              </div>
              {rw.rts.map((rt, rtIndex) => (
                <div key={rtIndex} className="grid grid-cols-[4.5rem_1fr_1fr_1fr_1fr_auto] gap-1.5">
                  <input
                    type="text"
                    required
                    value={rt.rt}
                    onChange={(event) => updateRt(rwIndex, rtIndex, "rt", event.target.value)}
                    placeholder="RT"
                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rt.laki || ""}
                    onChange={(event) => updateRt(rwIndex, rtIndex, "laki", event.target.value)}
                    onFocus={(event) => event.target.select()}
                    placeholder="0"
                    title="Laki-laki"
                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rt.perempuan || ""}
                    onChange={(event) =>
                      updateRt(rwIndex, rtIndex, "perempuan", event.target.value)
                    }
                    onFocus={(event) => event.target.select()}
                    placeholder="0"
                    title="Perempuan"
                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rt.kk || ""}
                    onChange={(event) => updateRt(rwIndex, rtIndex, "kk", event.target.value)}
                    onFocus={(event) => event.target.select()}
                    placeholder="0"
                    title="Kepala Keluarga"
                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  />
                  <input
                    type="number"
                    min={0}
                    value={rt.rumah || ""}
                    onChange={(event) => updateRt(rwIndex, rtIndex, "rumah", event.target.value)}
                    onFocus={(event) => event.target.select()}
                    placeholder="0"
                    title="Rumah"
                    className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-gray-900 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600/20"
                  />
                  <button
                    type="button"
                    onClick={() => removeRt(rwIndex, rtIndex)}
                    disabled={rw.rts.length === 1}
                    aria-label="Hapus RT ini"
                    className="flex items-center justify-center rounded-lg border border-gray-200 px-2 text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => addRt(rwIndex)}
              className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#003459] hover:underline"
            >
              <Plus className="size-3.5" />
              Tambah RT
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addRw}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#003459] hover:underline"
      >
        <Plus className="size-4" />
        Tambah RW
      </button>

      <p className="text-xs text-gray-400">
        Kolom: RT, Laki-laki, Perempuan, KK, Rumah. Total per RW dan total
        keseluruhan dihitung otomatis di halaman Profil, jadi tidak perlu
        diisi manual di sini.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-[#003459] py-3 text-sm font-semibold text-white transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Tabel Data Penduduk"}
      </button>
    </form>
  );
}
