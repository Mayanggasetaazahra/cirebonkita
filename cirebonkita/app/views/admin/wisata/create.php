<?php
/**
 * ====================================================================
 * VIEW ADMIN: FORM TAMBAH DESTINASI WISATA (create.php)
 * ====================================================================
 * Proyek      : CirebonKita - Portal Desa Wisata Mandiri Cirebon
 * Pengembang  : Divisi Wisata & Tiket
 * Modul       : CRUD Master Daya Tarik Wisata & Tiket Spot Rekreasi
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
            <a href="<?= BASEURL; ?>/wisata/admin" class="sidebar-nav-item active"><i class="fa-solid fa-monument"></i> <span>Wisata & Tiket</span></a>
            <a href="<?= BASEURL; ?>/umkm/admin" class="sidebar-nav-item"><i class="fa-solid fa-store"></i> <span>Produk UMKM</span></a>
            <a href="<?= BASEURL; ?>/homestay/admin" class="sidebar-nav-item"><i class="fa-solid fa-house-chimney-user"></i> <span>Homestay & Ulasan</span></a>
        </div>
    </aside>

    <main class="admin-main">
        <header class="admin-topbar">
            <div class="topbar-breadcrumbs">
                <a href="<?= BASEURL; ?>/wisata/admin">Wisata & Tiket</a> / <span>Tambah Destinasi Baru</span>
            </div>
            <div class="topbar-right">
                <div class="admin-profile-pill"><div class="profile-avatar">IH</div><span>Pengelola Wisata</span></div>
            </div>
        </header>

        <div class="admin-content-pad">
            <div class="form-container-card">
                <div class="form-header-box">
                    <div>
                        <h2 class="form-main-title">Tambah Destinasi Wisata Cirebon</h2>
                        <p class="form-sub-title">Modul Pengembang: Divisi Wisata & Tiket &bull; Penambahan master objek cagar budaya & HTM</p>
                    </div>
                    <a href="<?= BASEURL; ?>/wisata/admin" class="btn btn-outline-secondary"><i class="fa-solid fa-arrow-left"></i> Kembali</a>
                </div>

                <form action="<?= BASEURL; ?>/wisata/simpan" method="POST" enctype="multipart/form-data" class="admin-crud-form">
                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="nama_wisata">Nama Destinasi Wisata <span class="text-danger">*</span></label>
                            <input type="text" id="nama_wisata" name="nama_wisata" class="form-control" placeholder="Contoh: Keraton Kasepuhan Cirebon" required>
                        </div>

                        <div class="form-group">
                            <label for="kategori">Kategori Kebudayaan <span class="text-danger">*</span></label>
                            <select id="kategori" name="kategori" class="form-control" required>
                                <option value="Keraton & Sejarah">Keraton & Sejarah</option>
                                <option value="Situs Cagar Budaya">Situs Cagar Budaya</option>
                                <option value="Wisata Religi">Wisata Religi</option>
                                <option value="Wisata Alam & Rekreasi">Wisata Alam & Rekreasi</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-3">
                        <div class="form-group">
                            <label for="harga_tiket">Harga Tiket Masuk (Rp) <span class="text-danger">*</span></label>
                            <input type="number" id="harga_tiket" name="harga_tiket" class="form-control" placeholder="0 untuk infaq sukarela" min="0" required>
                        </div>

                        <div class="form-group">
                            <label for="kuota_harian">Kapasitas Kuota Harian (Orang) <span class="text-danger">*</span></label>
                            <input type="number" id="kuota_harian" name="kuota_harian" class="form-control" placeholder="Contoh: 500" min="1" required>
                        </div>

                        <div class="form-group">
                            <label for="status_operasional">Status Operasional</label>
                            <select id="status_operasional" name="status_operasional" class="form-control">
                                <option value="Buka (Aktif)">Buka (Aktif)</option>
                                <option value="Pemeliharaan Spot">Pemeliharaan Spot</option>
                                <option value="Tutup Sementara">Tutup Sementara</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-grid-2">
                        <div class="form-group">
                            <label for="lokasi">Alamat / Lokasi Lengkap <span class="text-danger">*</span></label>
                            <input type="text" id="lokasi" name="lokasi" class="form-control" placeholder="Jl. Kasepuhan No. 43, Lemahwungkuk" required>
                        </div>

                        <div class="form-group">
                            <label for="jam_buka">Jam Operasional</label>
                            <input type="text" id="jam_buka" name="jam_buka" class="form-control" value="08:00 - 17:00 WIB" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fasilitas">Fasilitas Wisata (Pisahkan dengan koma)</label>
                        <input type="text" id="fasilitas" name="fasilitas" class="form-control" value="Pemandu Lokal, Museum Pusaka, Parkir Luas, Musholla, Spot Foto">
                    </div>

                    <div class="form-group">
                        <label for="deskripsi">Deskripsi Sejarah & Daya Tarik Wisata <span class="text-danger">*</span></label>
                        <textarea id="deskripsi" name="deskripsi" rows="5" class="form-control" placeholder="Tuliskan latar belakang sejarah, arsitektur, dan daya tarik wisata..." required></textarea>
                    </div>

                    <div class="form-group">
                        <label for="foto">Upload Foto Destinasi (Maks 2MB - JPG, PNG, WEBP) <span class="text-danger">*</span></label>
                        <input type="file" id="foto" name="foto" class="form-control file-input" accept="image/*" required>
                        <small class="text-muted">Keamanan: File akan divalidasi MIME type dan di-rename acak dengan uniqid().</small>
                    </div>

                    <div class="form-action-buttons mt-30">
                        <a href="<?= BASEURL; ?>/wisata/admin" class="btn btn-secondary">Batal</a>
                        <button type="submit" class="btn btn-teal-solid">
                            <i class="fa-solid fa-save"></i> Simpan Destinasi Wisata
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</div>

</body>
</html>
