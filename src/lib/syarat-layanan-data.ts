import type { SyaratLayanan } from "@/types/layanan";

// Sumber: Lampiran Keputusan Lurah Boribellaya Nomor 1002/SKPTS/BBL/II/2023
// tentang Standar Operasional Pelayanan Kelurahan Boribellaya.
// Alurnya sama untuk seluruh jenis surat di bawah ini, hanya dokumen
// persyaratannya yang berbeda per jenis.
export const alurPengajuanUmum: string[] = [
  "Mengajukan permohonan yang ditandatangani oleh Ketua RW/RT sebagai bukti pengantar.",
  "Melampirkan dokumen persyaratan yang diperlukan.",
  "Menyetor berkas tersebut di loket pelayanan untuk diproses.",
];

export const syaratLayananItems: SyaratLayanan[] = [
  {
    no: 1,
    name: "Surat Keterangan/Pengantar SKCK",
    persyaratan: [
      "Permohonan yang ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto copy ijazah",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 2,
    name: "Surat Keterangan Domisili",
    persyaratan: [
      "Permohonan yang ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto copy KK pemilik rumah (jika menumpang)",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 3,
    name: "Surat Keterangan Kematian",
    persyaratan: [
      "Permohonan memuat nama almarhum, tempat, dan tanggal kematian, ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 4,
    name: "Surat Pengantar Ijin Keramaian",
    persyaratan: [
      "Permohonan memuat jenis keramaian dan waktu pelaksanaan, ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 5,
    name: "Surat Keterangan Hilang",
    persyaratan: [
      "Permohonan memuat jenis dokumen yang hilang, ditandatangani oleh RW/RT",
      "Foto copy dokumen yang hilang",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 7,
    name: "Surat Pernyataan Ahli Waris",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Surat keterangan kematian",
      "Foto copy KTP/KK para ahli waris",
      "Telah bayar PBB",
    ],
  },
  {
    no: 8,
    name: "Surat Keterangan Tanah",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Dokumen pengajuan permohonan penerbitan SKT",
      "Foto copy KTP/KK, termasuk para ahli waris jika ada",
      "PBB dan bukti lunas",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 9,
    name: "Surat Pernyataan Penguasaan Fisik Tanah",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK, termasuk para ahli waris jika ada",
      "PBB dan bukti lunas",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 10,
    name: "Surat Pernyataan Tidak dalam Sengketa",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK, termasuk para ahli waris jika ada",
      "PBB dan bukti lunas",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 11,
    name: "Surat Keterangan Lahir",
    persyaratan: [
      "Permohonan memuat identitas kelahiran, ditandatangani oleh RW/RT",
      "Mengisi formulir",
      "Keterangan lahir dari bidan/fasilitas kesehatan",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 12,
    name: "Surat Keterangan Pindah Keluar",
    persyaratan: [
      "Permohonan memuat identitas dan alamat yang dituju, ditandatangani oleh RW/RT",
      "Mengisi formulir",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 13,
    name: "Surat Keterangan Penerbitan KK Baru",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Mengisi formulir",
      "Foto copy buku nikah",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 14,
    name: "Surat Keterangan Identitas",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Dokumen identitas yang terdapat perbedaan",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
    ],
  },
  {
    no: 15,
    name: "Surat Keterangan Harga Tanah",
    persyaratan: [
      "Permohonan memuat harga NJOP dan harga pasar, ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "PBB dan bukti bayar",
      "Bukti kepemilikan",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 16,
    name: "Surat Keterangan Usaha",
    persyaratan: [
      "Permohonan memuat nama usaha, jenis usaha, jumlah modal usaha, karyawan, dan alamat usaha, ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto usaha",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 17,
    name: "Surat Keterangan Tidak Mampu/Miskin",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 18,
    name: "Surat Keterangan Nikah",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto copy akta kelahiran",
      "Foto copy ijazah (jika ada)",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 19,
    name: "Surat Keterangan Telah Menikah",
    persyaratan: [
      "Permohonan memuat waktu menikah, mahar, saksi, dll, ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto copy akta kelahiran",
      "Foto copy ijazah (jika ada)",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 20,
    name: "Surat Keterangan Belum Menikah",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Foto copy akta kelahiran",
      "Foto copy ijazah (jika ada)",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 21,
    name: "Surat Keterangan Gaib",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Buku nikah",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 23,
    name: "Surat Keterangan Penghasilan",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
      "Persyaratan lainnya yang diperlukan",
    ],
  },
  {
    no: 24,
    name: "Surat Keterangan Lainnya",
    persyaratan: [
      "Permohonan ditandatangani oleh RW/RT",
      "Foto copy KTP/KK",
      "Telah bayar PBB",
    ],
  },
];

// Diatur UU No. 14 Tahun 2008 tentang Keterbukaan Informasi Publik, bukan SK
// Lurah di atas — ditampilkan di halaman pengajuan/keberatan masing-masing,
// bukan di daftar SOP Pelayanan gabungan (yang mengikuti alur RW/RT yang
// tidak relevan untuk permohonan informasi/keberatan).
export const sopPengajuanInformasi: SyaratLayanan = {
  no: 0,
  name: "Pengajuan Permohonan Informasi Publik",
  persyaratan: [
    "Memiliki akun terverifikasi di portal ini",
    "NIK sesuai KTP",
    "Nama lengkap dan alamat pemohon",
    "Rincian informasi yang diminta",
    "Tujuan penggunaan informasi",
  ],
};

export const sopKeberatanInformasi: SyaratLayanan = {
  no: 0,
  name: "Keberatan Informasi Publik",
  persyaratan: [
    "Sudah pernah mengajukan Permohonan Informasi Publik melalui portal ini",
    "Alasan keberatan sesuai Pasal 17 & 35 UU No. 14 Tahun 2008",
    "Kronologi/penjelasan keberatan",
    "Surat kuasa (jika keberatan dikuasakan)",
  ],
};
