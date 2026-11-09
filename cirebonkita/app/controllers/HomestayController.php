<?php
/**
 * ====================================================================
 * CONTROLLER HOMESTAY & ULASAN (HomestayController.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Homestay & Akomodasi
 * Modul       : CRUD Booking Homestay & Moderasi Ulasan
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Logika reservasi kamar homestay dengan kalkulasi otomatis durasi malam dan total biaya.
 * 2. Penilaian rating bintang interaktif (1-5) dan pengumpulan feedback testimoni tamu.
 * 3. Manajemen moderasi ulasan publik serta pembaruan status transaksi booking.
 * ====================================================================
 */

require_once '../app/core/Controller.php';
require_once '../app/core/Auth.php';

class HomestayController extends Controller {

    /**
     * Halaman Publik Daftar Homestay & Penginapan Warga
     */
    public function index() {
        $homestayModel = $this->model('Homestay');
        $keyword = $_GET['cari'] ?? null;

        $data = [
            'judul' => 'Reservasi Homestay & Penginapan Tradisional - CirebonKita',
            'homestayList' => $homestayModel->getAllHomestay($keyword),
            'ulasanList' => $homestayModel->getUlasan(null, 5)
        ];

        $this->view('layouts/header', $data);
        $this->view('public/detail_homestay', $data);
        $this->view('layouts/footer');
    }

    /**
     * Detail Homestay & Form Booking
     */
    public function detail($id = null) {
        if (!$id) {
            $this->redirect('homestay');
        }

        $homestayModel = $this->model('Homestay');
        $homestay = $homestayModel->getHomestayById($id);

        if (!$homestay) {
            $this->view('errors/404');
            return;
        }

        $data = [
            'judul' => $homestay['nama_homestay'] . ' - Reservasi Homestay',
            'homestay' => $homestay,
            'ulasanList' => $homestayModel->getUlasan($id, 10)
        ];

        $this->view('layouts/header', $data);
        $this->view('public/detail_homestay', $data);
        $this->view('layouts/footer');
    }

    /**
     * Proses Simpan Booking Reservasi Baru (POST)
     */
    public function booking() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $homestayModel = $this->model('Homestay');

            $data = [
                'homestay_id' => (int)$_POST['homestay_id'],
                'nama_tamu' => $this->sanitize($_POST['nama_tamu']),
                'asal_kota' => $this->sanitize($_POST['asal_kota'] ?? 'Cirebon'),
                'kontak' => $this->sanitize($_POST['kontak']),
                'tgl_checkin' => $this->sanitize($_POST['tgl_checkin']),
                'tgl_checkout' => $this->sanitize($_POST['tgl_checkout']),
                'jumlah_tamu' => (int)($_POST['jumlah_tamu'] ?? 2),
                'status_transaksi' => 'Terkonfirmasi'
            ];

            $kodeBooking = $homestayModel->buatBooking($data);

            if ($kodeBooking) {
                Auth::setFlash('Booking Berhasil!', "Kode Reservasi Anda adalah: {$kodeBooking}. Konfirmasi telah dikirim via kontak Anda.", 'success');
            } else {
                Auth::setFlash('Gagal!', 'Terjadi kendala saat memproses booking kamar.', 'danger');
            }

