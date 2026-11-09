<?php
/**
 * ====================================================================
 * BASE CONTROLLER (Controller.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Menjadi induk (parent class) bagi seluruh Controller dalam sistem MVC.
 * 2. Menyediakan fungsi view($view, $data) untuk mengirim data ke file View HTML.
 * 3. Menyediakan fungsi model($model) untuk menginisialisasi kelas Model terkait.
 * 4. Menyediakan utilitas redirect, jsonResponse untuk request AJAX/Fetch,
 *    dan pembersihan data anti XSS (Cross-Site Scripting).
 * ====================================================================
 */

class Controller {
    /**
     * Memuat file View dan mem-pass data array asosiatif
     * @param string $view Lokasi path file view relatif terhadap folder views/
     * @param array $data Data yang diekstrak untuk dirender pada HTML
     */
    public function view($view, $data = []) {
        // Ekstrak array $data menjadi variabel lokal ($data['judul'] -> $judul)
        if (!empty($data)) {
            extract($data);
        }

        $viewPath = '../app/views/' . $view . '.php';

        if (file_exists($viewPath)) {
            require_once $viewPath;
        } else {
            // Tampilkan halaman error 404 jika view tidak ditemukan
            require_once '../app/views/errors/404.php';
        }
    }

    /**
     * Menginstansiasi objek Model yang diminta
     * @param string $model Nama kelas Model
     * @return object Objek model siap pakai
     */
    public function model($model) {
        $modelPath = '../app/models/' . $model . '.php';
        if (file_exists($modelPath)) {
            require_once $modelPath;
            return new $model();
        }
        die("Model {$model} tidak ditemukan.");
    }

    /**
     * Fungsi Helper Pengalihan Halaman (Redirect)
     * @param string $url Alamat tujuan
     */
    public function redirect($url) {
        header('Location: ' . BASEURL . '/' . ltrim($url, '/'));
        exit();
    }

    /**
     * Fungsi Helper Respon JSON untuk AJAX/Live Search
     * @param mixed $data Data yang akan di-encode ke JSON
     * @param int $statusCode Kode status HTTP
     */
    public function jsonResponse($data, $statusCode = 200) {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data);
        exit();
    }

    /**
     * Sanitasi input teks dari karakter berbahaya XSS
     * @param string $input
     * @return string
     */
    public function sanitize($input) {
        return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
    }
}
