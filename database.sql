-- ====================================================================
-- SISTEM INFORMASI DESA WISATA MANDIRI CIREBON (CIREBONKITA)
-- Smart Tourism Sektor Pariwisata Daerah Cirebon
-- Modul:
-- 1. Modul Master Daya Tarik Wisata & Tiket (Divisi Wisata & Tiket)
-- 2. Modul Produk Kerajinan & Kuliner UMKM (Divisi UMKM & Ekonomi Kreatif)
-- 3. Modul Booking Homestay & Moderasi Ulasan (Divisi Homestay & Akomodasi)
-- ====================================================================

-- 1. Inisialisasi Database
CREATE DATABASE IF NOT EXISTS `cirebonkita` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `cirebonkita`;

-- Matikan foreign key checks sementara untuk import bersih
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `ulasan`;
DROP TABLE IF EXISTS `booking`;
DROP TABLE IF EXISTS `homestay`;
DROP TABLE IF EXISTS `umkm`;
DROP TABLE IF EXISTS `tiket`;
DROP TABLE IF EXISTS `wisata`;
DROP TABLE IF EXISTS `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- TABEL 1: USERS (Admin & Pengelola Desa)
-- Digunakan untuk keamanan otentikasi login admin dengan password BCRYPT
-- ====================================================================
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_lengkap` VARCHAR(100) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'pengelola_wisata', 'pengelola_umkm', 'pengelola_homestay') DEFAULT 'admin',
  `foto` VARCHAR(255) DEFAULT 'default_avatar.png',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 2: WISATA (Daya Tarik Cagar Budaya & Spot Rekreasi)
-- Divisi Wisata & Tiket
-- ====================================================================
CREATE TABLE `wisata` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_wisata` VARCHAR(150) NOT NULL,
  `kategori` ENUM('Keraton & Sejarah', 'Situs Cagar Budaya', 'Wisata Religi', 'Wisata Alam & Rekreasi') NOT NULL,
  `harga_tiket` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `deskripsi` TEXT NOT NULL,
  `kuota_harian` INT NOT NULL DEFAULT 100,
  `kuota_terisi` INT NOT NULL DEFAULT 0,
  `foto` VARCHAR(255) NOT NULL,
  `lokasi` VARCHAR(200) NOT NULL,
  `jam_buka` VARCHAR(50) DEFAULT '08:00 - 17:00 WIB',
  `fasilitas` VARCHAR(255) DEFAULT 'Pemandu Lokal, Parkir Luas, Musholla, Toilet, Spot Foto',
  `status_operasional` ENUM('Buka (Aktif)', 'Tutup Sementara', 'Pemeliharaan Spot') DEFAULT 'Buka (Aktif)',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 3: TIKET (Pemesanan E-Tiket Pintu Masuk / Reket)
-- ====================================================================
CREATE TABLE `tiket` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_tiket` VARCHAR(50) NOT NULL UNIQUE,
  `wisata_id` INT NOT NULL,
  `nama_pengunjung` VARCHAR(100) NOT NULL,
  `kontak` VARCHAR(30) NOT NULL,
  `tanggal_kunjungan` DATE NOT NULL,
  `jumlah_tiket` INT NOT NULL DEFAULT 1,
  `total_bayar` DECIMAL(10,2) NOT NULL,
  `status_validasi` ENUM('Terverifikasi', 'Belum Digunakan', 'Kadaluarsa') DEFAULT 'Terverifikasi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_tiket_wisata` FOREIGN KEY (`wisata_id`) REFERENCES `wisata` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 4: UMKM (Produk Kerajinan & Kuliner Khas Desa)
