# 📘 MODUL PANDUAN CARA PENGGUNAAN & PEMELIHARAAN WEBSITE KELURAHAN
## Portal Pelayanan Publik & Keterbukaan Informasi Kelurahan Boribellaya

---

### **SAMPUL MODUL**
* **Urutan Logo Resmi:** Kemendikti Saintek Berdampak, Universitas Hasanuddin, SDG’s UNHAS, KKN UNHAS, Kabupaten Maros
* **Judul Modul:** Modul Panduan Cara Penggunaan & Pemeliharaan Website Kelurahan
* **Penyusun Modul:** William Anthony Rustan (Mahasiswa) & Dr. Ahmad Bahar ST M.Si (Dosen Pembimbing)
* **Nama Posko & Lokasi:** Boribellaya Maros (Kecamatan Turikale, Kabupaten Maros)
* **Versi Dokumen & Tahun:** Versi 2.0 — Agustus 2026

---

## 📜 KATA PENGANTAR
Puji dan syukur senantiasa kita panjatkan ke hadirat Tuhan Yang Maha Esa atas terselesaikannya **Buku Modul Panduan Cara Penggunaan & Pemeliharaan Website Kelurahan Boribellaya**. Modul ini disusun sebagai bagian dari program kerja KKN Tematik Universitas Hasanuddin Gelombang 116 dalam mendukung digitalisasi pelayanan publik dan penguatan keterbukaan informasi di Kelurahan Boribellaya, Kecamatan Turikale, Kabupaten Maros.

Website resmi Kelurahan Boribellaya telah dirancang untuk memenuhi kebutuhan tersebut, mencakup pelayanan permohonan surat administrasi warga, pengajuan informasi publik (PPID), pelacakan status berkas mandiri, hingga publikasi berita kegiatan dan profil demografi kependudukan.

Modul ini disusun dengan format praktis dan terperinci. Setiap alur kerja dilengkapi dengan penjelasan berbasis peran tugas, aturan keamanan data pribadi, panduan pemeliharaan kuota gratis, hingga langkah penanganan kendala teknis.

*Maros, Agustus 2026*  
**Tim Penyusun**

---

## 📑 DAFTAR ISI
* **PENDAHULUAN & PENGANTAR**
  * Kata Pengantar
  * Daftar Isi
  * Pendahuluan: Latar Belakang, Tujuan, & Kompetensi
* **BAGIAN I — DASAR**
  * **Bab 01:** Mengenal Panel Admin & Arsitektur Penyimpanan (Firebase & Supabase)
  * **Bab 02:** Masuk, Keluar, dan Kata Sandi
  * **Bab 03:** Dashboard, Peringatan Sistem, dan Log Aktivitas
* **BAGIAN II — PEKERJAAN HARIAN (OPERASIONAL)**
  * **Bab 04:** Menangani Permohonan Surat Warga & Pengajuan Keberatan
  * **Bab 05:** Mengelola Berita dan Pengumuman
  * **Bab 06:** Dokumen Informasi Publik (PPID) & Laporan PPID
  * **Bab 07:** Layanan, Data Penduduk, Struktur Organisasi, Kontak & Lokasi
  * **Bab 08:** Kelola Admin & Hak Akses
* **BAGIAN III — PEMELIHARAAN & SISTEM**
  * **Bab 09:** Aturan Ukuran File dan Cara Memperkecilnya
  * **Bab 10:** Pembersihan Data, Berkas Lama, dan Retensi 180 Hari
  * **Bab 11:** Cadangan Data (Backup) dan Bantuan Teknis
  * **Bab 12:** Pemantauan Kuota Layanan Gratis
* **LAMPIRAN & PENUTUP**
  * **Lampiran A:** Pertanyaan yang Sering Muncul (FAQ)
  * **Lampiran B:** Daftar Istilah (Glosarium)
  * Ringkasan Kewajiban Admin, Lembar Pengesahan & Daftar Pustaka

---

## 📖 PENDAHULUAN
### 1. Latar Belakang
Transformasi pelayanan digital tingkat kelurahan mempermudah masyarakat mengakses layanan tanpa antre fisik di kantor. Website Kelurahan Boribellaya menjadi pusat data dan portal mandiri pengurusan surat.

### 2. Tujuan & Target Kompetensi
1. Menjadi pedoman SOP resmi staf admin dalam memverifikasi berkas KTP/KK dan mengubah status permohonan.
2. Memastikan perlindungan data pribadi warga (UU PDP) saat mengelola scan dokumen identitas.
3. Memberikan panduan pemeliharaan kuota gratis Firebase dan Supabase agar website beroperasi lancar.

---

