<?php
/**
 * ====================================================================
 * CONTROLLER WISATA & TIKET (WisataController.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Wisata & Tiket
 * Modul       : CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Logika CRUD lengkap (Create, Read, Update, Delete) destinasi wisata cagar budaya.
 * 2. Sanitasi & validasi upload file foto (Maks 2MB, ekstensi JPG, PNG, WEBP, uniqid()).
 * 3. Filter kategori interaktif berbasis AJAX maupun HTTP GET.
 * ====================================================================
 */

require_once '../app/core/Controller.php';
require_once '../app/core/Auth.php';

class WisataController extends Controller {

    /**
     * Tampilan Katalog Wisata Publik
     */
    public function index() {
        $wisataModel = $this->model('Wisata');
        $kategori = $_GET['kategori'] ?? null;
        $keyword = $_GET['cari'] ?? null;

        $data = [
            'judul' => 'Destinasi Wisata Cirebon - CirebonKita',
            'wisataList' => $wisataModel->getAllWisata($kategori, $keyword),
            'kategoriAktif' => $kategori ?? 'Semua'
        ];

        $this->view('layouts/header', $data);
        $this->view('public/katalog_wisata', $data);
        $this->view('layouts/footer');
    }

    /**
     * Detail Wisata Publik
     */
    public function detail($id = null) {
        if (!$id) {
            $this->redirect('wisata');
        }

        $wisataModel = $this->model('Wisata');
        $wisata = $wisataModel->getWisataById($id);

        if (!$wisata) {
            $this->view('errors/404');
            return;
        }

        $data = [
            'judul' => $wisata['nama_wisata'] . ' - CirebonKita',
            'wisata' => $wisata
        ];

        $this->view('layouts/header', $data);
        $this->view('public/detail_wisata', $data);
        $this->view('layouts/footer');
    }

    /**
     * Dashboard Admin Wisata (Kelola Destinasi & Tiket)
     */
    public function admin() {
        Auth::guard();
        $wisataModel = $this->model('Wisata');

        $kategori = $_GET['kategori'] ?? null;
        $keyword = $_GET['cari'] ?? null;

        $data = [
            'judul' => 'Manajemen Destinasi Wisata & Tiket Rekreasi',
            'user' => Auth::user(),
            'wisataList' => $wisataModel->getAllWisata($kategori, $keyword),
            'kpi' => $wisataModel->getKPIWisata(),
            'tiketTerbaru' => $wisataModel->getTiketTerbaru(5),
            'pengembang' => 'Divisi Wisata & Tiket'
        ];

        $this->view('admin/wisata/index', $data);
    }

    /**
     * Form Tambah Wisata (Admin)
     */
    public function create() {
        Auth::guard();
        $data = [
            'judul' => 'Tambah Destinasi Wisata Baru',
            'user' => Auth::user()
        ];
        $this->view('admin/wisata/create', $data);
    }

    /**
     * Proses Simpan Wisata Baru (POST)
     */
    public function simpan() {
        Auth::guard();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $wisataModel = $this->model('Wisata');

            // Sanitasi upload file foto
            $namaFoto = $this->handleUploadFoto($_FILES['foto'] ?? null);

            $data = [
                'nama_wisata' => $this->sanitize($_POST['nama_wisata']),
                'kategori' => $this->sanitize($_POST['kategori']),
                'harga_tiket' => (float)$_POST['harga_tiket'],
                'deskripsi' => $this->sanitize($_POST['deskripsi']),
                'kuota_harian' => (int)$_POST['kuota_harian'],
                'lokasi' => $this->sanitize($_POST['lokasi']),
                'jam_buka' => $this->sanitize($_POST['jam_buka']),
                'fasilitas' => $this->sanitize($_POST['fasilitas']),
                'status_operasional' => $this->sanitize($_POST['status_operasional'])
            ];

            if ($wisataModel->tambahWisata($data, $namaFoto) > 0) {
                Auth::setFlash('Berhasil!', 'Destinasi wisata baru berhasil ditambahkan.', 'success');
            } else {
                Auth::setFlash('Gagal!', 'Terjadi kesalahan saat menambahkan destinasi.', 'danger');
            }

            $this->redirect('wisata/admin');
        }
    }

    /**
     * Form Edit Wisata (Admin)
     */
    public function edit($id = null) {
        Auth::guard();
        $wisataModel = $this->model('Wisata');
        $wisata = $wisataModel->getWisataById($id);

        if (!$wisata) {
            $this->redirect('wisata/admin');
        }

        $data = [
            'judul' => 'Edit Destinasi Wisata - ' . $wisata['nama_wisata'],
            'wisata' => $wisata,
            'user' => Auth::user()
        ];
        $this->view('admin/wisata/edit', $data);
    }

    /**
     * Proses Update Wisata (POST)
     */
    public function update() {
        Auth::guard();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $wisataModel = $this->model('Wisata');

            $namaFoto = null;
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
                $namaFoto = $this->handleUploadFoto($_FILES['foto']);
            }

            $data = [
                'id' => (int)$_POST['id'],
                'nama_wisata' => $this->sanitize($_POST['nama_wisata']),
                'kategori' => $this->sanitize($_POST['kategori']),
                'harga_tiket' => (float)$_POST['harga_tiket'],
                'deskripsi' => $this->sanitize($_POST['deskripsi']),
                'kuota_harian' => (int)$_POST['kuota_harian'],
                'lokasi' => $this->sanitize($_POST['lokasi']),
                'jam_buka' => $this->sanitize($_POST['jam_buka']),
                'fasilitas' => $this->sanitize($_POST['fasilitas']),
                'status_operasional' => $this->sanitize($_POST['status_operasional'])
            ];

            if ($wisataModel->updateWisata($data, $namaFoto) >= 0) {
                Auth::setFlash('Berhasil!', 'Data wisata berhasil diperbarui.', 'success');
            }

            $this->redirect('wisata/admin');
        }
    }

    /**
     * Proses Hapus Wisata (POST / GET)
     */
    public function hapus($id = null) {
        Auth::guard();
        if ($id) {
            $wisataModel = $this->model('Wisata');
            if ($wisataModel->hapusWisata($id) > 0) {
                Auth::setFlash('Berhasil!', 'Destinasi wisata berhasil dihapus.', 'success');
            }
        }
        $this->redirect('wisata/admin');
    }

    /**
     * Sanitasi Keamanan File Upload
     * Batasan: Maks 2MB, Ekstensi jpg/jpeg/png/webp, Rename dengan uniqid()
     */
    private function handleUploadFoto($file) {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return 'default_wisata.jpg';
        }

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
        $maxSize = 2 * 1024 * 1024; // 2 Megabyte

        $fileName = $file['name'];
        $fileSize = $file['size'];
        $tmpName  = $file['tmp_name'];
        $fileExt  = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedExt)) {
            die("Error: Format file tidak didukung! Hanya JPG, JPEG, PNG, dan WEBP yang diizinkan.");
        }

        if ($fileSize > $maxSize) {
            die("Error: Ukuran file melebihi batas maksimal 2MB!");
        }

        // Generate nama file acak unik untuk mencegah eksekusi file berbahaya
        $newName = 'wisata_' . uniqid() . '.' . $fileExt;
        $destination = '../public/uploads/' . $newName;

        if (!is_dir('../public/uploads')) {
            mkdir('../public/uploads', 0755, true);
        }

        move_uploaded_file($tmpName, $destination);
        return $newName;
    }
}