-- Divisi UMKM & Ekonomi Kreatif
-- ====================================================================
CREATE TABLE `umkm` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `kode_sku` VARCHAR(30) NOT NULL UNIQUE,
  `nama_produk` VARCHAR(150) NOT NULL,
  `kategori` ENUM('Batik Cirebon', 'Kuliner Khas', 'Kerajinan Tangan', 'Aksesoris') NOT NULL,
  `harga` DECIMAL(10,2) NOT NULL,
  `stok` INT NOT NULL DEFAULT 0,
  `deskripsi` TEXT NOT NULL,
  `mitra_pengrajin` VARCHAR(120) NOT NULL,
  `desa_asal` VARCHAR(100) NOT NULL,
  `foto` VARCHAR(255) NOT NULL,
  `status_stok` ENUM('Tersedia', 'Stok Menipis', 'Kritis', 'Habis') DEFAULT 'Tersedia',
  `terjual` INT DEFAULT 0,
  `rating` DECIMAL(2,1) DEFAULT 4.8,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 5: HOMESTAY (Akomodasi Hunian Ramah Warga Lokal)
-- Divisi Homestay & Akomodasi
-- ====================================================================
CREATE TABLE `homestay` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nama_homestay` VARCHAR(150) NOT NULL,
  `tipe_kamar` VARCHAR(100) NOT NULL,
  `kapasitas_tamu` INT NOT NULL DEFAULT 2,
  `harga_per_malam` DECIMAL(10,2) NOT NULL,
  `fasilitas` VARCHAR(255) NOT NULL,
  `lokasi` VARCHAR(200) NOT NULL,
  `jarak_pusat` VARCHAR(100) DEFAULT '250m dari Keraton',
  `foto` VARCHAR(255) NOT NULL,
  `nama_pemilik` VARCHAR(100) NOT NULL,
  `kontak_pemilik` VARCHAR(30) NOT NULL,
  `status_kamar` ENUM('Tersedia', 'Penuh', 'Renovasi') DEFAULT 'Tersedia',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 6: BOOKING (Reservasi Kamar Homestay)
-- Divisi Homestay & Akomodasi
-- ====================================================================
CREATE TABLE `booking` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `booking_code` VARCHAR(50) NOT NULL UNIQUE,
  `homestay_id` INT NOT NULL,
  `nama_tamu` VARCHAR(100) NOT NULL,
  `asal_kota` VARCHAR(100) DEFAULT 'Cirebon',
  `kontak` VARCHAR(30) NOT NULL,
  `tgl_checkin` DATE NOT NULL,
  `tgl_checkout` DATE NOT NULL,
  `durasi_malam` INT NOT NULL,
  `jumlah_tamu` INT NOT NULL DEFAULT 2,
  `total_biaya` DECIMAL(10,2) NOT NULL,
  `status_transaksi` ENUM('Terkonfirmasi', 'Menunggu Pembayaran', 'Selesai', 'Batal') DEFAULT 'Terkonfirmasi',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_booking_homestay` FOREIGN KEY (`homestay_id`) REFERENCES `homestay` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- TABEL 7: ULASAN (Review & Rating Bintang Pengalaman Menginap)
