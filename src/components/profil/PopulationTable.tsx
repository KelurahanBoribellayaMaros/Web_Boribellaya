import { Fragment } from "react";
import { formatNumber } from "@/lib/home-data";
import type { PopulationRw } from "@/types/population";

function sumRw(rw: PopulationRw) {
  return rw.rts.reduce(
    (acc, rt) => ({
      laki: acc.laki + rt.laki,
      perempuan: acc.perempuan + rt.perempuan,
      kk: acc.kk + rt.kk,
      rumah: acc.rumah + rt.rumah,
    }),
    { laki: 0, perempuan: 0, kk: 0, rumah: 0 }
  );
}

export function PopulationTable({ rws }: { rws: PopulationRw[] }) {
  if (rws.length === 0) return null;

  const rwTotals = rws.map(sumRw);
  const grandTotal = rwTotals.reduce(
    (acc, t) => ({
      laki: acc.laki + t.laki,
      perempuan: acc.perempuan + t.perempuan,
      kk: acc.kk + t.kk,
      rumah: acc.rumah + t.rumah,
    }),
    { laki: 0, perempuan: 0, kk: 0, rumah: 0 }
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
      <table className="w-full min-w-max text-sm">
        <thead>
          <tr className="bg-[#003459] text-white">
            <th className="px-4 py-3 text-center font-semibold">RW</th>
            <th className="px-4 py-3 text-center font-semibold">RT</th>
            <th className="px-4 py-3 text-center font-semibold">Laki-laki</th>
            <th className="px-4 py-3 text-center font-semibold">Perempuan</th>
            <th className="px-4 py-3 text-center font-semibold">KK</th>
            <th className="px-4 py-3 text-center font-semibold">Rumah</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rws.map((rw, i) => {
            const total = rwTotals[i];
            return (
              <Fragment key={rw.name}>
                <tr className="bg-blue-50 font-semibold text-gray-900">
                  <td
                    className="px-4 py-2.5 text-center align-middle"
                    rowSpan={rw.rts.length + 1}
                  >
                    {rw.name}
                  </td>
                  <td className="px-4 py-2.5 text-center">Semua</td>
                  <td className="px-4 py-2.5 text-center">{formatNumber(total.laki)}</td>
                  <td className="px-4 py-2.5 text-center">{formatNumber(total.perempuan)}</td>
                  <td className="px-4 py-2.5 text-center">{formatNumber(total.kk)}</td>
                  <td className="px-4 py-2.5 text-center">{formatNumber(total.rumah)}</td>
                </tr>
                {rw.rts.map((rt, j) => (
                  <tr key={`${rw.name}-${rt.rt}-${j}`} className="text-gray-600">
                    <td className="px-4 py-2 text-center">{rt.rt}</td>
                    <td className="px-4 py-2 text-center">{formatNumber(rt.laki)}</td>
                    <td className="px-4 py-2 text-center">{formatNumber(rt.perempuan)}</td>
                    <td className="px-4 py-2 text-center">{formatNumber(rt.kk)}</td>
                    <td className="px-4 py-2 text-center">{formatNumber(rt.rumah)}</td>
                  </tr>
                ))}
              </Fragment>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-[#fdd85d]/20 font-bold text-gray-900">
            <td className="px-4 py-3 text-center" colSpan={2}>
              Jumlah
            </td>
            <td className="px-4 py-3 text-center">{formatNumber(grandTotal.laki)}</td>
            <td className="px-4 py-3 text-center">{formatNumber(grandTotal.perempuan)}</td>
            <td className="px-4 py-3 text-center">{formatNumber(grandTotal.kk)}</td>
            <td className="px-4 py-3 text-center">{formatNumber(grandTotal.rumah)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