## 🌐 BAB 01: MENGENAL PANEL ADMIN
* **Dua Sisi Website:** Halaman publik untuk warga (`/`, `/layanan`, `/berita`, `/profil`, `/informasi-publik`, `/kontak`) dan Panel Admin tertutup untuk staf (`/admin`).
* **Arsitektur Penyimpanan:**
  * **Google Firebase Firestore:** Menyimpan data teks permohonan, berita, data penduduk, struktur, log aktivitas, dan foto sampul/pejabat (Base64 < 600 KB).
  * **Supabase Storage:** Menyimpan berkas fisik PDF dokumen publik (bucket `ppid-documents`) dan scan KTP/KK privat warga (bucket `permohonan-berkas` dengan tautan sementara bertanda tangan 1 jam).

---

## 🔐 BAB 02: MASUK, KELUAR, DAN KATA SANDI
* **Langkah Login:** Buka `/login`, masukkan email admin dan kata sandi, selesaikan verifikasi, lalu klik Masuk.
* **Keamanan Akun:** Wajib klik tombol **Keluar (Logout)** di menu profil kanan atas setiap kali selesai bekerja.
* **Aturan Sandi:** Minimal 10 karakter kombinasi huruf besar, huruf kecil, dan angka.

---

## 📊 BAB 03: DASHBOARD DAN LOG AKTIVITAS
* **4 Kartu Metrik:** Permohonan Masuk, Warga Terdaftar (KK), Total Berita, dan Dokumen PPID.
* **Kotak Peringatan Merah:** Muncul otomatis jika ada surat berstatus Baru yang belum disentuh > 24 jam.
* **Log Aktivitas:** Jejak audit otomatis yang mencatat nama admin, jenis perubahan, dan waktu aksi secara permanen.

---

## 📑 BAB 04: MENANGANI PERMOHONAN WARGA & KEBERATAN
* **4 Status Permohonan:**
  1. 🟡 **Baru:** Wajib diverifikasi dalam 1 hari kerja.
  2. 🔵 **Diverifikasi:** Berkas sah, surat fisik sedang diproses/diteken Lurah.
  3. 🟢 **Selesai:** Surat fisik siap diambil warga / perkara ditutup.
  4. 🔴 **Ditolak:** Berkas salah/buram (Wajib isi catatan penolakan).
* **Penanganan Keberatan (/admin/keberatan):** Meninjau permohonan informasi yang diajukan keberatan oleh warga sesuai UU KIP No. 14/2008.

---

## 📰 BAB 05: MENGELOLA BERITA DAN PENGUMUMAN
* **Tambah Berita Baru:** Judul, Ringkasan (2-3 kalimat), Konten lengkap, Kategori (Berita/Pengumuman), dan Foto Sampul.
* **Batas Foto:** Maksimal 600 KB (Format JPG, PNG, WEBP).

---

## 📑 BAB 06: DOKUMEN INFORMASI PUBLIK (PPID) & LAPORAN
* **Kategori Dokumen:** Berkala, Setiap Saat, dan Serta Merta.
* **Dokumen Tanpa File:** Kosongkan file lalu isi kolom *Link Halaman Website* dengan awalan `/` (misal `/profil` atau `/layanan`).
* **Laporan PPID:** Rekapitulasi jumlah layanan informasi publik per periode.

---

## 🏛️ BAB 07: LAYANAN, DATA PENDUDUK, STRUKTUR, KONTAK
* **Kelola Layanan:** Aktif/nonaktifkan tombol pengajuan surat digital.
* **Data Penduduk:** Isi tabel rincian RT/RW, sistem otomatis menghitung Total Penduduk, KK, Laki-laki, dan Perempuan.
* **Struktur Organisasi:** Profil sambutan Lurah & susunan aparatur kelurahan.
* **Kontak & Lokasi:** WhatsApp resmi, jam operasional, dan kode sematan Google Maps.

---

## 👥 BAB 08: KELOLA ADMIN & HAK AKSES
* Menambah admin baru langsung dari website tanpa perlu database console.
* Sisakan minimal 2 admin aktif di kantor kelurahan.

---

## 🛠️ BAB 09–12: PEMELIHARAAN & KUOTA GRATIS
* **Batas File:** Foto < 600 KB, Dokumen PDF < 2 MB.
* **Pembersihan Triwulanan:** Hapus permohonan berlabel *Kandidat Retensi* (180 hari) setelah melakukan backup.
* **Backup Data:** Klik tombol *Backup Data* di Dashboard untuk mengunduh rekapan JSON.
* **Penanganan Kuota:** Hindari refresh F5 berlebihan dan pantau pemakaian storage secara berkala.

---

## ✍️ LEMBAR PENGESAHAN & DAFTAR PUSTAKA
* **Mengetahui & Menyetujui:** Lurah Boribellaya  
* **Penyusun Modul:** Dr. Ahmad Bahar ST M.Si & William Anthony Rustan  
* **Daftar Pustaka:** KemenPAN-RB (2020), Kemenkominfo (2021), Pemkab Maros (2023), P2KKN UNHAS (2026).
