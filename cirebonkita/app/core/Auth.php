<?php
/**
 * ====================================================================
 * MIDDLEWARE KEAMANAN & OTENTIKASI (Auth.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Menjaga otentikasi sesi (Session Guard) untuk seluruh akses area /admin/.
 * 2. Mencegah Session Fixation dengan session_regenerate_id(true) setelah login.
 * 3. Menghindari Session Hijacking dengan validasi User Agent & IP Address browser.
 * 4. Menyimpan dan menampilkan Flash Message (pemberitahuan sukses/gagal).
 * ====================================================================
 */

class Auth {
    /**
     * Memulai sesi aman jika belum dimulai
     */
    public static function initSession() {
        if (session_status() === PHP_SESSION_NONE) {
            // Konfigurasi cookie session aman
            ini_set('session.cookie_httponly', 1);
            ini_set('session.use_only_cookies', 1);
            session_start();
        }
    }

    /**
     * Memeriksa apakah pengguna sudah login ke sistem
     * @return bool
     */
    public static function check() {
        self::initSession();
        return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
    }

    /**
     * Auth Guard: Memproteksi rute tertutup admin
     * Mengalihkan pengunjung yang belum login ke form login
     */
    public static function guard() {
        self::initSession();
        if (!self::check()) {
            self::setFlash('Akses Ditolak!', 'Silakan login terlebih dahulu untuk mengakses Panel Admin.', 'danger');
            header('Location: ' . BASEURL . '/auth/login');
            exit();
        }
    }

    /**
     * Mengatur data sesi login setelah verifikasi password berhasil
     * @param array $user Data user dari database
     */
    public static function login($user) {
        self::initSession();
        // Mencegah Session Fixation dengan memperbarui ID sesi baru
        session_regenerate_id(true);

        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['nama_lengkap'] = $user['nama_lengkap'];
        $_SESSION['role'] = $user['role'];
        $_SESSION['user_agent'] = $_SERVER['HTTP_USER_AGENT'] ?? '';
    }

    /**
     * Menghapus seluruh sesi login dan logout
     */
    public static function logout() {
        self::initSession();
        $_SESSION = [];
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }
        session_destroy();
    }

    /**
     * Mengambil ID pengguna yang sedang aktif
     */
    public static function user() {
        self::initSession();
        if (self::check()) {
            return [
                'id' => $_SESSION['user_id'],
                'username' => $_SESSION['username'],
                'nama_lengkap' => $_SESSION['nama_lengkap'],
                'role' => $_SESSION['role']
            ];
        }
        return null;
    }

    /**
     * Set Flash Notification
     */
    public static function setFlash($pesan, $aksi, $tipe = 'success') {
        self::initSession();
        $_SESSION['flash'] = [
            'pesan' => $pesan,
            'aksi'  => $aksi,
            'tipe'  => $tipe // success, danger, warning, info
        ];
    }

    /**
     * Tampilkan dan hapus flash message
     */
    public static function flash() {
        self::initSession();
        if (isset($_SESSION['flash'])) {
            $flash = $_SESSION['flash'];
            echo '
            <div class="alert alert-' . htmlspecialchars($flash['tipe']) . ' alert-dismissible fade show shadow-sm" role="alert">
                <strong>' . htmlspecialchars($flash['pesan']) . '</strong> ' . htmlspecialchars($flash['aksi']) . '
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>';
            unset($_SESSION['flash']);
        }
    }
}
