# CirebonKita: Portal Desa Wisata Mandiri Cirebon
> **Sistem Informasi Smart Tourism & Pariwisata Daerah Berbasis Native PHP (Pure MVC) & MySQL PDO**

Sektor Pariwisata & Smart Tourism Daerah Cirebon

---

### Struktur Modul & Tanggung Jawab Pengelolaan
1. **Divisi Wisata & Tiket**
   - **Modul**: CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
   - **Fitur**: Galeri foto responsif CSS Grid, filter kategori interaktif (Keraton, Situs Cagar Budaya, Religi, Alam), kontrol kuota harian tiket, log validasi tiket pintu masuk real-time, proporsi kunjungan chart.
2. **Divisi UMKM & Ekonomi Kreatif**
   - **Modul**: CRUD Produk Kerajinan & Kuliner UMKM Lokal
   - **Fitur**: Katalog produk digital, live search pencarian instan tanpa refresh, sorting harga (termurah/termahal/terlaris), filter rentang harga slider, pemantauan stok menipis (<= 10 pcs alert), ekspor data CSV inventori.
3. **Divisi Homestay & Akomodasi**
   - **Modul**: CRUD Booking Homestay & Moderasi Ulasan
   - **Fitur**: Datepicker tanggal inap interaktif, kalkulasi otomatis durasi malam dan total biaya menginap, formulir penilaian rating bintang (1-5 bintang), moderasi ulasan publik.

---

### 4 Pilar Indikator Evaluasi & Keamanan Siber
1. **Desain Antarmuka (HTML5 + CSS3 + JS)**
   - Menggunakan palet warna khas pesisir Cirebon: *Hijau Teal* (`#004C6D` / `#024B35`), *Deep Navy* (`#002B36`), dan *Cream Warm* (`#F8F9FA`).
   - Fully Responsive dengan breakpoint desktop, tablet, dan mobile.
   - Interaksi murni Vanilla JS tanpa jQuery.
2. **Arsitektur MVC (Model-View-Controller) Murni Tanpa Framework**
   - **Model (`app/models/`)**: Hanya menjalankan kueri SQL menggunakan PDO Prepared Statements.
   - **View (`app/views/`)**: Hanya bertanggung jawab me-render tampilan antarmuka HTML/CSS/JS.
   - **Controller (`app/controllers/`)**: Mengatur alur logika bisnis, validasi input, dan komunikasi antara Model dan View.
3. **Keamanan Siber Web**
   - **SQL Injection Prevention**: 100% kueri database menggunakan `PDO::prepare()` dengan named parameter binding (`:param`).
   - **XSS (Cross-Site Scripting) Prevention**: Seluruh output dinamis dari database di-escape menggunakan fungsi pembantu `htmlspecialchars()`.
   - **Session Security**: `session_start()` dengan cookie `httponly`, proteksi middleware `Auth::guard()`, dan `session_regenerate_id(true)` saat proses login untuk mencegah Session Fixation.
   - **Password Hashing**: Menggunakan fungsi bawaan PHP standar industri `password_hash($password, PASSWORD_BCRYPT)` dan diverifikasi dengan `password_verify()`.
   - **File Upload Sanitasi**: Validasi ekstensi file (`jpg`, `jpeg`, `png`, `webp`), batas ukuran maksimal 2MB, dan penggantian nama file secara acak menggunakan `uniqid()`.

---

### Panduan Instalasi Lokal (XAMPP / Laragon)
1. **Salin Folder Proyek**
   - Letakkan folder `cirebonkita` ke dalam direktori root web server lokal:
     - XAMPP: `C:/xampp/htdocs/cirebonkita`
     - Laragon: `C:/laragon/www/cirebonkita`
2. **Import Database MySQL**
   - Buka `http://localhost/phpmyadmin`
   - Buat database baru bernama: `cirebonkita`
   - Buka menu **Import**, pilih file `database.sql`, lalu klik **Kirim / Go**.
3. **Konfigurasi Database**
   - Buka file `app/config/Database.php`
   - Sesuaikan konfigurasi username dan password MySQL Anda (secara default `root` tanpa password).
4. **Jalankan Aplikasi**
   - Akses melalui browser: `http://localhost/cirebonkita/public`
   - Akun Login Default Panel Admin:
     - **Username**: `admin`
     - **Password**: `admin123`

---

### Struktur Direktori Proyek
```text
cirebonkita/
│
├── public/                      <-- Document Root Web Server
│   ├── index.php                <-- Front Router
│   ├── .htaccess                <-- Clean URL Rewriting
│   ├── assets/
│   │   ├── css/style.css        <-- CSS Utama
│   │   ├── js/script.js         <-- JS Interaktif
│   │   └── img/                 <-- Foto Statis
│   └── uploads/                 <-- Direktori Upload Foto
│
├── app/
│   ├── config/Database.php      <-- Koneksi Database PDO
│   ├── core/
│   │   ├── App.php              <-- Core Router & Dispatcher
│   │   ├── Controller.php       <-- Base Controller
│   │   └── Auth.php             <-- Middleware Keamanan & Auth Guard
│   ├── models/
│   │   ├── User.php             <-- Model Otentikasi Admin
│   │   ├── Wisata.php           <-- [Imam] CRUD Wisata & Tiket
│   │   ├── Umkm.php             <-- [Nasywa] CRUD Produk UMKM
│   │   └── Homestay.php         <-- [Siti] CRUD Homestay & Ulasan
│   ├── controllers/
│   │   ├── AuthController.php   <-- Login & Logout Session
│   │   ├── HomeController.php   <-- Aggregator Landing Page
│   │   ├── WisataController.php <-- Logika Wisata & Upload
│   │   ├── UmkmController.php   <-- Logika UMKM & Live Search
│   │   └── HomestayController.php <-- Logika Homestay & Booking
│   └── views/
│       ├── layouts/             <-- header.php & footer.php
│       ├── auth/                <-- login.php
│       ├── public/              <-- home.php, katalog_wisata.php, dll
│       ├── admin/               <-- dashboard.php, wisata/, umkm/, homestay/
│       └── errors/              <-- 404.php
│
├── database.sql                 <-- Skema MySQL & Data Dummy
└── README.md                    <-- Dokumentasi Teknis
```

---

### Panduan Tanya Jawab Saat Ujian Lisan Mandiri
- **Bagaimana alur kerja MVC saat user membuka halaman `/wisata`?**
  1. Apache membaca `.htaccess` dan mengarahkan URL ke `public/index.php?url=wisata`.
  2. `App.php` mem-parsing URL: menentukan Controller yang dipanggil adalah `WisataController` dan default method adalah `index()`.
  3. `WisataController::index()` meminta data dari model `Wisata::getAllWisata()`.
  4. Model `Wisata.php` menjalankan kueri PDO prepared statement ke MySQL dan mengembalikan data array asosiatif.
  5. Controller memanggil `this->view('public/katalog_wisata', $data)` untuk merender data ke HTML bagi wisatawan.
- **Mengapa aplikasi ini aman dari SQL Injection?**
  Karena seluruh masukan pengguna tidak digabungkan langsung ke string query (`WHERE id = " . $id`), melainkan di-bind melalui PDO Prepared Statement (`$this->db->bind(':id', $id)`). Server database memisahkan tahap kompilasi struktur SQL dan parsing data.
- **Mengapa aplikasi ini aman dari XSS?**
  Karena setiap variabel data yang dicetak pada file view selalu diapit fungsi `htmlspecialchars($variabel, ENT_QUOTES, 'UTF-8')` sehingga karakter kurung siku `<script>` akan diubah menjadi entitas aman `&lt;script&gt;`.
