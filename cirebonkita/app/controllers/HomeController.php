<?php
/**
 * ====================================================================
 * CONTROLLER LANDING PAGE PUBLIK (HomeController.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Berfungsi sebagai data aggregator dari 3 Model: Wisata, Umkm, dan Homestay.
 * 2. Mengumpulkan produk unggulan UMKM, destinasi rekreasi populer, dan homestay warga.
 * 3. Menghitung statistik ringkasan portal (150+ Pengrajin UMKM, 18 Situs Bersejarah, 45+ Homestay).
 * ====================================================================
 */

require_once '../app/core/Controller.php';

class HomeController extends Controller {

    public function index() {
        $wisataModel = $this->model('Wisata');
        $umkmModel = $this->model('Umkm');
        $homestayModel = $this->model('Homestay');

        $data = [
            'judul' => 'CirebonKita - Portal Desa Wisata Mandiri Cirebon',
            'wisataList' => $wisataModel->getAllWisata(),
            'umkmList' => $umkmModel->getAllUmkm(null, null, 'terlaris'),
            'homestayList' => $homestayModel->getAllHomestay(),
            'ulasanList' => $homestayModel->getUlasan(null, 4),
            'stats' => [
                'pengrajin' => '150+',
                'situs' => '18',
                'homestay' => '45+'
            ]
        ];

        $this->view('layouts/header', $data);
        $this->view('public/home', $data);
        $this->view('layouts/footer');
    }
}
