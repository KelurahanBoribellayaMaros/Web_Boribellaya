import type { Leader, OrgNode } from "@/types/profile";

export const history: string[] = [
  'Kelurahan Boribellaya, terletak di jantung Kecamatan Turikale, Kabupaten Maros, menyimpan sejarah panjang sebagai pusat pemukiman yang berkembang pesat seiring dengan dinamika wilayah sekitarnya. Berawal dari sebuah perkampungan agraris yang subur, nama "Boribellaya" sendiri merefleksikan kearifan lokal masyarakat dalam mengelola lahan dan merawat kebersamaan.',
  "Seiring berjalannya waktu dan pesatnya pembangunan di Kabupaten Maros, Boribellaya bertransformasi menjadi kawasan urban yang strategis, menjembatani aktivitas pemerintahan dan perdagangan. Perubahan status menjadi kelurahan menandai babak baru dalam administrasi pelayanan publik, memungkinkan pendekatan yang lebih modern dan responsif terhadap kebutuhan warga.",
  "Kini, Kelurahan Boribellaya terus melangkah maju, memadukan warisan tradisi yang kuat dengan visi modernitas. Pemerintah kelurahan berkomitmen untuk menghadirkan pelayanan prima, membangun infrastruktur yang inklusif, dan memberdayakan masyarakat, menjadikan Boribellaya sebagai teladan kelurahan yang mandiri, aman, dan sejahtera di Kabupaten Maros.",
];

export const vision =
  "Mewujudkan Kelurahan Boribellaya yang Mandiri, Sejahtera, dan Berbudaya melalui Pelayanan Publik yang Prima.";

export const missions: string[] = [
  "Meningkatkan kualitas pelayanan administrasi publik yang cepat, tepat, dan transparan.",
  "Mendorong partisipasi aktif masyarakat dalam pembangunan dan menjaga kebersihan lingkungan.",
  "Memberdayakan ekonomi kerakyatan melalui dukungan terhadap UMKM lokal.",
];

export const leader: Leader = {
  name: "Andi M. Ridwan, S.STP., M.Si.",
  position: "Kepala Kelurahan",
  nip: "NIP. 19850720 200501 1 003",
  bio: "Menjabat sebagai Lurah Boribellaya sejak tahun 2021, Bapak Andi M. Ridwan berkomitmen membawa perubahan positif melalui inovasi pelayanan digital dan pendekatan langsung kepada masyarakat.",
  email: "lurah.boribellaya@maroskab.go.id",
  term: "Masa Jabatan: 2021 - Sekarang",
};

export const orgChart: OrgNode = {
  name: leader.name,
  position: "Lurah",
  children: [
    {
      name: "Budi Santoso, S.Sos.",
      position: "Kasi Pemerintahan",
    },
  ],
};