-- Divisi Homestay & Akomodasi
-- ====================================================================
CREATE TABLE `ulasan` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `homestay_id` INT NOT NULL,
  `nama_pengulas` VARCHAR(100) NOT NULL,
  `rating_bintang` INT NOT NULL CHECK (`rating_bintang` BETWEEN 1 AND 5),
  `komentar` TEXT NOT NULL,
  `status_moderasi` ENUM('Disetujui', 'Menunggu Moderasi', 'Ditolak') DEFAULT 'Disetujui',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_ulasan_homestay` FOREIGN KEY (`homestay_id`) REFERENCES `homestay` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================================================
-- DATA SEEDING (DATA DUMMY AWAL SESUAI MOCKUP & STUDI KASUS)
-- ====================================================================

-- 1. Insert Akun Admin (Password: admin123 -> Hash BCRYPT)
-- BCRYPT hash dari 'admin123' adalah: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO `users` (`nama_lengkap`, `username`, `email`, `password`, `role`) VALUES
('Administrator Desa', 'admin', 'admin@cirebonkita.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Pengelola Destinasi Wisata', 'imam', 'wisata@cirebonkita.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pengelola_wisata'),
('Pengelola Produk UMKM', 'nasywa', 'umkm@cirebonkita.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pengelola_umkm'),
('Pengelola Akomodasi Homestay', 'siti', 'homestay@cirebonkita.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pengelola_homestay');

-- 2. Insert Data Wisata Cirebon (Divisi Wisata & Tiket)
INSERT INTO `wisata` (`nama_wisata`, `kategori`, `harga_tiket`, `deskripsi`, `kuota_harian`, `kuota_terisi`, `foto`, `lokasi`, `jam_buka`, `fasilitas`, `status_operasional`) VALUES
('Keraton Kasepuhan Cirebon', 'Keraton & Sejarah', 20000.00, 'Istana kesultanan tertua di Cirebon yang didirikan tahun 1529, memadukan arsitektur Jawa, Sunda, Tiongkok, dan Eropa dengan Museum Kereta Singa Barong.', 500, 385, 'wisata_kasepuhan.jpg', 'Jl. Kasepuhan No. 43, Lemahwungkuk', '08:00 - 17:00 WIB', 'Pemandu Lokal, Museum Pusaka, Parkir Luas, Musholla, Souvenir', 'Buka (Aktif)'),
('Taman Air Gua Sunyaragi', 'Situs Cagar Budaya', 15000.00, 'Situs pesanggrahan kuno dan tempat meditasi keraton berlapis batu karang laut eksotis dengan lorong rahasia prajurit dan panggung pagelaran budaya.', 350, 290, 'wisata_sunyaragi.jpg', 'Sunyaragi, Kec. Kesambi, Kota Cirebon', '08:00 - 17:30 WIB', 'Panggung Teater, Lorong Rahasia, Spot Instagramable, Parkir', 'Buka (Aktif)'),
('Keraton Kanoman', 'Keraton & Sejarah', 15000.00, 'Pusat pelestarian upacara adat Panjang Jimat dengan koleksi pusaka kereta kencana Paksi Naga Liman yang penuh makna mistis agung peradaban Islam Cirebon.', 300, 195, 'wisata_kanoman.jpg', 'Jl. Kanoman No. 40, Lemahwungkuk', '08:30 - 16:30 WIB', 'Kereta Kencana, Wisata Spiritual, Spot Foto Budaya, Area Parkir', 'Buka (Aktif)'),
('Makam Sunan Gunung Jati', 'Wisata Religi', 0.00, 'Pusat ziarah salah satu Wali Songo dengan arsitektur akulturasi Jawa, Tiongkok dan Arab dengan ornamen piring keramik Dinasti Ming bersejarah.', 1000, 810, 'wisata_gunungjati.jpg', 'Astana, Kec. Gunungjati, Kab. Cirebon', '24 Jam Penuh', 'Kawasan Peziarah, Area Wudhu, Aula Dzikir, Pasar Souvenir Religi', 'Buka (Aktif)'),
('Hutan Kera Plangon', 'Wisata Alam & Rekreasi', 10000.00, 'Kawasan bukit hutan lindung alami yang dihuni ratusan primata jinak sekaligus makam Pangeran Panjunan dan Pangeran Kejaksan.', 200, 32, 'wisata_plangon.jpg', 'Babakan, Kec. Sumber, Kab. Cirebon', '07:00 - 17:00 WIB', 'Jalur Trekking, Penjual Kacang Primata, Gazebo Hutan, Parkir', 'Pemeliharaan Spot');

-- 3. Insert Data Tiket Masuk Real-Time
INSERT INTO `tiket` (`kode_tiket`, `wisata_id`, `nama_pengunjung`, `kontak`, `tanggal_kunjungan`, `jumlah_tiket`, `total_bayar`, `status_validasi`) VALUES
('TKT-CRB-202505-0912', 1, 'Hendrik Pratama', '081299887711', CURDATE(), 2, 40000.00, 'Terverifikasi'),
('TKT-CRB-202505-0911', 2, 'Dewi Lestari', '085711223344', CURDATE(), 4, 60000.00, 'Terverifikasi'),
('TKT-CRB-202505-0910', 3, 'Bagus Ramadhan', '081388904411', CURDATE(), 1, 15000.00, 'Terverifikasi');

-- 4. Insert Produk UMKM (Divisi UMKM & Ekonomi Kreatif)
INSERT INTO `umkm` (`kode_sku`, `nama_produk`, `kategori`, `harga`, `stok`, `deskripsi`, `mitra_pengrajin`, `desa_asal`, `foto`, `status_stok`, `terjual`, `rating`) VALUES
('CRB-BTK-001', 'Batik Mega Mendung Trusmi', 'Batik Cirebon', 150000.00, 18, 'Kain batik tulis katun primissima halus 2x1m motif awan megamendung khas Cirebon dengan pewarnaan alami tahan lama.', 'Sentra Batik Trusmi', 'Desa Trusmi', 'umkm_megamendung.jpg', 'Tersedia', 128, 4.9),
('CRB-KUL-002', 'Terasi Udang Rebon Asli Cirebon', 'Kuliner Khas', 16000.00, 42, 'Terasi udang rebon grade super 250gr diolah tradisional tanpa pengawet kimia, aroma gurih harum khas pesisir utara.', 'Nelayan Pasindangan', 'Pesisir Samadikun', 'umkm_terasi.jpg', 'Tersedia', 340, 4.8),
('CRB-KRY-003', 'Anyaman Bambu Tudung Saji Khas', 'Kerajinan Tangan', 75000.00, 6, 'Bakul dan penutup saji multiguna ramah lingkungan dari bambu wulung pilihan dengan anyaman rapat tahan jamur.', 'Desa Binaan Plumbon', 'Desa Tegalwangi', 'umkm_anyaman.jpg', 'Stok Menipis', 64, 4.7),
('CRB-KUL-004', 'Empal Gentong Kemasan Siap Saji', 'Kuliner Khas', 35000.00, 24, 'Paket daging sapi bumbu kuning gurih santan rempah khas Battembat dalam kemasan retort steril siap santap.', 'UMKM Battembat', 'Desa Battembat', 'umkm_empalgentong.jpg', 'Tersedia', 512, 5.0),
('CRB-KUL-005', 'Kerupuk Melarat Pasir Asli', 'Kuliner Khas', 12000.00, 50, 'Kerupuk gurih digoreng pasir kali bersih tanpa minyak goreng, disajikan lengkap dengan sambal asam pedas segar.', 'Perajin Plered', 'Desa Plered', 'umkm_kerupukmelarat.jpg', 'Tersedia', 890, 4.8),
('CRB-AKS-006', 'Aksesoris Motif Kerang & Batik', 'Aksesoris', 45000.00, 3, 'Anting etnik dan liontin liontina dari cangkang kerang simping pesisir dilapisi motif mini batik klasik pesisir.', 'Sanggar Seni Kanoman', 'Kreatif Kanoman', 'umkm_anting.jpg', 'Kritis', 88, 4.6),
('CRB-BTK-007', 'Kain Batik Pesisir Motif Kompeni', 'Batik Cirebon', 120000.00, 15, 'Kain batik cap kombinasi motif kompeni dan flora pesisir khas pesisiran Cirebon.', 'Sentra Kalitengah', 'Desa Kalitengah', 'umkm_batikpesisir.jpg', 'Tersedia', 156, 4.9),
('CRB-KUL-008', 'Kue Apem Tradisional Cirebon', 'Kuliner Khas', 10000.00, 20, 'Kue basah tradisional berbahan tepung beras dengan siraman saus kinca gula aren asli.', 'Pawon Ibu Kasepuhan', 'Desa Kasepuhan', 'umkm_apem.jpg', 'Tersedia', 210, 4.9),
('CRB-KUL-009', 'Mie Koclok', 'Kuliner Khas', 22000.00, 35, 'Mie Koclok merupakan kuliner khas Cirebon berupa mi kuning dengan kuah santan kental yang gurih, dilengkapi suwiran ayam, telur, tauge, dan irisan kol.', 'Kedai Mie Koclok Panjunan', 'Desa Panjunan', 'mie_koclok_97b8e22c.jpeg', 'Tersedia', 340, 4.9),
('CRB-KUL-010', 'Nasi Jamblang', 'Kuliner Khas', 25000.00, 45, 'Nasi Jamblang merupakan kuliner khas Cirebon berupa nasi putih yang dibungkus daun jati, disajikan dengan berbagai pilihan lauk seperti sambal goreng, tahu, tempe, perkedel, dan cumi hitam.', 'Nasi Jamblang Asli Cirebon', 'Desa Jamblang', 'nasi_jamblang_bu_nur_ad2faba2.jpeg', 'Tersedia', 680, 5.0),
('CRB-KUL-011', 'Docang', 'Kuliner Khas', 15000.00, 30, 'Docang merupakan kuliner tradisional khas Cirebon berupa lontong yang disajikan dengan daun singkong, tauge, kerupuk, dan kuah dage (ampas kelapa berbumbu) yang gurih dan khas.', 'Docang Tradisi Cirebon', 'Desa Kesenden', 'docang_pak_kumis_ad6ae0bd.jpeg', 'Tersedia', 290, 4.8),
('CRB-KUL-012', 'Tahu Gejrot', 'Kuliner Khas', 12000.00, 50, 'Tahu Gejrot merupakan jajanan khas Cirebon berupa potongan tahu goreng yang disiram kuah gula merah, asam jawa, bawang, dan cabai sehingga menghasilkan perpaduan rasa manis, asam, dan pedas.', 'Sentra Tahu Ciledug', 'Desa Ciledug', 'tahu_gejrot_mang_wardi_0dc96ec3.jpeg', 'Tersedia', 820, 4.9),
('CRB-KUL-013', 'Nasi Lengko', 'Kuliner Khas', 18000.00, 40, 'Nasi Lengko merupakan kuliner khas Cirebon berupa nasi putih yang disajikan dengan tahu, tempe, tauge, mentimun, daun kucai, dan siraman bumbu kacang serta kecap yang gurih.', 'Warung Lengko Cirebon', 'Desa Pagongan', 'nasi_lengko_hj_barno_5fe8a3cc.jpeg', 'Tersedia', 450, 4.9),
('CRB-BTK-014', 'Kain Batik Wadasan', 'Batik Cirebon', 220000.00, 12, 'Kain batik tulis katun primissima halus ukuran 2x1 m bermotif Wadasan khas Cirebon dengan pola ornamen menyerupai susunan batu karang serta perpaduan warna tradisional yang melambangkan keteguhan, kekuatan, dan keagungan budaya Keraton Cirebon.', 'Sanggar Batik Keraton Kasepuhan', 'Desa Trusmi Kulon', 'kainbatik_tulis_katun_primissima_ea7346d3.jpeg', 'Tersedia', 95, 4.9),
('CRB-BTK-015', 'Kain Batik Singa Barong', 'Batik Cirebon', 275000.00, 10, 'Kain batik tulis katun primissima halus ukuran 2x1 m bermotif Singa Barong khas Cirebon dengan perpaduan ornamen singa, naga, dan gajah serta warna-warna khas yang mencerminkan kekuatan, keberanian, dan kemegahan budaya Keraton Cirebon.', 'Sentra Batik Warisan Cirebon', 'Desa Trusmi Wetan', 'batik_singa_barong_50097582.jpeg', 'Tersedia', 110, 5.0),
('CRB-BTK-016', 'Kain Batik Paksi Naga Liman', 'Batik Cirebon', 295000.00, 8, 'Kain batik tulis katun primissima halus ukuran 2x1 m bermotif Paksi Naga Liman khas Cirebon dengan perpaduan ornamen burung garuda, naga, dan gajah serta kombinasi warna khas yang melambangkan kekuatan, kebijaksanaan, dan kemegahan budaya Keraton Cirebon.', 'Perajin Batik Pusaka Kanoman', 'Desa Kanoman', 'batik_paksi_naga_liman_2aa77802.jpeg', 'Tersedia', 84, 5.0),
('CRB-KRY-017', 'Ukiran Kayu Cirebon', 'Kerajinan Tangan', 380000.00, 8, 'Kerajinan ukiran berbahan kayu dengan motif kaligrafi, dedaunan, hewan, dan ornamen tradisional.', 'Sanggar Seni Ukir Gegesik', 'Desa Gegesik', 'ukiran_kayu_cirebon_12170d16.jpeg', 'Tersedia', 62, 4.9),
('CRB-KRY-018', 'Lukisan Kaca Cirebon', 'Kerajinan Tangan', 275000.00, 12, 'Lukisan yang dibuat pada media kaca dengan motif Mega Mendung, wayang, kaligrafi, dan ornamen khas Keraton Cirebon.', 'Sanggar Lukis Kaca Rastika', 'Desa Gegesik Kulon', 'lukisan_kaca_cirebon_69f8d797.jpeg', 'Tersedia', 90, 5.0),
('CRB-KRY-019', 'Topeng Kayu Cirebon', 'Kerajinan Tangan', 190000.00, 15, 'Kerajinan topeng berbahan kayu yang menggambarkan karakter Tari Topeng Cirebon, seperti Panji, Samba, Rumyang, Tumenggung, dan Kelana.', 'Sanggar Topeng Slangit', 'Desa Slangit', 'topeng_kayu_cirebon_0d0818fb.jpeg', 'Tersedia', 145, 5.0),
('CRB-AKS-020', 'Gantungan Kunci Topeng', 'Aksesoris', 15000.00, 60, 'Suvenir berbentuk miniatur topeng tradisional Cirebon yang cocok dijadikan buah tangan.', 'Pengrajin Souvenir Slangit', 'Desa Slangit', 'gantungan_kunci_topeng_41eb381c.jpeg', 'Tersedia', 320, 4.9),
('CRB-AKS-021', 'Blangkon Cirebon', 'Aksesoris', 45000.00, 25, 'blangkon / ikat kepala batik merupakan aksesori tradisional berbahan kain batik yang dapat digunakan sebagai pelengkap pakaian adat maupun aksesori sehari-hari. Memiliki desain praktis dengan ikatan yang mudah disesuaikan serta tersedia dalam berbagai pilihan motif dan warna batik khas Cirebon yang unik dan menarik.', 'Sentra Busana Adat Trusmi', 'Desa Trusmi Kulon', 'blangkon_cirebon_ef3da5c3.jpeg', 'Tersedia', 210, 5.0);

-- 5. Insert Homestay & Hotel Nyata di Cirebon (Divisi Homestay & Akomodasi)
INSERT INTO `homestay` (`nama_homestay`, `tipe_kamar`, `kapasitas_tamu`, `harga_per_malam`, `fasilitas`, `lokasi`, `jarak_pusat`, `foto`, `nama_pemilik`, `kontak_pemilik`, `status_kamar`) VALUES
('Aston Cirebon Hotel & Convention Center', 'Superior Double / Deluxe Twin', 2, 785000.00, 'Kolam Renang Resort, Mini Zoo, Spa & Fitness, Restoran Oasis, WiFi Cepat, Parkir Luas', 'Kedawung, Cirebon', '10 menit dari Stasiun Cirebon & Pusat Kota', 'Aston_Cirebon_Hotel___Convention_Center_bc159b08.jfif', 'Manajemen Aston Archipelago', '0231-8298000', 'Tersedia'),
('The Luxton Cirebon Hotel & Convention', 'Deluxe City View / Executive', 2, 720000.00, 'Rooftop Pool, Sky Lounge View Gn Ciremai, Sauna & Gym, Restoran X.O Suki, WiFi Kencang', 'Kejaksan, Kota Cirebon', '5 menit dari Stasiun Cirebon Kejaksan', 'hotel_luxton_5af33765.jpg', 'Manajemen The Luxton Hotel', '0231-8338888', 'Tersedia'),
('Hotel Santika Cirebon', 'Superior Double / Deluxe King', 2, 590000.00, 'Kolam Renang Teduh Asri, Tamansari Restaurant, Sarapan Nasi Lengko & Empal Gentong, Gym, Parkir Lega', 'Kejaksan, Kota Cirebon', '3 menit ke sentra kuliner Wahidin & Kejaksan', 'hotel_santika_6375e40f.jpeg', 'Santika Indonesia Hotels & Resorts', '0231-200570', 'Tersedia'),
('Grage Grand Business Hotel Cirebon', 'Business Executive / Grand Superior', 2, 535000.00, 'Kolam Renang Semi-Olympic Indah, Lily Cafe, Akses Langsung Grage Mall, Spa & Sauna, WiFi Kencang', 'Kejaksan, Kota Cirebon', 'Terhubung langsung dengan Grage Mall Cirebon', 'Grage_Grand_Business_Hotel_Cirebon_36ef2fea.jpg', 'Grage Group Cirebon', '0231-222999', 'Tersedia'),
('Hotel Asri Cirebon', 'Standard Deluxe / Superior Double', 2, 385000.00, 'Kolam Renang Terbuka, Teras Berjemur, Sentra Niaga Karanggetas, AC Dingin, WiFi Gratis, Parkir Aman', 'Panjunan, Lemahwungkuk, Cirebon', 'Langkah kaki ke Sentra Pasar Pagi & Pecinan', 'hotel_asri_be036608.jpg', 'Manajemen Hotel Asri', '0231-210166', 'Tersedia'),
('De Hanami Homestay Cirebon', 'Deluxe Private Balcony / 1 Unit Rumah', 4, 285000.00, 'Garasi Berpagar, Balkon Santai Luas, Dapur Bersama Lengkap, AC di Setiap Kamar, Smart TV, WiFi Kencang', 'Tuparev / Ciremai Raya, Cirebon', '7 menit ke Keraton Kasepuhan & Sentra Batik Trusmi', 'De_Hanami_Homestay_7dc9158a.jpg', 'Ibu Hanami', '0812-3488-9901', 'Tersedia'),
('Rumah Suka Guest House Cirebon', 'Cozy Double Room / Twin Comfort', 2, 245000.00, 'Taman Depan Asri & Bersih, Parkir Halaman Lega, Kamar Mandi Dalam Air Hangat, AC Dingin, WiFi Gratis', 'Kesambi, Kota Cirebon', '6 menit ke Stasiun Parujakan & CSB Mall', 'rumah_suka_cirebon_3a87a831.webp', 'Bapak Sukardi', '0818-0922-4411', 'Tersedia');

-- 6. Insert Data Reservasi Booking Tamu
INSERT INTO `booking` (`booking_code`, `homestay_id`, `nama_tamu`, `asal_kota`, `kontak`, `tgl_checkin`, `tgl_checkout`, `durasi_malam`, `jumlah_tamu`, `total_biaya`, `status_transaksi`) VALUES
('#BK-2025-081', 1, 'Budi Santoso', 'DKI Jakarta', '0812-9988-1209', '2025-11-12', '2025-11-14', 2, 2, 1570000.00, 'Terkonfirmasi'),
('#BK-2025-082', 2, 'Sarah Wijaya', 'Kota Bandung', '0857-1122-3490', '2025-11-15', '2025-11-16', 1, 2, 720000.00, 'Menunggu Pembayaran'),
('#BK-2025-083', 6, 'Rian Pratama', 'Surabaya', '0813-8890-4411', '2025-11-18', '2025-11-20', 2, 4, 570000.00, 'Terkonfirmasi');

-- 7. Insert Ulasan & Rating Bintang
INSERT INTO `ulasan` (`homestay_id`, `nama_pengulas`, `rating_bintang`, `komentar`, `status_moderasi`) VALUES
(1, 'Hendro Prasetyo', 5, 'Sangat recommended untuk liburan keluarga! Anak-anak sangat senang bermain di mini zoo dan kolam renang tropisnya. Sarapannya lengkap dari empal gentong sampai pastry enak. Pelayanan staf luar biasa ramah.', 'Disetujui'),
(2, 'Dina Marlina', 5, 'Rooftop swimming pool-nya luar biasa indah dengan view langsung Gunung Ciremai! Kamar sangat bersih, kasur empuk, dan dekat sekali dari stasiun Kejaksan.', 'Disetujui'),
(6, 'Ahmad Fauzi', 5, 'Homestay sangat bersih, nyaman, dan lingkungan perumahan tenang. Balkon lantai 2 enak buat ngopi sore. Pemilik Bu Hanami sangat ramah dan responsif. Cocok bawa rombongan keluarga.', 'Disetujui'),
(3, 'Ratna Dewi', 5, 'Suasana asri dan sejuk di tengah kota. Menu sarapannya juara, nasi jamblang dan empal gentongnya otentik Cirebon banget!', 'Disetujui');
