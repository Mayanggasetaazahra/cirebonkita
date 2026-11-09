<?php
/**
 * ====================================================================
 * CONTROLLER PRODUK UMKM (UmkmController.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Logika CRUD produk UMKM desa cirebon (Batik, Kuliner, Anyaman, Aksesoris).
 * 2. Menyediakan endpoint AJAX liveSearch() untuk pencarian instan tanpa refresh halaman.
 * 3. Fitur sorting harga termurah/termahal, filter rentang harga, dan ekspor data CSV.
 * ====================================================================
 */

require_once '../app/core/Controller.php';
require_once '../app/core/Auth.php';

class UmkmController extends Controller {

    /**
     * Katalog Produk UMKM Publik
     */
    public function index() {
        $umkmModel = $this->model('Umkm');
        $kategori = $_GET['kategori'] ?? null;
        $keyword = $_GET['cari'] ?? null;
        $sort = $_GET['sort'] ?? 'terbaru';
        $maxPrice = $_GET['max_price'] ?? null;

        $data = [
            'judul' => 'Katalog Produk UMKM Cirebon - CirebonKita',
            'umkmList' => $umkmModel->getAllUmkm($kategori, $keyword, $sort, $maxPrice),
            'kategoriAktif' => $kategori ?? 'Semua Kategori',
            'sortAktif' => $sort,
            'maxPriceAktif' => $maxPrice ?? 200000
        ];

        $this->view('layouts/header', $data);
        $this->view('public/katalog_umkm', $data);
        $this->view('layouts/footer');
    }

    /**
     * Detail Produk UMKM
     */
    public function detail($id = null) {
        if (!$id) {
            $this->redirect('umkm');
        }

        $umkmModel = $this->model('Umkm');
        $produk = $umkmModel->getUmkmById($id);

        if (!$produk) {
            $this->view('errors/404');
            return;
        }

        $data = [
            'judul' => $produk['nama_produk'] . ' - CirebonKita',
            'produk' => $produk
        ];

        $this->view('layouts/header', $data);
        $this->view('public/detail_umkm', $data);
        $this->view('layouts/footer');
    }

    /**
     * Endpoint API Live Search untuk AJAX Produk UMKM
     */
    public function liveSearch() {
        $keyword = $_GET['q'] ?? '';
        $kategori = $_GET['kategori'] ?? null;
        $sort = $_GET['sort'] ?? 'terbaru';

        $umkmModel = $this->model('Umkm');
        $hasil = $umkmModel->getAllUmkm($kategori, $keyword, $sort);

        $this->jsonResponse([
            'status' => 'success',
            'total' => count($hasil),
            'data' => $hasil
        ]);
    }

    /**
     * Panel Admin Kelola Produk UMKM
     */
    public function admin() {
        Auth::guard();
        $umkmModel = $this->model('Umkm');

        $kategori = $_GET['kategori'] ?? null;
        $keyword = $_GET['cari'] ?? null;
        $sort = $_GET['sort'] ?? 'terbaru';

        $data = [
            'judul' => 'Manajemen Inventori & Produk UMKM Cirebon',
            'user' => Auth::user(),
            'umkmList' => $umkmModel->getAllUmkm($kategori, $keyword, $sort),
            'kpi' => $umkmModel->getKPIUmkm(),
            'pengembang' => 'Divisi UMKM & Ekonomi Kreatif'
        ];

        $this->view('admin/umkm/index', $data);
    }

    /**
     * Form Tambah Produk Baru
     */
    public function create() {
        Auth::guard();
        $data = [
            'judul' => 'Tambah Produk UMKM Baru',
            'user' => Auth::user()
        ];
        $this->view('admin/umkm/create', $data);
    }

