<?php
/**
 * ====================================================================
 * VIEW ADMIN: FORM TAMBAH PRODUK UMKM (create.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi UMKM & Ekonomi Kreatif
 * Modul       : CRUD Produk Kerajinan & Kuliner UMKM Lokal
 * ====================================================================
 */
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($judul); ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?= BASEURL; ?>/assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body class="admin-body">

<div class="admin-wrapper">
    <aside class="admin-sidebar">
        <div class="sidebar-brand">
            <div class="sidebar-brand-icon"><i class="fa-solid fa-mountain-sun"></i></div>
            <div>
                <h4 class="sidebar-title">CirebonKita</h4>
                <span class="sidebar-subtitle">PANEL ADMINISTRATOR</span>
            </div>
        </div>
        <div class="sidebar-menu-wrapper">
            <a href="<?= BASEURL; ?>/admin" class="sidebar-nav-item"><i class="fa-solid fa-table-cells-large"></i> <span>Overview Portal</span></a>
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item"><i class="fa-solid fa-monument"></i> <span>Wisata & Tiket</span></a>
            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item active"><i class="fa-solid fa-store"></i> <span>Produk UMKM</span></a>
            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item"><i class="fa-solid fa-house-chimney-user"></i> <span>Homestay & Ulasan</span></a>
        </div>
    </aside>

    <main class="admin-main">
        <header class="admin-topbar">
            <div class="topbar-breadcrumbs">
                <a href="<?= BASEURL; ?>/umkm/admin">Produk UMKM</a> / <span>Tambah Produk Baru</span>
            </div>
            <div class="topbar-right">
                <div class="admin-profile-pill"><div class="profile-avatar">NM</div><span>Pengelola UMKM</span></div>
            </div>
        </header>

        <div class="admin-content-pad">
            <div class="form-container-card">
                <div class="form-header-box">
                    <div>
                        <h2 class="form-main-title">Tambah Produk UMKM Komoditas Desa</h2>
                        <p class="form-sub-title">Modul Pengembang: Divisi UMKM & Ekonomi Kreatif &bull; Etalase Batik, Kuliner, dan Kriya</p>
                    </div>
                    <a href="<?= BASEURL; ?>/umkm/admin" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
                </div>

                <form action="<?= BASEURL; ?>/umkm/simpan" method="POST" enctype="multipart/form-data" class="admin-crud-form">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="nama_produk">Nama Produk UMKM <span class="text-danger">*</span></label>
                            <input type="text" id="nama_produk" name="nama_produk" class="form-control" placeholder="Contoh: Batik Mega Mendung Trusmi" required>
                        </div>

                        <div class="form-group">
                            <label for="kategori">Kategori Komoditas <span class="text-danger">*</span></label>
                            <select id="kategori" name="kategori" class="form-control" required>
                                <option value="Batik Cirebon">Batik Cirebon</option>
                                <option value="Kuliner Khas">Kuliner Khas</option>
                                <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                                <option value="Aksesoris">Aksesoris</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-3">
                        <div class="form-group">
                            <label for="harga">Harga Satuan (Rp) <span class="text-danger">*</span></label>
                            <input type="number" id="harga" name="harga" class="form-control" placeholder="Contoh: 150000" min="1000" required>
                        </div>

                        <div class="form-group">
                            <label for="stok">Jumlah Stok Inventori <span class="text-danger">*</span></label>
                            <input type="number" id="stok" name="stok" class="form-control" placeholder="Contoh: 25" min="0" required>
                        </div>

                        <div class="form-group">
                            <label for="kode_sku">Kode SKU (Unik)</label>
                            <input type="text" id="kode_sku" name="kode_sku" class="form-control" value="CRB-<?= rand(100, 999); ?>" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="mitra_pengrajin">Nama Mitra Pengrajin / UMKM <span class="text-danger">*</span></label>
                            <input type="text" id="mitra_pengrajin" name="mitra_pengrajin" class="form-control" placeholder="Contoh: Sentra Batik Trusmi" required>
                        </div>

                        <div class="form-group">
                            <label for="desa_asal">Desa Binaan Asal <span class="text-danger">*</span></label>
                            <input type="text" id="desa_asal" name="desa_asal" class="form-control" placeholder="Contoh: Desa Trusmi Kulon" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="deskripsi">Deskripsi Bahan, Rasa, atau Filosofi Produk <span class="text-danger">*</span></label>
                        <textarea id="deskripsi" name="deskripsi" rows="4" class="form-control" placeholder="Jelaskan keistimewaan produk UMKM ini secara detail..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="foto">Foto Produk (Maks 2MB - JPG, PNG, WEBP) <span class="text-danger">*</span></label>
                        <input type="file" id="foto" name="foto" class="form-control file-input" accept="image/*" required>
                    </div>

                    <div class="form-action-buttons mt-30">
                        <a href="<?= BASEURL; ?>/umkm/admin" class="btn btn-secondary">Batal</a>
                        <button type="submit" class="btn btn-teal-solid">
                            <i class="fa-solid fa-save"></i> Tambahkan ke Inventori
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

</body>
</html>
