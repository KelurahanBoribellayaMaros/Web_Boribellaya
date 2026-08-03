import { alurPengajuanUmum, syaratLayananItems } from "@/lib/syarat-layanan-data";
import { SyaratLayananList } from "@/components/layanan/SyaratLayananList";
import { Reveal } from "@/components/ui/Reveal";

export function SopPelayananSection() {
  return (
    <section
      id="sop-pelayanan"
      className="mx-auto max-w-6xl scroll-mt-20 px-2 py-10 sm:px-3 sm:py-12 lg:px-4"
    >
      <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
        SOP Pelayanan
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Dokumen persyaratan dan alur pengajuan seluruh jenis surat keterangan
        di Kelurahan Boribellaya, berdasarkan SK Lurah Boribellaya Nomor
        1002/SKPTS/BBL/II/2023. Untuk jenis di luar 3 layanan online di atas,
        pengajuan dilakukan langsung di kantor kelurahan.
      </p>

      <Reveal className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
        <h3 className="font-semibold text-gray-900">Alur Pengajuan Umum</h3>
        <ol className="mt-3 space-y-2.5">
          {alurPengajuanUmum.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-600">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-[#003459]">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </Reveal>

      <div className="mt-6">
        <SyaratLayananList items={syaratLayananItems} />
      </div>
    </section>
  );
}
