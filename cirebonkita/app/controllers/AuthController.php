<?php
/**
 * ====================================================================
 * CONTROLLER OTENTIKASI & LOGIN (AuthController.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Mengatur alur login dan logout administrator.
 * 2. Menerima POST request username & password, lalu memverifikasi melalui Model User.
 * 3. Menjalankan Auth::login() untuk menyimpan session aman dan session_regenerate_id().
 * ====================================================================
 */

require_once '../app/core/Controller.php';
require_once '../app/core/Auth.php';

class AuthController extends Controller {

    /**
     * Menampilkan form login
     */
    public function index() {
        Auth::initSession();
        if (Auth::check()) {
            $this->redirect('admin/dashboard');
        }

        $data = [
            'judul' => 'Login Administrator - CirebonKita',
            'error' => null
        ];

        $this->view('auth/login', $data);
    }

    /**
     * Memproses kredensial login (POST)
     */
    public function login() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $this->sanitize($_POST['username'] ?? '');
            $password = $_POST['password'] ?? '';

            if (empty($username) || empty($password)) {
                $data = [
                    'judul' => 'Login Administrator - CirebonKita',
                    'error' => 'Username dan password wajib diisi!'
                ];
                $this->view('auth/login', $data);
                return;
            }

            $userModel = $this->model('User');
            $user = $userModel->authenticate($username, $password);

            if ($user) {
                // Login berhasil, set sesi aman
                Auth::login($user);
                $this->redirect('admin/dashboard');
            } else {
                $data = [
                    'judul' => 'Login Administrator - CirebonKita',
                    'error' => 'Kombinasi username atau password salah!'
                ];
                $this->view('auth/login', $data);
            }
        } else {
            $this->redirect('auth/index');
        }
    }

    /**
     * Memproses pendaftaran akun baru (POST)
     */
    public function daftar() {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nama = $this->sanitize($_POST['nama_lengkap'] ?? '');
            $username = $this->sanitize($_POST['username'] ?? '');
            $email = $this->sanitize($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $role = $_POST['role'] ?? 'wisatawan';

            if (empty($nama) || empty($username) || empty($email) || empty($password)) {
                $data = [
                    'judul' => 'Daftar Akun Baru - CirebonKita',
                    'error' => 'Semua kolom formulir wajib diisi!'
                ];
                $this->view('auth/login', $data);
                return;
            }

            $userModel = $this->model('User');
            if ($userModel->findByUsername($username)) {
                $data = [
                    'judul' => 'Daftar Akun Baru - CirebonKita',
                    'error' => 'Username sudah digunakan, silakan pilih username lain!'
                ];
                $this->view('auth/login', $data);
                return;
            }

            $userModel->register([
                'nama_lengkap' => $nama,
                'username' => $username,
                'email' => $email,
                'password' => $password,
                'role' => $role
            ]);

            $this->redirect('auth/index?registered=1');
        } else {
            $this->redirect('auth/index');
        }
    }

    /**
     * Menghancurkan sesi dan logout
     */
    public function logout() {
        Auth::logout();
        $this->redirect('auth/index');
    }
}

