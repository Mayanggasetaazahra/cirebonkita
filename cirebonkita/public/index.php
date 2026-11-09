<?php
/**
 * ====================================================================
 * FRONT ROUTER (index.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Sebagai pintu gerbang utama (Single Entry Point) seluruh request HTTP web.
 * 2. Menginisialisasi session dan konstanta BASEURL secara dinamis.
 * 3. Memuat file inti (Core MVC Framework): Database, Auth, Controller, dan App.
 * 4. Menjalankan router ($app = new App()) untuk mendistribusikan URL ke Controller.
 * ====================================================================
 */

// Aktifkan error reporting untuk kemudahan debugging saat pengembangan
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Deteksi BASEURL dinamis (mendukung localhost/cirebonkita/public maupun custom vhost)
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
$host = $_SERVER['HTTP_HOST'];
$scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
$baseUrl = rtrim($protocol . $host . $scriptDir, '/');

if (!defined('BASEURL')) {
    define('BASEURL', $baseUrl);
}

// Inisialisasi Sesi Pengguna
require_once '../app/core/Auth.php';
Auth::initSession();

// Muat Komponen Inti Arsitektur MVC
require_once '../app/config/Database.php';
require_once '../app/core/Controller.php';
require_once '../app/core/App.php';

// Eksekusi Front Controller Dispatcher
$app = new App();
