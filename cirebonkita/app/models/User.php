<?php
/**
 * ====================================================================
 * MODEL USER (User.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Mengelola otentikasi login pengguna admin.
 * 2. Menggunakan PDO Prepared Statement untuk query SELECT berdasarkan username.
 * 3. Menggunakan password_verify() bawaan PHP untuk memverifikasi password
 *    dengan algoritma hash modern BCRYPT yang aman dan tidak dapat di-reverse.
 * ====================================================================
 */

require_once '../app/config/Database.php';

class User {
    private $table = 'users';
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Mencari pengguna berdasarkan username
     * @param string $username
     * @return array|false
     */
    public function findByUsername($username) {
        $query = "SELECT * FROM " . $this->table . " WHERE username = :username LIMIT 1";
        $this->db->query($query);
        $this->db->bind(':username', $username);
        return $this->db->single();
    }

    /**
     * Memverifikasi kredensial login pengguna
     * @param string $username
     * @param string $password
     * @return array|false
     */
    public function authenticate($username, $password) {
        $user = $this->findByUsername($username);
        if ($user) {
            // Verifikasi kecocokan hash BCRYPT
            if (password_verify($password, $user['password'])) {
                return $user;
            }
        }
        return false;
    }

    /**
     * Registrasi pengguna baru dengan enkripsi password_hash BCRYPT
     */
    public function register($data) {
        $query = "INSERT INTO " . $this->table . " (nama_lengkap, username, email, password, role) 
                  VALUES (:nama_lengkap, :username, :email, :password, :role)";
        
        $hashedPassword = password_hash($data['password'], PASSWORD_BCRYPT);

        $this->db->query($query);
        $this->db->bind(':nama_lengkap', $data['nama_lengkap']);
        $this->db->bind(':username', $data['username']);
        $this->db->bind(':email', $data['email']);
        $this->db->bind(':password', $hashedPassword);
        $this->db->bind(':role', $data['role'] ?? 'admin');

        $this->db->execute();
        return $this->db->rowCount();
    }

    /**
     * Ambil data user berdasarkan ID
     */
    public function getUserById($id) {
        $query = "SELECT id, nama_lengkap, username, email, role, created_at FROM " . $this->table . " WHERE id = :id";
        $this->db->query($query);
        $this->db->bind(':id', $id);
        return $this->db->single();
    }
}
