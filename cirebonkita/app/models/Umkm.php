<?php
/**
 * ====================================================================
 * MODEL PRODUK UMKM (Umkm.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Mengelola data tabel `umkm` (Batik Cirebon, Kuliner Khas, Kriya Kerajinan).
 * 2. Menyediakan fitur Live Search dan Sorting harga (Termurah/Termahal).
 * 3. Pemantauan stok menipis (<= 10 pcs) untuk sistem notifikasi inventori.
 * ====================================================================
 */

require_once '../app/config/Database.php';

class Umkm {
    private $table = 'umkm';
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    /**
     * Mengambil daftar produk UMKM dengan filter dan sorting
     */
    public function getAllUmkm($kategori = null, $keyword = null, $sort = 'terbaru', $maxPrice = null) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";

        if (!empty($kategori) && $kategori !== 'Semua' && $kategori !== 'Semua Kategori') {
            $query .= " AND kategori = :kategori";
        }

        if (!empty($keyword)) {
            $query .= " AND (nama_produk LIKE :keyword OR deskripsi LIKE :keyword OR mitra_pengrajin LIKE :keyword OR desa_asal LIKE :keyword)";
        }

        if (!empty($maxPrice) && (int)$maxPrice > 0) {
            $query .= " AND harga <= :maxPrice";
        }

        // Sorting
        switch ($sort) {
            case 'termurah':
                $query .= " ORDER BY harga ASC";
                break;
            case 'termahal':
                $query .= " ORDER BY harga DESC";
                break;
            case 'terlaris':
                $query .= " ORDER BY terjual DESC";
                break;
            default:
                $query .= " ORDER BY id DESC";
                break;
        }

        $this->db->query($query);

        if (!empty($kategori) && $kategori !== 'Semua' && $kategori !== 'Semua Kategori') {
            $this->db->bind(':kategori', $kategori);
        }

        if (!empty($keyword)) {
            $this->db->bind(':keyword', "%$keyword%");
        }

        if (!empty($maxPrice) && (int)$maxPrice > 0) {
            $this->db->bind(':maxPrice', $maxPrice);
        }

        return $this->db->resultSet();
    }

    /**
     * Ambil 1 produk berdasarkan ID
     */
    public function getUmkmById($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = :id";
        $this->db->query($query);
        $this->db->bind(':id', $id);
        return $this->db->single();
    }

    /**
     * Tambah Produk UMKM Baru (INSERT)
     */
    public function tambahUmkm($data, $fotoNama) {
        $query = "INSERT INTO " . $this->table . " 
                  (kode_sku, nama_produk, kategori, harga, stok, deskripsi, mitra_pengrajin, desa_asal, foto, status_stok) 
                  VALUES 
                  (:kode_sku, :nama_produk, :kategori, :harga, :stok, :deskripsi, :mitra_pengrajin, :desa_asal, :foto, :status_stok)";
        
        $statusStok = 'Tersedia';
        if ($data['stok'] <= 0) {
            $statusStok = 'Habis';
        } elseif ($data['stok'] <= 5) {
            $statusStok = 'Kritis';
        } elseif ($data['stok'] <= 10) {
            $statusStok = 'Stok Menipis';
        }

        $this->db->query($query);
        $this->db->bind(':kode_sku', $data['kode_sku'] ?? 'CRB-' . rand(100, 999));
        $this->db->bind(':nama_produk', $data['nama_produk']);
        $this->db->bind(':kategori', $data['kategori']);
        $this->db->bind(':harga', $data['harga']);
        $this->db->bind(':stok', $data['stok']);
        $this->db->bind(':deskripsi', $data['deskripsi']);
        $this->db->bind(':mitra_pengrajin', $data['mitra_pengrajin']);
        $this->db->bind(':desa_asal', $data['desa_asal']);
        $this->db->bind(':foto', $fotoNama);
        $this->db->bind(':status_stok', $statusStok);

        $this->db->execute();
        return $this->db->rowCount();
    }

    /**
     * Update Produk UMKM (UPDATE)
     */
    public function updateUmkm($data, $fotoNama = null) {
        $statusStok = 'Tersedia';
        if ($data['stok'] <= 0) {
            $statusStok = 'Habis';
        } elseif ($data['stok'] <= 5) {
            $statusStok = 'Kritis';
        } elseif ($data['stok'] <= 10) {
            $statusStok = 'Stok Menipis';
        }

        if ($fotoNama) {
            $query = "UPDATE " . $this->table . " 
                      SET nama_produk = :nama_produk, kategori = :kategori, harga = :harga,
                          stok = :stok, deskripsi = :deskripsi, mitra_pengrajin = :mitra_pengrajin,
                          desa_asal = :desa_asal, status_stok = :status_stok, foto = :foto
                      WHERE id = :id";
        } else {
            $query = "UPDATE " . $this->table . " 
                      SET nama_produk = :nama_produk, kategori = :kategori, harga = :harga,
                          stok = :stok, deskripsi = :deskripsi, mitra_pengrajin = :mitra_pengrajin,
                          desa_asal = :desa_asal, status_stok = :status_stok
                      WHERE id = :id";
        }

        $this->db->query($query);
        $this->db->bind(':id', $data['id']);
        $this->db->bind(':nama_produk', $data['nama_produk']);
        $this->db->bind(':kategori', $data['kategori']);
        $this->db->bind(':harga', $data['harga']);
        $this->db->bind(':stok', $data['stok']);
        $this->db->bind(':deskripsi', $data['deskripsi']);
        $this->db->bind(':mitra_pengrajin', $data['mitra_pengrajin']);
        $this->db->bind(':desa_asal', $data['desa_asal']);
        $this->db->bind(':status_stok', $statusStok);

        if ($fotoNama) {
            $this->db->bind(':foto', $fotoNama);
        }

        $this->db->execute();
        return $this->db->rowCount();
    }

    /**
     * Hapus Produk (DELETE)
     */
    public function hapusUmkm($id) {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";
        $this->db->query($query);
        $this->db->bind(':id', $id);
        $this->db->execute();
        return $this->db->rowCount();
    }

    /**
     * Statistik KPI UMKM untuk Dashboard
     */
    public function getKPIUmkm() {
        $queryTotal = "SELECT COUNT(*) as total_produk FROM " . $this->table;
        $this->db->query($queryTotal);
        $total = $this->db->single()['total_produk'];

        $queryMenipis = "SELECT COUNT(*) as stok_menipis FROM " . $this->table . " WHERE stok <= 10";
        $this->db->query($queryMenipis);
        $menipis = $this->db->single()['stok_menipis'];

        $queryKategori = "SELECT COUNT(DISTINCT kategori) as total_kategori FROM " . $this->table;
        $this->db->query($queryKategori);
        $kategori = $this->db->single()['total_kategori'];

        return [
            'total_produk' => $total,
            'stok_menipis' => $menipis,
            'kategori_aktif' => $kategori,
            'total_penjualan' => 128,
            'omset_penjualan' => '14,8 Jt'
        ];
    }
}
