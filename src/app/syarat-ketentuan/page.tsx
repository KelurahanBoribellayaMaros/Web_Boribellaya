import type { Metadata } from "next";
import { FileCheck2 } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Kelurahan Boribellaya",
  description: "Syarat dan ketentuan penggunaan portal Kelurahan Boribellaya.",
};

export default function SyaratKetentuanPage() {
  return (
    <div className="mx-auto max-w-3xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Ketentuan Layanan
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Syarat &amp; Ketentuan
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Terakhir diperbarui: Agustus 2026.
        </p>
      </div>

      <div className="mt-8 sm:mt-10">
        <Reveal>
          <ProfileCard icon={FileCheck2} title="Syarat & Ketentuan">
            <div className="space-y-5 text-sm leading-relaxed text-gray-600">
              <p>
                Dengan mengakses dan menggunakan portal resmi Kelurahan
                Boribellaya, Anda dianggap menyetujui syarat dan ketentuan
                berikut.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900">
                  1. Tujuan Layanan
                </h3>
                <p className="mt-2">
                  Portal ini disediakan untuk memudahkan warga Kelurahan
                  Boribellaya mengakses informasi publik dan mengajukan
                  layanan administrasi kependudukan secara daring. Layanan
                  ini melengkapi, bukan menggantikan, layanan tatap muka di
                  kantor kelurahan.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  2. Akun Pengguna
                </h3>
                <p className="mt-2">
                  Anda wajib mendaftar dengan data yang benar dan menjaga
                  kerahasiaan kata sandi akun Anda. Anda bertanggung jawab
                  atas seluruh aktivitas yang dilakukan melalui akun Anda.
                  Kelurahan berhak menonaktifkan akun yang terindikasi
                  digunakan untuk menyalahgunakan sistem, termasuk mengirim
                  permohonan palsu atau berulang secara tidak wajar.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  3. Kewajiban Pengguna
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    Memberikan data dan dokumen yang benar, akurat, dan
                    sesuai keadaan sebenarnya saat mengajukan permohonan.
                  </li>
                  <li>
                    Tidak menyalahgunakan portal ini untuk tujuan di luar
                    keperluan administrasi resmi.
                  </li>
                  <li>
                    Tidak mengunggah dokumen milik orang lain tanpa hak atau
                    persetujuan yang sah.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  4. Keakuratan Informasi
                </h3>
                <p className="mt-2">
                  Kami berupaya menjaga informasi di portal ini tetap
                  akurat dan terkini. Namun, untuk keperluan resmi/hukum,
                  dokumen dan informasi tetap harus dikonfirmasi langsung ke
                  kantor Kelurahan Boribellaya. Status dan waktu pemrosesan
                  permohonan dapat berbeda tergantung kelengkapan berkas dan
                  kondisi operasional kantor.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  5. Perubahan Layanan
                </h3>
                <p className="mt-2">
                  Kami dapat mengubah, menambah, atau menghentikan sebagian
                  fitur portal ini sewaktu-waktu tanpa pemberitahuan
                  sebelumnya, sepanjang tidak mengurangi hak warga untuk
                  mengakses layanan kelurahan secara langsung.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  6. Hukum yang Berlaku
                </h3>
                <p className="mt-2">
                  Syarat dan ketentuan ini tunduk pada hukum Negara Republik
                  Indonesia.
                </p>
              </div>
            </div>
          </ProfileCard>
        </Reveal>
      </div>
    </div>
  );
}
