export interface PhpFileRecord {
  path: string;
  category: 'config' | 'core' | 'model' | 'controller' | 'view' | 'public' | 'database';
  title: string;
  developer?: string;
  examExplanation: string;
  code: string;
}

export const phpProjectFiles: PhpFileRecord[] = [
  {
    path: 'database.sql',
    category: 'database',
    title: 'database.sql (Skema & Seeding Data MySQL)',
    developer: 'Tim Pengembang CirebonKita',
    examExplanation: 'Mendefinisikan 7 tabel relasional (users, wisata, tiket, umkm, homestay, booking, ulasan) dengan tipe data presisi, Foreign Keys, dan data seeding awal.',
    code: `-- ====================================================================
-- SISTEM INFORMASI DESA WISATA MANDIRI CIREBON (CIREBONKITA)
-- Tim Pengembang Portal Pariwisata Terpadu
-- ====================================================================

CREATE DATABASE IF NOT EXISTS \`cirebonkita\` DEFAULT CHARACTER SET utf8mb4;
USE \`cirebonkita\`;

CREATE TABLE \`users\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_lengkap\` VARCHAR(100) NOT NULL,
  \`username\` VARCHAR(50) NOT NULL UNIQUE,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('admin', 'pengelola_wisata', 'pengelola_umkm', 'pengelola_homestay') DEFAULT 'admin',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE \`wisata\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_wisata\` VARCHAR(150) NOT NULL,
  \`kategori\` ENUM('Keraton & Sejarah', 'Situs Cagar Budaya', 'Wisata Religi', 'Wisata Alam & Rekreasi') NOT NULL,
  \`harga_tiket\` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  \`deskripsi\` TEXT NOT NULL,
  \`kuota_harian\` INT NOT NULL DEFAULT 100,
  \`kuota_terisi\` INT NOT NULL DEFAULT 0,
  \`foto\` VARCHAR(255) NOT NULL,
  \`lokasi\` VARCHAR(200) NOT NULL,
  \`jam_buka\` VARCHAR(50) DEFAULT '08:00 - 17:00 WIB',
  \`fasilitas\` VARCHAR(255) DEFAULT 'Pemandu, Parkir, Musholla',
  \`status_operasional\` ENUM('Buka (Aktif)', 'Tutup Sementara', 'Pemeliharaan Spot') DEFAULT 'Buka (Aktif)'
);

CREATE TABLE \`tiket\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`kode_tiket\` VARCHAR(50) NOT NULL UNIQUE,
  \`wisata_id\` INT NOT NULL,
  \`nama_pengunjung\` VARCHAR(100) NOT NULL,
  \`kontak\` VARCHAR(30) NOT NULL,
  \`tanggal_kunjungan\` DATE NOT NULL,
  \`jumlah_tiket\` INT NOT NULL DEFAULT 1,
  \`total_bayar\` DECIMAL(10,2) NOT NULL,
  \`status_validasi\` ENUM('Terverifikasi', 'Belum Digunakan', 'Kadaluarsa') DEFAULT 'Terverifikasi',
  CONSTRAINT \`fk_tiket_wisata\` FOREIGN KEY (\`wisata_id\`) REFERENCES \`wisata\` (\`id\`) ON DELETE CASCADE
);

CREATE TABLE \`umkm\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`kode_sku\` VARCHAR(30) NOT NULL UNIQUE,
  \`nama_produk\` VARCHAR(150) NOT NULL,
  \`kategori\` ENUM('Batik Cirebon', 'Kuliner Khas', 'Kerajinan Tangan', 'Aksesoris') NOT NULL,
  \`harga\` DECIMAL(10,2) NOT NULL,
  \`stok\` INT NOT NULL DEFAULT 0,
  \`deskripsi\` TEXT NOT NULL,
  \`mitra_pengrajin\` VARCHAR(120) NOT NULL,
  \`desa_asal\` VARCHAR(100) NOT NULL,
  \`foto\` VARCHAR(255) NOT NULL,
  \`status_stok\` ENUM('Tersedia', 'Stok Menipis', 'Kritis', 'Habis') DEFAULT 'Tersedia'
);

CREATE TABLE \`homestay\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`nama_homestay\` VARCHAR(150) NOT NULL,
  \`tipe_kamar\` VARCHAR(100) NOT NULL,
  \`kapasitas_tamu\` INT NOT NULL DEFAULT 2,
  \`harga_per_malam\` DECIMAL(10,2) NOT NULL,
  \`fasilitas\` VARCHAR(255) NOT NULL,
  \`lokasi\` VARCHAR(200) NOT NULL,
  \`jarak_pusat\` VARCHAR(100) DEFAULT 'Dekat Sentra Wisata',
  \`foto\` VARCHAR(255) NOT NULL,
  \`nama_pemilik\` VARCHAR(100) NOT NULL,
  \`kontak_pemilik\` VARCHAR(30) NOT NULL,
  \`status_kamar\` ENUM('Tersedia', 'Penuh', 'Renovasi') DEFAULT 'Tersedia'
);

CREATE TABLE \`booking\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`booking_code\` VARCHAR(50) NOT NULL UNIQUE,
  \`homestay_id\` INT NOT NULL,
  \`nama_tamu\` VARCHAR(100) NOT NULL,
  \`asal_kota\` VARCHAR(100) DEFAULT 'Cirebon',
  \`kontak\` VARCHAR(30) NOT NULL,
  \`tgl_checkin\` DATE NOT NULL,
  \`tgl_checkout\` DATE NOT NULL,
  \`durasi_malam\` INT NOT NULL,
  \`jumlah_tamu\` INT NOT NULL DEFAULT 2,
  \`total_biaya\` DECIMAL(10,2) NOT NULL,
  \`status_transaksi\` ENUM('Terkonfirmasi', 'Menunggu Pembayaran', 'Selesai', 'Batal') DEFAULT 'Terkonfirmasi',
  CONSTRAINT \`fk_booking_homestay\` FOREIGN KEY (\`homestay_id\`) REFERENCES \`homestay\` (\`id\`) ON DELETE CASCADE
);

CREATE TABLE \`ulasan\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`homestay_id\` INT NOT NULL,
  \`nama_pengulas\` VARCHAR(100) NOT NULL,
  \`rating_bintang\` INT NOT NULL CHECK (\`rating_bintang\` BETWEEN 1 AND 5),
  \`komentar\` TEXT NOT NULL,
  \`status_moderasi\` ENUM('Disetujui', 'Menunggu Moderasi', 'Ditolak') DEFAULT 'Disetujui',
  CONSTRAINT \`fk_ulasan_homestay\` FOREIGN KEY (\`homestay_id\`) REFERENCES \`homestay\` (\`id\`) ON DELETE CASCADE
);`
  },
  {
    path: 'app/config/Database.php',
    category: 'config',
    title: 'Database.php (PDO Connection & Prepared Statements)',
    developer: 'Tim Pengembang CirebonKita',
    examExplanation: '100% Anti SQL Injection dengan PDO Prepared Statements via bindValue() dan PDO::ERRMODE_EXCEPTION.',
    code: `<?php
class Database {
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $db_name = "cirebonkita";
    private $dbh;
    private $stmt;

    public function __construct() {
        $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_PERSISTENT => true,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ];
        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            die("Koneksi Database Gagal: " . $e->getMessage());
        }
    }

    public function query($query) { $this->stmt = $this->dbh->prepare($query); }
    public function bind($param, $value, $type = null) {
        if (is_null($type)) {
            if (is_int($value)) $type = PDO::PARAM_INT;
            elseif (is_bool($value)) $type = PDO::PARAM_BOOL;
            elseif (is_null($value)) $type = PDO::PARAM_NULL;
            else $type = PDO::PARAM_STR;
        }
        $this->stmt->bindValue($param, $value, $type);
    }
    public function execute() { return $this->stmt->execute(); }
    public function resultSet() { $this->execute(); return $this->stmt->fetchAll(); }
    public function single() { $this->execute(); return $this->stmt->fetch(); }
    public function rowCount() { return $this->stmt->rowCount(); }
}`
  },
  {
    path: 'app/core/App.php',
    category: 'core',
    title: 'App.php (Core Front Router & URL Parser)',
    developer: 'Tim Pengembang CirebonKita',
    examExplanation: 'Memecah string URL menjadi [$controller, $method, $params] untuk memetakan route secara dinamis.',
    code: `<?php
class App {
    protected $controller = 'HomeController';
    protected $method = 'index';
    protected $params = [];

    public function __construct() {
        $url = $this->parseURL();

        if (!empty($url[0])) {
            $controllerName = ucfirst($url[0]) . 'Controller';
            if (file_exists('../app/controllers/' . $controllerName . '.php')) {
                $this->controller = $controllerName;
                unset($url[0]);
            } elseif (strtolower($url[0]) === 'admin') {
                $this->controller = 'AdminController';
                unset($url[0]);
            }
        }

        require_once '../app/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

        if (isset($url[1]) && method_exists($this->controller, $url[1])) {
            $this->method = $url[1];
            unset($url[1]);
        }

        $this->params = $url ? array_values($url) : [];
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    public function parseURL() {
        if (isset($_GET['url'])) {
            $url = rtrim($_GET['url'], '/');
            return explode('/', filter_var($url, FILTER_SANITIZE_URL));
        }
        return null;
    }
}`
  },
  {
    path: 'app/core/Auth.php',
    category: 'core',
    title: 'Auth.php (Session Security & Auth Guard Middleware)',
    developer: 'Tim Pengembang CirebonKita',
    examExplanation: 'Melindungi halaman admin dengan Auth::guard(), mencegah Session Fixation via session_regenerate_id(true).',
    code: `<?php
class Auth {
    public static function initSession() {
        if (session_status() === PHP_SESSION_NONE) {
            ini_set('session.cookie_httponly', 1);
            session_start();
        }
    }
    public static function check() {
        self::initSession();
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }
    public static function guard() {
        self::initSession();
        if (!self::check()) {
            self::setFlash('Akses Ditolak!', 'Silakan login terlebih dahulu.', 'danger');
            header('Location: ' . BASEURL . '/auth/login');
            exit();
        }
    }
    public static function login($user) {
        self::initSession();
        session_regenerate_id(true); // Anti session fixation
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['role'] = $user['role'];
    }
    public static function logout() {
        self::initSession();
        $_SESSION = [];
        session_destroy();
    }
}`
  },
  {
    path: 'app/models/Wisata.php',
    category: 'model',
    title: 'Wisata.php (Model Wisata & E-Tiket)',
    developer: 'Divisi Wisata & Tiket',
    examExplanation: 'CRUD lengkap data objek wisata cagar budaya, perhitungan persentase kuota harian terisi, dan pencatatan tiket masuk.',
    code: `<?php
require_once '../app/config/Database.php';

class Wisata {
    private $table = 'wisata';
    private $db;

    public function __construct() { $this->db = new Database(); }

    public function getAllWisata($kategori = null, $keyword = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
        if (!empty($kategori) && $kategori !== 'Semua') {
            $query .= " AND kategori = :kategori";
        }
        if (!empty($keyword)) {
            $query .= " AND (nama_wisata LIKE :kw OR deskripsi LIKE :kw)";
        }
        $query .= " ORDER BY id ASC";
        $this->db->query($query);
        if (!empty($kategori) && $kategori !== 'Semua') $this->db->bind(':kategori', $kategori);
        if (!empty($keyword)) $this->db->bind(':kw', "%$keyword%");
        return $this->db->resultSet();
    }

    public function getWisataById($id) {
        $this->db->query("SELECT * FROM " . $this->table . " WHERE id = :id");
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    public function tambahWisata($data, $fotoNama) {
        $query = "INSERT INTO " . $this->table . " (nama_wisata, kategori, harga_tiket, deskripsi, kuota_harian, foto, lokasi) 
                  VALUES (:nama, :kat, :harga, :desk, :kuota, :foto, :lokasi)";
        $this->db->query($query);
        $this->db->bind(':nama', $data['nama_wisata']);
        $this->db->bind(':kat', $data['kategori']);
        $this->db->bind(':harga', $data['harga_tiket']);
        $this->db->bind(':desk', $data['deskripsi']);
        $this->db->bind(':kuota', $data['kuota_harian']);
        $this->db->bind(':foto', $fotoNama);
        $this->db->bind(':lokasi', $data['lokasi']);
        $this->db->execute();
        return $this->db->rowCount();
    }
}`
  },
  {
    path: 'app/models/Umkm.php',
    category: 'model',
    title: 'Umkm.php (Model Inventori Produk UMKM)',
    developer: 'Divisi UMKM & Ekonomi Kreatif',
    examExplanation: 'CRUD inventori komoditas desa, sorting harga, filter kategori, live search, serta monitoring stok menipis (<= 10 pcs).',
    code: `<?php
require_once '../app/config/Database.php';

class Umkm {
    private $table = 'umkm';
    private $db;

    public function __construct() { $this->db = new Database(); }

    public function getAllUmkm($kategori = null, $keyword = null, $sort = 'terbaru', $maxPrice = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
        if (!empty($kategori) && $kategori !== 'Semua') {
            $query .= " AND kategori = :kategori";
        }
        if (!empty($keyword)) {
            $query .= " AND (nama_produk LIKE :kw OR mitra_pengrajin LIKE :kw)";
        }
        if (!empty($maxPrice)) {
            $query .= " AND harga <= :maxPrice";
        }
        if ($sort === 'termurah') $query .= " ORDER BY harga ASC";
        elseif ($sort === 'termahal') $query .= " ORDER BY harga DESC";
        else $query .= " ORDER BY id DESC";

        $this->db->query($query);
        if (!empty($kategori) && $kategori !== 'Semua') $this->db->bind(':kategori', $kategori);
        if (!empty($keyword)) $this->db->bind(':kw', "%$keyword%");
        if (!empty($maxPrice)) $this->db->bind(':maxPrice', $maxPrice);
        return $this->db->resultSet();
    }
}`
  },
  {
    path: 'app/models/Homestay.php',
    category: 'model',
    title: 'Homestay.php (Model Homestay, Booking & Ulasan)',
    developer: 'Divisi Homestay & Akomodasi',
    examExplanation: 'Kalkulasi selisih hari tanggal inap check-in/check-out dengan DateTime->diff(), hitung total tarif, dan agregasi rating bintang 1-5.',
    code: `<?php
require_once '../app/config/Database.php';

class Homestay {
    private $table = 'homestay';
    private $tableBooking = 'booking';
    private $tableUlasan = 'ulasan';
    private $db;

    public function __construct() { $this->db = new Database(); }

    public function buatBooking($data) {
        $d1 = new DateTime($data['tgl_checkin']);
        $d2 = new DateTime($data['tgl_checkout']);
        $durasi = max(1, (int)$d1->diff($d2)->days);

        $h = $this->getHomestayById($data['homestay_id']);
        $total = $durasi * (float)$h['harga_per_malam'];
        $code = '#BK-' . date('Y') . '-' . rand(100, 999);

        $query = "INSERT INTO " . $this->tableBooking . " 
                  (booking_code, homestay_id, nama_tamu, asal_kota, kontak, tgl_checkin, tgl_checkout, durasi_malam, total_biaya)
                  VALUES (:code, :hid, :nama, :asal, :kontak, :in, :out, :dur, :total)";
        $this->db->query($query);
        $this->db->bind(':code', $code);
        $this->db->bind(':hid', $data['homestay_id']);
        $this->db->bind(':nama', $data['nama_tamu']);
        $this->db->bind(':asal', $data['asal_kota']);
        $this->db->bind(':kontak', $data['kontak']);
        $this->db->bind(':in', $data['tgl_checkin']);
        $this->db->bind(':out', $data['tgl_checkout']);
        $this->db->bind(':dur', $durasi);
        $this->db->bind(':total', $total);
        $this->db->execute();
        return $code;
    }
}`
  }
];

export interface PhpFileEntry {
  name: string;
  path: string;
  category: string;
  description: string;
  developer: string;
  oralExamNote: string;
  content: string;
}

export const phpCodeFiles: PhpFileEntry[] = phpProjectFiles.map(f => ({
  name: f.path.split('/').pop() || f.path,
  path: f.path,
  category: f.category,
  description: f.title,
  developer: f.developer || 'Tim Pengembang CirebonKita',
  oralExamNote: f.examExplanation,
  content: f.code
}));
