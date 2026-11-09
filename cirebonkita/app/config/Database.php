<?php
/**
 * ====================================================================
 * KELAS KONEKSI DATABASE (PDO - PHP DATA OBJECTS)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Menggunakan PDO (PHP Data Objects) yang mendukung Prepared Statements.
 * 2. Parameter :param menggantikan interpolasi string variabel langsung
 *    sehingga 100% kebal terhadap celah SQL Injection.
 * 3. Mode ERRMODE_EXCEPTION diaktifkan untuk menangkap seluruh kegagalan kueri.
 * 4. DEFAULT_FETCH_MODE diatur ke FETCH_ASSOC untuk menghasilkan array asosiatif bersih.
 * ====================================================================
 */

class Database {
    private $host = "localhost";
    private $user = "root";
    private $pass = "";
    private $db_name = "cirebonkita";
    private $port = "3306";
    
    private $dbh; // Database Handler
    private $stmt; // Statement
    private $error;

    public function __construct() {
        // Konfigurasi DSN (Data Source Name)
        $dsn = "mysql:host=" . $this->host . ";port=" . $this->port . ";dbname=" . $this->db_name . ";charset=utf8mb4";
        
        $options = [
            PDO::ATTR_PERSISTENT => true, // Menjaga koneksi tetap persisten
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Menampilkan error kueri sebagai Exception
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Format data array asosiatif
            PDO::ATTR_EMULATE_PREPARES => false // Prepared statements dieksekusi native di server database
        ];

        try {
            $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            die("Koneksi Database Gagal: " . $this->error);
        }
    }

    /**
     * Mempersiapkan kueri SQL dengan PDO Prepared Statement
     * @param string $query Kueri SQL dengan named parameter (:nama)
     */
    public function query($query) {
        $this->stmt = $this->dbh->prepare($query);
    }

    /**
     * Mengikat nilai parameter ke statement untuk mencegah SQL Injection
     * @param string $param Nama parameter (contoh: :id, :username)
     * @param mixed $value Nilai yang dimasukkan
     * @param int|null $type Tipe data PDO (INT, STR, BOOL, NULL)
     */
    public function bind($param, $value, $type = null) {
        if (is_null($type)) {
            switch (true) {
                case is_int($value):
                    $type = PDO::PARAM_INT;
                    break;
                case is_bool($value):
                    $type = PDO::PARAM_BOOL;
                    break;
                case is_null($value):
                    $type = PDO::PARAM_NULL;
                    break;
                default:
                    $type = PDO::PARAM_STR;
            }
        }
        $this->stmt->bindValue($param, $value, $type);
    }

    /**
     * Mengeksekusi Prepared Statement
     * @return bool Hasil eksekusi kueri
     */
    public function execute() {
        return $this->stmt->execute();
    }

    /**
     * Mengambil seluruh record data (SELECT * / multi baris)
     * @return array
     */
    public function resultSet() {
        $this->execute();
        return $this->stmt->fetchAll();
    }

    /**
     * Mengambil 1 baris record tunggal (SELECT WHERE id = :id)
     * @return mixed
     */
    public function single() {
        $this->execute();
        return $this->stmt->fetch();
    }

    /**
     * Menghitung jumlah baris yang terdampak (INSERT, UPDATE, DELETE)
     * @return int
     */
    public function rowCount() {
        return $this->stmt->rowCount();
    }

    /**
     * Mendapatkan ID terakhir yang baru di-insert (Auto Increment)
     * @return string
     */
    public function lastInsertId() {
        return $this->dbh->lastInsertId();
    }
}
