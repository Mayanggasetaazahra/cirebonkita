<?php
/**
 * ====================================================================
 * CONTROLLER ADMIN UTAMA (AdminController.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Berfungsi sebagai hub sentral Dashboard Administrator.
 * 2. Mengumpulkan KPI gabungan dari Wisata, UMKM, dan Homestay.
 * 3. Mengarahkan submenu navigasi admin berdasarkan penanggung jawab modul kelompok.
 * ====================================================================
 */

require_once '../app/core/Controller.php';
require_once '../app/core/Auth.php';

class AdminController extends Controller {

    public function index() {
        Auth::guard();

        $wisataModel = $this->model('Wisata');
        $umkmModel = $this->model('Umkm');
        $homestayModel = $this->model('Homestay');

        $data = [
            'judul' => 'Dashboard Overview - CirebonKita Panel Admin Tim Pengembang CirebonKita',
            'user' => Auth::user(),
            'kpiWisata' => $wisataModel->getKPIWisata(),
            'kpiUmkm' => $umkmModel->getKPIUmkm(),
            'kpiHomestay' => $homestayModel->getKPIHomestay(),
            'recentBookings' => $homestayModel->getAllBooking(),
            'recentWisata' => $wisataModel->getAllWisata()
        ];

        $this->view('admin/dashboard', $data);
    }
}