    /**
     * Simpan Produk UMKM Baru (POST)
     */
    public function simpan() {
        Auth::guard();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $umkmModel = $this->model('Umkm');
            $namaFoto = $this->handleUploadFoto($_FILES['foto'] ?? null);

            $data = [
                'kode_sku' => $this->sanitize($_POST['kode_sku'] ?? 'CRB-' . rand(100, 999)),
                'nama_produk' => $this->sanitize($_POST['nama_produk']),
                'kategori' => $this->sanitize($_POST['kategori']),
                'harga' => (float)$_POST['harga'],
                'stok' => (int)$_POST['stok'],
                'deskripsi' => $this->sanitize($_POST['deskripsi']),
                'mitra_pengrajin' => $this->sanitize($_POST['mitra_pengrajin']),
                'desa_asal' => $this->sanitize($_POST['desa_asal'])
            ];

            if ($umkmModel->tambahUmkm($data, $namaFoto) > 0) {
                Auth::setFlash('Berhasil!', 'Produk UMKM berhasil ditambahkan ke inventori.', 'success');
            } else {
                Auth::setFlash('Gagal!', 'Gagal menambahkan produk UMKM.', 'danger');
            }

            $this->redirect('umkm/admin');
        }
    }

    /**
     * Form Edit Produk
     */
    public function edit($id = null) {
        Auth::guard();
        $umkmModel = $this->model('Umkm');
        $produk = $umkmModel->getUmkmById($id);

        if (!$produk) {
            $this->redirect('umkm/admin');
        }

        $data = [
            'judul' => 'Edit Produk UMKM - ' . $produk['nama_produk'],
            'produk' => $produk,
            'user' => Auth::user()
        ];
        $this->view('admin/umkm/edit', $data);
    }

    /**
     * Update Produk (POST)
     */
    public function update() {
        Auth::guard();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $umkmModel = $this->model('Umkm');

            $namaFoto = null;
            if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
                $namaFoto = $this->handleUploadFoto($_FILES['foto']);
            }

            $data = [
                'id' => (int)$_POST['id'],
                'nama_produk' => $this->sanitize($_POST['nama_produk']),
                'kategori' => $this->sanitize($_POST['kategori']),
                'harga' => (float)$_POST['harga'],
                'stok' => (int)$_POST['stok'],
                'deskripsi' => $this->sanitize($_POST['deskripsi']),
                'mitra_pengrajin' => $this->sanitize($_POST['mitra_pengrajin']),
                'desa_asal' => $this->sanitize($_POST['desa_asal'])
            ];

            if ($umkmModel->updateUmkm($data, $namaFoto) >= 0) {
                Auth::setFlash('Berhasil!', 'Data produk UMKM berhasil diperbarui.', 'success');
            }

            $this->redirect('umkm/admin');
        }
    }

    /**
     * Hapus Produk (GET / POST)
     */
    public function hapus($id = null) {
        Auth::guard();
        if ($id) {
            $umkmModel = $this->model('Umkm');
            if ($umkmModel->hapusUmkm($id) > 0) {
                Auth::setFlash('Berhasil!', 'Produk UMKM berhasil dihapus.', 'success');
            }
        }
        $this->redirect('umkm/admin');
    }

    /**
     * Ekspor Data Produk UMKM ke CSV
     */
    public function exportCsv() {
        Auth::guard();
        $umkmModel = $this->model('Umkm');
        $produkList = $umkmModel->getAllUmkm();

        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=rekap_produk_umkm_cirebon_' . date('Ymd_His') . '.csv');

        $output = fopen('php://output', 'w');
        fputcsv($output, ['No', 'Kode SKU', 'Nama Produk', 'Kategori', 'Mitra Pengrajin', 'Desa', 'Harga Satuan', 'Stok', 'Status Stok']);

        $no = 1;
        foreach ($produkList as $item) {
            fputcsv($output, [
                $no++,
                $item['kode_sku'],
                $item['nama_produk'],
                $item['kategori'],
                $item['mitra_pengrajin'],
                $item['desa_asal'],
                $item['harga'],
                $item['stok'],
                $item['status_stok']
            ]);
        }
        fclose($output);
        exit();
    }

    /**
     * Sanitasi Keamanan File Upload Foto Produk
     */
    private function handleUploadFoto($file) {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return 'default_umkm.jpg';
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

        $newName = 'umkm_' . uniqid() . '.' . $fileExt;
        $destination = '../public/uploads/' . $newName;

        if (!is_dir('../public/uploads')) {
            mkdir('../public/uploads', 0755, true);
        }

        move_uploaded_file($tmpName, $destination);
        return $newName;
    }
}