            $this->redirect('homestay');
        }
    }

    /**
     * Proses Pengiriman Ulasan & Rating Bintang (POST)
     */
    public function submitUlasan() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $homestayModel = $this->model('Homestay');

            $data = [
                'homestay_id' => (int)$_POST['homestay_id'],
                'nama_pengulas' => $this->sanitize($_POST['nama_pengulas']),
                'rating_bintang' => (int)$_POST['rating_bintang'],
                'komentar' => $this->sanitize($_POST['komentar'])
            ];

            if ($homestayModel->tambahUlasan($data) > 0) {
                Auth::setFlash('Terima Kasih!', 'Ulasan dan bintang penilaian Anda berhasil dikirim.', 'success');
            }

            $this->redirect('homestay');
        }
    }

    /**
     * Dashboard Admin Homestay & Ulasan
     */
    public function admin() {
        Auth::guard();
        $homestayModel = $this->model('Homestay');

        $status = $_GET['status'] ?? null;

        $data = [
            'judul' => 'Manajemen Reservasi Homestay & Moderasi Ulasan',
            'user' => Auth::user(),
            'bookingList' => $homestayModel->getAllBooking($status),
            'homestayList' => $homestayModel->getAllHomestay(),
            'ulasanList' => $homestayModel->getUlasan(null, 20),
            'kpi' => $homestayModel->getKPIHomestay(),
            'pengembang' => 'Divisi Homestay & Akomodasi'
        ];

        $this->view('admin/homestay/index', $data);
    }

    /**
     * Form Tambah Unit Homestay (Admin)
     */
    public function create() {
        Auth::guard();
        $data = [
            'judul' => 'Tambah Unit Mitra Homestay',
            'user' => Auth::user()
        ];
        $this->view('admin/homestay/create', $data);
    }

    /**
     * Simpan Homestay Baru (POST)
     */
    public function simpan() {
        Auth::guard();
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $homestayModel = $this->model('Homestay');
            $namaFoto = $this->handleUploadFoto($_FILES['foto'] ?? null);

            $data = [
                'nama_homestay' => $this->sanitize($_POST['nama_homestay']),
                'tipe_kamar' => $this->sanitize($_POST['tipe_kamar']),
                'kapasitas_tamu' => (int)$_POST['kapasitas_tamu'],
                'harga_per_malam' => (float)$_POST['harga_per_malam'],
                'fasilitas' => $this->sanitize($_POST['fasilitas']),
                'lokasi' => $this->sanitize($_POST['lokasi']),
                'jarak_pusat' => $this->sanitize($_POST['jarak_pusat']),
                'nama_pemilik' => $this->sanitize($_POST['nama_pemilik']),
                'kontak_pemilik' => $this->sanitize($_POST['kontak_pemilik'])
            ];

            if ($homestayModel->tambahHomestay($data, $namaFoto) > 0) {
                Auth::setFlash('Berhasil!', 'Unit homestay baru berhasil ditambahkan.', 'success');
            }

            $this->redirect('homestay/admin');
        }
    }

    /**
     * Edit Status Booking (Konfirmasi / Batal)
     */
    public function updateStatusBooking($id, $status) {
        Auth::guard();
        $homestayModel = $this->model('Homestay');
        $homestayModel->updateStatusBooking($id, $status);
        Auth::setFlash('Status Diperbarui!', "Status booking berhasil diubah menjadi {$status}.", 'info');
        $this->redirect('homestay/admin');
    }

    /**
     * Hapus Homestay (Admin)
     */
    public function hapus($id = null) {
        Auth::guard();
        if ($id) {
            $homestayModel = $this->model('Homestay');
            $homestayModel->hapusHomestay($id);
            Auth::setFlash('Berhasil!', 'Unit homestay berhasil dihapus.', 'success');
        }
        $this->redirect('homestay/admin');
    }

    /**
     * Sanitasi Upload Foto Homestay
     */
    private function handleUploadFoto($file) {
        if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
            return 'default_homestay.jpg';
        }

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp'];
        $maxSize = 2 * 1024 * 1024;

        $fileName = $file['name'];
        $fileSize = $file['size'];
        $tmpName  = $file['tmp_name'];
        $fileExt  = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

        if (!in_array($fileExt, $allowedExt)) {
            die("Error: Format file foto tidak valid!");
        }

        if ($fileSize > $maxSize) {
            die("Error: Ukuran foto maksimal 2MB!");
        }

        $newName = 'homestay_' . uniqid() . '.' . $fileExt;
        $destination = '../public/uploads/' . $newName;

        if (!is_dir('../public/uploads')) {
            mkdir('../public/uploads', 0755, true);
        }

        move_uploaded_file($tmpName, $destination);
        return $newName;
    }
}
