import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { ProfileCard } from "@/components/profil/ProfileCard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Kelurahan Boribellaya",
  description:
    "Kebijakan privasi dan perlindungan data pribadi pengguna portal Kelurahan Boribellaya.",
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="mx-auto max-w-6xl px-2 py-10 sm:px-3 sm:py-12 lg:px-4">
      <div className="rounded-2xl bg-[#003459] px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#fdd85d]" />
          <span className="text-xs font-semibold tracking-widest text-[#fdd85d] uppercase">
            Perlindungan Data
          </span>
          <span className="h-px w-8 bg-[#fdd85d]" />
        </div>
        <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Kebijakan Privasi
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-white/80 sm:text-base">
          Terakhir diperbarui: Agustus 2026.
        </p>
      </div>

      <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
        <Reveal>
          <ProfileCard icon={ShieldCheck} title="Kebijakan Privasi">
            <div className="space-y-5 text-sm leading-relaxed text-gray-600">
              <p>
                Kelurahan Boribellaya berkomitmen melindungi data pribadi
                warga yang menggunakan portal ini, sesuai dengan
                Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data
                Pribadi. Kebijakan ini menjelaskan data apa yang kami
                kumpulkan, untuk apa data tersebut digunakan, dan bagaimana
                kami menjaganya.
              </p>

              <div>
                <h3 className="font-semibold text-gray-900">
                  1. Data yang Kami Kumpulkan
                </h3>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>
                    <strong>Saat mendaftar akun:</strong> nama lengkap dan
                    alamat email.
                  </li>
                  <li>
                    <strong>Saat mengajukan layanan atau permohonan
                    informasi:</strong> nama, email, nomor HP, NIK, alamat,
                    pekerjaan, dan keperluan permohonan, sesuai jenis layanan
                    yang diajukan.
                  </li>
                  <li>
                    <strong>Berkas pendukung:</strong> untuk sebagian layanan
                    (seperti SKCK, pengurusan KK/KTP), kami meminta unggahan
                    foto/scan dokumen seperti KTP, KK, atau surat pengantar
                    RT/RW sebagai syarat administrasi.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  2. Tujuan Penggunaan Data
                </h3>
                <p className="mt-2">
                  Data yang Anda berikan digunakan semata-mata untuk
                  memproses permohonan layanan/informasi Anda, memverifikasi
                  identitas pemohon, dan mengirim notifikasi status
                  permohonan ke email akun Anda. Kami tidak menggunakan data
                  Anda untuk tujuan pemasaran atau membagikannya ke pihak
                  ketiga di luar keperluan administrasi kelurahan.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  3. Penyimpanan &amp; Keamanan Data
                </h3>
                <p className="mt-2">
                  Data akun dan permohonan disimpan menggunakan layanan cloud
                  Google Firebase, sedangkan berkas dokumen (seperti scan
                  KTP/KK) disimpan terpisah di penyimpanan privat yang tidak
                  dapat diakses publik. Hanya petugas kelurahan yang
                  berwenang yang dapat mengakses data permohonan warga untuk
                  keperluan verifikasi dan pemrosesan.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  4. Hak Anda
                </h3>
                <p className="mt-2">
                  Anda berhak memperbarui data akun Anda kapan saja melalui
                  halaman akun, dan dapat menghubungi kami melalui halaman{" "}
                  <Link
                    href="/kontak"
                    className="font-semibold text-[#003459] hover:underline"
                  >
                    Kontak
                  </Link>{" "}
                  untuk meminta penghapusan akun atau data pribadi Anda,
                  sepanjang tidak bertentangan dengan kewajiban penyimpanan
                  arsip pemerintahan.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  5. Perubahan Kebijakan
                </h3>
                <p className="mt-2">
                  Kebijakan ini dapat diperbarui sewaktu-waktu mengikuti
                  perkembangan layanan kami. Perubahan akan diumumkan melalui
                  halaman ini.
                </p>
              </div>
            </div>
          </ProfileCard>
        </Reveal>
      </div>
    </div>
  );
}
