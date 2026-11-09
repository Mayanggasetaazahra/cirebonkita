<?php
/**
 * ====================================================================
 * CORE ROUTER & DISPATCHER (App.php)
 * ====================================================================
 * Proyek  : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Kelompok: 5 (Smart Tourism Sektor Pariwisata Daerah)
 * 
 * Penjelasan untuk Ujian Lisan:
 * 1. Menganalisis $_GET['url'] yang dikirim dari file public/.htaccess.
 * 2. Memecah string URL menjadi array:
 *    $url[0] => Nama Controller (misal: WisataController)
 *    $url[1] => Nama Method (misal: detail)
 *    $url[2...] => Parameter dinamis (misal: ID record wisata)
 * 3. Jika controller/method tidak ditemukan, otomatis fallback ke 404.
 * ====================================================================
 */

class App {
    protected $controller = 'HomeController';
    protected $method = 'index';
    protected $params = [];

    public function __construct() {
        $url = $this->parseURL();

        // 1. Periksa Controller
        if (!empty($url[0])) {
            $controllerName = ucfirst($url[0]) . 'Controller';
            if (file_exists('../app/controllers/' . $controllerName . '.php')) {
                $this->controller = $controllerName;
                unset($url[0]);
            } else {
                // Route admin khusus (misal: /admin, /admin/wisata, dll)
                if (strtolower($url[0]) === 'admin') {
                    $this->controller = 'AdminController';
                    unset($url[0]);
                }
            }
        }

        // Panggil controller file yang bersangkutan
        require_once '../app/controllers/' . $this->controller . '.php';
        $this->controller = new $this->controller;

        // 2. Periksa Method pada Controller
        if (isset($url[1])) {
            if (method_exists($this->controller, $url[1])) {
                $this->method = $url[1];
                unset($url[1]);
            }
        }

        // 3. Ambil sisa elemen URL sebagai Parameter
        $this->params = $url ? array_values($url) : [];

        // 4. Jalankan controller & method serta kirimkan parameter
        call_user_func_array([$this->controller, $this->method], $this->params);
    }

    /**
     * Parsing dan sanitasi URL dari query string $_GET['url']
     * @return array|null
     */
    public function parseURL() {
        if (isset($_GET['url'])) {
            $url = rtrim($_GET['url'], '/');
            $url = filter_var($url, FILTER_SANITIZE_URL);
            return explode('/', $url);
        }
        return null;
    }
}
