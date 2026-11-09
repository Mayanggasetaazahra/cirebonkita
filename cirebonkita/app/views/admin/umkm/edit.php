<?php
/**
 * ====================================================================
 * VIEW ADMIN: FORM EDIT PRODUK UMKM (edit.php)
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
                <a href="<?= BASEURL; ?>/umkm/admin">Produk UMKM</a> / <span>Edit Produk</span>
            </div>
            <div class="topbar-right">
                <div class="admin-profile-pill"><div class="profile-avatar">NM</div><span>Pengelola UMKM</span></div>
            </div>
        </header>

        <div class="admin-content-pad">
            <div class="form-container-card">
                <div class="form-header-box">
                    <div>
                        <h2 class="form-main-title">Perbarui Data: <?= htmlspecialchars($produk['nama_produk']); ?></h2>
                        <p class="form-sub-title">Modul Pengembang: Divisi UMKM & Ekonomi Kreatif</p>
                    </div>
                    <a href="<?= BASEURL; ?>/umkm/admin" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
                </div>

                <form action="<?= BASEURL; ?>/umkm/update" method="POST" enctype="multipart/form-data" class="admin-crud-form">
                    <input type="hidden" name="id" value="<?= $produk['id']; ?>">

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="nama_produk">Nama Produk UMKM</label>
                            <input type="text" id="nama_produk" name="nama_produk" class="form-control" value="<?= htmlspecialchars($produk['nama_produk']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="kategori">Kategori Komoditas</label>
                            <select id="kategori" name="kategori" class="form-control" required>
                                <option value="Batik Cirebon" <?= ($produk['kategori'] === 'Batik Cirebon') ? 'selected' : ''; ?>>Batik Cirebon</option>
                                <option value="Kuliner Khas" <?= ($produk['kategori'] === 'Kuliner Khas') ? 'selected' : ''; ?>>Kuliner Khas</option>
                                <option value="Kerajinan Tangan" <?= ($produk['kategori'] === 'Kerajinan Tangan') ? 'selected' : ''; ?>>Kerajinan Tangan</option>
                                <option value="Aksesoris" <?= ($produk['kategori'] === 'Aksesoris') ? 'selected' : ''; ?>>Aksesoris</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="harga">Harga Satuan (Rp)</label>
                            <input type="number" id="harga" name="harga" class="form-control" value="<?= (int)$produk['harga']; ?>" min="1000" required>
                        </div>

                        <div class="form-group">
                            <label for="stok">Jumlah Stok Inventori</label>
                            <input type="number" id="stok" name="stok" class="form-control" value="<?= $produk['stok']; ?>" min="0" required>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="mitra_pengrajin">Nama Mitra Pengrajin</label>
                            <input type="text" id="mitra_pengrajin" name="mitra_pengrajin" class="form-control" value="<?= htmlspecialchars($produk['mitra_pengrajin']); ?>" required>
                        </div>

                        <div class="form-group">
                            <label for="desa_asal">Desa Asal</label>
                            <input type="text" id="desa_asal" name="desa_asal" class="form-control" value="<?= htmlspecialchars($produk['desa_asal']); ?>" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="deskripsi">Deskripsi Produk</label>
                        <textarea id="deskripsi" name="deskripsi" rows="4" class="form-control" required><?= htmlspecialchars($produk['deskripsi']); ?></textarea>
                    </div>

                    <div class="form-group">
                        <label for="foto">Ganti Foto Produk (Kosongkan jika tidak diganti)</label>
                        <input type="file" id="foto" name="foto" class="form-control file-input" accept="image/*">
                        <small class="text-muted">Foto saat ini: <code><?= htmlspecialchars($produk['foto']); ?></code></small>
                    </div>

                    <div class="form-action-buttons mt-30">
                        <a href="<?= BASEURL; ?>/umkm/admin" class="btn btn-secondary">Batal</a>
                        <button type="submit" class="btn btn-teal-solid">
                            <i class="fa-solid fa-save"></i> Perbarui Produk UMKM
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

</body>
</html>
